# 🔐 Credenciales del Panel Admin

## ✅ AWS Cognito Configurado

### **Configuración Creada:**

#### User Pool:
- **Name**: Dosce25-Admin-Users
- **User Pool ID**: `us-east-1_jK2m3C6w6`
- **Region**: us-east-1

#### App Client:
- **Name**: Dosce25-Web-Client  
- **Client ID**: `39hhotrvehs8rck3sbua8sabab`

---

## 👤 Usuario Administrador Creado

### **Credenciales Actuales:**
```
Email: admin@doce23.org
Password: Doce25Admin2026!@
```

### **URL de Login:**
```
https://main.d10lzd121ayedb.amplifyapp.com/admin/login
```

### **Usuario Anterior (deprecado):**
```
Email: admin@dosce25.org
Password: Dosce25Admin2026!
```

---

## 🚀 Cómo Usar el Panel Admin

### **Paso 1: Acceder**
1. Ve a: https://main.d10lzd121ayedb.amplifyapp.com/admin/login
2. Ingresa las credenciales:
   - Email: `admin@doce23.org`
   - Password: `Doce25Admin2026!@`
3. Click en "Iniciar Sesión"

### **Paso 2: Funcionalidades Disponibles**

#### 📊 **Gestión de Eventos** (`/admin/eventos`)
- Ver lista completa de eventos
- Crear nuevos eventos
- Editar eventos existentes
- Ver asistentes por evento

#### 👥 **Ver Asistentes** (`/admin/asistentes/[eventId]`)
- Estadísticas en tiempo real:
  - Total de registros
  - Check-ins realizados
  - Pendientes
- Lista completa de asistentes con:
  - Nombre
  - Email
  - Fecha de registro
  - Estado de check-in
- **Exportar a CSV** para análisis en Excel

#### 📱 **Escáner QR** (`/admin/scanner`)
- Abrir cámara del dispositivo
- Escanear códigos QR de asistentes
- Check-in automático
- Validación en tiempo real

---

## 🔄 Variables de Ambiente Configuradas

### **En Amplify (Producción):**
```
NEXT_PUBLIC_API_ENDPOINT=https://moo5jpvl56.execute-api.us-east-1.amazonaws.com/prod
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_jK2m3C6w6
NEXT_PUBLIC_COGNITO_CLIENT_ID=39hhotrvehs8rck3sbua8sabab
NEXT_PUBLIC_AWS_REGION=us-east-1
```

### **En Local (.env.local):**
Ya está configurado ✅

---

## 👥 Crear Más Usuarios Admin

### **Opción 1: CLI (Recomendado)**
```bash
aws cognito-idp admin-create-user \
  --user-pool-id "us-east-1_jK2m3C6w6" \
  --username "nuevo-admin@doce25.org" \
  --user-attributes Name=email,Value=nuevo-admin@doce25.org Name=email_verified,Value=true \
  --temporary-password "TempPassword123!" \
  --message-action SUPPRESS \
  --region us-east-1

# Establecer contraseña permanente
aws cognito-idp admin-set-user-password \
  --user-pool-id "us-east-1_jK2m3C6w6" \
  --username "nuevo-admin@doce25.org" \
  --password "NuevaPassword123!" \
  --permanent \
  --region us-east-1
```

### **Opción 2: AWS Console**
1. Ve a: https://console.aws.amazon.com/cognito/
2. Select User Pool: `Dosce25-Admin-Users`
3. Click "Users" → "Create user"
4. Ingresa email y contraseña
5. Desmarca "Send invitation email"
6. Click "Create user"

---

## 🔒 Seguridad

### **Política de Contraseñas:**
- Mínimo 8 caracteres
- Requiere mayúsculas
- Requiere minúsculas
- Requiere números
- Símbolos opcionales

### **Recuperación de Cuenta:**
- Por email verificado
- Por número de teléfono (si está configurado)

### **Recomendaciones:**
1. ✅ Cambiar la contraseña después del primer uso
2. ✅ No compartir credenciales
3. ✅ Usar emails únicos por administrador
4. ✅ Revocar acceso de usuarios que ya no lo necesiten

---

## 🗑️ Eliminar Usuario Admin

```bash
aws cognito-idp admin-delete-user \
  --user-pool-id "us-east-1_jK2m3C6w6" \
  --username "email@doce25.org" \
  --region us-east-1
```

---

