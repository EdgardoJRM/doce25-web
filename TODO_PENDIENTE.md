# 📋 TODO - Pendientes del Sistema Dosce25

## 🔴 **PRIORIDAD ALTA** (Funcionalidad Crítica)

### **1. Relevo de Responsabilidad**
- [ ] Crear página `/terminos-y-condiciones`
- [ ] Crear página `/relevo-responsabilidad`
- [ ] Agregar checkbox en formulario de registro
- [ ] Guardar aceptación en DynamoDB (campo `termsAccepted`)
- [ ] Validar que esté marcado antes de permitir registro

---

### **2. CRUD de Asistentes (Admin)**

#### **Ver Asistentes:** ✅ YA EXISTE
- Ruta: `/admin/asistentes/[eventId]`
- Muestra lista completa
- Estadísticas
- Exportar CSV

#### **Editar Asistente:** ❌ FALTA
- Ruta: `/admin/asistentes/[eventId]/editar/[registrationId]`
- Editar: nombre, email, teléfono
- Lambda: `update-registration` (PUT)

#### **Eliminar Asistente:** ❌ FALTA
- Botón "Eliminar" en tabla de asistentes
- Confirmación antes de borrar
- Lambda: `delete-registration` (DELETE)
- Considerar: soft delete vs hard delete

#### **Reenviar Email con QR:** ❌ FALTA
- Botón en tabla de asistentes
- Lambda: `resend-qr-email`
- Útil si el asistente perdió el email

---

### **3. CRUD de Eventos (Admin)**

#### **Crear Evento:** ✅ YA EXISTE
#### **Ver Eventos:** ✅ YA EXISTE
#### **Editar Evento:** ✅ YA EXISTE

#### **Eliminar Evento:** ❌ FALTA
- Botón "Eliminar" en lista de eventos
- Confirmación modal
- Lambda: `delete-event` (DELETE)
- Considerar: ¿qué pasa con los asistentes registrados?

---

## 🟡 **PRIORIDAD MEDIA** (Contenido Web Pública)

### **4. Páginas de Contenido Institucional**

#### **Sobre Nosotros:** ❌ FALTA
- Ruta: `/nosotros` o `/sobre-nosotros`
- Historia de la fundación
- Equipo
- Misión y Visión detallada

#### **Proyectos Detallados:** ❌ FALTA
- Ruta: `/proyectos/[proyecto-slug]`
- Página individual por proyecto
- Con fotos, descripción, impacto

#### **Galería de Fotos:** ❌ FALTA
- Ruta: `/galeria`
- Grid de fotos de eventos pasados
- Las 51 fotos en `/Fotos doce25/` esperando ser usadas

#### **Contacto:** ❌ FALTA
- Ruta: `/contacto`
- Formulario de contacto
- Mapa/dirección
- Redes sociales
- Lambda: `send-contact-email`

#### **Donaciones:** ❌ FALTA
- Ruta: `/donar` o `/donaciones`
- Info de cómo donar
- Stripe/PayPal integration (opcional)
- Cuentas bancarias

---

### **5. Páginas Legales**

#### **Términos y Condiciones:** ❌ FALTA
- Ruta: `/terminos`
- Términos de uso del sitio

#### **Política de Privacidad:** ❌ FALTA
- Ruta: `/privacidad`
- Cómo manejamos datos personales
- GDPR compliance (si aplica)

#### **Relevo de Responsabilidad:** ❌ FALTA
- Ruta: `/relevo-responsabilidad`
- Documento legal para eventos
- Se acepta al registrarse

---

## 🟢 **PRIORIDAD BAJA** (Mejoras y Optimizaciones)

### **6. Dashboard Admin**

#### **Dashboard Principal:** ❌ FALTA
- Ruta: `/admin/dashboard`
- Métricas generales:
  - Total de eventos
  - Total de asistentes registrados
  - Check-ins del mes
  - Gráficas

---

### **7. Búsqueda y Filtros**

#### **Búsqueda de Eventos (Público):** ❌ FALTA
- Barra de búsqueda en `/eventos`
- Filtrar por fecha, ubicación, categoría

#### **Búsqueda de Asistentes (Admin):** ❌ FALTA
- Barra de búsqueda en lista de asistentes
- Filtrar por nombre, email

---

### **8. Notificaciones**

