/**
 * Modelo de Sala para el Quiz
 */
class Sala {
    constructor(codigo, docente) {
        this.codigo = codigo;
        this.docente = docente;
        this.pregunta = '';
        this.respuesta = '';
        this.activa = false;
        this.estudiantes = new Set();
        this.fechaCreacion = new Date();
    }

    /**
     * Agregar un estudiante a la sala
     * @param {string} socketId - ID del socket del estudiante
     */
    agregarEstudiante(socketId) {
        this.estudiantes.add(socketId);
    }

    /**
     * Remover un estudiante de la sala
     * @param {string} socketId - ID del socket del estudiante
     */
    removerEstudiante(socketId) {
        this.estudiantes.delete(socketId);
    }

    /**
     * Establecer una nueva pregunta
     * @param {string} pregunta - La pregunta
     * @param {string} respuesta - La respuesta correcta
     */
    establecerPregunta(pregunta, respuesta) {
        this.pregunta = pregunta;
        this.respuesta = respuesta.toLowerCase().trim();
        this.activa = true;
    }

    /**
     * Verificar si una respuesta es correcta
     * @param {string} respuesta - Respuesta del usuario
     * @returns {boolean} - True si es correcta
     */
    verificarRespuesta(respuesta) {
        return respuesta.toLowerCase().trim() === this.respuesta;
    }

    /**
     * Finalizar la ronda actual
     */
    finalizarRonda() {
        this.activa = false;
    }

    /**
     * Reiniciar la sala
     */
    reiniciar() {
        this.pregunta = '';
        this.respuesta = '';
        this.activa = false;
    }

    /**
     * Obtener el número de estudiantes
     * @returns {number} - Número de estudiantes
     */
    getNumeroEstudiantes() {
        return this.estudiantes.size;
    }

    /**
     * Verificar si la sala está vacía
     * @returns {boolean} - True si no hay estudiantes
     */
    estaVacia() {
        return this.estudiantes.size === 0;
    }
}

module.exports = Sala;
