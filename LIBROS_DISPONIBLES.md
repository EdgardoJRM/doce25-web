# 📚 LIBROS DISPONIBLES EN LA BIBLIOTECA DIGITAL

**Fecha de actualización:** 16 de febrero de 2026  
**Total de libros:** 6  
**Total de páginas:** 203  
**Estado:** ✅ TODOS SUBIDOS Y FUNCIONANDO

---

## 📖 Catálogo de Libros

### 1. Glosario de Palabras
- **Slug:** `glosario-palabras`
- **Páginas:** 24
- **Endpoint:** `https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url?libro=glosario-palabras&pagina=1`
- **S3 Path:** `s3://biblioteca-pdfs-edgardohernandez/biblioteca/glosario-palabras/`

### 2. Guía del Cliente Ideal
- **Slug:** `guia-cliente-ideal`
- **Páginas:** 23
- **Endpoint:** `https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url?libro=guia-cliente-ideal&pagina=1`
- **S3 Path:** `s3://biblioteca-pdfs-edgardohernandez/biblioteca/guia-cliente-ideal/`

### 3. Guía de Segmentación
- **Slug:** `guia-segmentar`
- **Páginas:** 17
- **Endpoint:** `https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url?libro=guia-segmentar&pagina=1`
- **S3 Path:** `s3://biblioteca-pdfs-edgardohernandez/biblioteca/guia-segmentar/`

### 4. Material de Apoyo - Duplica
- **Slug:** `material-apoyo-duplica`
- **Páginas:** 105 📕 (¡El más grande!)
- **Endpoint:** `https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url?libro=material-apoyo-duplica&pagina=1`
- **S3 Path:** `s3://biblioteca-pdfs-edgardohernandez/biblioteca/material-apoyo-duplica/`

### 5. Persuasión Peligrosa ⭐
- **Slug:** `persuasion-peligrosa`
- **Páginas:** 19
- **Endpoint:** `https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url?libro=persuasion-peligrosa&pagina=1`
- **S3 Path:** `s3://biblioteca-pdfs-edgardohernandez/biblioteca/persuasion-peligrosa/`
- **Nota:** Este es el libro que estabas buscando originalmente

### 6. Títulos Imprescindibles
- **Slug:** `titulos-imprescindibles`
- **Páginas:** 15
- **Endpoint:** `https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url?libro=titulos-imprescindibles&pagina=1`
- **S3 Path:** `s3://biblioteca-pdfs-edgardohernandez/biblioteca/titulos-imprescindibles/`

---

## 🧪 Probar los Libros

### Desde Terminal:

```bash
# Glosario de Palabras
curl "https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url?libro=glosario-palabras&pagina=1"

# Guía del Cliente Ideal
curl "https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url?libro=guia-cliente-ideal&pagina=1"

# Guía de Segmentación
curl "https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url?libro=guia-segmentar&pagina=1"

# Material de Apoyo - Duplica
curl "https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url?libro=material-apoyo-duplica&pagina=1"

# Persuasión Peligrosa
curl "https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url?libro=persuasion-peligrosa&pagina=1"

# Títulos Imprescindibles
curl "https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url?libro=titulos-imprescindibles&pagina=1"
```

### Desde el Navegador:

Simplemente abre cualquiera de los HTMLs en la carpeta `lectores/`:
- `lector-glosario-palabras.html`
- `lector-guia-cliente-ideal.html`
- `lector-guia-segmentar.html`
- `lector-material-apoyo-duplica.html`
- `lector-persuasion-peligrosa.html`
- `lector-titulos-imprescindibles.html`

---

## 📊 Estadísticas

| Libro | Páginas | Tamaño Aprox. | Estado |
|-------|---------|---------------|--------|
| Glosario de Palabras | 24 | ~2.4 MB | ✅ |
| Guía del Cliente Ideal | 23 | ~2.3 MB | ✅ |
| Guía de Segmentación | 17 | ~1.7 MB | ✅ |
| Material de Apoyo - Duplica | 105 | ~10.5 MB | ✅ |
| Persuasión Peligrosa | 19 | ~1.9 MB | ✅ |
| Títulos Imprescindibles | 15 | ~1.5 MB | ✅ |
| **TOTAL** | **203** | **~20.3 MB** | **✅** |

---

## 🔗 URLs Base

**API Endpoint:**
```
https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url
```

**Parámetros:**
- `libro`: Nombre del libro (slug)
- `pagina`: Número de página (1 a N)

**Ejemplo:**
```
https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url?libro=persuasion-peligrosa&pagina=5
```

---

## 📝 Código Base para Cualquier Libro

