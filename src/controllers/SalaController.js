const Validator = require('../utils/Validator');
const { logger } = require('../utils/Logger');

/**
 * Controlador para gestionar las salas del quiz
 */
class SalaController {
    constructor(salaService, usuarioService, io) {
        this.salaService = salaService;
        this.usuarioService = usuarioService;
        this.io = io;
    }

    /**
     * Crear una nueva sala
     * @param {object} socket - Socket del usuario
     * @param {string} nombreDocente - Nombre del docente
     */
    crearSala(socket, nombreDocente) {
        try {
            // Validar nombre del docente
            const validacionNombre = this.usuarioService.validarNombre(nombreDocente);
            if (!validacionNombre.valido) {
                socket.emit('error:validacion', validacionNombre.mensaje);
                return;
            }

            // Crear la sala
            const codigoSala = this.salaService.crearSala(validacionNombre.nombreLimpio);

            // Registrar al docente
            this.usuarioService.registrarUsuario(
                socket.id, 
                validacionNombre.nombreLimpio, 
                true, 
                codigoSala
            );

            // Unir al docente a la sala
            socket.join(codigoSala);

            logger.salaActivity('creada', codigoSala, { docente: validacionNombre.nombreLimpio });

            // Confirmar creación al docente
            socket.emit('sala:creada', {
                codigo: codigoSala,
                mensaje: `Sala creada exitosamente. Código: ${codigoSala}`,
                docente: validacionNombre.nombreLimpio
            });

        } catch (error) {
            logger.error('Error al crear sala', { socketId: socket.id, error: error.message });
            socket.emit('error:servidor', 'Error interno del servidor');
        }
    }

    /**
     * Unirse a una sala existente
     * @param {object} socket - Socket del usuario
     * @param {object} datos - Datos del estudiante {nombre, codigo}
     */
    unirseSala(socket, datos) {
        try {
            const { nombre, codigo } = datos;

            // Validar nombre del estudiante
            const validacionNombre = this.usuarioService.validarNombre(nombre);
            if (!validacionNombre.valido) {
                socket.emit('error:validacion', validacionNombre.mensaje);
                return;
            }

            // Validar código de sala
            const validacionCodigo = Validator.validarCodigoSala(codigo);
            if (!validacionCodigo.valido) {
                socket.emit('error:validacion', validacionCodigo.mensaje);
                return;
            }

            // Verificar que la sala existe
            if (!this.salaService.existeSala(validacionCodigo.codigoLimpio)) {
                socket.emit('error:sala-no-existe', 'El código de sala no existe');
                return;
            }

            const codigoSala = validacionCodigo.codigoLimpio;

            // Registrar al estudiante
            this.usuarioService.registrarUsuario(
                socket.id, 
                validacionNombre.nombreLimpio, 
                false, 
                codigoSala
            );

            // Agregar estudiante a la sala
            this.salaService.agregarEstudianteASala(codigoSala, socket.id);

            // Unir al estudiante a la sala
            socket.join(codigoSala);

            const sala = this.salaService.obtenerSala(codigoSala);

            logger.salaActivity('estudiante-unido', codigoSala, { 
                estudiante: validacionNombre.nombreLimpio,
                totalEstudiantes: sala.getNumeroEstudiantes()
            });

            // Confirmar unión al estudiante
            socket.emit('sala:unido', {
                codigo: codigoSala,
                mensaje: `Te has unido a la sala ${codigoSala}`,
                docente: sala.docente
            });

            // Si hay una pregunta activa, enviarla al nuevo estudiante
            if (sala.pregunta && sala.activa) {
                socket.emit('pregunta:publicada', sala.pregunta);
            }

            // Notificar a todos en la sala sobre el nuevo participante
            this.io.to(codigoSala).emit('participante:nuevo', {
                nombre: validacionNombre.nombreLimpio,
                totalEstudiantes: sala.getNumeroEstudiantes()
            });

        } catch (error) {
            logger.error('Error al unirse a sala', { socketId: socket.id, error: error.message });
            socket.emit('error:servidor', 'Error interno del servidor');
        }
    }

    /**
     * Publicar nueva pregunta con opciones
     * @param {object} socket - Socket del usuario
     * @param {object} datos - Datos de la pregunta {pregunta, opciones, respuestaCorrecta}
     */
    publicarPregunta(socket, datos) {
        try {
            const usuario = this.usuarioService.obtenerUsuario(socket.id);
            if (!usuario || !usuario.esProfesor()) {
                socket.emit('error:sin-permisos', 'Solo el docente puede publicar preguntas');
                return;
            }

            // Validar datos de la pregunta
            if (!datos.pregunta || !datos.opciones || !datos.respuestaCorrecta) {
                socket.emit('error:validacion', 'Debes ingresar pregunta, opciones y respuesta correcta');
                return;
            }
            const opciones = datos.opciones;
            const clavesValidas = ['a', 'b', 'c', 'd'];
            if (typeof opciones !== 'object' || clavesValidas.some(k => !opciones[k])) {
                socket.emit('error:validacion', 'Las opciones deben incluir a, b, c y d');
                return;
            }
            if (!clavesValidas.includes(datos.respuestaCorrecta.toLowerCase())) {
                socket.emit('error:validacion', 'La respuesta correcta debe ser a, b, c o d');
                return;
            }

            const codigoSala = usuario.codigoSala;
            this.salaService.establecerPregunta(
                codigoSala,
                datos.pregunta,
                opciones,
                datos.respuestaCorrecta
            );

            logger.salaActivity('pregunta-publicada', codigoSala, { pregunta: datos.pregunta });

            // Enviar la pregunta y opciones a todos en la sala (sin la respuesta)
            this.io.to(codigoSala).emit('pregunta:publicada', {
                pregunta: datos.pregunta,
                opciones: opciones
            });

            // Notificar que la ronda ha comenzado
            this.io.to(codigoSala).emit('ronda:iniciada');

        } catch (error) {
            logger.error('Error al publicar pregunta', { socketId: socket.id, error: error.message });
            socket.emit('error:servidor', 'Error interno del servidor');
        }
    }

