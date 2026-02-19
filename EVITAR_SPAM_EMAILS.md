# 📧 Cómo Evitar que los Emails con QR Codes vayan a Spam

## ✅ Estado Actual de Autenticación

### **Dominio:** `precotracks.org`

| Servicio | Estado | Descripción |
|----------|--------|-------------|
| ✅ **Dominio Verificado** | Success | El dominio está verificado en AWS SES |
| ✅ **DKIM Enabled** | Success | Firma digital configurada correctamente |
| ⚠️ **SPF** | Pendiente verificar | Registro DNS para autorizar servidores |
| ⚠️ **DMARC** | Pendiente verificar | Política de autenticación |
| ⚠️ **Reputación** | En construcción | Dominio nuevo necesita warming |

---

## 🔧 Pasos para Mejorar la Entregabilidad

### **1️⃣ VERIFICAR Registros DNS Actuales**

Verifica en tu proveedor DNS (Squarespace) que tengas estos registros:

#### **A) SPF (Sender Policy Framework)**
```
Tipo: TXT
Nombre: @ (o precotracks.org)
Valor: v=spf1 include:amazonses.com ~all
TTL: 3600
```

#### **B) DKIM (Ya está configurado en SES, pero verifica DNS)**
Deberías tener 3 registros CNAME:
```
Tipo: CNAME
Nombre: rs3sa7ha63oddxhk7wo5acxgwqqcx4mz._domainkey
Valor: rs3sa7ha63oddxhk7wo5acxgwqqcx4mz.dkim.amazonses.com
TTL: 3600

Tipo: CNAME
Nombre: wkmoapwip7hsbo6lfhtaqdmej2x3wnfv._domainkey
Valor: wkmoapwip7hsbo6lfhtaqdmej2x3wnfv.dkim.amazonses.com
TTL: 3600

Tipo: CNAME
Nombre: 3u2pg3hd2w3qcstj3yrmkmjwkro5he2k._domainkey
Valor: 3u2pg3hd2w3qcstj3yrmkmjwkro5he2k.dkim.amazonses.com
TTL: 3600
```

#### **C) DMARC (Recomendado)**
```
Tipo: TXT
Nombre: _dmarc
Valor: v=DMARC1; p=quarantine; rua=mailto:dmarc@precotracks.org; pct=100; adkim=s; aspf=s
TTL: 3600
```

**Explicación DMARC:**
- `p=quarantine`: Pone en cuarentena emails que fallen autenticación
- `rua=mailto:dmarc@precotracks.org`: Envía reportes de cumplimiento
- `pct=100`: Aplica política al 100% de los emails
- `adkim=s`: DKIM estricto
- `aspf=s`: SPF estricto

---

### **2️⃣ Verificar SPF en Terminal**

Para verificar si SPF está configurado:

```bash
# Verificar SPF
dig TXT precotracks.org +short | grep spf

# Verificar DKIM
dig CNAME rs3sa7ha63oddxhk7wo5acxgwqqcx4mz._domainkey.precotracks.org +short

# Verificar DMARC
dig TXT _dmarc.precotracks.org +short
```

---

### **3️⃣ Configurar "From" Personalizado**

Actualmente usamos: `doce25@precotracks.org`

**Recomendación:** Cambiar a un nombre amigable:

```
From: Doce25 <doce25@precotracks.org>
Reply-To: info@doce25.org
```

Esto lo vemos más profesional y mejora la tasa de apertura.

---

### **4️⃣ Optimizar Contenido del Email**

#### **✅ Buenas Prácticas Actuales:**
- ✅ HTML bien formateado
- ✅ Incluye versión texto plano
- ✅ Logo inline (cid:)
- ✅ Botones con enlaces válidos

#### **⚠️ Mejoras Recomendadas:**

1. **Ratio Texto/Imagen**
   - Mantener al menos 60% texto, 40% imágenes
   - ✅ Ya tenemos buen balance

