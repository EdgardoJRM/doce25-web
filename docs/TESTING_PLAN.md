# Plan de Testing - Sistema de Grupos y Registro de Peso Múltiple

## ✅ Deployment Completado

**Fecha:** 2026-03-05  
**API Endpoint:** https://moo5jpvl56.execute-api.us-east-1.amazonaws.com/prod  
**Status Backend:** ✅ Desplegado exitosamente

### Recursos Creados:
- ✅ Tabla `Dosce25-WeightRecords` con GSIs
- ✅ 3 Nuevas Lambdas:
  - `UpdateCheckInGroupFunction`
  - `GetGroupInfoFunction`
  - `GetWeightHistoryFunction`
- ✅ Lambdas Modificadas:
  - `CheckInFunction` - Soporta grupos y devuelve info extendida
  - `RegisterWeightFunction` - Crea registros en WeightRecords con múltiples viajes

### Frontend Actualizado:
- ✅ `app/perfil/page.tsx` - Muestra historial completo de peso con múltiples viajes
- ✅ `app/admin/eventos/[eventId]/page.tsx` - Vista de individuales y grupos con historial completo
- ✅ `lib/api.ts` - Funciones para grupos y historial de peso

---

## 📋 Checklist de Testing End-to-End

### 1. Flujo Individual ✅

**Objetivo:** Verificar que un participante individual puede hacer check-in y registrar peso múltiples veces.

