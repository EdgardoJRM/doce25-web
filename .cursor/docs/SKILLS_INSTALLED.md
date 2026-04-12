# Skills Instalados en Doce25 - Web

## ✅ Instalación Completada

Se han instalado exitosamente dos skills en tu workspace:

### 1. **UI/UX Pro Max** 🎨
**Ubicación:** `.cursor/skills/ui-ux-pro-max/`

Un skill de diseño UI/UX profesional con:
- **67 estilos UI** (Glassmorphism, Claymorphism, Minimalism, Brutalism, etc.)
- **96 paletas de colores** específicas por industria
- **57 combinaciones tipográficas** con Google Fonts
- **100 reglas de razonamiento** para generar sistemas de diseño automáticamente
- **13 stacks tecnológicos** soportados (React, Next.js, Vue, Svelte, SwiftUI, Flutter, etc.)

#### Cómo usar:
```
Build a landing page for my SaaS product
```

```
Create a dashboard for healthcare analytics
```

```
Design a portfolio website with dark mode
```

El skill generará automáticamente:
- Sistema de diseño completo
- Recomendaciones de estilo y colores
- Código implementado con mejores prácticas
- Validaciones de accesibilidad

---

### 2. **Nano Banana 2** 🍌
**Ubicación:** `~/.agents/skills/nano-banana-2/`

Generador de imágenes con Google Gemini 3.1 Flash Image Preview.

#### Requisitos:
Necesitas instalar `inference.sh` CLI:
```bash
npm install -g @inference-sh/cli
# o
infsh login
```

#### Cómo usar:
```bash
# Generación básica
infsh app run google/gemini-3-1-flash-image-preview --input '{"prompt": "a banana in space, photorealistic"}'

# Múltiples imágenes
infsh app run google/gemini-3-1-flash-image-preview --input '{
  "prompt": "Minimalist logo design for a coffee shop",
  "num_images": 4
}'

# Con relación de aspecto personalizada
infsh app run google/gemini-3-1-flash-image-preview --input '{
  "prompt": "Panoramic mountain landscape with northern lights",
  "aspect_ratio": "16:9"
}'

# Alta resolución (4K)
infsh app run google/gemini-3-1-flash-image-preview --input '{
  "prompt": "Detailed illustration of a medieval castle",
  "resolution": "4K"
}'
```

#### Opciones disponibles:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `prompt` | string | **Requerido.** Qué generar o cambiar |
| `images` | array | Imágenes de entrada para editar (hasta 14) |
| `num_images` | integer | Número de imágenes a generar |
| `aspect_ratio` | string | "1:1", "16:9", "9:16", "4:3", "3:4", "auto" |
| `resolution` | string | "1K", "2K", "4K" (default: 1K) |
| `enable_google_search` | boolean | Habilitar información en tiempo real |

---

## 📋 Próximos Pasos

### Para UI/UX Pro Max:
1. Reinicia Cursor
2. Prueba con: `"Build a landing page for a SaaS product"`
3. El skill generará automáticamente un sistema de diseño completo

### Para Nano Banana 2:
1. Instala `inference.sh` CLI:
   ```bash
   npm install -g @inference-sh/cli
   infsh login
   ```
2. Usa los comandos de generación de imágenes arriba

---

## 🔗 Referencias

- **UI/UX Pro Max**: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- **Nano Banana 2**: https://skills.sh/tul-sh/skills/nano-banana-2

---

## ⚠️ Notas de Seguridad

El skill `nano-banana-2` tiene alertas de seguridad reportadas. Revisa los detalles en:
https://skills.sh/tul-sh/skills

Úsalo solo si confías en la fuente y entiendes los riesgos.

---

**Instalado:** 7 de Marzo, 2026
**Workspace:** /Users/gardo/Doce25 - Web
