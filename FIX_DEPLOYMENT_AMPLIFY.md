# 🔧 Correcciones para Deployment en AWS Amplify

## Problemas Identificados y Solucionados

### 1. ❌ `output: 'standalone'` (CRÍTICO)
**Problema:** Next.js con `output: 'standalone'` genera una estructura incompatible con Amplify Hosting. Amplify ejecuta `next start` que requiere el output estándar.

**Solución:** Eliminado de `next.config.js`

### 2. ❌ Carpeta "Fotos doce25" - 81MB en el repo (CRÍTICO)
**Problema:** 51 archivos JPEG (81MB) en el repositorio causaban:
- Timeouts en el build de Amplify
- Límites de tamaño excedidos
- Deployments lentos o fallidos

**Solución:** 
- Agregada a `.gitignore`
- Eliminada del tracking con `git rm -r --cached`
- Galería actualizada para usar `/hero/` e `/images/` que sí existen

### 3. ✅ Galería actualizada
**Antes:** Referenciaba 51 fotos en `/Fotos doce25/` (no en public)
**Ahora:** Usa las 7 fotos existentes en `/hero/` e `/images/`

### 4. ✅ .nvmrc agregado
Especifica Node 18 para consistencia en Amplify.

---

## Cómo agregar más fotos a la galería

1. Copia fotos optimizadas a `public/galeria/`
2. Actualiza el array en `app/galeria/page.tsx`
3. Mantén las fotos < 500KB cada una para buen rendimiento

---

## Verificación del Build

```bash
npm run build
```

Debe completar sin errores.



## Problemas Identificados y Solucionados

### 1. ❌ `output: 'standalone'` (CRÍTICO)
**Problema:** Next.js con `output: 'standalone'` genera una estructura incompatible con Amplify Hosting. Amplify ejecuta `next start` que requiere el output estándar.

**Solución:** Eliminado de `next.config.js`

### 2. ❌ Carpeta "Fotos doce25" - 81MB en el repo (CRÍTICO)
**Problema:** 51 archivos JPEG (81MB) en el repositorio causaban:
- Timeouts en el build de Amplify
- Límites de tamaño excedidos
- Deployments lentos o fallidos

**Solución:** 
- Agregada a `.gitignore`
- Eliminada del tracking con `git rm -r --cached`
- Galería actualizada para usar `/hero/` e `/images/` que sí existen

### 3. ✅ Galería actualizada
**Antes:** Referenciaba 51 fotos en `/Fotos doce25/` (no en public)
**Ahora:** Usa las 7 fotos existentes en `/hero/` e `/images/`

### 4. ✅ .nvmrc agregado
Especifica Node 18 para consistencia en Amplify.

---

## Cómo agregar más fotos a la galería

1. Copia fotos optimizadas a `public/galeria/`
2. Actualiza el array en `app/galeria/page.tsx`
3. Mantén las fotos < 500KB cada una para buen rendimiento

---

## Verificación del Build

```bash
npm run build
```

Debe completar sin errores.

