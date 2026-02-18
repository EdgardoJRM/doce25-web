#!/bin/bash

###############################################################################
# Script para subir libros a S3
# Uso: ./subir-libros.sh [carpeta-con-libros]
###############################################################################

set -e  # Salir si hay algún error

BUCKET="biblioteca-pdfs-edgardohernandez"
PREFIX="biblioteca"
REGION="us-east-1"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   📚 SUBIR LIBROS A LA BIBLIOTECA DIGITAL${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Verificar que AWS CLI está instalado
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ Error: AWS CLI no está instalado${NC}"
    echo "Instala AWS CLI: https://aws.amazon.com/cli/"
    exit 1
fi

# Verificar credenciales de AWS
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ Error: No hay credenciales de AWS configuradas${NC}"
    echo "Ejecuta: aws configure"
    exit 1
fi

echo -e "${GREEN}✅ AWS CLI configurado correctamente${NC}"

# Verificar que el bucket existe
if ! aws s3 ls "s3://$BUCKET" &> /dev/null; then
    echo -e "${RED}❌ Error: El bucket $BUCKET no existe${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Bucket $BUCKET encontrado${NC}"
echo ""

# Directorio de libros
if [ -z "$1" ]; then
    echo -e "${YELLOW}⚠️  No se especificó carpeta de libros${NC}"
    echo "Uso: $0 <carpeta-con-libros>"
    echo ""
    echo "Ejemplo:"
    echo "  $0 ~/mis-libros"
    echo ""
    echo "Estructura esperada:"
    echo "  ~/mis-libros/"
    echo "  ├── libro-1/"
    echo "  │   ├── page1.jpg"
    echo "  │   ├── page2.jpg"
    echo "  │   └── ..."
    echo "  └── libro-2/"
    echo "      ├── page1.jpg"
    echo "      └── ..."
    exit 1
fi

LIBROS_DIR="$1"

if [ ! -d "$LIBROS_DIR" ]; then
    echo -e "${RED}❌ Error: El directorio $LIBROS_DIR no existe${NC}"
    exit 1
fi

echo -e "${BLUE}📂 Buscando libros en: $LIBROS_DIR${NC}"
echo ""

# Contador
total_libros=0
total_archivos=0

# Iterar sobre cada carpeta (cada carpeta es un libro)
for libro_dir in "$LIBROS_DIR"/*/ ; do
    if [ -d "$libro_dir" ]; then
        libro_name=$(basename "$libro_dir")
        
        # Contar archivos en el libro
        num_archivos=$(find "$libro_dir" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | wc -l | tr -d ' ')
        
        if [ "$num_archivos" -eq 0 ]; then
            echo -e "${YELLOW}⚠️  Saltando '$libro_name' (no tiene imágenes)${NC}"
            continue
        fi
        
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}📖 Subiendo: $libro_name${NC}"
        echo -e "   Archivos: $num_archivos"
        echo ""
        
        # Subir el libro completo
        aws s3 sync "$libro_dir" "s3://$BUCKET/$PREFIX/$libro_name/" \
            --region "$REGION" \
            --exclude "*" \
            --include "*.jpg" \
            --include "*.jpeg" \
            --include "*.png" \
            --no-progress
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ '$libro_name' subido correctamente${NC}"
            total_libros=$((total_libros + 1))
            total_archivos=$((total_archivos + num_archivos))
        else
            echo -e "${RED}❌ Error subiendo '$libro_name'${NC}"
        fi
        echo ""
    fi
done

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 ¡Proceso completado!${NC}"
echo ""
echo "📊 Resumen:"
echo "   • Libros subidos: $total_libros"
echo "   • Archivos totales: $total_archivos"
echo ""
echo -e "${BLUE}🔗 Ver archivos en S3:${NC}"
echo "   https://s3.console.aws.amazon.com/s3/buckets/$BUCKET?prefix=$PREFIX/"
echo ""
echo -e "${BLUE}🧪 Probar un libro:${NC}"
echo "   curl \"https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url?libro=NOMBRE-LIBRO&pagina=1\""
echo ""
echo -e "${GREEN}✅ Biblioteca digital actualizada${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

