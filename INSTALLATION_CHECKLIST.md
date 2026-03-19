# ✅ Checklist de Instalación

## Verificación de Instalación

### UI/UX Pro Max
- [x] CLI `uipro-cli` instalado globalmente
- [x] Skill instalado en `.cursor/skills/ui-ux-pro-max/`
- [x] Archivos de datos y scripts presentes
- [x] Listo para usar en Cursor

**Verificar:**
```bash
ls -la "/Users/gardo/Doce25 - Web/.cursor/skills/ui-ux-pro-max/"
```

---

### Nano Banana 2
- [x] Skill instalado en `~/.agents/skills/nano-banana-2/`
- [ ] `inference.sh` CLI instalado (PENDIENTE)
- [ ] Autenticación completada (PENDIENTE)
- [ ] Script `generate-image.sh` creado

**Verificar:**
```bash
ls -la ~/.agents/skills/nano-banana-2/
```

---

## Tareas Pendientes

### 1. Instalar inference.sh CLI
```bash
npm install -g @inference-sh/cli
```

**Verificar:**
```bash
infsh --version
```

### 2. Autenticarse en inference.sh
```bash
infsh login
```

Necesitarás:
- Email
- Contraseña o token de API

### 3. Reiniciar Cursor
- Cierra Cursor completamente
- Reabre Cursor
- Los skills deberían estar disponibles

---

## Pruebas de Funcionalidad

### Test 1: UI/UX Pro Max
En Cursor, escribe:
```
Build a landing page for a fitness app
```

**Resultado esperado:**
- Sistema de diseño generado automáticamente
- Recomendaciones de colores y tipografía
- Código implementado

### Test 2: Nano Banana 2
En terminal:
```bash
cd "/Users/gardo/Doce25 - Web"
./generate-image.sh "a beautiful sunset over mountains"
```

**Resultado esperado:**
- Imagen generada exitosamente
- Guardada en el directorio de salida

---

## Archivos Creados

```
/Users/gardo/Doce25 - Web/
├── README_SKILLS.md              ← Resumen general
├── SKILLS_INSTALLED.md           ← Guía de instalación
├── EXAMPLES_SKILLS.md            ← Ejemplos de uso
├── NANO_BANANA_SETUP.md          ← Configuración detallada
├── INSTALLATION_CHECKLIST.md     ← Este archivo
└── generate-image.sh             ← Script para generar imágenes
```

---

## Estructura de Skills

```
.cursor/skills/
└── ui-ux-pro-max/
    ├── SKILL.md
    ├── data/
    ├── scripts/
    └── templates/

~/.agents/skills/
└── nano-banana-2/
    ├── SKILL.md
    └── ...
```

---

## Comandos Útiles

### Ver todos los skills instalados
```bash
# Globales
ls -la ~/.agents/skills/

# Locales en el proyecto
ls -la "/Users/gardo/Doce25 - Web/.cursor/skills/"
```

### Actualizar skills
```bash
# UI/UX Pro Max
uipro update

# Nano Banana 2
npx skills update
```

### Desinstalar skills (si es necesario)
```bash
# UI/UX Pro Max
rm -rf "/Users/gardo/Doce25 - Web/.cursor/skills/ui-ux-pro-max/"

# Nano Banana 2
rm -rf ~/.agents/skills/nano-banana-2/
```

---

## Solución de Problemas

### Problema: Skills no aparecen en Cursor
**Solución:**
1. Reinicia Cursor completamente
2. Verifica que los archivos existan:
   ```bash
   ls -la "/Users/gardo/Doce25 - Web/.cursor/skills/"
   ```
3. Revisa la consola de Cursor para errores

### Problema: "infsh: command not found"
**Solución:**
```bash
npm install -g @inference-sh/cli
# O usa npx
npx @inference-sh/cli --version
```

### Problema: Error de autenticación en Nano Banana 2
**Solución:**
```bash
infsh logout
infsh login
```

---

## Recursos

- **UI/UX Pro Max Docs**: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- **Nano Banana 2 Docs**: https://skills.sh/tul-sh/skills/nano-banana-2
- **Inference.sh Docs**: https://inference.sh

---

## Notas

- UI/UX Pro Max está completamente funcional
- Nano Banana 2 requiere configuración adicional (inference.sh CLI)
- Ambos skills se actualizan automáticamente
- Los skills tienen acceso completo a los permisos del agente

---

**Última actualización:** 7 de Marzo, 2026
**Estado:** ✅ Instalación completada (Nano Banana 2 requiere configuración)
