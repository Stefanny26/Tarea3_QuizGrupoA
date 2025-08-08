# 🚀 Guía Completa de Despliegue - Quiz Rápido

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Git configurado
- Cuenta en la plataforma de despliegue elegida

---

## 🌐 HEROKU (Recomendado para principiantes)

### Paso 1: Preparar el proyecto
```bash
# Asegurar que package.json tenga el script start
npm install

# Probar localmente
npm start
```

### Paso 2: Instalar Heroku CLI
```bash
# En Ubuntu/Linux
sudo snap install heroku --classic

# En macOS
brew tap heroku/brew && brew install heroku

# En Windows
# Descargar desde https://devcenter.heroku.com/articles/heroku-cli
```

### Paso 3: Desplegar
```bash
# Login en Heroku
heroku login

# Crear aplicación (cambiar nombre único)
heroku create tu-quiz-app-unico

# Configurar variables (opcional)
heroku config:set NODE_ENV=production

# Desplegar
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Abrir aplicación
heroku open
```

### Comandos útiles de Heroku:
```bash
# Ver logs
heroku logs --tail

# Reiniciar aplicación
heroku restart

# Ver información de la aplicación
heroku info
```

---

## ⚡ RAILWAY (Más moderno y rápido)

### Paso 1: Preparar repositorio
```bash
# Subir código a GitHub (ya hecho)
git push origin main
```

### Paso 2: Desplegar
1. Ve a [railway.app](https://railway.app)
2. Conecta con GitHub
3. Selecciona el repositorio `Tarea3_QuizGrupoA`
4. Railway detectará automáticamente Node.js
5. **¡Listo!** La aplicación se desplegará automáticamente

### Variables de entorno en Railway:
- `NODE_ENV=production`
- `PORT` (se configura automáticamente)

---

## 🔺 VERCEL (Especializado en frontend)

**⚠️ NOTA**: Vercel está más optimizado para aplicaciones frontend. Para Socket.io es mejor usar Heroku o Railway.

### Si quieres intentar con Vercel:
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Desplegar
vercel

# Seguir las instrucciones interactivas
```

---

## 🐳 RENDER (Alternativa moderna)

### Paso 1: Preparar Dockerfile (ya incluido)
El proyecto ya incluye `Dockerfile` para Render.

### Paso 2: Desplegar
1. Ve a [render.com](https://render.com)
2. Conecta con GitHub
3. Selecciona el repositorio
4. Configura:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `NODE_ENV=production`

---

## 🔧 CONFIGURACIÓN DE VARIABLES DE ENTORNO

### Variables recomendadas:
```bash
NODE_ENV=production
PORT=3000  # Se configura automáticamente en la mayoría de plataformas
```

### Configurar en cada plataforma:

**Heroku:**
```bash
heroku config:set NODE_ENV=production
```

**Railway:**
- Panel web → Variables → Agregar `NODE_ENV=production`

**Render:**
- Panel web → Environment → Agregar variables

---

## 🛠️ SOLUCIÓN DE PROBLEMAS COMUNES

### Problema: "Application Error" en Heroku
```bash
# Ver logs detallados
heroku logs --tail

# Verificar que package.json tenga:
"scripts": {
  "start": "node server.js"
}
```

### Problema: WebSockets no funcionan
- Verificar que la plataforma soporte WebSockets
- Heroku y Railway: ✅ Soportan
- Vercel: ⚠️ Limitado para WebSockets
- Render: ✅ Soporte completo

### Problema: Puerto incorrecto
```javascript
// En server.js (ya configurado correctamente):
const PORT = process.env.PORT || 3000;
```

---

## 🌟 RECOMENDACIONES POR CASO DE USO

### 📚 Para Tarea Académica:
**RAILWAY** - Más moderno, fácil configuración

### 🎓 Para Portafolio:
**HEROKU** - Más conocido por empleadores

### 🚀 Para Producción Real:
**RENDER** - Mejor rendimiento, más características

---

## 📝 CHECKLIST DE DESPLIEGUE

- [ ] ✅ Código funcionando localmente
- [ ] ✅ Repositorio en GitHub actualizado
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Plataforma de despliegue elegida
- [ ] ✅ Aplicación desplegada y probada
- [ ] ✅ URL compartida con el profesor

---

## 🎯 PRUEBA FINAL

Después del despliegue, prueba:

1. **Como Docente:**
   - Crear sala
   - Obtener código
   - Publicar pregunta

2. **Como Estudiante:**
   - Unirse con código
   - Responder pregunta
   - Ver resultado

3. **Funcionalidades:**
   - ✅ Tiempo real funcionando
   - ✅ Múltiples usuarios
   - ✅ Reconexión automática

---

## 📞 SOPORTE

Si tienes problemas:

1. **Revisa los logs** de la plataforma
2. **Verifica la consola** del navegador
3. **Comprueba la conexión** WebSocket
4. **Consulta la documentación** de la plataforma

---

**¡Tu aplicación estará lista para impresionar al profesor! 🎉**
