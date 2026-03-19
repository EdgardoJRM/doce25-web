# Ejemplos de Uso - Skills Instalados

## 🎨 UI/UX Pro Max - Ejemplos

### Ejemplo 1: Landing Page para SaaS
```
Build a landing page for a project management SaaS product with dark mode
```

**Resultado esperado:**
- Sistema de diseño automático
- Paleta de colores profesional
- Tipografía elegante
- Componentes React/Next.js listos para usar
- Validaciones de accesibilidad

---

### Ejemplo 2: Dashboard de Analytics
```
Create a healthcare analytics dashboard with real-time data visualization
```

**Resultado esperado:**
- Diseño optimizado para datos
- Gráficos y visualizaciones
- Tema claro/oscuro
- Componentes de tabla y métricas

---

### Ejemplo 3: Portfolio Personal
```
Design a creative portfolio website for a photographer with a modern aesthetic
```

**Resultado esperado:**
- Galería de imágenes
- Secciones de portafolio
- Contacto y redes sociales
- Animaciones suaves

---

### Ejemplo 4: E-commerce
```
Build an e-commerce landing page for luxury fashion with premium feel
```

**Resultado esperado:**
- Hero section impactante
- Catálogo de productos
- Carrito de compras
- Checkout optimizado

---

## 🍌 Nano Banana 2 - Ejemplos

### Ejemplo 1: Generar una imagen simple
```bash
./generate-image.sh "a futuristic cityscape at sunset with flying cars"
```

### Ejemplo 2: Múltiples imágenes
```bash
./generate-image.sh "minimalist logo design for a coffee shop" 4
```

### Ejemplo 3: Imagen panorámica
```bash
./generate-image.sh "mountain landscape with northern lights" 1 16:9
```

### Ejemplo 4: Alta resolución
```bash
./generate-image.sh "detailed medieval castle illustration" 1 1:1 4K
```

### Ejemplo 5: Usando infsh directamente
```bash
# Generación básica
infsh app run google/gemini-3-1-flash-image-preview --input '{
  "prompt": "a banana in space, photorealistic"
}'

# Con múltiples opciones
infsh app run google/gemini-3-1-flash-image-preview --input '{
  "prompt": "Minimalist logo design for a coffee shop",
  "num_images": 4,
  "aspect_ratio": "1:1",
  "resolution": "2K"
}'

# Editar imagen existente
infsh app run google/gemini-3-1-flash-image-preview --input '{
  "prompt": "Add a rainbow in the sky",
  "images": ["https://example.com/landscape.jpg"]
}'
```

---

## 💡 Casos de Uso Combinados

### Caso 1: Crear Landing Page + Generar Imágenes
1. Usa **UI/UX Pro Max** para diseñar la estructura
2. Usa **Nano Banana 2** para generar imágenes hero personalizadas
3. Integra todo en tu proyecto

### Caso 2: Diseño de Marca Completo
1. Genera paleta de colores con **UI/UX Pro Max**
2. Crea assets visuales con **Nano Banana 2**
3. Implementa el sistema de diseño

### Caso 3: Prototipado Rápido
1. Pide a **UI/UX Pro Max** un prototipo completo
2. Genera imágenes de demostración con **Nano Banana 2**
3. Presenta al cliente en minutos

---

## 🚀 Tips Profesionales

### Para UI/UX Pro Max:
- Especifica el tipo de industria para mejores recomendaciones
- Menciona el stack tecnológico (React, Vue, Svelte, etc.)
- Pide validaciones de accesibilidad (WCAG AA)
- Solicita componentes reutilizables

### Para Nano Banana 2:
- Usa prompts descriptivos y específicos
- Especifica el estilo (photorealistic, illustration, watercolor, etc.)
- Usa aspect ratios apropiados para el contexto
- Genera múltiples versiones para elegir la mejor

---

## 📚 Documentación Completa

- **UI/UX Pro Max**: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- **Nano Banana 2**: https://skills.sh/tul-sh/skills/nano-banana-2

---

**Última actualización:** 7 de Marzo, 2026