## 🔍 Ver Todos los Usuarios

```bash
aws cognito-idp list-users \
  --user-pool-id "us-east-1_jK2m3C6w6" \
  --region us-east-1
```

---

## 🚨 Troubleshooting

### **Error: "User does not exist"**
- Verifica que el email esté correcto
- Verifica el User Pool ID

### **Error: "Incorrect username or password"**
- Verifica las credenciales
- Usa exactamente: `admin@doce23.org`
- Password: `Doce25Admin2026!@`

### **No puedo acceder al admin**
1. Verifica que el build de Amplify haya terminado
2. Verifica las variables de ambiente en Amplify Console
3. Abre DevTools (F12) y revisa errores en Console

### **El escáner no funciona**
- Requiere HTTPS (Amplify lo provee automáticamente)
- El navegador pedirá permisos de cámara
- Funciona mejor en dispositivos móviles

---

## 📱 URLs Importantes

### **Producción (Amplify):**
- Admin Login: https://main.d10lzd121ayedb.amplifyapp.com/admin/login
- Eventos: https://main.d10lzd121ayedb.amplifyapp.com/admin/eventos
- Escáner: https://main.d10lzd121ayedb.amplifyapp.com/admin/scanner

### **Local (Development):**
- Admin Login: http://localhost:3000/admin/login
- Eventos: http://localhost:3000/admin/eventos
- Escáner: http://localhost:3000/admin/scanner

### **AWS Resources:**
- Cognito Console: https://console.aws.amazon.com/cognito/
- Amplify Console: https://console.aws.amazon.com/amplify/
- API Gateway: https://console.aws.amazon.com/apigateway/

---

## ✅ Estado Actual

- ✅ User Pool creado
- ✅ App Client creado
- ✅ Usuario admin creado
- ✅ Variables de ambiente configuradas
- ✅ Deploy iniciado en Amplify
- ✅ Sistema listo para usar

---

**Creado**: 12 de Febrero de 2026  
**User Pool ID**: us-east-1_jK2m3C6w6  
**Client ID**: 39hhotrvehs8rck3sbua8sabab  
**Region**: us-east-1

---

¡Todo listo! 🎉 El panel admin está completamente configurado y operativo.




## ✅ AWS Cognito Configurado

### **Configuración Creada:**

#### User Pool:
- **Name**: Dosce25-Admin-Users
- **User Pool ID**: `us-east-1_jK2m3C6w6`
- **Region**: us-east-1

#### App Client:
- **Name**: Dosce25-Web-Client  
- **Client ID**: `39hhotrvehs8rck3sbua8sabab`

---

## 👤 Usuario Administrador Creado

### **Credenciales Actuales:**
```
Email: admin@doce23.org
Password: Doce25Admin2026!@
```

### **URL de Login:**
```
https://main.d10lzd121ayedb.amplifyapp.com/admin/login
```

### **Usuario Anterior (deprecado):**
```
Email: admin@dosce25.org
Password: Dosce25Admin2026!
```

---

## 🚀 Cómo Usar el Panel Admin

### **Paso 1: Acceder**
1. Ve a: https://main.d10lzd121ayedb.amplifyapp.com/admin/login
2. Ingresa las credenciales:
   - Email: `admin@doce23.org`
   - Password: `Doce25Admin2026!@`
3. Click en "Iniciar Sesión"

### **Paso 2: Funcionalidades Disponibles**

#### 📊 **Gestión de Eventos** (`/admin/eventos`)
- Ver lista completa de eventos
- Crear nuevos eventos
- Editar eventos existentes
- Ver asistentes por evento

#### 👥 **Ver Asistentes** (`/admin/asistentes/[eventId]`)
- Estadísticas en tiempo real:
  - Total de registros
  - Check-ins realizados
  - Pendientes
- Lista completa de asistentes con:
  - Nombre
  - Email
  - Fecha de registro
  - Estado de check-in
- **Exportar a CSV** para análisis en Excel

#### 📱 **Escáner QR** (`/admin/scanner`)
- Abrir cámara del dispositivo
- Escanear códigos QR de asistentes
- Check-in automático
- Validación en tiempo real

---

## 🔄 Variables de Ambiente Configuradas

