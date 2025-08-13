/**
 * Logger personalizado para la aplicación
 */
class Logger {
    static LOG_LEVELS = {
        ERROR: 0,
        WARN: 1,
        INFO: 2,
        DEBUG: 3
    };

    constructor(level = Logger.LOG_LEVELS.INFO) {
        this.level = level;
    }

    /**
     * Formatear mensaje con timestamp
     * @param {string} level - Nivel del log
     * @param {string} message - Mensaje
     * @param {object} data - Datos adicionales
     * @returns {string} - Mensaje formateado
     */
    formatMessage(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const baseMessage = `[${timestamp}] ${level}: ${message}`;
        
        if (data) {
            return `${baseMessage} ${JSON.stringify(data)}`;
        }
        
        return baseMessage;
    }

    /**
     * Log de error
     * @param {string} message - Mensaje de error
     * @param {object} data - Datos adicionales
     */
    error(message, data = null) {
        if (this.level >= Logger.LOG_LEVELS.ERROR) {
            console.error(this.formatMessage('ERROR', message, data));
        }
    }

    /**
     * Log de advertencia
     * @param {string} message - Mensaje de advertencia
     * @param {object} data - Datos adicionales
     */
    warn(message, data = null) {
        if (this.level >= Logger.LOG_LEVELS.WARN) {
            console.warn(this.formatMessage('WARN', message, data));
        }
    }

    /**
     * Log de información
     * @param {string} message - Mensaje de información
     * @param {object} data - Datos adicionales
     */
    info(message, data = null) {
        if (this.level >= Logger.LOG_LEVELS.INFO) {
            console.log(this.formatMessage('INFO', message, data));
        }
    }

    /**
     * Log de debug
     * @param {string} message - Mensaje de debug
     * @param {object} data - Datos adicionales
     */
    debug(message, data = null) {
        if (this.level >= Logger.LOG_LEVELS.DEBUG) {
            console.log(this.formatMessage('DEBUG', message, data));
        }
    }

    /**
     * Log de evento de socket
     * @param {string} event - Nombre del evento
     * @param {string} socketId - ID del socket
     * @param {object} data - Datos del evento
     */
    socketEvent(event, socketId, data = null) {
        this.info(`Socket Event: ${event}`, { socketId, data });
    }

    /**
     * Log de error de socket
     * @param {string} event - Nombre del evento
     * @param {string} socketId - ID del socket
     * @param {string} error - Error ocurrido
     */
    socketError(event, socketId, error) {
        this.error(`Socket Error in ${event}`, { socketId, error });
    }

    /**
     * Log de conexión de usuario
     * @param {string} socketId - ID del socket
     * @param {string} tipo - Tipo de conexión
     */
    userConnection(socketId, tipo = 'conectado') {
        this.info(`Usuario ${tipo}`, { socketId });
    }

    /**
     * Log de actividad de sala
     * @param {string} accion - Acción realizada
     * @param {string} codigoSala - Código de la sala
     * @param {object} detalles - Detalles adicionales
     */
    salaActivity(accion, codigoSala, detalles = null) {
        this.info(`Sala ${accion}`, { codigoSala, detalles });
    }

    /**
     * Log de estadísticas del sistema
     * @param {object} estadisticas - Estadísticas del sistema
     */
    systemStats(estadisticas) {
        this.info('Estadísticas del sistema', estadisticas);
    }
}

// Instancia global del logger
const logger = new Logger(
    process.env.NODE_ENV === 'development' 
        ? Logger.LOG_LEVELS.DEBUG 
        : Logger.LOG_LEVELS.INFO
);

module.exports = { Logger, logger };
