#!/bin/bash

# 🌐 Script de Despliegue para Netlify - Quiz Rápido

echo "🌐 Preparando despliegue para Netlify..."
echo "========================================="

# Verificar si está instalado Netlify CLI
if ! command -v netlify &> /dev/null; then
    echo "📦 Instalando Netlify CLI..."
    npm install -g netlify-cli
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Crear build para Netlify
echo "🔨 Preparando build..."
npm run build

# Login en Netlify (si no está logueado)
echo "🔐 Verificando login en Netlify..."
if ! netlify status &> /dev/null; then
    echo "Por favor, haz login en Netlify:"
    netlify login
fi

echo ""
echo "⚠️  ADVERTENCIA IMPORTANTE:"
echo "Netlify tiene limitaciones con Socket.io en tiempo real."
echo "Para funcionalidad completa, considera usar Railway en su lugar."
echo ""

read -p "¿Deseas continuar con Netlify? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Desplegando en Netlify..."
    
    # Opción 1: Despliegue desde directorio public
    echo "📁 Desplegando contenido estático..."
    netlify deploy --prod --dir=public
    
    echo ""
    echo "✅ ¡Despliegue completado en Netlify!"
    echo ""
    echo "📋 Información importante:"
    echo "• La funcionalidad de Socket.io puede estar limitada"
    echo "• Para funcionalidad completa, usa Railway o Heroku"
    echo "• La aplicación funcionará como demo básico"
    echo ""
    echo "🌟 RECOMENDACIÓN:"
    echo "Para obtener la máxima puntuación en tu tarea, usa Railway:"
    echo "1. Ve a railway.app"
    echo "2. Conecta GitHub"
    echo "3. Selecciona tu repositorio"
    echo "4. ¡Despliega automáticamente con funcionalidad completa!"
    
else
    echo "❌ Despliegue cancelado."
    echo ""
    echo "🚀 Te recomendamos usar Railway para mejores resultados:"
    echo "• Soporte completo de WebSockets"
    echo "• Configuración automática"
    echo "• Sin limitaciones de tiempo"
    echo "• Perfecto para Socket.io"
    echo ""
    echo "Comando rápido:"
    echo "1. Ve a https://railway.app"
    echo "2. Conecta GitHub → Tarea3_QuizGrupoA"
    echo "3. ¡Listo! 🎉"
fi
