#!/bin/bash

# 🚀 Script de Despliegue Automatizado - Quiz Rápido
# Ejecutar con: bash deploy.sh [plataforma]

echo "🧠 Quiz Rápido - Script de Despliegue"
echo "====================================="

# Verificar que Git esté configurado
if ! git config user.name > /dev/null; then
    echo "❌ Git no está configurado. Configurando..."
    read -p "Ingresa tu nombre: " git_name
    read -p "Ingresa tu email: " git_email
    git config --global user.name "$git_name"
    git config --global user.email "$git_email"
fi

# Verificar que estemos en un repositorio Git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ No estás en un repositorio Git. Inicializando..."
    git init
    git remote add origin https://github.com/Stefanny26/Tarea3_QuizGrupoA.git
fi

# Verificar que las dependencias estén instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Probar la aplicación localmente
echo "🧪 Probando aplicación localmente..."
npm start &
SERVER_PID=$!
sleep 3

if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Servidor funcionando correctamente"
    kill $SERVER_PID
else
    echo "❌ Error al iniciar el servidor. Revisa el código."
    exit 1
fi

# Preparar archivos para commit
echo "📝 Preparando archivos para commit..."
git add .

# Verificar si hay cambios
if git diff --staged --quiet; then
    echo "ℹ️ No hay cambios para hacer commit"
else
    echo "💾 Haciendo commit de cambios..."
    git commit -m "🚀 Deploy: Quiz Rápido con sistema de salas - $(date '+%Y-%m-%d %H:%M')"
fi

# Subir a GitHub
echo "⬆️ Subiendo código a GitHub..."
git push origin main

echo ""
echo "✅ ¡Código subido exitosamente a GitHub!"
echo ""

# Opciones de despliegue
echo "🌐 Opciones de Despliegue Disponibles:"
echo ""
echo "1️⃣  RAILWAY (Recomendado - Más fácil)"
echo "   • Ve a: https://railway.app"
echo "   • Conecta GitHub → Selecciona el repositorio"
echo "   • ¡Despliega automáticamente!"
echo ""
echo "2️⃣  HEROKU (Tradicional)"
echo "   • Instala Heroku CLI"
echo "   • heroku create tu-app-nombre"
echo "   • git push heroku main"
echo ""
echo "3️⃣  RENDER (Moderno)"
echo "   • Ve a: https://render.com"
echo "   • Conecta GitHub → Selecciona el repositorio"
echo "   • Configura: npm install | npm start"
echo ""

# Mostrar información útil
echo "📋 Información del Proyecto:"
echo "• Repositorio: https://github.com/Stefanny26/Tarea3_QuizGrupoA"
echo "• Puerto local: 3000"
echo "• Tecnologías: Node.js + Socket.io + Express"
echo ""
echo "📚 Archivos de ayuda incluidos:"
echo "• DEPLOYMENT_GUIDE.md - Guía completa de despliegue"
echo "• DEPLOY.md - Documentación técnica"
echo "• vercel.json, Dockerfile - Configuraciones listas"
echo ""
echo "🎉 ¡Listo para desplegar! Elige tu plataforma favorita."
