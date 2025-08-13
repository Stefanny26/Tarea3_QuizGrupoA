/**
 * Utilidades para validación
 */
class Validator {
    /**
     * Validar código de sala
     * @param {string} codigo - Código a validar
     * @returns {object} - Resultado de validación
     */
    static validarCodigoSala(codigo) {
        if (!codigo || typeof codigo !== 'string') {
            return { valido: false, mensaje: 'El código de sala es requerido' };
        }

        const codigoLimpio = codigo.trim().toUpperCase();
        
        if (codigoLimpio.length !== 6) {
            return { valido: false, mensaje: 'El código debe tener exactamente 6 caracteres' };
        }

        const caracteresValidos = /^[A-Z0-9]+$/;
        if (!caracteresValidos.test(codigoLimpio)) {
            return { valido: false, mensaje: 'El código solo puede contener letras y números' };
        }

        return { valido: true, codigoLimpio };
    }

    /**
     * Validar pregunta
     * @param {string} pregunta - Pregunta a validar
     * @returns {object} - Resultado de validación
     */
    static validarPregunta(pregunta) {
        if (!pregunta || typeof pregunta !== 'string') {
            return { valido: false, mensaje: 'La pregunta es requerida' };
        }

        const preguntaLimpia = pregunta.trim();
        
        if (preguntaLimpia.length < 5) {
            return { valido: false, mensaje: 'La pregunta debe tener al menos 5 caracteres' };
        }

        if (preguntaLimpia.length > 500) {
            return { valido: false, mensaje: 'La pregunta no puede tener más de 500 caracteres' };
        }

        return { valido: true, preguntaLimpia };
    }

    /**
     * Validar respuesta
     * @param {string} respuesta - Respuesta a validar
     * @returns {object} - Resultado de validación
     */
    static validarRespuesta(respuesta) {
        if (!respuesta || typeof respuesta !== 'string') {
            return { valido: false, mensaje: 'La respuesta es requerida' };
        }

        const respuestaLimpia = respuesta.trim();
        
        if (respuestaLimpia.length < 1) {
            return { valido: false, mensaje: 'La respuesta no puede estar vacía' };
        }

        if (respuestaLimpia.length > 100) {
            return { valido: false, mensaje: 'La respuesta no puede tener más de 100 caracteres' };
        }

        return { valido: true, respuestaLimpia };
    }

    /**
     * Sanitizar texto
     * @param {string} texto - Texto a sanitizar
     * @returns {string} - Texto sanitizado
     */
    static sanitizarTexto(texto) {
        if (!texto || typeof texto !== 'string') {
            return '';
        }

        return texto
            .trim()
            .replace(/\s+/g, ' ') // Múltiples espacios por uno solo
            .replace(/[<>]/g, ''); // Remover caracteres peligrosos
    }

    /**
     * Validar email (para futuras funcionalidades)
     * @param {string} email - Email a validar
     * @returns {object} - Resultado de validación
     */
    static validarEmail(email) {
        if (!email || typeof email !== 'string') {
            return { valido: false, mensaje: 'El email es requerido' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { valido: false, mensaje: 'El formato del email no es válido' };
        }

        return { valido: true, emailLimpio: email.toLowerCase().trim() };
    }

    /**
     * Validar datos de usuario completos
     * @param {object} datos - Datos del usuario
     * @returns {object} - Resultado de validación
     */
    static validarDatosUsuario(datos) {
        const errores = [];

        if (!datos.nombre) {
            errores.push('El nombre es requerido');
        }

        if (datos.esDocente !== undefined && typeof datos.esDocente !== 'boolean') {
            errores.push('El tipo de usuario debe ser válido');
        }

        if (datos.codigoSala && !this.validarCodigoSala(datos.codigoSala).valido) {
            errores.push('El código de sala no es válido');
        }

        return {
            valido: errores.length === 0,
            errores: errores
        };
    }

    /**
     * Validar datos de pregunta completos
     * @param {object} datos - Datos de la pregunta
     * @returns {object} - Resultado de validación
     */
    static validarDatosPregunta(datos) {
        const errores = [];

        const validacionPregunta = this.validarPregunta(datos.pregunta);
        if (!validacionPregunta.valido) {
            errores.push(validacionPregunta.mensaje);
        }

        const validacionRespuesta = this.validarRespuesta(datos.respuesta);
        if (!validacionRespuesta.valido) {
            errores.push(validacionRespuesta.mensaje);
        }

        return {
            valido: errores.length === 0,
            errores: errores,
            datosLimpios: errores.length === 0 ? {
                pregunta: validacionPregunta.preguntaLimpia,
                respuesta: validacionRespuesta.respuestaLimpia
            } : null
        };
    }
}

module.exports = Validator;
