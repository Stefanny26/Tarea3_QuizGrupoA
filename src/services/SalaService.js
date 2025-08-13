const Sala = require('../models/Sala');

/**
 * Servicio para gestionar las salas del quiz
 */
class SalaService {
    constructor() {
        this.salas = new Map(); // código -> Sala
    }

    /**
     * Generar un código único para la sala
     * @returns {string} - Código de 6 caracteres
     */
    generarCodigoSala() {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let codigo;
        
        do {
            codigo = '';
            for (let i = 0; i < 6; i++) {
                codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
            }
        } while (this.salas.has(codigo)); // Asegurar que sea único
        
        return codigo;
    }

    /**
     * Crear una nueva sala
     * @param {string} nombreDocente - Nombre del docente
     * @returns {string} - Código de la sala creada
     */
    crearSala(nombreDocente) {
        const codigo = this.generarCodigoSala();
        const sala = new Sala(codigo, nombreDocente);
        this.salas.set(codigo, sala);
        
        console.log(`📚 Sala creada: ${codigo} por ${nombreDocente}`);
        return codigo;
    }

    /**
     * Obtener una sala por código
     * @param {string} codigo - Código de la sala
     * @returns {Sala|null} - La sala o null si no existe
     */
    obtenerSala(codigo) {
        return this.salas.get(codigo.toUpperCase()) || null;
    }

    /**
     * Verificar si una sala existe
     * @param {string} codigo - Código de la sala
     * @returns {boolean} - True si existe
     */
    existeSala(codigo) {
        return this.salas.has(codigo.toUpperCase());
    }

    /**
     * Eliminar una sala
     * @param {string} codigo - Código de la sala
     * @returns {boolean} - True si se eliminó correctamente
     */
    eliminarSala(codigo) {
        const resultado = this.salas.delete(codigo.toUpperCase());
        if (resultado) {
            console.log(`🗑️  Sala eliminada: ${codigo}`);
        }
        return resultado;
    }

    /**
     * Agregar estudiante a una sala
     * @param {string} codigo - Código de la sala
     * @param {string} socketId - ID del socket del estudiante
     * @returns {boolean} - True si se agregó correctamente
     */
    agregarEstudianteASala(codigo, socketId) {
        const sala = this.obtenerSala(codigo);
        if (sala) {
            sala.agregarEstudiante(socketId);
            console.log(`👩‍🎓 Estudiante agregado a sala ${codigo}: ${socketId}`);
            return true;
        }
        return false;
    }

    /**
     * Remover estudiante de una sala
     * @param {string} codigo - Código de la sala
     * @param {string} socketId - ID del socket del estudiante
     * @returns {boolean} - True si se removió correctamente
     */
    removerEstudianteDeSala(codigo, socketId) {
        const sala = this.obtenerSala(codigo);
        if (sala) {
            sala.removerEstudiante(socketId);
            console.log(`👋 Estudiante removido de sala ${codigo}: ${socketId}`);
            
            // Si la sala está vacía y no es del docente, eliminarla
            if (sala.estaVacia()) {
                console.log(`🧹 Sala ${codigo} está vacía, considerando eliminación...`);
            }
            
            return true;
        }
        return false;
    }

    /**
     * Establecer pregunta en una sala
     * @param {string} codigo - Código de la sala
     * @param {string} pregunta - La pregunta
     * @param {string} respuesta - La respuesta correcta
     * @returns {boolean} - True si se estableció correctamente
     */
    establecerPregunta(codigo, pregunta, respuesta) {
        const sala = this.obtenerSala(codigo);
        if (sala) {
            sala.establecerPregunta(pregunta, respuesta);
            console.log(`❓ Nueva pregunta en sala ${codigo}: ${pregunta}`);
            return true;
        }
        return false;
    }

    /**
     * Verificar respuesta en una sala
     * @param {string} codigo - Código de la sala
     * @param {string} respuesta - Respuesta del usuario
     * @returns {boolean} - True si es correcta
     */
    verificarRespuesta(codigo, respuesta) {
        const sala = this.obtenerSala(codigo);
        if (sala && sala.activa) {
            return sala.verificarRespuesta(respuesta);
        }
        return false;
    }

    /**
     * Finalizar ronda en una sala
     * @param {string} codigo - Código de la sala
     * @returns {boolean} - True si se finalizó correctamente
     */
    finalizarRonda(codigo) {
        const sala = this.obtenerSala(codigo);
        if (sala) {
            sala.finalizarRonda();
            console.log(`🏁 Ronda finalizada en sala ${codigo}`);
            return true;
        }
        return false;
    }

    /**
     * Reiniciar sala
     * @param {string} codigo - Código de la sala
     * @returns {boolean} - True si se reinició correctamente
     */
    reiniciarSala(codigo) {
        const sala = this.obtenerSala(codigo);
        if (sala) {
            sala.reiniciar();
            console.log(`🔄 Sala reiniciada: ${codigo}`);
            return true;
        }
        return false;
    }

    /**
     * Obtener estadísticas de todas las salas
     * @returns {object} - Estadísticas generales
     */
    obtenerEstadisticas() {
        const totalSalas = this.salas.size;
        let totalEstudiantes = 0;
        let salasActivas = 0;

        this.salas.forEach(sala => {
            totalEstudiantes += sala.getNumeroEstudiantes();
            if (sala.activa) salasActivas++;
        });

        return {
            totalSalas,
            totalEstudiantes,
            salasActivas,
            timestamp: new Date()
        };
    }

    /**
     * Limpiar salas inactivas (mantenimiento)
     */
    limpiarSalasInactivas() {
        const ahora = new Date();
        const salasAEliminar = [];

        this.salas.forEach((sala, codigo) => {
            // Eliminar salas vacías de más de 1 hora
            const tiempoInactivo = ahora - sala.fechaCreacion;
            const unaHora = 60 * 60 * 1000;

            if (sala.estaVacia() && tiempoInactivo > unaHora) {
                salasAEliminar.push(codigo);
            }
        });

        salasAEliminar.forEach(codigo => {
            this.eliminarSala(codigo);
        });

        if (salasAEliminar.length > 0) {
            console.log(`🧹 Limpieza automática: ${salasAEliminar.length} salas eliminadas`);
        }
    }
}

module.exports = SalaService;
