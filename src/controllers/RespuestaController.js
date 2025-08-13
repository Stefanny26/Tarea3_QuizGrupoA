const Validator = require('../utils/Validator');
const { logger } = require('../utils/Logger');

/**
 * Controlador para gestionar las respuestas del quiz
 */
class RespuestaController {
    constructor(salaService, usuarioService, io) {
        this.salaService = salaService;
        this.usuarioService = usuarioService;
        this.io = io;
    }

    /**
     * Procesar respuesta enviada por un estudiante
     * @param {object} socket - Socket del usuario
     * @param {string} respuestaUsuario - Respuesta del usuario
     */
    procesarRespuesta(socket, respuestaUsuario) {
        try {
            const usuario = this.usuarioService.obtenerUsuario(socket.id);
            if (!usuario) {
                socket.emit('error:usuario-no-identificado', 'Usuario no identificado');
                return;
            }

            if (usuario.esProfesor()) {
                socket.emit('error:docente-no-puede-responder', 'El docente no puede responder las preguntas');
                return;
            }

            // Validar respuesta
            const validacionRespuesta = Validator.validarRespuesta(respuestaUsuario);
            if (!validacionRespuesta.valido) {
                socket.emit('error:validacion', validacionRespuesta.mensaje);
                return;
            }

            const sala = this.salaService.obtenerSala(usuario.codigoSala);
            if (!sala) {
                socket.emit('error:sala-no-existe', 'La sala no existe');
                return;
            }

            // Verificar si la ronda está activa
            if (!sala.activa) {
                socket.emit('error:ronda-terminada', 'La ronda ya ha terminado');
                return;
            }

            const respuestaLimpia = validacionRespuesta.respuestaLimpia;

            logger.info('Respuesta recibida', { 
                usuario: usuario.nombre, 
                sala: usuario.codigoSala, 
                respuesta: respuestaLimpia 
            });

            // Verificar si la respuesta es correcta
            if (this.salaService.verificarRespuesta(usuario.codigoSala, respuestaLimpia)) {
                this._manejarRespuestaCorrecta(socket, usuario, sala, respuestaLimpia);
            } else {
                this._manejarRespuestaIncorrecta(socket, usuario, respuestaLimpia);
            }

        } catch (error) {
            logger.error('Error al procesar respuesta', { socketId: socket.id, error: error.message });
            socket.emit('error:servidor', 'Error interno del servidor');
        }
    }

    /**
     * Manejar respuesta correcta
     * @private
     * @param {object} socket - Socket del usuario
     * @param {object} usuario - Usuario que respondió
     * @param {object} sala - Sala actual
     * @param {string} respuesta - Respuesta del usuario
     */
    _manejarRespuestaCorrecta(socket, usuario, sala, respuesta) {
        // Finalizar la ronda inmediatamente
        this.salaService.finalizarRonda(usuario.codigoSala);

        // Incrementar puntuación del usuario
        this.usuarioService.incrementarPuntuacion(socket.id);

        logger.info('Respuesta correcta - Ronda terminada', { 
            ganador: usuario.nombre, 
            sala: usuario.codigoSala,
            respuesta: respuesta
        });

        // Obtener ranking actualizado
        const ranking = this.usuarioService.obtenerRankingSala(usuario.codigoSala);

        // Anunciar al ganador a todos en la sala
        this.io.to(usuario.codigoSala).emit('ronda:terminada', {
            ganador: usuario.nombre,
            respuestaCorrecta: sala.respuesta,
            pregunta: sala.pregunta,
            tiempoRespuesta: this._calcularTiempoRespuesta(sala),
            ranking: ranking.slice(0, 5) // Top 5
        });

        // Enviar información específica al ganador
        socket.emit('respuesta:correcta', {
            mensaje: '¡Correcto! Has ganado esta ronda',
            puntuacion: usuario.puntuacion,
            respuestasCorrectas: usuario.respuestasCorrectas
        });

        // Log para estadísticas
        logger.salaActivity('ronda-terminada', usuario.codigoSala, {
            ganador: usuario.nombre,
            pregunta: sala.pregunta,
            respuestaCorrecta: sala.respuesta,
            totalParticipantes: sala.getNumeroEstudiantes()
        });
    }

    /**
     * Manejar respuesta incorrecta
     * @private
     * @param {object} socket - Socket del usuario
     * @param {object} usuario - Usuario que respondió
     * @param {string} respuesta - Respuesta del usuario
     */
    _manejarRespuestaIncorrecta(socket, usuario, respuesta) {
        // Notificar solo al usuario que su respuesta es incorrecta
        socket.emit('respuesta:incorrecta', {
            mensaje: 'Respuesta incorrecta, sigue intentando',
            respuestaEnviada: respuesta
        });

        logger.debug('Respuesta incorrecta', { 
            usuario: usuario.nombre, 
            sala: usuario.codigoSala,
            respuesta: respuesta
        });

        // Opcional: Notificar al docente sobre intentos (sin mostrar la respuesta)
        const docente = this.usuarioService.obtenerDocentePorSala(usuario.codigoSala);
        if (docente) {
            this.io.to(docente.socketId).emit('intento:respuesta', {
                estudiante: usuario.nombre,
                momento: new Date()
            });
        }
    }

