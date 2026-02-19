# 📸 Imágenes Principales del Website

## Imágenes Disponibles

### 1. `doce25-hero-main.jpg` (657KB)
**Uso principal:** Hero section, banners principales, landing pages
- **Tamaño optimizado:** 1920px de ancho
- **Ubicación actual:** Hero section (primera imagen del carrusel)
- **Dónde usar:**
  - Hero section principal
  - Landing pages de eventos importantes
  - Banners promocionales
  - Backgrounds de secciones destacadas

### 2. `doce25-featured.jpg` (812KB)
**Uso principal:** Secciones destacadas, about us, galería
- **Tamaño optimizado:** 1920px de ancho
- **Dónde usar:**
  - Sección "Sobre Nosotros"
  - Galería de fotos
  - Cards de eventos destacados
  - Secciones de impacto

## Cómo Usar en Componentes

```tsx
import Image from 'next/image'

// En cualquier componente
<Image
  src="/images/doce25-hero-main.jpg"
  alt="Doce25 - Limpieza de playas"
  width={1920}
  height={1080}
  className="object-cover"
/>
```

## Optimización

- ✅ Imágenes optimizadas para web (reducidas de ~20-30MB a ~600-800KB)
- ✅ Formato JPG para mejor compresión
- ✅ Ancho máximo: 1920px (Full HD)
- ✅ Listas para uso responsive con Next.js Image

## Actualización

Si necesitas actualizar estas imágenes:
1. Coloca la nueva imagen en `/public/images/`
2. Mantén el mismo nombre o actualiza las referencias en los componentes
3. Optimiza con: `sips -s format jpeg -Z 1920 [imagen-original] --out [destino]`



## Imágenes Disponibles

### 1. `doce25-hero-main.jpg` (657KB)
**Uso principal:** Hero section, banners principales, landing pages
- **Tamaño optimizado:** 1920px de ancho
- **Ubicación actual:** Hero section (primera imagen del carrusel)
- **Dónde usar:**
  - Hero section principal
  - Landing pages de eventos importantes
  - Banners promocionales
  - Backgrounds de secciones destacadas

### 2. `doce25-featured.jpg` (812KB)
**Uso principal:** Secciones destacadas, about us, galería
- **Tamaño optimizado:** 1920px de ancho
- **Dónde usar:**
  - Sección "Sobre Nosotros"
  - Galería de fotos
  - Cards de eventos destacados
  - Secciones de impacto

## Cómo Usar en Componentes

```tsx
import Image from 'next/image'

// En cualquier componente
<Image
  src="/images/doce25-hero-main.jpg"
  alt="Doce25 - Limpieza de playas"
  width={1920}
  height={1080}
  className="object-cover"
/>
```

## Optimización

- ✅ Imágenes optimizadas para web (reducidas de ~20-30MB a ~600-800KB)
- ✅ Formato JPG para mejor compresión
- ✅ Ancho máximo: 1920px (Full HD)
- ✅ Listas para uso responsive con Next.js Image

## Actualización

Si necesitas actualizar estas imágenes:
1. Coloca la nueva imagen en `/public/images/`
2. Mantén el mismo nombre o actualiza las referencias en los componentes
3. Optimiza con: `sips -s format jpeg -Z 1920 [imagen-original] --out [destino]`


