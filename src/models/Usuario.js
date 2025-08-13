/**
 * Modelo de Usuario para el Quiz
 */
class Usuario {
    constructor(socketId, nombre, esDocente = false, codigoSala = null) {
        this.socketId = socketId;
        this.nombre = nombre;
        this.esDocente = esDocente;
        this.codigoSala = codigoSala;
        this.fechaConexion = new Date();
        this.puntuacion = 0;
        this.respuestasCorrectas = 0;
    }

    /**
     * Asignar una sala al usuario
     * @param {string} codigoSala - Código de la sala
     */
    asignarSala(codigoSala) {
        this.codigoSala = codigoSala;
    }

    /**
     * Incrementar puntuación
     * @param {number} puntos - Puntos a agregar
     */
    incrementarPuntuacion(puntos = 1) {
        this.puntuacion += puntos;
        this.respuestasCorrectas++;
    }

    /**
     * Obtener información básica del usuario
     * @returns {object} - Información del usuario
     */
    getInfo() {
        return {
            nombre: this.nombre,
            esDocente: this.esDocente,
            sala: this.codigoSala,
            puntuacion: this.puntuacion,
            respuestasCorrectas: this.respuestasCorrectas
        };
    }

    /**
     * Verificar si el usuario es docente
     * @returns {boolean} - True si es docente
     */
    esProfesor() {
        return this.esDocente;
    }

    /**
     * Verificar si el usuario está en una sala
     * @returns {boolean} - True si está en una sala
     */
    estaEnSala() {
        return this.codigoSala !== null;
    }

    /**
     * Salir de la sala actual
     */
    salirDeSala() {
        this.codigoSala = null;
    }

    /**
     * Reiniciar estadísticas del usuario
     */
    reiniciarEstadisticas() {
        this.puntuacion = 0;
        this.respuestasCorrectas = 0;
    }
}

module.exports = Usuario;