    /**
     * Calcular tiempo de respuesta aproximado
     * @private
     * @param {object} sala - Sala actual
     * @returns {number} - Tiempo en segundos
     */
    _calcularTiempoRespuesta(sala) {
        // Esta es una implementación básica
        // En una implementación real, guardaríamos el timestamp de cuando se publicó la pregunta
        return Math.floor(Math.random() * 30) + 5; // Entre 5 y 35 segundos (simulado)
    }

    /**
     * Obtener pista para una pregunta (funcionalidad adicional)
     * @param {object} socket - Socket del usuario
     */
    obtenerPista(socket) {
        try {
            const usuario = this.usuarioService.obtenerUsuario(socket.id);
            if (!usuario) {
                socket.emit('error:usuario-no-identificado', 'Usuario no identificado');
                return;
            }

            if (usuario.esProfesor()) {
                socket.emit('error:docente-no-puede-pista', 'El docente no puede solicitar pistas');
                return;
            }

            const sala = this.salaService.obtenerSala(usuario.codigoSala);
            if (!sala || !sala.activa) {
                socket.emit('error:sin-pregunta-activa', 'No hay pregunta activa');
                return;
            }

            // Generar pista básica (primera letra + longitud)
            const respuesta = sala.respuesta;
            const pista = this._generarPista(respuesta);

            socket.emit('pista:disponible', {
                pista: pista,
                mensaje: 'Aquí tienes una pista para ayudarte'
            });

            logger.debug('Pista solicitada', { 
                usuario: usuario.nombre, 
                sala: usuario.codigoSala 
            });

        } catch (error) {
            logger.error('Error al obtener pista', { socketId: socket.id, error: error.message });
            socket.emit('error:servidor', 'Error interno del servidor');
        }
    }

    /**
     * Generar pista básica
     * @private
     * @param {string} respuesta - Respuesta correcta
     * @returns {string} - Pista generada
     */
    _generarPista(respuesta) {
        if (respuesta.length <= 1) return respuesta;
        
        const primeraLetra = respuesta.charAt(0).toUpperCase();
        const longitud = respuesta.length;
        const guiones = '_'.repeat(longitud - 1);
        
        return `${primeraLetra}${guiones} (${longitud} letras)`;
    }

    /**
     * Obtener ranking de la sala
     * @param {object} socket - Socket del usuario
     */
    obtenerRanking(socket) {
        try {
            const usuario = this.usuarioService.obtenerUsuario(socket.id);
            if (!usuario) {
                socket.emit('error:usuario-no-identificado', 'Usuario no identificado');
                return;
            }

            const ranking = this.usuarioService.obtenerRankingSala(usuario.codigoSala);

            socket.emit('ranking:actualizado', {
                ranking: ranking,
                tuPosicion: ranking.findIndex(r => r.nombre === usuario.nombre) + 1,
                totalParticipantes: ranking.length
            });

        } catch (error) {
            logger.error('Error al obtener ranking', { socketId: socket.id, error: error.message });
            socket.emit('error:servidor', 'Error interno del servidor');
        }
    }

    /**
     * Reportar respuesta (para moderación)
     * @param {object} socket - Socket del usuario
     * @param {object} datos - Datos del reporte
     */
    reportarRespuesta(socket, datos) {
        try {
            const usuario = this.usuarioService.obtenerUsuario(socket.id);
            if (!usuario) {
                socket.emit('error:usuario-no-identificado', 'Usuario no identificado');
                return;
            }

            // Solo los docentes pueden recibir reportes
            if (!usuario.esProfesor()) {
                // Enviar reporte al docente de la sala
                const docente = this.usuarioService.obtenerDocentePorSala(usuario.codigoSala);
                if (docente) {
                    this.io.to(docente.socketId).emit('reporte:recibido', {
                        reportadoPor: usuario.nombre,
                        motivo: datos.motivo || 'Sin especificar',
                        detalles: datos.detalles || '',
                        momento: new Date()
                    });
                }

                socket.emit('reporte:enviado', 'Tu reporte ha sido enviado al docente');
            }

            logger.info('Reporte enviado', { 
                sala: usuario.codigoSala,
                reportadoPor: usuario.nombre,
                motivo: datos.motivo
            });

        } catch (error) {
            logger.error('Error al enviar reporte', { socketId: socket.id, error: error.message });
            socket.emit('error:servidor', 'Error interno del servidor');
        }
    }
}

module.exports = RespuestaController;
