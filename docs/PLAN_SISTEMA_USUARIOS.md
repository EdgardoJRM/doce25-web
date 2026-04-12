# 📋 PLAN: Sistema de Usuarios con Login

## 🎯 OBJETIVO

Implementar un sistema completo de usuarios donde:
- Los usuarios puedan crear cuenta y hacer login
- Ver su historial de eventos registrados
- Gestionar su perfil
- Admin pueda ver todos los usuarios en el panel

---

## 🏗️ ARQUITECTURA PROPUESTA

### **1. NUEVA TABLA DYNAMODB: `Doce25-Users`**

```yaml
TableName: Doce25-Users
PartitionKey: userId (String)
Attributes:
  - userId: UUID único
  - email: String (único)
  - password: String (hasheado con bcrypt)
  - fullName: String
  - phone: String (opcional)
  - ageRange: String
  - gender: String
  - city: String
  - organization: String
  - createdAt: Timestamp
  - updatedAt: Timestamp
  - lastLogin: Timestamp
  - status: 'active' | 'inactive' | 'suspended'

GlobalSecondaryIndex:
  - EmailIndex: email (para login)
```

### **2. MODIFICAR TABLA `Doce25-Registrations`**

Agregar campo:
- `userId: String` (referencia a Doce25-Users)

Esto conecta registros con usuarios.

---

## 🔐 NUEVOS LAMBDAS NECESARIOS

### **Auth Lambdas:**

1. **`register-user`** - POST `/auth/register`
   - Crear nueva cuenta de usuario
   - Hash password con bcrypt
   - Enviar email de bienvenida
   - Retornar JWT token

2. **`login-user`** - POST `/auth/login`
   - Validar email + password
   - Generar JWT token
   - Actualizar lastLogin
   - Retornar user data + token

3. **`get-user-profile`** - GET `/auth/profile`
   - Requiere JWT token
   - Retornar datos del usuario

4. **`update-user-profile`** - PUT `/auth/profile`
   - Requiere JWT token
   - Actualizar datos del usuario

5. **`change-password`** - POST `/auth/change-password`
   - Requiere JWT token
   - Cambiar contraseña

### **User Management Lambdas:**

6. **`get-all-users`** - GET `/admin/users`
   - Solo admin (verificar con Cognito)
   - Listar todos los usuarios
   - Paginación

7. **`get-user-registrations`** - GET `/users/{userId}/registrations`
   - Requiere JWT token
   - Listar eventos del usuario

---

## 🎨 NUEVAS PÁGINAS FRONTEND

### **Públicas:**

1. **`/registro`** - Crear cuenta
   - Formulario: email, password, nombre, datos básicos
   - Validación de email único
   - Redirect a `/login` después de registro

2. **`/login`** - Iniciar sesión
   - Formulario: email + password
   - "¿Olvidaste tu contraseña?"
   - Redirect a `/perfil` después de login

3. **`/perfil`** - Dashboard del usuario
   - Datos personales
   - Historial de eventos registrados
   - Botón "Editar perfil"

4. **`/perfil/editar`** - Editar perfil
   - Actualizar datos
   - Cambiar contraseña

### **Admin:**

5. **`/admin/usuarios`** - Lista de usuarios
   - Tabla con todos los usuarios
   - Filtros: status, ciudad, organización
   - Acciones: ver, editar, suspender

6. **`/admin/usuarios/[userId]`** - Detalle de usuario
   - Información completa
   - Historial de registros
   - Estadísticas

---

## 🔄 FLUJO DE REGISTRO MEJORADO

### **Opción 1: Usuario CON cuenta**
```
1. Usuario hace login → /login
2. Ve lista de eventos → /eventos
3. Click en evento → /eventos/[slug]
4. Click "Registrarme" → Auto-completa datos desde perfil
5. Solo completa Relevo + Firma
6. Registro guardado con userId
```

### **Opción 2: Usuario SIN cuenta (Guest)**
```
1. Ve lista de eventos → /eventos
2. Click en evento → /eventos/[slug]
3. Click "Registrarme" → Formulario completo (como ahora)
4. Al final: "¿Quieres crear cuenta para futuros eventos?"
5. Si acepta → crea cuenta automáticamente
```

---

## 🛠️ TECNOLOGÍAS

- **Auth:** JWT tokens (jsonwebtoken)
- **Password:** bcrypt para hashing
- **Storage:** DynamoDB
- **Email:** AWS SES
- **Frontend:** React Context para auth state

---

## 📦 PAQUETES NPM NECESARIOS

### Backend (Lambdas):
```json
{
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2"
}
```

### Frontend:
```json
{
  "jwt-decode": "^4.0.0"
}
```

---

## 🎯 FASES DE IMPLEMENTACIÓN

### **FASE 1: Backend Auth** (2-3 horas)
- ✅ Crear tabla Doce25-Users
- ✅ Lambda: register-user
- ✅ Lambda: login-user
- ✅ Lambda: get-user-profile
- ✅ Configurar JWT secrets en SAM

### **FASE 2: Frontend Auth** (2-3 horas)
- ✅ Página /registro
- ✅ Página /login
- ✅ Auth Context (React)
- ✅ Protected routes
- ✅ Navbar con user menu

### **FASE 3: User Profile** (1-2 horas)
- ✅ Página /perfil
- ✅ Página /perfil/editar
- ✅ Lambda: update-user-profile
- ✅ Lambda: get-user-registrations

### **FASE 4: Admin Users** (1-2 horas)
- ✅ Página /admin/usuarios
- ✅ Página /admin/usuarios/[userId]
- ✅ Lambda: get-all-users
- ✅ Filtros y búsqueda

### **FASE 5: Integración Registro** (1 hora)
- ✅ Modificar EventRegistrationForm
- ✅ Auto-completar si usuario logueado
- ✅ Opción crear cuenta después de registro

---

## 🔒 SEGURIDAD

1. **Passwords:**
   - Hash con bcrypt (10 rounds)
   - Nunca guardar en plain text

2. **JWT Tokens:**
   - Expiración: 7 días
   - Secret en AWS Secrets Manager
   - Refresh tokens (opcional)

3. **API Protection:**
   - Middleware para verificar JWT
   - Rate limiting en API Gateway

4. **Validaciones:**
   - Email format
   - Password strength (min 8 chars, 1 mayúscula, 1 número)
   - Sanitizar inputs

---

## 📊 BENEFICIOS

✅ **Para Usuarios:**
- No repetir datos en cada registro
- Ver historial de eventos
- Gestionar perfil

✅ **Para Admin:**
- Base de datos de usuarios
- Métricas de participación
- Comunicación directa

✅ **Para el Sistema:**
- Mejor UX
- Datos más limpios
- Analytics mejorados

---

## ⏱️ TIEMPO ESTIMADO TOTAL

**8-12 horas** de desarrollo completo

---

## 🚀 PRÓXIMOS PASOS

1. ¿Aprobamos este plan?
2. Empezamos con FASE 1 (Backend Auth)
3. Testeamos cada fase antes de continuar

---

**¿Quieres que empecemos con la implementación?** 🎯


