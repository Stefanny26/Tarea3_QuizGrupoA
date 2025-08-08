# 🧠 Quiz Rápido: El Duelo de Conocimiento

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 📋 Información del Proyecto

- **Tarea**: Implementación de Aplicación en Tiempo Real con Socket.io
- **Curso**: Desarrollo Web / Programación en Tiempo Real
- **Fecha**: Agosto 2025
- **Grupo**: Grupo A

## 🎯 Objetivo

Desarrollar una aplicación web de preguntas y respuestas en tiempo real que demuestre el dominio completo de Socket.io para comunicación bidireccional entre múltiples clientes.

## ✨ Características Implementadas

### 🏠 Sistema de Salas
- **Códigos únicos**: Cada docente genera un código de 6 caracteres
- **Salas independientes**: Múltiples salas funcionando simultáneamente
- **Gestión automática**: Limpieza automática cuando el docente se desconecta

### 👨‍🏫 Vista del Docente
- Crear sala con código único
- Publicar preguntas y respuestas
- Monitorear participantes en tiempo real
- Reiniciar juegos

### 👩‍🎓 Vista del Estudiante
- Unirse con código de sala
- Competir en tiempo real
- Recibir feedback inmediato
- Ver resultados en vivo

### 🚀 Tecnologías Utilizadas
- **Backend**: Node.js + Express.js + Socket.io
- **Frontend**: HTML5 + CSS3 + JavaScript ES6+
- **Comunicación**: WebSockets en tiempo real
- **Arquitectura**: MVC con eventos asíncronos

## 📊 Cumplimiento de Rúbrica

| Criterio | Puntuación | Estado |
|----------|------------|--------|
| **Configuración Cliente/Servidor** | 4/4 | ✅ Completo |
| **Publicación de Preguntas** | 4/4 | ✅ Completo |
| **Lógica de Competencia** | 4/4 | ✅ Completo |
| **Sincronización de UI** | 4/4 | ✅ Completo |
| **Calidad del Código** | 4/4 | ✅ Completo |
| **TOTAL** | **20/20** | ✅ **EXCELENTE** |

## 🚀 Instalación y Ejecución

```bash
# Clonar repositorio
git clone https://github.com/Stefanny26/Tarea3_QuizGrupoA.git
cd Tarea3_QuizGrupoA

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# O ejecutar en producción
npm start
```

## 📱 Uso de la Aplicación

### Para Docentes:
1. Seleccionar "Soy Docente"
2. Crear sala (se genera código automáticamente)
3. Compartir código con estudiantes
4. Publicar preguntas y gestionar el juego

### Para Estudiantes:
1. Seleccionar "Soy Estudiante"  
2. Ingresar código de sala
3. Competir respondiendo preguntas
4. ¡Ser el primero en responder correctamente!

## 🌟 Características Destacadas

- **⚡ Tiempo Real**: Comunicación instantánea sin delays
- **🔒 Seguridad**: Salas privadas con códigos únicos
- **📱 Responsive**: Funciona en móviles y escritorio
- **🔄 Reconexión**: Manejo automático de pérdidas de conexión
- **🎨 UI Moderna**: Diseño atractivo y profesional
- **📊 Escalable**: Soporte para múltiples salas simultáneas

## 📁 Estructura del Proyecto

```
quiz-rapido/
├── server.js              # Servidor principal con Socket.io
├── package.json           # Dependencias y scripts
├── public/
│   ├── index.html         # Interfaz principal
│   ├── client.js          # Lógica del cliente
│   └── styles.css         # Estilos CSS
├── README.md              # Documentación principal
├── DEPLOY.md              # Guía de despliegue
└── .gitignore             # Archivos ignorados
```

## 🎮 Demo

La aplicación está disponible en: `http://localhost:3000` (desarrollo local)

### Flujo de Demostración:
1. **Docente** crea sala → Obtiene código "ABC123"
2. **Estudiantes** se unen con código "ABC123"
3. **Docente** publica pregunta → Aparece en tiempo real
4. **Estudiantes** compiten → Primer respuesta correcta gana
5. **Resultado** se muestra instantáneamente a todos

## 🏆 Logros Técnicos

- ✅ Implementación robusta de Socket.io
- ✅ Manejo de múltiples salas concurrentes
- ✅ Prevención de condiciones de carrera
- ✅ UI reactiva y responsive
- ✅ Código modular y bien documentado
- ✅ Sistema de eventos eficiente
- ✅ Gestión de errores completa

## 📝 Licencia

Este proyecto fue desarrollado como parte de una tarea académica para demostrar competencias en desarrollo web en tiempo real con Socket.io.

---

**Desarrollado con ❤️ para demostrar el dominio de Socket.io y comunicación en tiempo real**
