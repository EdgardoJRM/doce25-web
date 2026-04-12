# Inicio Rápido - Dosce25

## ✅ Estado del Proyecto

El proyecto está configurado y listo para desarrollo. El build se completó exitosamente.

## 🚀 Comandos Disponibles

### Desarrollo Local

```bash
# Iniciar servidor de desarrollo
npm run dev

# El sitio estará disponible en http://localhost:3000
```

### Build y Producción

```bash
# Crear build de producción
npm run build

# Iniciar servidor de producción (después del build)
npm start
```

### Linting

```bash
# Verificar código
npm run lint
```

## 📁 Estructura del Proyecto

```
Doce25 - Web/
├── app/                    # Páginas Next.js (App Router)
│   ├── page.tsx           # Homepage
│   ├── eventos/           # Páginas de eventos
│   ├── admin/             # Panel de administración
│   └── checkin/           # Verificación de QR codes
├── components/            # Componentes React reutilizables
├── lib/                   # Utilidades y configuración
├── lambda/                # Funciones Lambda (no se incluyen en build)
└── public/                # Archivos estáticos
```

## 🔧 Configuración

### Variables de Entorno

El archivo `.env.local` ya está creado. Necesitas completarlo con tus credenciales de AWS después del despliegue:

```env
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=tu-user-pool-id
NEXT_PUBLIC_COGNITO_CLIENT_ID=tu-client-id
NEXT_PUBLIC_API_ENDPOINT=https://tu-api.execute-api.us-east-1.amazonaws.com/prod
```

### Para Desarrollo Local (sin AWS)

Puedes probar el frontend localmente sin configurar AWS. Las llamadas a la API fallarán, pero podrás ver la interfaz.

## 📝 Próximos Pasos

1. **Probar localmente:**
   ```bash
   npm run dev
   ```
   Abre http://localhost:3000

2. **Desplegar Backend (Lambda + DynamoDB + S3):**
   - Sigue las instrucciones en `docs/ops/DEPLOYMENT.md`
   - Usa `sam build && sam deploy --guided`

3. **Configurar Cognito:**
   - Crea un User Pool en AWS Cognito
   - Crea un usuario admin
   - Actualiza las variables de entorno

4. **Desplegar Frontend:**
   - Conecta tu repo a AWS Amplify
   - O usa `amplify publish`

## 🐛 Troubleshooting

### Error: "Module not found"
- Ejecuta `npm install` nuevamente

### Error: "Port 3000 already in use"
- Cambia el puerto: `PORT=3001 npm run dev`

### Error: "Build failed"
- Verifica que no haya errores de TypeScript: `npm run build`
- Revisa los logs para más detalles

## 📚 Documentación Adicional

- `README.md` - Información general del proyecto
- `docs/ops/DEPLOYMENT.md` - Guía completa de despliegue en AWS
- `package.json` - Dependencias y scripts disponibles


