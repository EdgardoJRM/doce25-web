# 📸 Instrucciones para Subir Fotos del Hero

## ✅ Opción Recomendada: Carpeta `public/hero/` (GRATIS)

Esta es la forma más barata - **completamente gratis** con tu hosting de Amplify.

### Paso 1: Preparar las Fotos

1. **Selecciona 3-5 fotos del club** de tus mejores limpiezas de playa
2. **Optimiza las imágenes** antes de subirlas:
   - Resolución recomendada: **1920x1080 px** (Full HD)
   - Formato: **JPG** (mejor compresión que PNG para fotos)
   - Calidad: **80-85%** (balance perfecto calidad/tamaño)
   - Peso ideal: **200-500 KB** por imagen

### Herramientas para Optimizar (Gratis):
- **TinyPNG**: https://tinypng.com/ (arrastra y suelta)
- **Squoosh**: https://squoosh.app/ (más control)
- **ImageOptim** (Mac): https://imageoptim.com/mac

### Paso 2: Renombrar las Fotos

Renombra tus fotos así:
```
hero-1.jpg
hero-2.jpg
hero-3.jpg
hero-4.jpg (opcional)
hero-5.jpg (opcional)
```

### Paso 3: Subir las Fotos

**Opción A: Usando Cursor/VS Code**
1. Abre la carpeta del proyecto en Cursor
2. Ve a: `public/hero/`
3. Arrastra y suelta tus fotos ahí
4. Haz commit y push:
   ```bash
   git add public/hero/
   git commit -m "📸 Agregar fotos del club al hero"
   git push origin main
   ```

**Opción B: Usando Terminal**
```bash
# Desde tu carpeta de fotos
cp hero-1.jpg hero-2.jpg hero-3.jpg "/Users/gardo/Doce25 - Web/public/hero/"

# Luego hacer commit
cd "/Users/gardo/Doce25 - Web"
git add public/hero/
git commit -m "📸 Agregar fotos del club al hero"
git push origin main
```

### Paso 4: Actualizar el Código (Si tienes más/menos de 3 fotos)

Si subes un número diferente de fotos, actualiza el archivo `components/Hero.tsx`:

```typescript
// Línea 8-13
const heroImages = [
  '/hero/hero-1.jpg',
  '/hero/hero-2.jpg',
  '/hero/hero-3.jpg',
  '/hero/hero-4.jpg',  // Agregar o quitar según necesites
  '/hero/hero-5.jpg',
]
```

## 🎨 Características del Hero Actualizado

- ✅ **Carrusel automático**: Cambia de foto cada 5 segundos
- ✅ **Transición suave**: Fade in/out entre imágenes
- ✅ **Optimizado**: Usa Next.js Image para mejor rendimiento
- ✅ **Responsive**: Se adapta a todos los tamaños de pantalla
- ✅ **Overlay oscuro**: Para que el texto sea legible sobre cualquier foto

## 💰 Comparación de Costos

| Opción | Costo Mensual | Pros | Contras |
|--------|---------------|------|---------|
| **public/ (Amplify)** | **$0** | Gratis, fácil, rápido | Solo para imágenes estáticas |
| S3 + CloudFront | ~$0.50-2 | Escalable, CDN | Requiere configuración |
| Cloudinary | $0 (hasta 25GB) | Transformaciones automáticas | Límite gratuito |
| ImgIX | Desde $10/mes | Muy potente | Más caro |

## 📝 Tips Importantes

1. **Usa fotos horizontales** (landscape) para mejor composición
2. **Evita fotos con texto importante** - el overlay oscuro puede taparlo
3. **Selecciona fotos con acción** - personas limpiando, equipos trabajando
4. **Variedad de colores** - diferentes ubicaciones se ven mejor
5. **Verifica el peso** - Idealmente todas las fotos juntas < 2MB

## 🚀 Deploy Automático

Una vez hagas push, Amplify desplegará automáticamente en ~3-5 minutos.
Puedes verificar en: https://console.aws.amazon.com/amplify/

## ❓ ¿Necesitas Ayuda?

Si tienes problemas:
1. Verifica que las fotos estén en `public/hero/`
2. Confirma que los nombres coincidan exactamente
3. Revisa que sean formato `.jpg` (no `.jpeg` o `.JPG`)
4. Asegúrate de que el push se hizo correctamente

¡Listo! Las fotos del Tortuga Club PR brillarán en el hero 🌊🐢