```javascript
const LIBROS = {
  'glosario-palabras': { nombre: 'Glosario de Palabras', paginas: 24 },
  'guia-cliente-ideal': { nombre: 'Guía del Cliente Ideal', paginas: 23 },
  'guia-segmentar': { nombre: 'Guía de Segmentación', paginas: 17 },
  'material-apoyo-duplica': { nombre: 'Material de Apoyo - Duplica', paginas: 105 },
  'persuasion-peligrosa': { nombre: 'Persuasión Peligrosa', paginas: 19 },
  'titulos-imprescindibles': { nombre: 'Títulos Imprescindibles', paginas: 15 }
};

// Usar cualquier libro
const libroActual = 'persuasion-peligrosa';
const libro = LIBROS[libroActual];
const totalPages = libro.paginas;
const apiBase = "https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url";

async function cargarPagina(pagina) {
  const res = await fetch(`${apiBase}?libro=${libroActual}&pagina=${pagina}`);
  const data = await res.json();
  return data.url;
}
```

---

## 🛠️ Gestión de Libros

### Agregar un nuevo libro:

```bash
# 1. Convierte el PDF a páginas JPG
cd /Users/gardo/Desktop/convertidor-pdf
python convertir_todos.py

# 2. Sube el nuevo libro
aws s3 sync ./nuevo-libro-pages/ \
  s3://biblioteca-pdfs-edgardohernandez/biblioteca/nuevo-libro/

# 3. Verifica
aws s3 ls s3://biblioteca-pdfs-edgardohernandez/biblioteca/nuevo-libro/
```

### Eliminar un libro:

```bash
# Eliminar completamente un libro
aws s3 rm s3://biblioteca-pdfs-edgardohernandez/biblioteca/NOMBRE-LIBRO/ --recursive
```

### Ver libros disponibles:

```bash
aws s3 ls s3://biblioteca-pdfs-edgardohernandez/biblioteca/
```

### Contar páginas de un libro:

```bash
aws s3 ls s3://biblioteca-pdfs-edgardohernandez/biblioteca/persuasion-peligrosa/ | wc -l
```

---

## 🔒 Seguridad

Todos los libros están protegidos con:

1. ✅ **URLs Firmadas** - Expiran en 5 minutos
2. ✅ **Watermark Dinámico** - Fecha y hora en tiempo real
3. ✅ **Bloqueo de Screenshots**
4. ✅ **Click Derecho Deshabilitado**
5. ✅ **Ocultar al cambiar pestaña**
6. ✅ **Anti-drag y anti-select**

---

## 💰 Costos Estimados

### Almacenamiento S3:
- **203 archivos** (~20 MB total)
- **Costo:** ~$0.005/mes
- **Clase de almacenamiento:** Standard

### Lambda Invocations:
- **1 millón de requests gratuitas/mes**
- **Costo adicional:** $0.20 por millón después del free tier

### API Gateway:
- **1 millón de requests gratuitas/mes** (primer año)
- **Costo adicional:** $3.50 por millón después del free tier

**Costo estimado mensual:** < $1 para uso moderado (dentro del free tier)

---

## 📱 Responsivo y Móvil

Todos los lectores son completamente responsivos:
- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablet (iPad, Android Tablets)
- ✅ Móvil (iPhone, Android)

### Navegación por Teclado (Desktop):
- `←` / `→` : Navegar páginas
- `Home` : Primera página
- `End` : Última página

### Navegación Táctil (Móvil):
- Botones grandes y táctiles
- Input numérico para ir a página específica
- Responsive design optimizado

---

## 🎨 Personalización

Para personalizar el lector de cualquier libro, edita estas variables en el HTML:

```javascript
// Configuración del libro
const libro = "persuasion-peligrosa";  // Cambia aquí
const totalPages = 19;                  // Cambia aquí
const tituloLibro = "Persuasión Peligrosa";  // Cambia aquí

// Tema de colores (opcional)
const colorPrimario = "#667eea";
const colorSecundario = "#764ba2";
```

---

## 📞 Soporte

Si algo no funciona:

1. **Verifica el sistema:**
   ```bash
   cd "/Users/gardo/Doce25 - Web"
   ./scripts/verificar-biblioteca.sh
   ```

2. **Revisa logs:**
   ```bash
   aws logs tail /aws/lambda/GenerarURLFirmada --follow
   ```

3. **Lista los archivos:**
   ```bash
   aws s3 ls s3://biblioteca-pdfs-edgardohernandez/biblioteca/ --recursive
   ```

---

## ✅ Estado del Sistema

```
✅ Bucket S3: OPERACIONAL
✅ API Gateway: OPERACIONAL  
✅ Lambda Function: OPERACIONAL
✅ 6 Libros: DISPONIBLES
✅ 203 Páginas: ACCESIBLES
```

**Última verificación:** 16 de febrero de 2026, 18:40 UTC

---

¡Disfruta de tu biblioteca digital! 📚✨

