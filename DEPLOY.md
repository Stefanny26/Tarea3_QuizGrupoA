# 🚀 Guía de Despliegue - Quiz Rápido

## Despliegue Local (Desarrollo)

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar en modo desarrollo (con auto-reload)
npm run dev

# 3. O iniciar en modo producción
npm start
```

## Despliegue en Heroku

```bash
# 1. Crear aplicación en Heroku
heroku create quiz-rapido-app

# 2. Configurar variables de entorno (opcional)
heroku config:set NODE_ENV=production

# 3. Desplegar
git add .
git commit -m "Deploy quiz app"
git push heroku main

# 4. Abrir aplicación
heroku open
```

## Despliegue en Railway

1. Conecta tu repositorio a Railway
2. Configura las variables de entorno:
   - `NODE_ENV=production`
   - `PORT=3000` (Railway lo configurará automáticamente)
3. Railway detectará automáticamente el archivo `package.json` y ejecutará `npm start`

## Despliegue en Vercel

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Desplegar
vercel

# 3. Seguir las instrucciones del CLI
```

## Variables de Entorno

### Opcional para producción:
```env
NODE_ENV=production
PORT=3000
```

## Configuración de Firewall/Puertos

- **Puerto predeterminado**: 3000
- **Protocolo**: HTTP/HTTPS
- **WebSockets**: Debe permitir conexiones WebSocket para Socket.io

## Consideraciones de Producción

### Rendimiento:
- El servidor puede manejar múltiples salas simultáneamente
- Cada sala es independiente y tiene su propio estado
- Socket.io maneja automáticamente las reconexiones

### Seguridad:
- Los códigos de sala son aleatorios de 6 caracteres
- Las salas se limpian automáticamente cuando el docente se desconecta
- No se almacenan datos sensibles en el cliente

### Escalabilidad:
- Para múltiples instancias del servidor, considera usar Redis como adaptador de Socket.io
- Los códigos de sala son únicos por instancia del servidor

## Ejemplo de Configuración con Redis (Opcional)

```javascript
// En server.js, para múltiples instancias
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

## Monitoreo

### Logs importantes:
- Creación y cierre de salas
- Conexiones y desconexiones de usuarios
- Preguntas publicadas y respuestas recibidas

### Métricas recomendadas:
- Número de salas activas
- Número de usuarios conectados por sala
- Tiempo de respuesta de las preguntas

## Solución de Problemas en Producción

### Problema: Los estudiantes no pueden unirse a las salas
- Verificar que el código de sala sea correcto
- Confirmar que el docente esté conectado
- Revisar los logs del servidor para errores

### Problema: Las preguntas no se publican
- Verificar que el usuario tenga permisos de docente
- Confirmar que la sala exista
- Revisar la consola del navegador para errores de JavaScript

### Problema: Reconexiones frecuentes
- Verificar la estabilidad de la conexión a internet
- Considerar aumentar el timeout de Socket.io
- Revisar la configuración del proxy/load balancer

## Backup y Recuperación

Actualmente la aplicación es stateless (sin base de datos), por lo que no requiere backup de datos. Sin embargo, para versiones futuras con persistencia:

- Respaldar la base de datos de salas y usuarios
- Mantener logs de actividad
- Configurar alertas de monitoreo

---

**¡La aplicación está lista para producción!** 🚀