2. **Evitar Palabras Spam**
   - ❌ "GRATIS", "URGENTE", "HAZ CLIC AQUÍ"
   - ✅ Usar "Confirma tu asistencia", "Tu pase digital"

3. **Incluir Texto Alt en Imágenes**
   - ✅ Ya tenemos alt text en QR code

4. **Link de Unsuscribe**
   - Agregar opción para no recibir notificaciones

---

### **5️⃣ Configuración Avanzada de SES**

#### **A) Configurar Conjunto de Configuración (Configuration Set)**

Esto permite trackear bounces, quejas y aperturas:

```bash
# Crear configuration set
aws ses create-configuration-set \
  --configuration-set-name doce25-emails \
  --region us-east-1

# Habilitar reputación metrics
aws ses put-configuration-set-tracking-options \
  --configuration-set-name doce25-emails \
  --tracking-options CustomRedirectDomain=precotracks.org \
  --region us-east-1
```

#### **B) Configurar SNS para Bounces y Quejas**

```bash
# Crear topic SNS
aws sns create-topic \
  --name doce25-email-bounces \
  --region us-east-1

# Subscribir email para notificaciones
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:YOUR_ACCOUNT:doce25-email-bounces \
  --protocol email \
  --notification-endpoint info@doce25.org \
  --region us-east-1
```

---

### **6️⃣ Email Warming (Calentamiento)**

Como el dominio es nuevo enviando emails, necesitas:

**Semana 1:**
- Enviar 50-100 emails/día máximo
- Solo a usuarios que se registren

**Semana 2:**
- Aumentar a 200-300 emails/día

**Semana 3+:**
- Aumentar gradualmente según necesidad

**⚠️ IMPORTANTE:** No envíes más de 500 emails el primer mes.

---

### **7️⃣ Monitorear Reputación del Dominio**

#### **Herramientas Gratuitas:**

1. **Sender Score**
   - https://senderscore.org
   - Verifica: precotracks.org

2. **MXToolbox**
   - https://mxtoolbox.com/blacklists.aspx
   - Verifica si estás en blacklists

3. **Google Postmaster Tools**
   - https://postmaster.google.com
   - Monitorea reputación con Gmail

4. **Mail Tester**
   - https://www.mail-tester.com
   - Envía un email de prueba para obtener score

---

### **8️⃣ Usar Custom MAIL FROM Domain**

Esto mejora significativamente la entregabilidad:

```bash
# Configurar MAIL FROM domain
aws ses set-identity-mail-from-domain \
  --identity precotracks.org \
  --mail-from-domain mail.precotracks.org \
  --behavior-on-mx-failure UseDefaultValue \
  --region us-east-1
```

Luego agregar en DNS:
```
Tipo: MX
Nombre: mail.precotracks.org
Valor: 10 feedback-smtp.us-east-1.amazonses.com
TTL: 3600

Tipo: TXT
Nombre: mail.precotracks.org
Valor: v=spf1 include:amazonses.com ~all
TTL: 3600
```

---

### **9️⃣ Mejoras en el Código**

Voy a actualizar las funciones Lambda para incluir mejores prácticas:

#### **Headers Recomendados:**

```typescript
// En lambda/register-event/index.ts y lambda/resend-qr-email/index.ts

const emailHeaders = [
  `From: Doce25 <doce25@precotracks.org>`,
  `Reply-To: info@doce25.org`,
  `To: ${email}`,
  `Subject: ${subject}`,
  `List-Unsubscribe: <mailto:unsubscribe@doce25.org>`, // NUEVO
  `List-Unsubscribe-Post: List-Unsubscribe=One-Click`, // NUEVO
  `Precedence: bulk`, // NUEVO
  `MIME-Version: 1.0`,
  // ... resto de headers
]
```

---

### **🔟 Checklist de Verificación**

Antes de enviar emails masivos, verifica:

