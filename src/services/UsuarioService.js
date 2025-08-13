const Usuario = require('../models/Usuario');

/**
 * Servicio para gestionar los usuarios del quiz
 */
class UsuarioService {
    constructor() {
        this.usuarios = new Map(); // socketId -> Usuario
    }

    /**
     * Registrar un nuevo usuario
     * @param {string} socketId - ID del socket
     * @param {string} nombre - Nombre del usuario
     * @param {boolean} esDocente - Si es docente
     * @param {string} codigoSala - Código de la sala (opcional)
     * @returns {Usuario} - Usuario creado
     */
    registrarUsuario(socketId, nombre, esDocente = false, codigoSala = null) {
        const usuario = new Usuario(socketId, nombre, esDocente, codigoSala);
        this.usuarios.set(socketId, usuario);
        
        const rol = esDocente ? 'Docente' : 'Estudiante';
        console.log(`👤 ${rol} registrado: ${nombre} (${socketId})`);
        
        return usuario;
    }

    /**
     * Obtener un usuario por socket ID
     * @param {string} socketId - ID del socket
     * @returns {Usuario|null} - Usuario o null si no existe
     */
    obtenerUsuario(socketId) {
        return this.usuarios.get(socketId) || null;
    }

    /**
     * Verificar si un usuario existe
     * @param {string} socketId - ID del socket
     * @returns {boolean} - True si existe
     */
    existeUsuario(socketId) {
        return this.usuarios.has(socketId);
    }

    /**
     * Eliminar un usuario
     * @param {string} socketId - ID del socket
     * @returns {boolean} - True si se eliminó correctamente
     */
    eliminarUsuario(socketId) {
        const usuario = this.usuarios.get(socketId);
        if (usuario) {
            const resultado = this.usuarios.delete(socketId);
            console.log(`👋 Usuario desconectado: ${usuario.nombre} (${socketId})`);
            return resultado;
        }
        return false;
    }

    /**
     * Asignar sala a un usuario
     * @param {string} socketId - ID del socket
     * @param {string} codigoSala - Código de la sala
     * @returns {boolean} - True si se asignó correctamente
     */
    asignarSala(socketId, codigoSala) {
        const usuario = this.obtenerUsuario(socketId);
        if (usuario) {
            usuario.asignarSala(codigoSala);
            console.log(`🏠 Usuario ${usuario.nombre} asignado a sala ${codigoSala}`);
            return true;
        }
        return false;
    }

    /**
     * Verificar si un usuario es docente
     * @param {string} socketId - ID del socket
     * @returns {boolean} - True si es docente
     */
    esDocente(socketId) {
        const usuario = this.obtenerUsuario(socketId);
        return usuario ? usuario.esProfesor() : false;
    }

    /**
     * Obtener sala del usuario
     * @param {string} socketId - ID del socket
     * @returns {string|null} - Código de la sala o null
     */
    obtenerSalaUsuario(socketId) {
        const usuario = this.obtenerUsuario(socketId);
        return usuario ? usuario.codigoSala : null;
    }

    /**
     * Incrementar puntuación de un usuario
     * @param {string} socketId - ID del socket
     * @param {number} puntos - Puntos a agregar
     * @returns {boolean} - True si se incrementó correctamente
     */
    incrementarPuntuacion(socketId, puntos = 1) {
        const usuario = this.obtenerUsuario(socketId);
        if (usuario) {
            usuario.incrementarPuntuacion(puntos);
            console.log(`⭐ Usuario ${usuario.nombre} ahora tiene ${usuario.puntuacion} puntos`);
            return true;
        }
        return false;
    }

    /**
     * Obtener usuarios por sala
     * @param {string} codigoSala - Código de la sala
     * @returns {Usuario[]} - Array de usuarios en la sala
     */
    obtenerUsuariosPorSala(codigoSala) {
        const usuariosEnSala = [];
        this.usuarios.forEach(usuario => {
            if (usuario.codigoSala === codigoSala) {
                usuariosEnSala.push(usuario);
            }
        });
        return usuariosEnSala;
    }