    /**
     * Reiniciar el juego en una sala
     * @param {object} socket - Socket del usuario
     */
    reiniciarJuego(socket) {
        try {
            const usuario = this.usuarioService.obtenerUsuario(socket.id);
            if (!usuario || !usuario.esProfesor()) {
                socket.emit('error:sin-permisos', 'Solo el docente puede reiniciar el juego');
                return;
            }

            const codigoSala = usuario.codigoSala;

            // Reiniciar la sala
            this.salaService.reiniciarSala(codigoSala);

            // Reiniciar estadísticas de usuarios
            this.usuarioService.reiniciarEstadisticasSala(codigoSala);

            logger.salaActivity('reiniciada', codigoSala, { docente: usuario.nombre });

            // Notificar a todos en la sala
            this.io.to(codigoSala).emit('juego:reiniciado');

        } catch (error) {
            logger.error('Error al reiniciar juego', { socketId: socket.id, error: error.message });
            socket.emit('error:servidor', 'Error interno del servidor');
        }
    }

    /**
     * Obtener información de la sala
     * @param {object} socket - Socket del usuario
     */
    obtenerInfoSala(socket) {
        try {
            const usuario = this.usuarioService.obtenerUsuario(socket.id);
            if (!usuario) {
                socket.emit('error:usuario-no-identificado', 'Usuario no identificado');
                return;
            }

            const sala = this.salaService.obtenerSala(usuario.codigoSala);
            if (!sala) {
                socket.emit('error:sala-no-existe', 'La sala no existe');
                return;
            }

            socket.emit('sala:info-actualizada', {
                codigo: usuario.codigoSala,
                docente: sala.docente,
                totalEstudiantes: sala.getNumeroEstudiantes(),
                esDocente: usuario.esProfesor(),
                preguntaActiva: sala.activa,
                preguntaActual: sala.activa ? sala.pregunta : null
            });

        } catch (error) {
            logger.error('Error al obtener info de sala', { socketId: socket.id, error: error.message });
            socket.emit('error:servidor', 'Error interno del servidor');
        }
    }

    /**
     * Manejar desconexión de usuario
     * @param {object} socket - Socket del usuario
     */
    manejarDesconexion(socket) {
        try {
            const usuario = this.usuarioService.obtenerUsuario(socket.id);
            if (!usuario) return;

            const codigoSala = usuario.codigoSala;
            const sala = this.salaService.obtenerSala(codigoSala);

            if (sala) {
                if (usuario.esProfesor()) {
                    // Si el docente se desconecta, cerrar la sala
                    sala.estudiantes.forEach(estudianteId => {
                        this.io.to(estudianteId).emit('sala:cerrada', 'El docente ha cerrado la sala');
                    });
                    
                    this.salaService.eliminarSala(codigoSala);
                    logger.salaActivity('cerrada-docente-desconectado', codigoSala);
                } else {
                    // Remover estudiante de la sala
                    this.salaService.removerEstudianteDeSala(codigoSala, socket.id);
                    
                    // Notificar a todos en la sala sobre la desconexión
                    this.io.to(codigoSala).emit('participante:desconectado', {
                        nombre: usuario.nombre,
                        totalEstudiantes: sala.getNumeroEstudiantes()
                    });

                    logger.salaActivity('estudiante-desconectado', codigoSala, { 
                        estudiante: usuario.nombre,
                        totalEstudiantes: sala.getNumeroEstudiantes()
                    });
                }
            }

            // Eliminar usuario
            this.usuarioService.eliminarUsuario(socket.id);

        } catch (error) {
            logger.error('Error al manejar desconexión', { socketId: socket.id, error: error.message });
        }
    }

    /**
     * Obtener estadísticas del sistema
     * @param {object} socket - Socket del usuario
     */
    obtenerEstadisticas(socket) {
        try {
            const usuario = this.usuarioService.obtenerUsuario(socket.id);
            if (!usuario || !usuario.esProfesor()) {
                socket.emit('error:sin-permisos', 'Solo los docentes pueden ver estadísticas');
                return;
            }

            const estadisticasSalas = this.salaService.obtenerEstadisticas();
            const estadisticasUsuarios = this.usuarioService.obtenerEstadisticas();

            socket.emit('estadisticas:sistema', {
                salas: estadisticasSalas,
                usuarios: estadisticasUsuarios
            });

        } catch (error) {
            logger.error('Error al obtener estadísticas', { socketId: socket.id, error: error.message });
            socket.emit('error:servidor', 'Error interno del servidor');
        }
    }
}

module.exports = SalaController;