- [ ] ✅ DKIM configurado (Ya tienes esto)
- [ ] ⚠️ SPF configurado en DNS
- [ ] ⚠️ DMARC configurado en DNS
- [ ] ⚠️ MAIL FROM domain configurado
- [ ] ⚠️ Dominio completo verificado en SES
- [ ] ⚠️ Reply-To apunta a email válido
- [ ] ⚠️ Link de unsuscribe incluido
- [ ] ⚠️ Contenido sin palabras spam
- [ ] ⚠️ Ratio texto/imagen balanceado
- [ ] ⚠️ Emails probados con Mail-Tester
- [ ] ⚠️ Warming period respetado

---

## 🚀 Acción Inmediata Recomendada

### **PASO 1: Verificar DNS (HOY)**

En tu panel de Squarespace DNS, verifica que tengas:

1. **TXT para SPF:**
   ```
   v=spf1 include:amazonses.com ~all
   ```

2. **3 CNAME para DKIM** (usa los tokens de arriba)

3. **TXT para DMARC:**
   ```
   v=DMARC1; p=quarantine; rua=mailto:info@doce25.org
   ```

### **PASO 2: Test de Email (HOY)**

Envía un email de prueba a:
- Tu Gmail personal
- mail-tester.com
- Revisa en qué carpeta llega

### **PASO 3: Actualizar Código (AHORA)**

¿Quieres que actualice las funciones Lambda para:
1. Agregar header de Reply-To: info@doce25.org
2. Agregar List-Unsubscribe
3. Agregar nombre amigable "Doce25" en el From

---

## 📊 Métricas a Monitorear

Una vez implementado, monitorea:

- **Bounce Rate** < 5%
- **Complaint Rate** < 0.1%
- **Open Rate** > 20%
- **Click Rate** > 5%

---

## 💡 Tip Adicional

Considera usar un subdominio dedicado para emails transaccionales:

```
emails.doce25.org → Solo para notificaciones automáticas
doce25.org → Para el sitio web principal
```

Esto protege la reputación del dominio principal.

---

¿Quieres que actualice el código ahora con las mejoras recomendadas? 🚀



## ✅ Estado Actual de Autenticación

### **Dominio:** `precotracks.org`

| Servicio | Estado | Descripción |
|----------|--------|-------------|
| ✅ **Dominio Verificado** | Success | El dominio está verificado en AWS SES |
| ✅ **DKIM Enabled** | Success | Firma digital configurada correctamente |
| ⚠️ **SPF** | Pendiente verificar | Registro DNS para autorizar servidores |
| ⚠️ **DMARC** | Pendiente verificar | Política de autenticación |
| ⚠️ **Reputación** | En construcción | Dominio nuevo necesita warming |

---

## 🔧 Pasos para Mejorar la Entregabilidad

### **1️⃣ VERIFICAR Registros DNS Actuales**

Verifica en tu proveedor DNS (Squarespace) que tengas estos registros:

#### **A) SPF (Sender Policy Framework)**
```
Tipo: TXT
Nombre: @ (o precotracks.org)
Valor: v=spf1 include:amazonses.com ~all
TTL: 3600
```

#### **B) DKIM (Ya está configurado en SES, pero verifica DNS)**
Deberías tener 3 registros CNAME:
```
Tipo: CNAME
Nombre: rs3sa7ha63oddxhk7wo5acxgwqqcx4mz._domainkey
Valor: rs3sa7ha63oddxhk7wo5acxgwqqcx4mz.dkim.amazonses.com
TTL: 3600

Tipo: CNAME
Nombre: wkmoapwip7hsbo6lfhtaqdmej2x3wnfv._domainkey
Valor: wkmoapwip7hsbo6lfhtaqdmej2x3wnfv.dkim.amazonses.com
TTL: 3600

Tipo: CNAME
Nombre: 3u2pg3hd2w3qcstj3yrmkmjwkro5he2k._domainkey
Valor: 3u2pg3hd2w3qcstj3yrmkmjwkro5he2k.dkim.amazonses.com
TTL: 3600
```