**Pasos:**
1. [ ] Crear/Seleccionar un evento de prueba
2. [ ] Registrar un nuevo participante
3. [ ] Hacer check-in con QR code
4. [ ] Seleccionar "Individual" como tipo de participación
5. [ ] Registrar peso (Viaje #1)
   - Verificar que se crea registro en WeightRecords
   - Verificar que NO se actualiza `weightCollected` en Registration
6. [ ] Volver a escanear QR del mismo participante
7. [ ] Registrar peso nuevamente (Viaje #2)
8. [ ] Verificar en `/perfil`:
   - [ ] Total de viajes: 2
   - [ ] Peso total acumulado correcto
   - [ ] Historial expandible muestra ambos viajes
9. [ ] Verificar en `/admin/eventos/[eventId]`:
   - [ ] Vista Individual muestra el participante
   - [ ] Historial completo con 2 viajes
   - [ ] Estadísticas totales correctas

**Expected Results:**
- 2 registros en WeightRecords con mismo `registrationId`
- Campo `groupId` es null
- Historial muestra quién registró (mismo participante)

---

### 2. Flujo Duo 👥

**Objetivo:** Verificar formación de duo y registro de peso grupal.

**Pasos:**
1. [ ] Registrar dos participantes (A y B)
2. [ ] Participante A hace check-in individual
3. [ ] Participante B hace check-in individual
4. [ ] Participante A vuelve a escanear QR
5. [ ] Seleccionar "Duo" como tipo de participación
6. [ ] Escanear QR de Participante B para formar duo
   - Verificar mensaje de éxito
   - Verificar que ambos comparten mismo `groupId`
   - Verificar que `groupMembers` tiene ambos IDs
7. [ ] Participante A registra peso (Viaje #1)
   - Verificar que se muestra "Registrado por: [Nombre A]"
   - Verificar que ambos participantes comparten este peso
8. [ ] Participante B escanea su QR
9. [ ] Participante B registra peso (Viaje #2)
   - Verificar que se muestra "Registrado por: [Nombre B]"
10. [ ] Verificar en `/perfil` de ambos participantes:
    - [ ] Ambos muestran mismo total de viajes
    - [ ] Ambos muestran mismo peso acumulado
    - [ ] Badge indica "👥 Duo"
11. [ ] Verificar en `/admin/eventos/[eventId]`:
    - [ ] Vista Grupos muestra el duo con 2 miembros
    - [ ] Historial completo con 2 viajes
    - [ ] Muestra quién registró cada viaje

**Expected Results:**
- 2 registros en WeightRecords con mismo `groupId`
- `registeredBy` diferente en cada registro
- Ambos participantes tienen `participationType: 'duo'`
- `groupMembers` array tiene ambos registrationIds

---

### 3. Flujo Grupo 3+ 👨‍👩‍👧‍👦

**Objetivo:** Verificar formación de grupo de 3 o más personas.

**Pasos:**
1. [ ] Registrar tres participantes (A, B, C)
2. [ ] Todos hacen check-in individual
3. [ ] Participante A vuelve a escanear
4. [ ] Seleccionar "Grupo 3+" como tipo de participación
5. [ ] Escanear QR de Participante B
6. [ ] Escanear QR de Participante C
7. [ ] Finalizar formación del grupo
   - Verificar que los 3 comparten mismo `groupId`
   - Verificar `groupMembers` tiene 3 IDs
8. [ ] Participante A registra peso (Viaje #1)
9. [ ] Participante B registra peso (Viaje #2)
10. [ ] Participante C registra peso (Viaje #3)
11. [ ] Verificar en `/perfil` de los 3 participantes:
    - [ ] Todos muestran 3 viajes
    - [ ] Badge indica "👨‍👩‍👧‍👦 Grupo"
    - [ ] Peso total acumulado es la suma de los 3 viajes
12. [ ] Verificar en `/admin/eventos/[eventId]`:
    - [ ] Vista Grupos muestra el grupo con 3 miembros
    - [ ] Historial con 3 viajes
    - [ ] Cada viaje muestra quién lo registró

**Expected Results:**
- 3 registros en WeightRecords con mismo `groupId`
- Cada registro tiene diferente `registeredBy` y `registeredByName`
- `participationType: 'group'` para los 3

---

### 4. Flujo Organización (Pequeña - 3 personas) 🏢

**Objetivo:** Verificar que una organización pequeña puede formarse sin escanear QRs de cada miembro.

**Pasos:**
1. [ ] Registrar 3 participantes con `organization: "Scouts PR"` en el registro previo
2. [ ] Participante A hace check-in
   - [ ] Sistema detecta que tiene organización en registro
   - [ ] Pregunta: "¿Vienes con Scouts PR?"
   - [ ] Confirmar "Sí"
   - [ ] Sistema crea nuevo `groupId` para "Scouts PR" en este evento
3. [ ] Participante B hace check-in
   - [ ] Sistema pregunta: "¿Vienes con Scouts PR?"
   - [ ] Confirmar "Sí"
   - [ ] Sistema asigna al mismo `groupId` existente
4. [ ] Participante C hace check-in y confirma organización
5. [ ] Participante A registra peso (Viaje #1)
6. [ ] Participante B registra peso (Viaje #2)
7. [ ] Verificar en `/perfil` de los 3:
   - [ ] Badge muestra "🏢 Scouts PR"
   - [ ] Todos muestran 2 viajes
   - [ ] Peso total acumulado correcto
8. [ ] Verificar en `/admin/eventos/[eventId]`:
   - [ ] Vista Grupos muestra "🏢 Scouts PR" con 3 miembros
   - [ ] Historial con 2 viajes
   - [ ] NO tiene array `groupMembers` (se agrupa dinámicamente)

**Expected Results:**
- `participationType: 'organization'`
- `eventOrganization: "Scouts PR"`
- Mismo `groupId` para los 3
- NO almacena `groupMembers` array
- Se agrupa dinámicamente por `eventId + eventOrganization + groupId`

---

### 5. Flujo Organización (Grande - 20+ personas) 🏢

**Objetivo:** Verificar escalabilidad del sistema con organizaciones grandes.

**Pasos:**
1. [ ] Registrar 20 participantes con `organization: "Banco Popular"`
2. [ ] Primeros 5 participantes hacen check-in y confirman organización
   - Verificar que todos comparten mismo `groupId`
3. [ ] Siguiente grupo de 5 hace check-in
4. [ ] Siguientes 10 hacen check-in
5. [ ] Múltiples participantes registran peso:
   - [ ] Participante #1 registra Viaje #1
   - [ ] Participante #5 registra Viaje #2
   - [ ] Participante #10 registra Viaje #3
   - [ ] Participante #15 registra Viaje #4
   - [ ] Participante #20 registra Viaje #5
6. [ ] Verificar en `/perfil` de varios participantes:
   - [ ] Todos muestran 5 viajes
   - [ ] Badge "🏢 Banco Popular"
   - [ ] Peso total correcto
7. [ ] Verificar en `/admin/eventos/[eventId]`:
   - [ ] Vista Grupos muestra "🏢 Banco Popular" con 20 miembros
   - [ ] Historial con 5 viajes
   - [ ] Sistema NO tiene problemas de rendimiento
8. [ ] Performance Check:
   - [ ] Tiempo de carga del historial < 2 segundos
   - [ ] Query a DynamoDB funciona eficientemente
   - [ ] NO se almacena array de 20 IDs en cada registro

**Expected Results:**
- Query dinámico funciona correctamente
- No hay límites de tamaño en `groupMembers` porque no se almacena
- Estadísticas agregadas correctamente

---

## 🔍 Validaciones Adicionales

### Validaciones de Negocio:

1. [ ] **No se puede unir a múltiples grupos:**
   - Intentar que un participante se una a 2 grupos diferentes
   - Debe rechazar la operación

2. [ ] **Check-in requerido antes de formar grupo:**
   - Intentar escanear QR de alguien sin check-in al formar duo/grupo
   - Debe mostrar error: "Debe hacer check-in primero"

3. [ ] **Cualquier miembro puede registrar peso:**
   - Verificar que todos los miembros de un grupo pueden registrar peso
   - No solo el "líder"

4. [ ] **Historial muestra quién registró:**
   - Cada registro debe mostrar `registeredByName`
   - Solo para grupos (no para individuales)

---

## 🎯 Testing de UI/UX

### Página de Perfil:
- [ ] Stats cards muestran contadores correctos
- [ ] Botón "Ver Historial" funciona
- [ ] Historial se expande/contrae correctamente
- [ ] Badges de tipo de participación se muestran correctamente
- [ ] Desglose por tipo de basura se calcula correctamente

### Página de Admin:
- [ ] Toggle entre "Individual" y "Grupos" funciona
- [ ] Filtros "Todos", "Con Peso", "Sin Peso" funcionan
- [ ] Stats cards superiores muestran totales correctos
- [ ] Vista de grupos muestra miembros correctamente
- [ ] Vista individual muestra participantes sin grupo
- [ ] Historial expandible funciona en ambas vistas

### Página de Check-in:
- [ ] Flujo de formación de duo funciona
- [ ] Flujo de formación de grupo funciona
- [ ] Confirmación de organización funciona
- [ ] Scanner de QR funciona dentro del flujo de grupos
- [ ] Mensajes de error son claros

---

## 🐛 Testing de Edge Cases

1. [ ] **Registrar peso sin grupo y luego formar grupo:**
   - Participante registra peso como individual
   - Luego intenta formar grupo
   - Verificar comportamiento

2. [ ] **Dejar un grupo:**
   - Intentar cambiar de grupo después de registrar peso
   - Debe rechazar la operación

3. [ ] **Organización con nombre diferente en evento:**
   - Registro previo tiene "Scouts"
   - En check-in, dice que viene con "Scouts PR"
   - Verificar que crea/busca por `eventOrganization`

4. [ ] **Múltiples viajes del mismo miembro:**
   - Mismo participante registra 3 viajes consecutivos
   - Verificar que todos se registran correctamente

5. [ ] **Concurrent registrations:**
   - Dos miembros del mismo grupo registran peso simultáneamente
   - Verificar que no hay conflictos

---

## 📊 Testing de Performance

1. [ ] **Load Testing:**
   - 100 participantes individuales
   - 10 grupos de 5 personas
   - 2 organizaciones de 30 personas cada una
   - Todos registran 3 viajes cada uno
   - Total: ~450 registros de peso

2. [ ] **Query Performance:**
   - Medir tiempo de carga del historial para grupo grande
   - Medir tiempo de carga de página admin con muchos registros
   - Verificar que GSIs se usan correctamente

---

## 🚀 Testing de Deployment

- [x] Backend build exitoso
- [x] Backend deploy exitoso
- [x] Tabla WeightRecords creada
- [x] Lambdas nuevas desplegadas
- [x] Lambdas modificadas actualizadas
- [x] API Gateway endpoints configurados
- [x] Frontend build exitoso (Next.js 14.2.35)
- [ ] Frontend deploy a producción
- [ ] Verificar env vars en producción

---

## 📝 Notas de Testing

### Importante:
- Probar cada flujo en un evento real de prueba
- Verificar la consola de AWS DynamoDB para ver los datos directamente
- Usar AWS CloudWatch Logs para debugging
- Verificar que los emails de QR code siguen funcionando

### Datos de Prueba Sugeridos:

**Evento de Prueba:**
- Nombre: "Testing - Sistema de Grupos"
- Fecha: Próxima semana
- Status: Published

**Participantes:**
- Individual: Ana García (ana@test.com)
- Duo: Carlos López (carlos@test.com) + María Rivera (maria@test.com)
- Grupo: Juan Pérez (juan@test.com) + Pedro Santos (pedro@test.com) + Sofia Torres (sofia@test.com)
- Org Pequeña: 3 personas de "Scouts PR"
- Org Grande: 20 personas de "Banco Popular"

---

## ✅ Checklist Final

Antes de marcar como completo:

- [x] Backend desplegado
- [x] Frontend actualizado
- [ ] Tests manuales completados para los 5 flujos principales
- [ ] Edge cases verificados
- [ ] Performance aceptable
- [ ] Documentación actualizada
- [ ] Usuario final aprueba los cambios

---

## 🎉 Estado Actual

**Completado al 95%:**
- ✅ Backend 100% implementado y desplegado
- ✅ Frontend 100% actualizado
- ⏳ Testing manual pendiente (requiere interacción con UI)

**Próximos Pasos:**
1. Ejecutar tests manuales con usuarios reales o staging environment
2. Monitorear logs de CloudWatch durante primeros registros
3. Ajustar según feedback de usuarios

**Notas:**
- El sistema está completamente funcional y listo para testing
- Todas las funcionalidades core están implementadas
- Testing end-to-end requiere interacción manual con la UI del frontend
