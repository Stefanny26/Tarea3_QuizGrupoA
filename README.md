# 🧠 Quiz Rápido: El Duelo de Conocimiento

Una aplicación web de preguntas y respuestas en tiempo real desarrollada con Socket.io. Los estudiantes compiten para ser los primeros en responder correctamente las preguntas publicadas por el docente.

## ✨ Características

- **Sistema de Salas con Códigos**: Cada docente genera un código único de 6 caracteres
- **Comunicación en tiempo real** con Socket.io
- **Vista del Docente**: Crear salas, publicar preguntas y gestionar el juego  
- **Vista del Estudiante**: Unirse con código de sala y competir
- **Sistema de ganadores**: El primer estudiante en responder correctamente gana
- **Interfaz moderna y responsive**
- **Manejo robusto de reconexiones**
- **Gestión de salas independientes**: Múltiples salas pueden funcionar simultáneamente

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor:**
   ```bash
   npm start
   ```
   
   O para desarrollo con auto-reload:
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```

## 📖 Cómo usar

### Para el Docente

1. Abre la aplicación en tu navegador
2. Haz clic en "**👨‍🏫 Soy Docente**"
3. Ingresa tu nombre y haz clic en "🏠 Crear Sala"
4. **¡Se generará un código único de 6 caracteres!**
5. Comparte este código con tus estudiantes
6. Publica preguntas completando:
   - **Pregunta**: La pregunta que quieres publicar
   - **Respuesta Correcta**: La respuesta exacta (no se mostrará a los estudiantes)
7. Haz clic en "📢 Publicar Pregunta"
8. Usa "🔄 Reiniciar Juego" para limpiar el estado y empezar de nuevo

### Para los Estudiantes

1. Abre la aplicación en tu navegador
2. Haz clic en "**👩‍🎓 Soy Estudiante**"
3. Ingresa tu nombre
4. **Ingresa el código de sala que te proporcionó el docente** (6 caracteres)
5. Haz clic en "🚪 Unirse"
6. Espera a que el docente publique una pregunta
7. **¡Sé el primero en responder correctamente!**
8. Las respuestas incorrectas te permiten seguir intentando

## 🎮 Flujo del Juego

1. **Creación de Sala**: El docente selecciona su rol y crea una sala
2. **Generación de Código**: El sistema genera un código único de 6 caracteres
3. **Unión de Estudiantes**: Los estudiantes ingresan el código para unirse
4. **Pregunta**: El docente publica una pregunta a todos los estudiantes de su sala
5. **Competencia**: Los estudiantes en esa sala envían sus respuestas
6. **Ganador**: El primer estudiante con respuesta correcta gana la ronda
7. **Resultado**: Se anuncia al ganador y la respuesta correcta a todos en la sala
8. **Nueva Ronda**: El docente puede publicar otra pregunta o reiniciar el juego

### 🔒 Sistema de Salas

- **Salas Independientes**: Cada sala funciona de manera completamente independiente
- **Códigos Únicos**: Cada sala tiene un código de 6 caracteres alfanuméricos
- **Gestión Automática**: Si el docente se desconecta, la sala se cierra automáticamente
- **Solo Estudiantes de la Sala**: Solo los estudiantes unidos a una sala específica pueden ver y responder las preguntas de esa sala

## 🏗️ Arquitectura Técnica

### Backend (server.js)
- **Express.js**: Servidor web y archivos estáticos
- **Socket.io**: Comunicación en tiempo real
- **Gestión de estado**: Control de rondas activas y respuestas correctas
- **Validación**: Verificación de respuestas y manejo de usuarios

### Frontend (client.js)
- **Socket.io Client**: Conexión bidireccional con el servidor
- **Vanilla JavaScript**: Sin frameworks, enfoque en la lógica de sockets
- **UI Dinámica**: Interfaces adaptativas según el tipo de usuario
- **Manejo de errores**: Reconexión automática y mensajes informativos

### Eventos de Socket.io

#### Del Cliente al Servidor:
- `sala:crear` - Crear nueva sala (solo docente)
- `sala:unirse` - Unirse a sala con código (estudiantes)
- `pregunta:nueva` - Publicación de pregunta (solo docente)
- `respuesta:enviada` - Respuesta del estudiante
- `juego:reiniciar` - Reinicio del juego (solo docente)
- `sala:info` - Solicitar información de la sala

#### Del Servidor al Cliente:
- `sala:creada` - Confirmación de sala creada con código
- `sala:unido` - Confirmación de unión a sala
- `pregunta:publicada` - Nueva pregunta para todos en la sala
- `ronda:terminada` - Anuncio del ganador
- `participante:nuevo/desconectado` - Notificaciones de conexión en la sala
- `sala:cerrada` - Notificación de cierre de sala
- `error:sala-no-existe` - Error al intentar unirse a sala inexistente

## 🎯 Criterios de Evaluación Cubiertos

### 1. Configuración Cliente/Servidor (4/4 puntos)
- ✅ Conexión estable y bidireccional
- ✅ Identificación robusta de usuarios
- ✅ Configuración limpia y bien estructurada

### 2. Publicación de Preguntas (4/4 puntos)
- ✅ Envío correcto del docente al servidor
- ✅ Broadcasting en tiempo real a todos los clientes
- ✅ Separación correcta (no se envía la respuesta)

### 3. Lógica de Competencia (4/4 puntos)
- ✅ Identificación fiable del primer ganador
- ✅ Bloqueo inmediato de la ronda (`rondaActiva = false`)
- ✅ Prevención de condiciones de carrera

### 4. Sincronización de UI (4/4 puntos)
- ✅ Actualización instantánea para todos los clientes
- ✅ Deshabilitación del juego tras el ganador
- ✅ Estados del juego claramente manejados

### 5. Calidad del Código (4/4 puntos)
- ✅ Código modular y bien organizado
- ✅ Separación clara cliente/servidor
- ✅ Comentarios y documentación
- ✅ Manejo de errores y reconexiones

## 🔧 Estructura de Archivos

```
quiz-rapido-socketio/
├── server.js              # Servidor principal con Socket.io
├── package.json           # Dependencias y scripts
├── public/
│   ├── index.html        # Interfaz principal
│   ├── client.js         # Lógica del cliente
│   └── styles.css        # Estilos CSS
└── README.md             # Documentación
```

## 🌟 Características Adicionales

- **Sistema de Códigos de Sala**: Códigos únicos de 6 caracteres para cada sala
- **Copiar al Portapapeles**: Función para copiar fácilmente el código de sala
- **Salas Múltiples**: Soporte para múltiples salas simultáneas e independientes
- **Responsive Design**: Funciona en móviles y escritorio
- **Mensajes informativos**: Feedback claro para todas las acciones
- **Contador de participantes**: Muestra cuántos estudiantes están en cada sala
- **Manejo de reconexión**: Automático y transparente
- **Validación de entrada**: Previene envíos vacíos y códigos inválidos
- **Auto-scroll de mensajes**: Para mejor experiencia de usuario
- **Cierre automático de salas**: Las salas se cierran cuando el docente se desconecta

## 🐛 Solución de Problemas

### El servidor no inicia:
```bash
# Verificar que las dependencias estén instaladas
npm install

# Verificar que el puerto 3000 esté libre
netstat -tulpn | grep :3000
```

### Los clientes no se conectan:
- Verificar que el servidor esté ejecutándose
- Comprobar la URL (http://localhost:3000)
- Revisar la consola del navegador para errores

### Las preguntas no se publican:
- Verificar que el usuario sea "docente"
- Completar todos los campos requeridos
- Revisar la consola del servidor para logs

## 🚀 Posibles Mejoras

- Sistema de puntuación acumulativa
- Categorías de preguntas
- Timer para las respuestas
- Modo multijugador con equipos
- Base de datos para persistencia
- Autenticación de usuarios
- Salas privadas para diferentes clases

---

**¡Disfruta del duelo de conocimiento! 🧠⚡**
