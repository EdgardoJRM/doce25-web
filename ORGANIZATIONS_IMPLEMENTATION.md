# 🏢 Implementación: Sistema de Organizaciones en Check-in

## Resumen de Cambios

Se ha implementado la funcionalidad **Opción B** que permite a los usuarios crear nuevas organizaciones al momento del check-in. Cuando escriben una organización que no existe, aparece un botón "Crear nueva" para agregarla dinámicamente.

---

## 📁 Archivos Creados

### 1. **Lambda: `lambda/create-organization/index.ts`**
- Endpoint: `POST /events/{eventId}/organizations`
- Valida y confirma la creación de nuevas organizaciones
- Verifica si la organización ya existe antes de crearla
- Retorna `isNew: true` si es nueva, `isNew: false` si ya existe

### 2. **Configuración: `lib/organizations.ts`**
- Define las organizaciones predefinidas: **Starbucks** y **Mapfre**
- Exporta `PREDEFINED_ORGANIZATIONS` para usar en componentes
- Función `getDefaultOrganizations()` para obtener la lista

### 3. **Script de Seed: `scripts/seed-organizations.js`**
- Script informativo para documentar las organizaciones predefinidas
- Puede ejecutarse con: `node scripts/seed-organizations.js`

---

## 📝 Archivos Modificados

### **`components/GroupFormation.tsx`**

#### Cambios principales:

1. **Importación de organizaciones predefinidas**
   ```typescript
   import { PREDEFINED_ORGANIZATIONS } from '@/lib/organizations'
   ```

2. **Nuevos estados**
   ```typescript
   const [creatingOrg, setCreatingOrg] = useState(false)
   const [showCreateButton, setShowCreateButton] = useState(false)
   ```

3. **Lógica mejorada de filtrado**
   - Detecta si el texto escrito coincide con una organización existente
   - Muestra botón "Crear nueva" solo si el texto NO existe en la lista

4. **Nueva función: `createNewOrganization()`**
   - Llama al endpoint POST para crear la organización
   - Agrega la nueva organización a la lista local
   - Selecciona automáticamente la nueva organización

5. **UI mejorada del dropdown**
   - Botón "Crear nueva" aparece en la parte superior del dropdown
   - Muestra el nombre que se va a crear: `"Crear: 'Mi Organización'"`
   - Indicador de carga mientras se crea
   - Las organizaciones predefinidas siempre están disponibles

6. **Integración de organizaciones predefinidas**
   - Combina organizaciones predefinidas con las del servidor
   - Si hay error al cargar, muestra al menos las predefinidas
   - Ordena alfabéticamente todas las organizaciones

---

## 🎯 Flujo de Uso

### Escenario 1: Seleccionar organización existente
1. Usuario selecciona "Organización" en check-in
2. Ve dropdown con: **Starbucks**, **Mapfre**, y otras creadas
3. Hace clic en una → se selecciona automáticamente

### Escenario 2: Crear nueva organización
1. Usuario selecciona "Organización"
2. Escribe "Google" (no existe)
3. Aparece botón: **"➕ Crear: 'Google'"**
4. Hace clic → se crea y selecciona automáticamente
5. Próximos usuarios verán "Google" en el dropdown

---

## 🔧 Configuración Requerida

### Variables de Entorno
```env
NEXT_PUBLIC_API_ENDPOINT=https://tu-api-endpoint.com
REGISTRATIONS_TABLE=Dosce25-Registrations
```

### Permisos AWS Lambda
El Lambda necesita permisos para:
- `dynamodb:Query` - para verificar organizaciones existentes
- `dynamodb:GetItem` - para obtener registros

---

## 🧪 Pruebas Recomendadas

1. **Crear organización nueva**
   - Escribir "Tesla" en el campo
   - Verificar que aparezca el botón "Crear: 'Tesla'"
   - Hacer clic y confirmar que se crea

2. **Seleccionar predefinida**
   - Escribir "Star" 
   - Verificar que aparezca "Starbucks" en el dropdown
   - Seleccionar y confirmar

3. **Duplicados**
   - Crear "Apple"
   - Intentar crear "Apple" de nuevo
   - Verificar que no se cree duplicado

4. **Búsqueda**
   - Escribir "map"
   - Verificar que filtre a "Mapfre"
   - Escribir "xyz"
   - Verificar que muestre botón "Crear: 'xyz'"

---

## 📊 Estructura de Datos

### Registro en DynamoDB
```json
{
  "registrationId": "uuid",
  "eventId": "event-123",
  "participationType": "organization",
  "eventOrganization": "Starbucks",
  "groupId": "group-uuid",
  "checkedIn": true,
  "checkedInAt": "2024-03-22T10:30:00Z"
}
```

---

## 🚀 Próximos Pasos (Opcional)

1. **Agregar más organizaciones predefinidas**
   - Editar `lib/organizations.ts`
   - Agregar a `PREDEFINED_ORGANIZATIONS`

2. **Validación de nombres**
   - Agregar validación de caracteres especiales
   - Limitar longitud de nombres

3. **Administración de organizaciones**
   - Panel admin para ver/editar/eliminar organizaciones
   - Estadísticas por organización

4. **Sincronización con registro**
   - Si el usuario tiene `organization` en su registro, preseleccionarla
   - Permitir cambiar de organización en check-in

---

## 📞 Soporte

Para preguntas o problemas:
- Revisar logs del Lambda en CloudWatch
- Verificar permisos de DynamoDB
- Confirmar que `NEXT_PUBLIC_API_ENDPOINT` está configurado correctamente

