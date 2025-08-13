# ⚡ Comandos Rápidos de Despliegue

## 🔧 Preparación Inicial (hacer una sola vez)
```bash
npm install
npm start  # Probar localmente
```

## 🌐 RAILWAY (MÁS FÁCIL - Sin comandos)
1. Ve a https://railway.app
2. Conecta con GitHub
3. Selecciona: `Tarea3_QuizGrupoA`
4. ¡Automático! 🎉

## 🟣 HEROKU (Comandos)
```bash
# Instalar CLI (una vez)
sudo snap install heroku --classic  # Linux
brew install heroku/brew/heroku      # Mac

# Desplegar
heroku login
heroku create tu-quiz-unico-nombre
git push heroku main
heroku open
```

## 🟢 RENDER (Sin comandos)
1. Ve a https://render.com
2. Conecta GitHub → `Tarea3_QuizGrupoA`
3. Build: `npm install`
4. Start: `npm start`
5. ¡Listo! 🚀

## ⚡ SCRIPT AUTOMÁTICO
```bash
# Ejecutar script incluido
bash deploy.sh
```

## 🔍 Verificar Despliegue
- ✅ Abrir la URL generada
- ✅ Probar crear sala como docente
- ✅ Probar unirse como estudiante  
- ✅ Publicar pregunta y responder

## 📋 URLs del Proyecto
- **GitHub**: https://github.com/Stefanny26/Tarea3_QuizGrupoA
- **Local**: http://localhost:3000

---
**¡Elige la plataforma más fácil para ti! Railway es la más simple.** 🎯
