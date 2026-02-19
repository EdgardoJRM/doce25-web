#!/bin/bash

echo "🚀 Configurando Doce25 - Fundación Web"
echo "========================================"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 20.x o superior."
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Verificar AWS CLI
if ! command -v aws &> /dev/null; then
    echo "⚠️  AWS CLI no está instalado. Necesitarás instalarlo para desplegar."
else
    echo "✅ AWS CLI encontrado: $(aws --version)"
fi

# Instalar dependencias
echo ""
echo "📦 Instalando dependencias del proyecto..."
npm install

# Crear archivo .env.local si no existe
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creando archivo .env.local..."
    cp .env.example .env.local
    echo "⚠️  Por favor edita .env.local con tus credenciales de AWS"
else
    echo "✅ Archivo .env.local ya existe"
fi

echo ""
echo "✅ Configuración inicial completada!"
echo ""
echo "Próximos pasos:"
echo "1. Edita .env.local con tus credenciales de AWS"
echo "2. Ejecuta 'npm run dev' para probar localmente"
echo "3. Sigue las instrucciones en DEPLOYMENT.md para desplegar en AWS"
echo ""


