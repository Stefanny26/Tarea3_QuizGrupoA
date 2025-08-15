/**
 * Modelo de Sala para el Quiz
 */
class Sala {
    constructor(codigo, docente) {
        this.codigo = codigo;
        this.docente = docente;
        this.pregunta = '';
        this.opciones = {};
        this.respuestaCorrecta = '';
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
    /**
     * Establecer una nueva pregunta con opciones
     * @param {string} pregunta - La pregunta
     * @param {object} opciones - Opciones {a, b, c, d}
     * @param {string} respuestaCorrecta - Clave de la respuesta correcta (a, b, c, d)
     */
    establecerPregunta(pregunta, opciones, respuestaCorrecta) {
        this.pregunta = pregunta;
        this.opciones = opciones;
        this.respuestaCorrecta = respuestaCorrecta.toLowerCase().trim();
        this.activa = true;
    }

    /**
     * Verificar si una respuesta es correcta
     * @param {string} respuesta - Respuesta del usuario
     * @returns {boolean} - True si es correcta
     */
    /**
     * Verificar si una respuesta es correcta (clave: a, b, c, d)
     * @param {string} respuesta - Respuesta del usuario (clave)
     * @returns {boolean} - True si es correcta
     */
    verificarRespuesta(respuesta) {
        return respuesta.toLowerCase().trim() === this.respuestaCorrecta;
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
        this.opciones = {};
        this.respuestaCorrecta = '';
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