#### **Email de Recordatorio:** ❌ FALTA
- Lambda que envía recordatorio 24h antes del evento
- CloudWatch Event Rule para trigger automático

#### **Email Post-Evento:** ❌ FALTA
- Agradecer asistencia
- Pedir feedback
- Compartir fotos

---

### **9. Reportes y Analytics**

#### **Reportes Avanzados:** ❌ FALTA
- Reporte de asistencia por evento
- Tendencias de registro
- Tasas de conversión (registrados vs check-in)

---

### **10. UX/UI Improvements**

#### **Mejoras de Diseño:** ❌ FALTA
- Animaciones
- Transiciones suaves
- Loading skeletons
- Toast notifications
- Modal components

#### **Responsive Mobile:** ⚠️ REVISAR
- Probar todas las páginas en móvil
- Optimizar formularios para móvil
- Scanner optimizado para móvil

---

## 📊 **RESUMEN DE LO QUE TENEMOS:**

### **✅ COMPLETO:**

#### **Backend (8 Lambdas):**
1. ✅ register-event
2. ✅ get-events
3. ✅ get-event-by-slug
4. ✅ get-event-by-id
5. ✅ create-event
6. ✅ update-event
7. ✅ get-registrations
8. ✅ checkin

#### **Admin:**
1. ✅ Login (Cognito)
2. ✅ Ver eventos
3. ✅ Crear eventos
4. ✅ Editar eventos
5. ✅ Ver asistentes
6. ✅ Estadísticas
7. ✅ Exportar CSV
8. ✅ Scanner QR

#### **Público:**
1. ✅ Home (básica)
2. ✅ Lista de eventos
3. ✅ Detalle de evento
4. ✅ Formulario de registro
5. ✅ Página de check-in

---

### **❌ FALTA:**

#### **Backend (Lambdas):**
1. ❌ update-registration
2. ❌ delete-registration
3. ❌ delete-event
4. ❌ resend-qr-email
5. ❌ send-contact-email

#### **Admin:**
1. ❌ Editar asistentes
2. ❌ Eliminar asistentes
3. ❌ Eliminar eventos
4. ❌ Dashboard con métricas
5. ❌ Reenviar QR

#### **Público:**
1. ❌ Sobre nosotros
2. ❌ Proyectos (detallados)
3. ❌ Galería de fotos
4. ❌ Contacto
5. ❌ Donaciones
6. ❌ Términos y condiciones
7. ❌ Privacidad
8. ❌ Relevo de responsabilidad
9. ❌ Búsqueda/filtros

---

## 🎯 **PLAN SUGERIDO DE IMPLEMENTACIÓN:**

### **FASE 1: Relevo de Responsabilidad** (1-2 días)
1. Crear página `/relevo-responsabilidad`
2. Agregar checkbox en formulario registro
3. Actualizar lambda `register-event` para guardar aceptación
4. Actualizar base de datos

### **FASE 2: CRUD Asistentes** (2-3 días)
1. Lambda `update-registration`
2. Lambda `delete-registration`
3. Página editar asistente
4. Botón eliminar en tabla
5. Lambda `resend-qr-email`

### **FASE 3: Contenido Público** (3-5 días)
1. Página "Sobre Nosotros"
2. Página "Contacto" con formulario
3. Galería de fotos (usar las 51 fotos existentes)
4. Páginas legales (términos, privacidad)

### **FASE 4: CRUD Eventos Completo** (1 día)
1. Lambda `delete-event`
2. Botón eliminar en admin eventos

### **FASE 5: Mejoras UX** (2-3 días)
1. Dashboard admin
2. Búsqueda y filtros
3. Optimización móvil

---

## 📈 **PORCENTAJE COMPLETADO:**

```
Backend API:       8/13 = 62% ✅
Admin Panel:       8/13 = 62% ✅
Página Pública:    5/14 = 36% ⚠️
Sistema General:   21/40 = 53% ⚠️
```

---

## 🚀 **SIGUIENTE PASO INMEDIATO:**

**Prioridad #1: Relevo de Responsabilidad**

¿Quieres que empiece con:
1. Crear la página `/relevo-responsabilidad`
2. Actualizar formulario de registro con checkbox
3. Modificar lambda para guardar aceptación

O prefieres que primero trabaje en otra cosa de la lista?

---

**Fecha**: 12 de Febrero de 2026  
**Estado Actual**: Sistema funcional básico, necesita contenido y CRUD completo

