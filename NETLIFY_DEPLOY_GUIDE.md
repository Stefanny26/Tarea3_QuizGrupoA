# 🚀 Guía de Despliegue en Netlify

## Configuración Recomendada para Netlify

### Configuración del Proyecto en Netlify

```
Team: ESPE
Project name: Tarea3_QuizGrupoA
Branch to deploy: main
Base directory: .
Build command: npm run build
Publish directory: public
Functions directory: netlify/functions
```

## ⚙️ Pasos para Desplegar

### 1. Preparar el Repositorio

```bash
# Asegúrate de que todos los cambios estén commiteados
git add .
git commit -m "feat: implementar arquitectura limpia y configuración Netlify"
git push origin main
```

### 2. Configurar en Netlify

1. **Conectar Repositorio**
   - Ir a [Netlify](https://app.netlify.com)
   - Hacer clic en "New site from Git"
   - Seleccionar GitHub
   - Elegir el repositorio `Tarea3_QuizGrupoA`

2. **Configuración de Build**
   ```
   Branch to deploy: main
   Base directory: (leave empty)
   Build command: npm run build
   Publish directory: public
   ```

3. **Variables de Entorno** (opcional)
   ```
   NODE_ENV=production
   ```

### 3. Configuración Automática

El proyecto incluye:
- ✅ `netlify.toml` - Configuración automática
- ✅ `package.json` - Scripts de build configurados
- ✅ Netlify Functions preparadas
- ✅ Redirects configurados

## 📁 Estructura para Netlify

```
Tarea3_QuizGrupoA/
├── netlify.toml          # Configuración de Netlify
├── netlify/
│   └── functions/
│       └── server.js     # API Functions
├── public/               # Archivos estáticos (Deploy)
│   ├── index.html
│   ├── styles.css
│   └── client.js
├── src/                  # Código fuente organizado
├── app.js               # Servidor principal
└── package.json         # Dependencias y scripts
```

## 🔧 Scripts Disponibles

```bash
npm run build    # Preparar para producción
npm start        # Servidor local
npm run dev      # Desarrollo con nodemon
```

## ⚠️ Limitaciones de Netlify

**Importante**: Netlify Functions no soporta WebSockets nativamente. Para funcionalidad completa de Socket.io, considera:

### Alternativas Recomendadas:

1. **Railway** (Mejor para WebSockets)
   - Soporte completo para Socket.io
   - Configuración incluida: `railway.toml`

2. **Render**
   - Soporte WebSockets
   - Plan gratuito disponible

3. **Vercel** (Con limitaciones)
   - Configuración incluida: `vercel.json`

## 🌐 Para Despliegue Completo con WebSockets

### Opción 1: Railway (Recomendado)

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login y desplegar
railway login
railway init
railway up
```

### Opción 2: Render

1. Conectar repositorio en [Render](https://render.com)
2. Configurar como Web Service
3. Build command: `npm install`
4. Start command: `npm start`

## 📊 Monitoreo Post-Despliegue

### Endpoints de Salud

- `GET /health` - Estado del servidor
- `GET /api/info` - Información de la aplicación

### Logs y Debugging

```bash
# Ver logs en Railway
railway logs

# Ver logs en Netlify
# (Disponible en el dashboard)
```

## 🚀 Deploy Rápido

Para desplegar rápidamente:

```bash
# 1. Commit cambios
git add .
git commit -m "deploy: preparar para producción"
git push origin main

# 2. En Netlify, el deploy será automático
# 3. Verificar en: https://your-app-name.netlify.app
```

## 🛠️ Troubleshooting

### Problema: Build falla
```bash
# Verificar dependencias localmente
npm install
npm run build
```

### Problema: Funciones no responden
- Verificar `netlify/functions/server.js`
- Revisar logs en Netlify dashboard

### Problema: WebSockets no funcionan
- Netlify no soporta WebSockets
- Usar Railway o Render para funcionalidad completa

## 📞 Soporte

Si tienes problemas:
1. Revisar logs en Netlify dashboard
2. Verificar configuración en `netlify.toml`
3. Probar build local con `npm run build`

---

✨ **¡Tu aplicación Quiz está lista para el mundo!** ✨