#### **C) DMARC (Recomendado)**
```
Tipo: TXT
Nombre: _dmarc
Valor: v=DMARC1; p=quarantine; rua=mailto:dmarc@precotracks.org; pct=100; adkim=s; aspf=s
TTL: 3600
```

**Explicación DMARC:**
- `p=quarantine`: Pone en cuarentena emails que fallen autenticación
- `rua=mailto:dmarc@precotracks.org`: Envía reportes de cumplimiento
- `pct=100`: Aplica política al 100% de los emails
- `adkim=s`: DKIM estricto
- `aspf=s`: SPF estricto

---

### **2️⃣ Verificar SPF en Terminal**

Para verificar si SPF está configurado:

```bash
# Verificar SPF
dig TXT precotracks.org +short | grep spf

# Verificar DKIM
dig CNAME rs3sa7ha63oddxhk7wo5acxgwqqcx4mz._domainkey.precotracks.org +short

# Verificar DMARC
dig TXT _dmarc.precotracks.org +short
```

---

### **3️⃣ Configurar "From" Personalizado**

Actualmente usamos: `doce25@precotracks.org`

**Recomendación:** Cambiar a un nombre amigable:

```
From: Doce25 <doce25@precotracks.org>
Reply-To: info@doce25.org
```

Esto lo vemos más profesional y mejora la tasa de apertura.

---

### **4️⃣ Optimizar Contenido del Email**

#### **✅ Buenas Prácticas Actuales:**
- ✅ HTML bien formateado
- ✅ Incluye versión texto plano
- ✅ Logo inline (cid:)
- ✅ Botones con enlaces válidos

#### **⚠️ Mejoras Recomendadas:**

1. **Ratio Texto/Imagen**
   - Mantener al menos 60% texto, 40% imágenes
   - ✅ Ya tenemos buen balance

2. **Evitar Palabras Spam**
   - ❌ "GRATIS", "URGENTE", "HAZ CLIC AQUÍ"
   - ✅ Usar "Confirma tu asistencia", "Tu pase digital"

3. **Incluir Texto Alt en Imágenes**
   - ✅ Ya tenemos alt text en QR code

4. **Link de Unsuscribe**
   - Agregar opción para no recibir notificaciones

---

### **5️⃣ Configuración Avanzada de SES**

#### **A) Configurar Conjunto de Configuración (Configuration Set)**

Esto permite trackear bounces, quejas y aperturas:

```bash
# Crear configuration set
aws ses create-configuration-set \
  --configuration-set-name doce25-emails \
  --region us-east-1

# Habilitar reputación metrics
aws ses put-configuration-set-tracking-options \
  --configuration-set-name doce25-emails \
  --tracking-options CustomRedirectDomain=precotracks.org \
  --region us-east-1
```

#### **B) Configurar SNS para Bounces y Quejas**

```bash
# Crear topic SNS
aws sns create-topic \
  --name doce25-email-bounces \
  --region us-east-1

# Subscribir email para notificaciones
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:YOUR_ACCOUNT:doce25-email-bounces \
  --protocol email \
  --notification-endpoint info@doce25.org \
  --region us-east-1
```

---

### **6️⃣ Email Warming (Calentamiento)**

Como el dominio es nuevo enviando emails, necesitas:

**Semana 1:**
- Enviar 50-100 emails/día máximo
- Solo a usuarios que se registren

**Semana 2:**
- Aumentar a 200-300 emails/día

**Semana 3+:**
- Aumentar gradualmente según necesidad

**⚠️ IMPORTANTE:** No envíes más de 500 emails el primer mes.

---

### **7️⃣ Monitorear Reputación del Dominio**

#### **Herramientas Gratuitas:**

1. **Sender Score**
   - https://senderscore.org
   - Verifica: precotracks.org

2. **MXToolbox**
   - https://mxtoolbox.com/blacklists.aspx
   - Verifica si estás en blacklists