    /**
     * Obtener estudiantes por sala
     * @param {string} codigoSala - Código de la sala
     * @returns {Usuario[]} - Array de estudiantes en la sala
     */
    obtenerEstudiantesPorSala(codigoSala) {
        return this.obtenerUsuariosPorSala(codigoSala).filter(usuario => !usuario.esDocente);
    }

    /**
     * Obtener docente de una sala
     * @param {string} codigoSala - Código de la sala
     * @returns {Usuario|null} - Docente de la sala o null
     */
    obtenerDocentePorSala(codigoSala) {
        const usuarios = this.obtenerUsuariosPorSala(codigoSala);
        return usuarios.find(usuario => usuario.esDocente) || null;
    }

    /**
     * Reiniciar estadísticas de usuarios en una sala
     * @param {string} codigoSala - Código de la sala
     * @returns {number} - Número de usuarios reiniciados
     */
    reiniciarEstadisticasSala(codigoSala) {
        const usuarios = this.obtenerUsuariosPorSala(codigoSala);
        usuarios.forEach(usuario => {
            usuario.reiniciarEstadisticas();
        });
        
        console.log(`🔄 Estadísticas reiniciadas para ${usuarios.length} usuarios en sala ${codigoSala}`);
        return usuarios.length;
    }

    /**
     * Obtener ranking de una sala
     * @param {string} codigoSala - Código de la sala
     * @returns {object[]} - Array de usuarios ordenados por puntuación
     */
    obtenerRankingSala(codigoSala) {
        const estudiantes = this.obtenerEstudiantesPorSala(codigoSala);
        return estudiantes
            .map(usuario => ({
                nombre: usuario.nombre,
                puntuacion: usuario.puntuacion,
                respuestasCorrectas: usuario.respuestasCorrectas
            }))
            .sort((a, b) => b.puntuacion - a.puntuacion);
    }

    /**
     * Obtener estadísticas generales
     * @returns {object} - Estadísticas de usuarios
     */
    obtenerEstadisticas() {
        const totalUsuarios = this.usuarios.size;
        let totalDocentes = 0;
        let totalEstudiantes = 0;
        let puntuacionTotal = 0;

        this.usuarios.forEach(usuario => {
            if (usuario.esDocente) {
                totalDocentes++;
            } else {
                totalEstudiantes++;
            }
            puntuacionTotal += usuario.puntuacion;
        });

        return {
            totalUsuarios,
            totalDocentes,
            totalEstudiantes,
            puntuacionTotal,
            puntuacionPromedio: totalUsuarios > 0 ? puntuacionTotal / totalUsuarios : 0,
            timestamp: new Date()
        };
    }

    /**
     * Validar nombre de usuario
     * @param {string} nombre - Nombre a validar
     * @returns {object} - Resultado de validación
     */
    validarNombre(nombre) {
        if (!nombre || typeof nombre !== 'string') {
            return { valido: false, mensaje: 'El nombre es requerido' };
        }

        const nombreLimpio = nombre.trim();
        
        if (nombreLimpio.length < 2) {
            return { valido: false, mensaje: 'El nombre debe tener al menos 2 caracteres' };
        }

        if (nombreLimpio.length > 20) {
            return { valido: false, mensaje: 'El nombre no puede tener más de 20 caracteres' };
        }

        // Verificar caracteres válidos
        const caracteresValidos = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;
        if (!caracteresValidos.test(nombreLimpio)) {
            return { valido: false, mensaje: 'El nombre solo puede contener letras y espacios' };
        }

        return { valido: true, nombreLimpio };
    }

    /**
     * Limpiar usuarios desconectados (mantenimiento)
     * @param {Set} socketIdsActivos - Set de socket IDs activos
     */
    limpiarUsuariosDesconectados(socketIdsActivos) {
        const usuariosAEliminar = [];

        this.usuarios.forEach((usuario, socketId) => {
            if (!socketIdsActivos.has(socketId)) {
                usuariosAEliminar.push(socketId);
            }
        });

        usuariosAEliminar.forEach(socketId => {
            this.eliminarUsuario(socketId);
        });

        if (usuariosAEliminar.length > 0) {
            console.log(`🧹 Limpieza automática: ${usuariosAEliminar.length} usuarios eliminados`);
        }
    }
}

module.exports = UsuarioService;
