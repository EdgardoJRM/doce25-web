# Cómo Ver el Sistema de Peso y Grupos

## Estado Actual

✅ **Backend desplegado**: Todas las 28 funciones Lambda están actualizadas y funcionando
✅ **Frontend desplegado**: Commit `8486d2f` está en producción en Amplify
✅ **APIs funcionando**: Endpoints de eventos, peso, y grupos responden correctamente

## ¿Por qué no veo datos de peso?

El sistema de **múltiples viajes de peso** y **grupos** es completamente nuevo. Los datos existentes:

- ❌ No tienen `participationType` (individual/duo/group/organization)
- ❌ No tienen registros en la tabla `WeightRecords` (nueva tabla para historial)
- ❌ Solo tienen el campo antiguo `weightCollected` en Registrations

## Dónde Se Muestra el Sistema de Peso

### 1. Página de Perfil (`/perfil`)

Cuando un usuario logueado tiene registraciones con check-in, verá:

**Stats Cards:**
- 📊 **Viajes de Recolección**: Número total de trips
- ⚖️ **kg Total Recogidos**: Peso acumulado de todos los viajes

**Por cada evento asistido:**
- Badge con número de viajes y kg total (ej: "♻️ 3 viajes · 15.5 kg")
- Botón expandible: "📊 Ver Historial de Recolección (X viajes)"
- Al expandir, lista detallada de cada viaje:
  - Fecha y hora
  - Peso y tipo de basura
  - Desglose por material (plástico, metal, vidrio, orgánico, otro)
  - **Si es grupo**: Muestra quién registró ese viaje

**Para grupos:**
- Muestra badge del tipo: 👥 Duo, 👨‍👩‍👧‍👦 Grupo, o 🏢 [Nombre Org]
- Lista de miembros del grupo

### 2. Página Admin de Evento (`/admin/eventos/[eventId]`)

**Stats Cards en el top:**
- 📊 Total de Viajes
- ⚖️ Peso Total Recolectado
- 👥 Número de Grupos/Organizaciones

**Toggle de Vista:**
- **Individual**: Muestra cada participante con su historial personal
- **Grupos**: Agrupa por grupos/organizaciones con historial compartido

**Para cada participante/grupo:**
- Badge con número de viajes y kg total
- Lista expandible de cada viaje
- **Para grupos**: Muestra quién de los miembros registró cada peso

### 3. Flujo de Check-in (`/checkin/[token]`)

**Hub de Check-in mejorado:**

Si NO tiene check-in aún:
1. Selecciona tipo de participación:
   - 🚶 Individual
   - 👥 Duo
   - 👨‍👩‍👧‍👦 Grupo (3+)
   - 🏢 Organización

2. Para Duo/Grupo:
   - Escanea QR de cada integrante
   - Forma el grupo dinámicamente

3. Para Organización:
   - Si ya está registrado con org: "¿Vienes con [Nombre Org]?"
   - O ingresa nombre de org manualmente

Si YA tiene check-in:
- Muestra info del participante/grupo
- Botón: "Registrar Peso" → Abre formulario
- **Para grupos**: Cualquier miembro puede registrar peso para todo el grupo

### 4. Formulario de Peso Mejorado

**Para individuales:**
- Formulario estándar
- Guarda en WeightRecords con `registrationId`

**Para grupos:**
- Muestra lista de todos los miembros
- Indica quién está registrando (ej: "Juan Pérez está registrando peso para el grupo")
- Guarda en WeightRecords con `groupId` y `registeredBy`
- **Importante**: El peso se comparte entre todos los miembros

## Cómo Probar el Sistema

### Opción 1: Crear Nueva Registración de Prueba

1. Ve a la página del evento de prueba
2. Regístrate como nuevo participante
3. Haz check-in escaneando el QR (o desde `/checkin/[token]`)
4. Selecciona tipo de participación (Individual para empezar simple)
5. Registra peso (puedes hacerlo múltiples veces para simular varios viajes)
6. Ve a `/perfil` y verás el historial completo

### Opción 2: Probar Flujo de Grupo

1. Registra 3 participantes diferentes en un evento
2. Uno de ellos hace check-in y selecciona "Grupo (3+)"
3. Escanea los QRs de los otros 2 miembros
4. Registra peso como grupo
5. Cierra sesión y loguéate como otro miembro
6. Registra peso de nuevo (segundo viaje)
7. Ve al admin del evento → Vista "Grupos" para ver todo el historial

### Opción 3: Probar Flujo de Organización

1. Registra varios participantes con la misma organización
2. Cada uno hace check-in y confirma que viene con su org
3. Todos se agrupan automáticamente bajo el mismo `groupId`
4. Cualquiera puede registrar peso para toda la org
5. Ve al admin → Vista "Grupos" para ver el grupo de la org

## APIs Disponibles

Todos estos endpoints están funcionando:

- `GET /events` - Lista de eventos ✅
- `GET /events/{id}` - Detalle de evento ✅
- `POST /checkin` - Check-in de participante ✅
- `PUT /registrations/{id}/group` - Actualizar grupo ✅
- `GET /groups/{groupId}` - Info de grupo ✅
- `POST /weight` - Registrar peso ✅
- `GET /registrations/{id}/weight-history` - Historial individual ✅
- `GET /groups/{groupId}/weight-history` - Historial grupal ✅

## Tabla DynamoDB: WeightRecords

Esta nueva tabla almacena cada viaje de recolección:

```
weightRecordId (PK)
registrationId (para individuales) | null
groupId (para grupos) | null
eventId
weightCollected
trashType
trashBreakdown { plastic, metal, glass, organic, other }
timestamp
registeredBy (registrationId de quien registró)
registeredByName
notes
```

**GSIs:**
- `RegistrationIndex`: Para query por registrationId
- `GroupIndex`: Para query por groupId
- `EventIndex`: Para query por eventId

## Siguiente Paso

Para ver el sistema en acción, necesitas:

1. **Crear nuevas registraciones** en el evento de prueba
2. **Hacer check-in** usando el nuevo flujo
3. **Registrar peso** una o más veces

Los datos antiguos no se migran automáticamente porque el modelo cambió significativamente (de peso único a historial de múltiples viajes).

## Verificación Rápida

Puedes verificar que todo está funcionando correctamente:

```bash
# Ver si hay registros en WeightRecords
aws dynamodb scan --table-name Dosce25-WeightRecords --limit 5

# Probar endpoint de eventos
curl https://moo5jpvl56.execute-api.us-east-1.amazonaws.com/prod/events

# Probar endpoint de historial (vacío si no hay datos)
curl https://moo5jpvl56.execute-api.us-east-1.amazonaws.com/prod/registrations/[ID]/weight-history
```
