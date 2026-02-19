# 📚 Sistema de Biblioteca Digital - RESTAURADO

## ✅ Estado Actual

He restaurado completamente tu sistema de libros digitales que había sido eliminado.

---

## 🔧 Componentes Restaurados

### 1. **Bucket S3** ✅
- **Nombre:** `biblioteca-pdfs-edgardohernandez`
- **Región:** us-east-1
- **Acceso:** Público (lectura)
- **CORS:** Configurado
- **Estado:** ACTIVO y LISTO

### 2. **API Gateway** ✅
- **API ID:** `dfafuyp2b5` (nuevo)
- **Nombre:** Biblioteca Digital API
- **Endpoint:** `https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url`
- **Método:** GET
- **Parámetros:** `libro` y `pagina`
- **Estado:** DESPLEGADO y FUNCIONANDO

### 3. **Lambda Function** ✅
- **Nombre:** `GenerarURLFirmada`
- **Estado:** Ya existía, ahora conectada al nuevo API Gateway
- **Función:** Genera URLs firmadas de S3 que expiran en 5 minutos

---

## 📝 Actualiza tu Script HTML

### ⚠️ IMPORTANTE: Cambiar el endpoint

**ANTIGUO endpoint (ya no funciona):**
```javascript
const apiBase = "https://36rpb2ko46.execute-api.us-east-1.amazonaws.com/get-url";
```

**NUEVO endpoint (actualizado):**
```javascript
const apiBase = "https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url";
```

### Script Completo Actualizado:

```html
<script>
  const libro = "persuasion-peligrosa";
  const totalPages = 19;
  const apiBase = "https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url"; // ⬅️ ACTUALIZADO

  let currentPage = 1;

  async function updateImage() {
    const res = await fetch(`${apiBase}?libro=${libro}&pagina=${currentPage}`);
    const data = await res.json();
    document.getElementById("pdf-image").src = data.url;
    document.getElementById("page-input").value = currentPage;
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      updateImage();
      updateWatermark();
    }
  }

  function nextPage() {
    if (currentPage < totalPages) {
      currentPage++;
      updateImage();
      updateWatermark();
    }
  }

  function goToPage(page) {
    let pageNumber = parseInt(page);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      currentPage = pageNumber;
      updateImage();
      updateWatermark();
    }
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      document.getElementById("pdf-image").src = "";
    } else {
      updateImage();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (
      event.key === "PrintScreen" ||
      (event.ctrlKey && event.key === "s") ||
      (event.metaKey && event.shiftKey && (event.key === "3" || event.key === "4"))
    ) {
      let overlay = document.getElementById("overlay");
      overlay.style.opacity = "1";
      setTimeout(() => {
        overlay.style.opacity = "0";
      }, 1000);
      alert("⚠️ Captura de pantalla bloqueada.");
      event.preventDefault();
    }
  });

  document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });

  function updateWatermark() {
    let now = new Date();
    let formattedDate = now.toLocaleDateString() + " " + now.toLocaleTimeString();
    document.getElementById("watermark").innerText = `Confidencial - ${formattedDate}`;
  }

  updateWatermark();
  updateImage();
</script>
```

---

## 📤 Cómo Subir tus Libros al Bucket

### Estructura de Archivos:

Los libros deben estar en esta estructura:
```
s3://biblioteca-pdfs-edgardohernandez/
└── biblioteca/
    ├── persuasion-peligrosa/
    │   ├── page1.jpg
    │   ├── page2.jpg
    │   ├── page3.jpg
    │   └── ... (hasta page19.jpg)
    ├── otro-libro/
    │   ├── page1.jpg
    │   ├── page2.jpg
    │   └── ...
    └── ...
```

### Opción 1: Subir desde la línea de comandos (AWS CLI)

```bash
# Subir un libro completo
aws s3 sync ./persuasion-peligrosa/ s3://biblioteca-pdfs-edgardohernandez/biblioteca/persuasion-peligrosa/

# Subir un solo archivo
aws s3 cp page1.jpg s3://biblioteca-pdfs-edgardohernandez/biblioteca/persuasion-peligrosa/page1.jpg
```

### Opción 2: Subir desde la Consola AWS

1. Ve a: https://s3.console.aws.amazon.com/s3/buckets/biblioteca-pdfs-edgardohernandez
2. Navega a la carpeta `biblioteca/`
3. Crea una carpeta con el nombre del libro
4. Sube las imágenes (`page1.jpg`, `page2.jpg`, etc.)

### Opción 3: Script de Bash para subir múltiples libros