### **En Amplify (Producción):**
```
NEXT_PUBLIC_API_ENDPOINT=https://moo5jpvl56.execute-api.us-east-1.amazonaws.com/prod
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_jK2m3C6w6
NEXT_PUBLIC_COGNITO_CLIENT_ID=39hhotrvehs8rck3sbua8sabab
NEXT_PUBLIC_AWS_REGION=us-east-1
```

### **En Local (.env.local):**
Ya está configurado ✅

---

## 👥 Crear Más Usuarios Admin

### **Opción 1: CLI (Recomendado)**
```bash
aws cognito-idp admin-create-user \
  --user-pool-id "us-east-1_jK2m3C6w6" \
  --username "nuevo-admin@doce25.org" \
  --user-attributes Name=email,Value=nuevo-admin@doce25.org Name=email_verified,Value=true \
  --temporary-password "TempPassword123!" \
  --message-action SUPPRESS \
  --region us-east-1

# Establecer contraseña permanente
aws cognito-idp admin-set-user-password \
  --user-pool-id "us-east-1_jK2m3C6w6" \
  --username "nuevo-admin@doce25.org" \
  --password "NuevaPassword123!" \
  --permanent \
  --region us-east-1
```

### **Opción 2: AWS Console**
1. Ve a: https://console.aws.amazon.com/cognito/
2. Select User Pool: `Dosce25-Admin-Users`
3. Click "Users" → "Create user"
4. Ingresa email y contraseña
5. Desmarca "Send invitation email"
6. Click "Create user"

---

## 🔒 Seguridad

### **Política de Contraseñas:**
- Mínimo 8 caracteres
- Requiere mayúsculas
- Requiere minúsculas
- Requiere números
- Símbolos opcionales

### **Recuperación de Cuenta:**
- Por email verificado
- Por número de teléfono (si está configurado)

### **Recomendaciones:**
1. ✅ Cambiar la contraseña después del primer uso
2. ✅ No compartir credenciales
3. ✅ Usar emails únicos por administrador
4. ✅ Revocar acceso de usuarios que ya no lo necesiten

---

## 🗑️ Eliminar Usuario Admin

```bash
aws cognito-idp admin-delete-user \
  --user-pool-id "us-east-1_jK2m3C6w6" \
  --username "email@doce25.org" \
  --region us-east-1
```

---

## 🔍 Ver Todos los Usuarios

```bash
aws cognito-idp list-users \
  --user-pool-id "us-east-1_jK2m3C6w6" \
  --region us-east-1
```

---

## 🚨 Troubleshooting

### **Error: "User does not exist"**
- Verifica que el email esté correcto
- Verifica el User Pool ID

### **Error: "Incorrect username or password"**
- Verifica las credenciales
- Usa exactamente: `admin@doce23.org`
- Password: `Doce25Admin2026!@`

### **No puedo acceder al admin**
1. Verifica que el build de Amplify haya terminado
2. Verifica las variables de ambiente en Amplify Console
3. Abre DevTools (F12) y revisa errores en Console

### **El escáner no funciona**
- Requiere HTTPS (Amplify lo provee automáticamente)
- El navegador pedirá permisos de cámara
- Funciona mejor en dispositivos móviles

---

## 📱 URLs Importantes

### **Producción (Amplify):**
- Admin Login: https://main.d10lzd121ayedb.amplifyapp.com/admin/login
- Eventos: https://main.d10lzd121ayedb.amplifyapp.com/admin/eventos
- Escáner: https://main.d10lzd121ayedb.amplifyapp.com/admin/scanner

### **Local (Development):**
- Admin Login: http://localhost:3000/admin/login
- Eventos: http://localhost:3000/admin/eventos
- Escáner: http://localhost:3000/admin/scanner

### **AWS Resources:**
- Cognito Console: https://console.aws.amazon.com/cognito/
- Amplify Console: https://console.aws.amazon.com/amplify/
- API Gateway: https://console.aws.amazon.com/apigateway/

---

## ✅ Estado Actual

- ✅ User Pool creado
- ✅ App Client creado
- ✅ Usuario admin creado
- ✅ Variables de ambiente configuradas
- ✅ Deploy iniciado en Amplify
- ✅ Sistema listo para usar

---

**Creado**: 12 de Febrero de 2026  
**User Pool ID**: us-east-1_jK2m3C6w6  
**Client ID**: 39hhotrvehs8rck3sbua8sabab  
**Region**: us-east-1

---

¡Todo listo! 🎉 El panel admin está completamente configurado y operativo.

