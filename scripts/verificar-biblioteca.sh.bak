#!/bin/bash

###############################################################################
# Script para verificar el estado de la Biblioteca Digital
###############################################################################

set -e

BUCKET="biblioteca-pdfs-edgardohernandez"
API_ID="dfafuyp2b5"
API_ENDPOINT="https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url"
LAMBDA_NAME="GenerarURLFirmada"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   🔍 VERIFICACIÓN DE BIBLIOTECA DIGITAL${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Función para verificar checks
check_ok() {
  echo -e "${GREEN}✅ $1${NC}"
}

check_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

check_error() {
  echo -e "${RED}❌ $1${NC}"
}

# 1. Verificar AWS CLI
echo -e "${BLUE}1. Verificando AWS CLI...${NC}"
if command -v aws &> /dev/null; then
  check_ok "AWS CLI instalado"
else
  check_error "AWS CLI no instalado"
  exit 1
fi

# 2. Verificar credenciales
echo -e "${BLUE}2. Verificando credenciales AWS...${NC}"
if aws sts get-caller-identity &> /dev/null; then
  check_ok "Credenciales AWS configuradas"
  ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
  echo "   Account ID: $ACCOUNT_ID"
else
  check_error "Credenciales AWS no configuradas"
  exit 1
fi

# 3. Verificar Bucket S3
echo -e "${BLUE}3. Verificando Bucket S3...${NC}"
if aws s3 ls "s3://$BUCKET" &> /dev/null; then
  check_ok "Bucket '$BUCKET' existe"
  
  # Contar objetos
  NUM_OBJECTS=$(aws s3 ls "s3://$BUCKET/biblioteca/" --recursive 2>/dev/null | wc -l | tr -d ' ')
  if [ "$NUM_OBJECTS" -gt 0 ]; then
    check_ok "$NUM_OBJECTS archivos en el bucket"
    
    # Listar libros
    echo ""
    echo -e "${BLUE}   📚 Libros disponibles:${NC}"
    aws s3 ls "s3://$BUCKET/biblioteca/" --recursive | awk '{print $4}' | cut -d'/' -f2 | sort -u | while read libro; do
      if [ ! -z "$libro" ]; then
        NUM_PAGES=$(aws s3 ls "s3://$BUCKET/biblioteca/$libro/" | wc -l | tr -d ' ')
        echo "      • $libro ($NUM_PAGES páginas)"
      fi
    done
  else
    check_warning "Bucket vacío - No hay libros subidos"
  fi
else
  check_error "Bucket '$BUCKET' no existe"
fi

# 4. Verificar Lambda
echo ""
echo -e "${BLUE}4. Verificando Lambda Function...${NC}"
if aws lambda get-function --function-name "$LAMBDA_NAME" &> /dev/null; then
  check_ok "Lambda '$LAMBDA_NAME' existe"
  
  LAMBDA_STATUS=$(aws lambda get-function --function-name "$LAMBDA_NAME" --query 'Configuration.State' --output text)
  if [ "$LAMBDA_STATUS" == "Active" ]; then
    check_ok "Lambda está activa"
  else
    check_warning "Lambda estado: $LAMBDA_STATUS"
  fi
else
  check_error "Lambda '$LAMBDA_NAME' no existe"
fi

# 5. Verificar API Gateway
echo ""
echo -e "${BLUE}5. Verificando API Gateway...${NC}"
if aws apigateway get-rest-api --rest-api-id "$API_ID" &> /dev/null; then
  check_ok "API Gateway existe (ID: $API_ID)"
  
  API_NAME=$(aws apigateway get-rest-api --rest-api-id "$API_ID" --query 'name' --output text)
  echo "   Nombre: $API_NAME"
  
  # Verificar deployment
  DEPLOYMENT_COUNT=$(aws apigateway get-deployments --rest-api-id "$API_ID" --query 'items | length(@)' --output text)
  if [ "$DEPLOYMENT_COUNT" -gt 0 ]; then
    check_ok "API desplegada ($DEPLOYMENT_COUNT deployments)"
  else
    check_warning "API no tiene deployments"
  fi
else
  check_error "API Gateway no existe (ID: $API_ID)"
fi

# 6. Probar endpoint
echo ""
echo -e "${BLUE}6. Probando endpoint del API...${NC}"
TEST_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_ENDPOINT?libro=test&pagina=1")
HTTP_CODE=$(echo "$TEST_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "200" ]; then
  check_ok "Endpoint responde correctamente (HTTP 200)"
  
  # Verificar que la respuesta contiene una URL
  if echo "$TEST_RESPONSE" | grep -q "url"; then
    check_ok "Respuesta contiene URL firmada"
  else
    check_warning "Respuesta no contiene URL firmada"
  fi
else
  check_error "Endpoint no responde correctamente (HTTP $HTTP_CODE)"
fi

# 7. Verificar permisos del bucket
echo ""
echo -e "${BLUE}7. Verificando permisos del bucket...${NC}"
if aws s3api get-bucket-policy --bucket "$BUCKET" &> /dev/null; then
  check_ok "Bucket tiene política de acceso público"
else
  check_warning "Bucket no tiene política de acceso público configurada"
fi

# 8. Verificar CORS
echo ""
echo -e "${BLUE}8. Verificando CORS del bucket...${NC}"
if aws s3api get-bucket-cors --bucket "$BUCKET" &> /dev/null; then
  check_ok "CORS configurado en el bucket"
else
  check_warning "CORS no configurado en el bucket"
fi

# RESUMEN FINAL
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📊 RESUMEN${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "🔗 Endpoint del API:"
echo "   $API_ENDPOINT"
echo ""
echo "📦 Bucket S3:"
echo "   s3://$BUCKET/biblioteca/"
echo ""
echo "🧪 Probar manualmente:"
echo "   curl \"$API_ENDPOINT?libro=NOMBRE-LIBRO&pagina=1\""
echo ""
echo "🌐 Ver en AWS Console:"
echo "   S3: https://s3.console.aws.amazon.com/s3/buckets/$BUCKET"
echo "   API: https://console.aws.amazon.com/apigateway/home?region=us-east-1#/apis/$API_ID"
echo "   Lambda: https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/$LAMBDA_NAME"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Status final
echo ""
if [ "$NUM_OBJECTS" -gt 0 ] && [ "$HTTP_CODE" == "200" ]; then
  echo -e "${GREEN}✅ Todo está funcionando correctamente${NC}"
  exit 0
elif [ "$NUM_OBJECTS" -eq 0 ]; then
  echo -e "${YELLOW}⚠️  Sistema configurado pero no hay libros subidos${NC}"
  echo "   Ejecuta: ./scripts/subir-libros.sh <carpeta-con-libros>"
  exit 0
else
  echo -e "${YELLOW}⚠️  Algunos componentes necesitan atención${NC}"
  exit 1
fi

