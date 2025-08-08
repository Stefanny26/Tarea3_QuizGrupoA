const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Configuración del servidor
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Variables del juego
let salas = new Map(); // código -> { docente, pregunta, respuesta, activa, estudiantes }
let usuariosConectados = new Map(); // socket.id -> { nombre, sala, esDocente }

// Función para generar código de sala
function generarCodigoSala() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 6; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
}

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Gestión de conexiones Socket.io
io.on('connection', (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`);

    // Evento: Crear sala (solo para docentes)
    socket.on('sala:crear', (nombreDocente) => {
        const codigoSala = generarCodigoSala();
        
        // Crear nueva sala
        salas.set(codigoSala, {
            docente: nombreDocente,
            pregunta: '',
            respuesta: '',
            activa: false,
            estudiantes: new Set()
        });
        
        // Registrar usuario
        usuariosConectados.set(socket.id, {
            nombre: nombreDocente,
            sala: codigoSala,
            esDocente: true
        });
        
        // Unir al docente a la sala
        socket.join(codigoSala);
        
        console.log(`Docente ${nombreDocente} creó la sala ${codigoSala}`);
        
        // Enviar código de sala al docente
        socket.emit('sala:creada', {
            codigo: codigoSala,
            mensaje: `Sala creada exitosamente. Código: ${codigoSala}`
        });
    });

    // Evento: Unirse a sala (para estudiantes)
    socket.on('sala:unirse', (datos) => {
        const { nombre, codigo } = datos;
        const codigoMayuscula = codigo.toUpperCase();
        
        const sala = salas.get(codigoMayuscula);
        if (!sala) {
            socket.emit('error:sala-no-existe', 'El código de sala no existe');
            return;
        }
        
        // Registrar usuario
        usuariosConectados.set(socket.id, {
            nombre: nombre,
            sala: codigoMayuscula,
            esDocente: false
        });
        
        // Agregar estudiante a la sala
        sala.estudiantes.add(socket.id);
        
        // Unir al estudiante a la sala
        socket.join(codigoMayuscula);
        
        console.log(`Estudiante ${nombre} se unió a la sala ${codigoMayuscula}`);
        
        // Confirmar unión al estudiante
        socket.emit('sala:unido', {
            codigo: codigoMayuscula,
            mensaje: `Te has unido a la sala ${codigoMayuscula}`
        });
        
        // Si hay una pregunta activa, enviarla al nuevo estudiante
        if (sala.pregunta && sala.activa) {
            socket.emit('pregunta:publicada', sala.pregunta);
        }
        
        // Notificar a todos en la sala sobre el nuevo participante
        io.to(codigoMayuscula).emit('participante:nuevo', {
            nombre: nombre,
            totalEstudiantes: sala.estudiantes.size
        });
    });

    // Evento: Nueva pregunta del docente
    socket.on('pregunta:nueva', (datos) => {
        const usuario = usuariosConectados.get(socket.id);
        if (!usuario || !usuario.esDocente) {
            socket.emit('error:sin-permisos', 'Solo el docente puede publicar preguntas');
            return;
        }
        
        const sala = salas.get(usuario.sala);
        if (!sala) {
            socket.emit('error:sala-no-existe', 'La sala no existe');
            return;
        }
        
        const { pregunta, respuesta } = datos;
        
        // Actualizar datos de la sala
        sala.pregunta = pregunta;
        sala.respuesta = respuesta.toLowerCase().trim();
        sala.activa = true;
        
        console.log(`Nueva pregunta en sala ${usuario.sala}: ${pregunta}`);
        console.log(`Respuesta correcta: ${sala.respuesta}`);
        
        // Enviar la pregunta a todos en la sala (sin la respuesta)
        io.to(usuario.sala).emit('pregunta:publicada', pregunta);
        
        // Notificar que la ronda ha comenzado
        io.to(usuario.sala).emit('ronda:iniciada');
    });

    // Evento: Respuesta enviada por un estudiante
    socket.on('respuesta:enviada', (respuestaUsuario) => {
        const usuario = usuariosConectados.get(socket.id);
        if (!usuario) {
            socket.emit('error:usuario-no-identificado', 'Usuario no identificado');
            return;
        }
        
        if (usuario.esDocente) {
            socket.emit('error:docente-no-puede-responder', 'El docente no puede responder las preguntas');
            return;
        }
        
        const sala = salas.get(usuario.sala);
        if (!sala) {
            socket.emit('error:sala-no-existe', 'La sala no existe');
            return;
        }
        
        // Verificar si la ronda está activa
        if (!sala.activa) {
            socket.emit('error:ronda-terminada', 'La ronda ya ha terminado');
            return;
        }

        console.log(`${usuario.nombre} en sala ${usuario.sala} envió respuesta: ${respuestaUsuario}`);

        // Comparar respuesta (case insensitive)
        const respuestaNormalizada = respuestaUsuario.toLowerCase().trim();
        
        if (respuestaNormalizada === sala.respuesta) {
            // ¡Respuesta correcta! Terminar la ronda inmediatamente
            sala.activa = false;
            
            console.log(`¡${usuario.nombre} ha ganado la ronda en sala ${usuario.sala}!`);
            
            // Anunciar al ganador a todos en la sala
            io.to(usuario.sala).emit('ronda:terminada', {
                ganador: usuario.nombre,
                respuestaCorrecta: sala.respuesta,
                pregunta: sala.pregunta
            });
        } else {
            // Respuesta incorrecta, notificar solo al usuario
            socket.emit('respuesta:incorrecta', 'Respuesta incorrecta, sigue intentando');
        }
    });

    // Evento: Reiniciar juego (solo para el docente)
    socket.on('juego:reiniciar', () => {
        const usuario = usuariosConectados.get(socket.id);
        if (!usuario || !usuario.esDocente) {
            socket.emit('error:sin-permisos', 'Solo el docente puede reiniciar el juego');
            return;
        }
        
        const sala = salas.get(usuario.sala);
        if (!sala) {
            socket.emit('error:sala-no-existe', 'La sala no existe');
            return;
        }
        
        // Reiniciar estado de la sala
        sala.pregunta = '';
        sala.respuesta = '';
        sala.activa = false;
        
        io.to(usuario.sala).emit('juego:reiniciado');
        console.log(`Juego reiniciado en sala ${usuario.sala} por el docente`);
    });

    // Evento: Obtener información de la sala
    socket.on('sala:info', () => {
        const usuario = usuariosConectados.get(socket.id);
        if (!usuario) return;
        
        const sala = salas.get(usuario.sala);
        if (!sala) return;
        
        socket.emit('sala:info-actualizada', {
            codigo: usuario.sala,
            totalEstudiantes: sala.estudiantes.size,
            esDocente: usuario.esDocente,
            preguntaActiva: sala.activa
        });
    });

    // Evento: Desconexión
    socket.on('disconnect', () => {
        const usuario = usuariosConectados.get(socket.id);
        if (usuario) {
            console.log(`Usuario ${usuario.nombre} desconectado de sala ${usuario.sala}`);
            
            const sala = salas.get(usuario.sala);
            if (sala) {
                if (usuario.esDocente) {
                    // Si el docente se desconecta, cerrar la sala
                    sala.estudiantes.forEach(estudianteId => {
                        io.to(estudianteId).emit('sala:cerrada', 'El docente ha cerrado la sala');
                    });
                    salas.delete(usuario.sala);
                    console.log(`Sala ${usuario.sala} cerrada - docente desconectado`);
                } else {
                    // Remover estudiante de la sala
                    sala.estudiantes.delete(socket.id);
                    
                    // Notificar a todos en la sala sobre la desconexión
                    io.to(usuario.sala).emit('participante:desconectado', {
                        nombre: usuario.nombre,
                        totalEstudiantes: sala.estudiantes.size
                    });
                }
            }
            
            usuariosConectados.delete(socket.id);
        }
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log('💡 Abre tu navegador y navega a la URL para comenzar el quiz');
});
