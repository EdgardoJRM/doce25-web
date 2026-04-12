# Configuración de Nano Banana 2

## 🔧 Instalación de inference.sh CLI

Para usar **Nano Banana 2**, necesitas instalar `inference.sh` CLI.

### Opción 1: Instalación Global (Recomendado)

```bash
npm install -g @inference-sh/cli
```

### Opción 2: Instalación Local en el Proyecto

```bash
cd "/Users/gardo/Doce25 - Web"
npm install @inference-sh/cli
```

---

## 🔑 Autenticación

Después de instalar, necesitas autenticarte:

```bash
infsh login
```

Esto te pedirá:
1. Tu email
2. Una contraseña o token de API
3. Confirmación

---

## ✅ Verificar Instalación

```bash
# Verificar que infsh está instalado
infsh --version

# Listar aplicaciones disponibles
infsh app list

# Listar solo aplicaciones de generación de imágenes
infsh app list --category image
```

---

## 🚀 Uso Básico

### Desde Terminal

```bash
# Generación simple
infsh app run google/gemini-3-1-flash-image-preview --input '{
  "prompt": "a banana in space, photorealistic"
}'
```

### Usando el Script Incluido

```bash
# Ir al directorio del proyecto
cd "/Users/gardo/Doce25 - Web"

# Generar una imagen
./generate-image.sh "a futuristic cityscape at sunset"

# Generar 4 imágenes
./generate-image.sh "minimalist logo design" 4

# Generar con relación 16:9
./generate-image.sh "mountain landscape" 1 16:9

# Generar en 4K
./generate-image.sh "detailed castle" 1 1:1 4K
```

---

## 📝 Ejemplos de Prompts Efectivos

### Estilos
- `photorealistic` - Foto realista
- `illustration` - Ilustración
- `watercolor` - Acuarela
- `oil painting` - Óleo
- `digital art` - Arte digital
- `anime` - Estilo anime
- `3D render` - Renderizado 3D

### Composición
- `close-up` - Primer plano
- `wide shot` - Plano general
- `aerial view` - Vista aérea
- `macro` - Macro fotografía
- `portrait` - Retrato
- `landscape` - Paisaje

### Iluminación
- `natural light` - Luz natural
- `studio lighting` - Iluminación de estudio
- `golden hour` - Hora dorada
- `dramatic shadows` - Sombras dramáticas
- `neon` - Neón

### Ejemplo Completo
```
"A futuristic cyberpunk cityscape at night with neon signs, 
flying cars, and dramatic shadows, photorealistic, 4K, 
wide shot, cinematic lighting"
```

---

## 🎯 Casos de Uso

### 1. Generar Hero Images para Landing Pages
```bash
./generate-image.sh "modern SaaS dashboard interface, clean design, blue and white colors, professional, 4K" 1 16:9 4K
```

### 2. Crear Assets para Marketing
```bash
./generate-image.sh "luxury product photography, gold accents, minimalist background, professional lighting" 3 1:1 2K
```

### 3. Diseño de Portada
```bash
./generate-image.sh "abstract geometric design, vibrant colors, modern art, digital illustration" 1 16:9 4K
```

### 4. Iconografía
```bash
./generate-image.sh "minimalist icon set, flat design, 5 different icons, clean lines, professional" 1 1:1 2K
```

---

## 🔗 Recursos

- **Documentación oficial**: https://skills.sh/tul-sh/skills/nano-banana-2
- **Inference.sh CLI**: https://inference.sh
- **Google Gemini 3.1 Flash**: https://ai.google.dev

---

## ⚠️ Limitaciones y Consideraciones

- **Límite de imágenes**: Hasta 14 imágenes de entrada para edición
- **Resoluciones**: 1K, 2K, 4K disponibles
- **Aspect ratios**: 1:1, 16:9, 9:16, 4:3, 3:4, auto
- **Tiempo de generación**: Varía según complejidad y resolución
- **Cuota**: Verifica tu plan en inference.sh

---

## 🐛 Solución de Problemas

### Error: "infsh: command not found"
```bash
# Reinstalar globalmente
npm install -g @inference-sh/cli

# O usar npx
npx @inference-sh/cli app run google/gemini-3-1-flash-image-preview --input '{...}'
```

### Error: "Not authenticated"
```bash
# Volver a autenticarse
infsh login
```

### Error: "App not found"
```bash
# Listar apps disponibles
infsh app list

# Buscar apps de imagen
infsh app list --category image
```

---

**Configurado:** 7 de Marzo, 2026
**Workspace:** /Users/gardo/Doce25 - Web
