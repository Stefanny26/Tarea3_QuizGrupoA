const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Importar servicios y controladores
const SalaService = require('./src/services/SalaService');
const UsuarioService = require('./src/services/UsuarioService');
const SalaController = require('./src/controllers/SalaController');
const RespuestaController = require('./src/controllers/RespuestaController');
const { logger } = require('./src/utils/Logger');

/**
 * Clase principal de la aplicación Quiz
 */
class QuizApp {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIo(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        // Inicializar servicios
        this.salaService = new SalaService();
        this.usuarioService = new UsuarioService();

        // Inicializar controladores
        this.salaController = new SalaController(this.salaService, this.usuarioService, this.io);
        this.respuestaController = new RespuestaController(this.salaService, this.usuarioService, this.io);

        // Configurar la aplicación
        this.configurarApp();
        this.configurarRutas();
        this.configurarSocket();
        this.configurarMantenimiento();
    }

    /**
     * Configurar la aplicación Express
     */
    configurarApp() {
        // Servir archivos estáticos
        this.app.use(express.static(path.join(__dirname, 'public')));
        
        // Middleware para logs
        this.app.use((req, res, next) => {
            logger.info(`${req.method} ${req.url}`, { ip: req.ip });
            next();
        });

        // Configurar headers de seguridad básicos
        this.app.use((req, res, next) => {
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'DENY');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            next();
        });
    }

    /**
     * Configurar rutas HTTP
     */
    configurarRutas() {
        // Ruta principal
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });

        // Ruta de salud del servidor
        this.app.get('/health', (req, res) => {
            const estadisticas = {
                status: 'OK',
                uptime: process.uptime(),
                timestamp: new Date(),
                salas: this.salaService.obtenerEstadisticas(),
                usuarios: this.usuarioService.obtenerEstadisticas()
            };
            res.json(estadisticas);
        });

        // Ruta para obtener información del servidor
        this.app.get('/api/info', (req, res) => {
            res.json({
                name: 'Quiz Rápido: El Duelo de Conocimiento',
                version: '2.0.0',
                description: 'Aplicación de quiz en tiempo real con Socket.io',
                author: 'Grupo A - Tarea 3',
                features: [
                    'Salas en tiempo real',
                    'Quiz interactivo',
                    'Ranking de estudiantes',
                    'Gestión de docentes'
                ]
            });
        });

        // Manejo de rutas no encontradas
        this.app.use('*', (req, res) => {
            res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
        });
    }

    /**
     * Configurar eventos de Socket.io
     */
    configurarSocket() {
        this.io.on('connection', (socket) => {
            logger.userConnection(socket.id, 'conectado');

            // Eventos de sala
            socket.on('sala:crear', (nombreDocente) => {
                logger.socketEvent('sala:crear', socket.id, { nombreDocente });
                this.salaController.crearSala(socket, nombreDocente);
            });

            socket.on('sala:unirse', (datos) => {
                logger.socketEvent('sala:unirse', socket.id, datos);
                this.salaController.unirseSala(socket, datos);
            });

            socket.on('sala:info', () => {
                logger.socketEvent('sala:info', socket.id);
                this.salaController.obtenerInfoSala(socket);
            });

            // Eventos de pregunta
            socket.on('pregunta:nueva', (datos) => {
                logger.socketEvent('pregunta:nueva', socket.id, { pregunta: datos.pregunta });
                this.salaController.publicarPregunta(socket, datos);
            });

            // Eventos de respuesta
            socket.on('respuesta:enviada', (respuestaUsuario) => {
                logger.socketEvent('respuesta:enviada', socket.id, { respuesta: respuestaUsuario });
                this.respuestaController.procesarRespuesta(socket, respuestaUsuario);
            });

            socket.on('respuesta:pista', () => {
                logger.socketEvent('respuesta:pista', socket.id);
                this.respuestaController.obtenerPista(socket);
            });

            // Eventos de juego
            socket.on('juego:reiniciar', () => {
                logger.socketEvent('juego:reiniciar', socket.id);
                this.salaController.reiniciarJuego(socket);
            });

            socket.on('ranking:obtener', () => {
                logger.socketEvent('ranking:obtener', socket.id);
                this.respuestaController.obtenerRanking(socket);
            });

            // Eventos de administración
            socket.on('admin:estadisticas', () => {
                logger.socketEvent('admin:estadisticas', socket.id);
                this.salaController.obtenerEstadisticas(socket);
            });

            socket.on('reporte:enviar', (datos) => {
                logger.socketEvent('reporte:enviar', socket.id, datos);
                this.respuestaController.reportarRespuesta(socket, datos);
            });

            // Evento de desconexión
            socket.on('disconnect', () => {
                logger.userConnection(socket.id, 'desconectado');
                this.salaController.manejarDesconexion(socket);
            });

            // Manejo de errores de socket
            socket.on('error', (error) => {
                logger.socketError('error', socket.id, error);
            });
        });

        // Eventos del servidor de Socket.io
        this.io.on('connect_error', (error) => {
            logger.error('Error de conexión Socket.io', { error: error.message });
        });
    }

    /**
     * Configurar tareas de mantenimiento
     */
    configurarMantenimiento() {
        // Limpiar salas inactivas cada 30 minutos
        setInterval(() => {
            logger.info('Ejecutando limpieza automática...');
            this.salaService.limpiarSalasInactivas();
            
            // Obtener socket IDs activos
            const socketIdsActivos = new Set();
            this.io.sockets.sockets.forEach((socket, id) => {
                socketIdsActivos.add(id);
            });
            
            // Limpiar usuarios desconectados
            this.usuarioService.limpiarUsuariosDesconectados(socketIdsActivos);
        }, 30 * 60 * 1000); // 30 minutos

        // Log de estadísticas cada 10 minutos
        setInterval(() => {
            const estadisticasSalas = this.salaService.obtenerEstadisticas();
            const estadisticasUsuarios = this.usuarioService.obtenerEstadisticas();
            
            logger.systemStats({
                salas: estadisticasSalas,
                usuarios: estadisticasUsuarios
            });
        }, 10 * 60 * 1000); // 10 minutos
    }

    /**
     * Iniciar el servidor
     * @param {number} port - Puerto del servidor
     */
    iniciar(port = 3000) {
        this.server.listen(port, () => {
            logger.info(`🚀 Servidor Quiz ejecutándose en puerto ${port}`);
            logger.info('💡 Aplicación lista para recibir conexiones');
            
            // Log de configuración
            logger.info('Configuración del servidor', {
                node_env: process.env.NODE_ENV || 'development',
                port: port,
                cors_enabled: true
            });
        });

        // Manejo de cierre graceful
        process.on('SIGTERM', () => {
            logger.info('Recibida señal SIGTERM, cerrando servidor...');
            this.cerrar();
        });

        process.on('SIGINT', () => {
            logger.info('Recibida señal SIGINT, cerrando servidor...');
            this.cerrar();
        });

        // Manejo de errores no capturados
        process.on('uncaughtException', (error) => {
            logger.error('Error no capturado', { error: error.message, stack: error.stack });
            this.cerrar();
        });

        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Promesa rechazada no manejada', { reason, promise });
        });
    }

    /**
     * Cerrar el servidor de forma graceful
     */
    cerrar() {
        logger.info('Cerrando servidor...');
        
        this.server.close(() => {
            logger.info('Servidor cerrado correctamente');
            process.exit(0);
        });

        // Forzar cierre después de 10 segundos
        setTimeout(() => {
            logger.error('Forzando cierre del servidor');
            process.exit(1);
        }, 10000);
    }
}

// Inicializar y arrancar la aplicación
const PORT = process.env.PORT || 3000;
const app = new QuizApp();
app.iniciar(PORT);

module.exports = QuizApp;
