# 🌐 Configuración DNS Exacta: Amplify + Squarespace

**Dominio:** doce25.org  
**Fecha:** 2026-02-20  
**Status:** En configuración

---

## 📋 Registros que Amplify Requiere

### 1️⃣ CNAME de Verificación SSL (PRIORITARIO)

```
Hostname: _1ec9f8b1aca89d84b943482cea2cc729.doce25.org.
Type: CNAME
Value: _499538278a3d6730141fdbeee5023b11.jkddzztszm.acm-validations.aws.
```

### 2️⃣ Dominio Raíz

```
Hostname: @
Type: ANAME
Value: d3d7hdnqr9nw4m.cloudfront.net
```

### 3️⃣ Subdominio www

```
Hostname: www
Type: CNAME
Value: d3d7hdnqr9nw4m.cloudfront.net
```

---

## ⚙️ Cómo Configurar en Squarespace DNS

### ✅ Registro 1: CNAME de Verificación SSL

**En Squarespace:**

```
Type: CNAME
Host: _1ec9f8b1aca89d84b943482cea2cc729
Data: _499538278a3d6730141fdbeee5023b11.jkddzztszm.acm-validations.aws
TTL: 300 (o Auto)
```

**⚠️ IMPORTANTE:**
- Solo pon el prefijo `_1ec9f8b1aca89d84b943482cea2cc729` en Host
- NO incluyas `.doce25.org`
- NO pongas punto `.` al final del Data

---

### ✅ Registro 2: CNAME para www

**En Squarespace:**

```
Type: CNAME
Host: www
Data: d3d7hdnqr9nw4m.cloudfront.net
TTL: 300 (o Auto)
```

---

### ⚠️ Registro 3: Dominio Raíz (@) - PROBLEMA

**El problema:** Amplify pide ANAME, pero Squarespace NO lo soporta.

**Soluciones posibles:**

#### Opción A: Usar CNAME en @ (puede no funcionar)

Squarespace a veces permite CNAME en el dominio raíz:

```
Type: CNAME
Host: @ (o dejar vacío)
Data: d3d7hdnqr9nw4m.cloudfront.net
TTL: 300
```

⚠️ Si Squarespace no te deja, muestra error o dice "no permitido", pasa a la Opción B.

#### Opción B: Obtener IPs de CloudFront y usar registros A

CloudFront NO tiene IPs fijas, pero podemos obtener las IPs actuales y usarlas (con limitaciones).

**Pasos:**

1. Abre terminal y ejecuta:

```bash
# Obtener IPs de la distribución CloudFront
nslookup d3d7hdnqr9nw4m.cloudfront.net

# O con dig
dig d3d7hdnqr9nw4m.cloudfront.net
```

2. Te dará algo como:
```
Address: 18.164.242.10
Address: 18.164.242.20
Address: 18.164.242.30
Address: 18.164.242.40
```

3. Agrega TODAS las IPs en Squarespace como registros A:

```
Type: A
Host: @ (o dejar vacío)
Data: 18.164.242.10
TTL: 300

Type: A
Host: @ (o dejar vacío)
Data: 18.164.242.20
TTL: 300

(repite para todas las IPs)
```

⚠️ **DESVENTAJA:** Las IPs de CloudFront pueden cambiar. Si el sitio deja de funcionar en el futuro, necesitarás actualizarlas.

#### Opción C: Solo usar www (más simple)

La opción más confiable con Squarespace:

1. **NO configurar @ (dominio raíz)**
2. Solo configurar `www.doce25.org` con CNAME
3. En Amplify, remover el dominio raíz y dejar solo www
4. Configurar redirect de `doce25.org` → `www.doce25.org` en Squarespace

**Pasos en Amplify:**
- Ve a Domain management
- Edita el dominio
- Desmarca o remueve `@` (root domain)
- Deja solo `www`

**En Squarespace:**
- Settings → Domains → doce25.org
- Busca "WWW Redirect" o "Primary Domain"
- Configura para que `doce25.org` redirija a `www.doce25.org`

---

## 🔄 Opción D: Migrar DNS a Route 53 (AWS) - Más Profesional

Esta es la **solución definitiva y profesional** que elimina todos los problemas:

### Ventajas:
- ✅ Soporte completo para ANAME/ALIAS
- ✅ Integración perfecta con Amplify
- ✅ Más control sobre DNS
- ✅ Gratis (Route 53 cuesta ~$0.50/mes por zona)

### Pasos:

1. **Crear Hosted Zone en Route 53**
2. **Route 53 te dará 4 Name Servers** (algo como):
   ```
   ns-123.awsdns-45.com
   ns-678.awsdns-90.org
   ns-901.awsdns-23.net
   ns-456.awsdns-78.co.uk
   ```

3. **En Squarespace, cambiar los Name Servers:**
   - Settings → Domains → doce25.org
   - Advanced Settings → Name Servers
   - Cambiar de Squarespace Name Servers a Custom
   - Poner los 4 Name Servers de Route 53

4. **En Route 53, Amplify configurará automáticamente los registros**

⚠️ **IMPORTANTE:** Antes de cambiar Name Servers:
- Copia TODOS los registros DNS actuales de Squarespace (especialmente MX para email)
- Recréalos manualmente en Route 53

---

## 📊 Resumen de Opciones

| Opción | Dificultad | Confiabilidad | Recomendación |
|--------|-----------|---------------|---------------|
| **A: CNAME en @** | Fácil | Baja (puede no funcionar) | Pruébala primero |
| **B: Registros A con IPs** | Media | Media (IPs pueden cambiar) | Si A falla |
| **C: Solo www** | Fácil | Alta | La más simple y confiable |
| **D: Route 53** | Media-Alta | Muy Alta | La mejor a largo plazo |

---

## ⏱️ Después de Configurar

1. **Espera 15-30 minutos** para propagación DNS
2. **Verifica los registros:**
   ```bash
   # Verificar CNAME de verificación
   nslookup -type=CNAME _1ec9f8b1aca89d84b943482cea2cc729.doce25.org
   
   # Verificar www
   nslookup www.doce25.org
   ```

3. **En Amplify:** El status cambiará automáticamente cuando detecte los registros
4. **Si no funciona después de 1 hora:** Verifica en https://dnschecker.org/

---

## 🎯 Mi Recomendación Personal

**Para resolver AHORA y rápido:**
→ Usar **Opción C (Solo www)** con redirect

**Para solución profesional y definitiva:**
→ Migrar a **Route 53** (vale la pena, toma ~30 minutos)

---

## 📝 Siguiente Paso RECOMENDADO

Te sugiero empezar con **Opción C** (solo www):

1. En Amplify, edita el dominio y remueve `@`
2. Deja solo `www.doce25.org`
3. En Squarespace, configura CNAME para www
4. En Squarespace, configura redirect de @ → www

Esto funcionará de inmediato y es lo más confiable con Squarespace.

¿Quieres que te ayude con alguna de estas opciones específicamente?