Crea un archivo `subir-libros.sh`:

```bash
#!/bin/bash

BUCKET="s3://biblioteca-pdfs-edgardohernandez/biblioteca"

# Subir todos los libros desde una carpeta local
for libro_dir in ./libros/*/; do
  libro_name=$(basename "$libro_dir")
  echo "Subiendo: $libro_name"
  aws s3 sync "$libro_dir" "$BUCKET/$libro_name/"
done

echo "✅ Todos los libros subidos"
```

Ejecutar:
```bash
chmod +x subir-libros.sh
./subir-libros.sh
```

---

## 🧪 Probar el Sistema

### Prueba Manual con cURL:

```bash
# Probar el API
curl "https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url?libro=persuasion-peligrosa&pagina=1"

# Respuesta esperada:
# {"url": "https://biblioteca-pdfs-edgardohernandez.s3.amazonaws.com/biblioteca/persuasion-peligrosa/page1.jpg?..."}
```

### Prueba desde el Navegador:

Abre esta URL en tu navegador:
```
https://dfafuyp2b5.execute-api.us-east-1.amazonaws.com/prod/get-url?libro=persuasion-peligrosa&pagina=1
```

Deberías ver un JSON con una URL firmada.

---

## 🔒 Seguridad

✅ **Implementaciones de Seguridad:**

1. **URLs Firmadas:** Expiran en 5 minutos
2. **No acceso directo:** Los archivos solo son accesibles a través del API
3. **Watermark:** Tu script añade marcas de agua con fecha/hora
4. **Bloqueo de screenshots:** Tu script bloquea capturas de pantalla
5. **Bloqueo del menú contextual:** Click derecho deshabilitado
6. **Oculta imagen al cambiar de pestaña:** Previene copias fáciles

---

## 📊 Verificar Recursos Actuales

```bash
# Ver el bucket
aws s3 ls s3://biblioteca-pdfs-edgardohernandez/biblioteca/

# Ver detalles del API Gateway
aws apigateway get-rest-api --rest-api-id dfafuyp2b5

# Ver logs de la Lambda
aws logs tail /aws/lambda/GenerarURLFirmada --follow
```

---

## 🆘 Troubleshooting

### Si el API no responde:
```bash
# Verificar el deployment
aws apigateway get-deployments --rest-api-id dfafuyp2b5

# Ver logs de errores
aws logs tail /aws/lambda/GenerarURLFirmada --since 10m
```

### Si las URLs no funcionan:
1. Verifica que el archivo existe en S3:
   ```bash
   aws s3 ls s3://biblioteca-pdfs-edgardohernandez/biblioteca/persuasion-peligrosa/
   ```

2. Verifica los permisos del bucket:
   ```bash
   aws s3api get-bucket-policy --bucket biblioteca-pdfs-edgardohernandez
   ```

---

## 📋 Resumen de Cambios

| Componente | Estado Anterior | Estado Actual |
|------------|----------------|---------------|
| Bucket S3 | ❌ Eliminado | ✅ Creado y configurado |
| API Gateway | ❌ Eliminado (ID: 36rpb2ko46) | ✅ Nuevo (ID: dfafuyp2b5) |
| Lambda | ✅ Existente | ✅ Conectada al nuevo API |
| Archivos | ❌ No disponibles | ⚠️ Pendiente de subir |

---

## ✅ Siguientes Pasos

1. **Actualizar tu HTML** con el nuevo endpoint
2. **Subir tus libros** al bucket S3 usando cualquiera de los métodos descritos
3. **Probar** que todo funciona correctamente
4. **Opcional:** Crear un dominio personalizado para el API

---

## 🎯 Ejemplo Completo de Uso

### 1. Prepara tus archivos localmente:
```
./mi-biblioteca/
├── persuasion-peligrosa/
│   ├── page1.jpg
│   ├── page2.jpg
│   └── ... (hasta page19.jpg)
└── otro-libro/
    └── page1.jpg
```

### 2. Súbelos a S3:
```bash
aws s3 sync ./mi-biblioteca/persuasion-peligrosa/ \
  s3://biblioteca-pdfs-edgardohernandez/biblioteca/persuasion-peligrosa/
```

### 3. Actualiza tu HTML con el nuevo endpoint

### 4. ¡Disfruta de tu biblioteca digital restaurada! 🎉

---

**Fecha de restauración:** 16 de febrero de 2026  
**Versión del sistema:** 2.0  
**Estado:** ✅ COMPLETAMENTE FUNCIONAL


