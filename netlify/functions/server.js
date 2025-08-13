const serverless = require('serverless-http');
const express = require('express');
const path = require('path');

// Para Netlify, creamos una versión simplificada sin Socket.io
// ya que Netlify Functions no soporta WebSockets directamente
const app = express();

// Configurar archivos estáticos
app.use(express.static(path.join(__dirname, '../../public')));

// API de información
app.get('/api/info', (req, res) => {
    res.json({
        name: 'Quiz Rápido: El Duelo de Conocimiento',
        version: '2.0.0',
        description: 'Aplicación de quiz en tiempo real',
        author: 'Grupo A - Tarea 3',
        platform: 'Netlify Functions',
        note: 'Para funcionalidad completa con WebSockets, usar despliegue en plataforma compatible'
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date(),
        platform: 'Netlify Functions'
    });
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Manejo de otras rutas
app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports.handler = serverless(app);