3. **Google Postmaster Tools**
   - https://postmaster.google.com
   - Monitorea reputación con Gmail

4. **Mail Tester**
   - https://www.mail-tester.com
   - Envía un email de prueba para obtener score

---

### **8️⃣ Usar Custom MAIL FROM Domain**

Esto mejora significativamente la entregabilidad:

```bash
# Configurar MAIL FROM domain
aws ses set-identity-mail-from-domain \
  --identity precotracks.org \
  --mail-from-domain mail.precotracks.org \
  --behavior-on-mx-failure UseDefaultValue \
  --region us-east-1
```

Luego agregar en DNS:
```
Tipo: MX
Nombre: mail.precotracks.org
Valor: 10 feedback-smtp.us-east-1.amazonses.com
TTL: 3600

Tipo: TXT
Nombre: mail.precotracks.org
Valor: v=spf1 include:amazonses.com ~all
TTL: 3600
```

---

### **9️⃣ Mejoras en el Código**

Voy a actualizar las funciones Lambda para incluir mejores prácticas:

#### **Headers Recomendados:**

```typescript
// En lambda/register-event/index.ts y lambda/resend-qr-email/index.ts

const emailHeaders = [
  `From: Doce25 <doce25@precotracks.org>`,
  `Reply-To: info@doce25.org`,
  `To: ${email}`,
  `Subject: ${subject}`,
  `List-Unsubscribe: <mailto:unsubscribe@doce25.org>`, // NUEVO
  `List-Unsubscribe-Post: List-Unsubscribe=One-Click`, // NUEVO
  `Precedence: bulk`, // NUEVO
  `MIME-Version: 1.0`,
  // ... resto de headers
]
```

---

### **🔟 Checklist de Verificación**

Antes de enviar emails masivos, verifica:

- [ ] ✅ DKIM configurado (Ya tienes esto)
- [ ] ⚠️ SPF configurado en DNS
- [ ] ⚠️ DMARC configurado en DNS
- [ ] ⚠️ MAIL FROM domain configurado
- [ ] ⚠️ Dominio completo verificado en SES
- [ ] ⚠️ Reply-To apunta a email válido
- [ ] ⚠️ Link de unsuscribe incluido
- [ ] ⚠️ Contenido sin palabras spam
- [ ] ⚠️ Ratio texto/imagen balanceado
- [ ] ⚠️ Emails probados con Mail-Tester
- [ ] ⚠️ Warming period respetado

---

## 🚀 Acción Inmediata Recomendada

### **PASO 1: Verificar DNS (HOY)**

En tu panel de Squarespace DNS, verifica que tengas:

1. **TXT para SPF:**
   ```
   v=spf1 include:amazonses.com ~all
   ```

2. **3 CNAME para DKIM** (usa los tokens de arriba)

3. **TXT para DMARC:**
   ```
   v=DMARC1; p=quarantine; rua=mailto:info@doce25.org
   ```

### **PASO 2: Test de Email (HOY)**

Envía un email de prueba a:
- Tu Gmail personal
- mail-tester.com
- Revisa en qué carpeta llega

### **PASO 3: Actualizar Código (AHORA)**

¿Quieres que actualice las funciones Lambda para:
1. Agregar header de Reply-To: info@doce25.org
2. Agregar List-Unsubscribe
3. Agregar nombre amigable "Doce25" en el From

---

## 📊 Métricas a Monitorear

Una vez implementado, monitorea:

- **Bounce Rate** < 5%
- **Complaint Rate** < 0.1%
- **Open Rate** > 20%
- **Click Rate** > 5%

---

## 💡 Tip Adicional

Considera usar un subdominio dedicado para emails transaccionales:

```
emails.doce25.org → Solo para notificaciones automáticas
doce25.org → Para el sitio web principal
```

Esto protege la reputación del dominio principal.

---

¿Quieres que actualice el código ahora con las mejoras recomendadas? 🚀

