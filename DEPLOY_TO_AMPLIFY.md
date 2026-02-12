# 🚀 Guía de Deployment a GitHub y AWS Amplify

## Paso 1: Subir a GitHub

### 1.1. Crear repositorio en GitHub
1. Ve a https://github.com/new
2. Nombre del repo: `doce25-web` (o el nombre que prefieras)
3. **NO** inicialices con README (ya lo tenemos)
4. Click en "Create repository"

### 1.2. Conectar y hacer push
Copia el comando que GitHub te muestra, algo así:

```bash
cd "/Users/gardo/Doce25 - Web"

# Agregar el remote (usa TU URL de GitHub)
git remote add origin https://github.com/TU_USUARIO/doce25-web.git

# Hacer push
git push -u origin main
```

### 1.3. Verificar
- Ve a tu repositorio en GitHub
- Deberías ver todos los archivos subidos
- **IMPORTANTE**: `.env.local` NO se sube (está en .gitignore)

---

## Paso 2: Desplegar en AWS Amplify

### 2.1. Abrir AWS Amplify Console
1. Ve a: https://console.aws.amazon.com/amplify/
2. Click en **"New app"** → **"Host web app"**

### 2.2. Conectar GitHub
1. Selecciona **"GitHub"**
2. Autoriza AWS Amplify a acceder a tu cuenta
3. Selecciona el repositorio: `doce25-web`
4. Selecciona branch: `main`
5. Click **"Next"**

### 2.3. Configurar Build Settings

#### Amplify detectará automáticamente Next.js, pero verifica:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

**Este archivo ya está en tu repo como `amplify.yml`** ✅

### 2.4. Variables de Ambiente
**MUY IMPORTANTE**: Agregar las variables de ambiente antes de desplegar:

Click en **"Advanced settings"** → **"Environment variables"**

Agrega:
```
NEXT_PUBLIC_API_ENDPOINT = https://moo5jpvl56.execute-api.us-east-1.amazonaws.com/prod
```

### 2.5. Configuración de IAM (si es necesario)
Amplify creará automáticamente un service role. Si te pide permisos adicionales, acepta.

### 2.6. Deploy
1. Click **"Next"**
2. Revisa la configuración
3. Click **"Save and deploy"**

---

## Paso 3: Esperar el Deploy

### Fases del Deploy:
1. 🔄 **Provision** (1-2 min) - Creando recursos
2. 🔄 **Build** (3-5 min) - Instalando dependencias y compilando
3. 🔄 **Deploy** (1 min) - Desplegando a CDN
4. ✅ **Verify** (30 seg) - Verificación final

**Tiempo total estimado**: 5-8 minutos

---

## Paso 4: Verificar el Deploy

### 4.1. URL de Producción
Amplify te dará una URL como:
```
https://main.d1234abcde.amplifyapp.com
```

### 4.2. Probar las páginas:
- ✅ Home: https://tu-app.amplifyapp.com
- ✅ Eventos: https://tu-app.amplifyapp.com/eventos
- ✅ Admin Login: https://tu-app.amplifyapp.com/admin/login
- ✅ Escáner: https://tu-app.amplifyapp.com/admin/scanner

### 4.3. Verificar API
Abre el navegador console (F12) y verifica que las llamadas a la API funcionen:
```
https://moo5jpvl56.execute-api.us-east-1.amazonaws.com/prod
```

---

## Paso 5: Configurar Dominio Personalizado (Opcional)

### 5.1. En Amplify Console
1. Click en **"Domain management"**
2. Click **"Add domain"**
3. Ingresa tu dominio: `dosce25.org`

### 5.2. Configurar DNS
Amplify te dará registros DNS que debes agregar en tu proveedor:

**Ejemplo para Route 53:**
```
Tipo: CNAME
Nombre: www
Valor: [el que te da Amplify]
```

**Ejemplo para otros proveedores:**
Similar, pero la interfaz varía según el proveedor.

### 5.3. Certificado SSL
Amplify automáticamente:
- Solicita certificado SSL gratuito
- Configura HTTPS
- Redirige HTTP → HTTPS

**Tiempo**: 10-20 minutos para que el DNS se propague

---

## Paso 6: Configurar Deploy Automático

### 6.1. Ya está configurado ✅
Amplify automáticamente hará deploy cuando:
- Hagas `git push` a la rama `main`
- Detectará los cambios
- Reconstruirá y desplegará automáticamente

### 6.2. Ver historial de deploys
En Amplify Console puedes ver:
- ✅ Deploys exitosos
- ❌ Deploys fallidos
- 📊 Logs de cada deploy
- ⏱️ Duración de cada build

---

## Paso 7: Actualizar Frontend URL en DynamoDB

### 7.1. Actualizar email template
El email de registro contiene URLs. Actualiza la variable en las lambdas:

```bash
# En SAM template
FRONTEND_URL: https://tu-app.amplifyapp.com
```

O mejor aún, usa tu dominio personalizado:
```bash
FRONTEND_URL: https://dosce25.org
```

### 7.2. Redesplegar lambdas
```bash
cd "/Users/gardo/Doce25 - Web"
sam build
sam deploy
```

---

## 🎯 Checklist Final

### Backend (AWS):
- [x] API Gateway desplegada
- [x] 5 Lambdas funcionando
- [x] DynamoDB con tablas e índices
- [x] S3 bucket para QR codes
- [ ] FRONTEND_URL actualizada en lambdas

### Frontend (Amplify):
- [ ] Código en GitHub
- [ ] App creada en Amplify
- [ ] Variable de ambiente configurada
- [ ] Deploy exitoso
- [ ] URL funcionando
- [ ] API conectada correctamente

### Opcional:
- [ ] Dominio personalizado configurado
- [ ] SSL activo
- [ ] DNS propagado

---

## 🚨 Troubleshooting

### Error: "Build failed"
- Verifica las variables de ambiente
- Revisa los logs en Amplify Console
- Verifica que `package.json` tenga todos los scripts

### Error: "API calls failing"
- Verifica CORS en las lambdas
- Verifica la variable `NEXT_PUBLIC_API_ENDPOINT`
- Abre console del navegador para ver errores

### Error: "Scanner no funciona"
- La cámara requiere HTTPS (Amplify lo da automáticamente)
- El usuario debe dar permisos de cámara
- Funciona mejor en móvil

### Página en blanco
- Verifica variables de ambiente
- Verifica que el build completó exitosamente
- Revisa logs en Amplify Console

---

## 📱 Next Steps

Después del deploy:
1. Crear usuarios en Cognito para el admin
2. Crear eventos de prueba en DynamoDB
3. Probar flujo completo:
   - Registro → Email → QR → Check-in
4. Probar escáner en móvil
5. Compartir URL con el equipo

---

## 🎉 ¡Listo!

Una vez completado, tendrás:
- ✅ Frontend en producción con SSL
- ✅ Backend serverless en AWS
- ✅ Deploy automático con Git
- ✅ Dominio personalizado (opcional)
- ✅ Sistema completo funcionando

**URL de tu API**: https://moo5jpvl56.execute-api.us-east-1.amazonaws.com/prod  
**URL de Amplify**: (se genera después del deploy)  
**Dominio final**: https://dosce25.org (cuando lo configures)

---

¿Dudas? Revisa los logs en:
- AWS Amplify Console
- CloudWatch (para lambdas)
- Browser DevTools (para frontend)

