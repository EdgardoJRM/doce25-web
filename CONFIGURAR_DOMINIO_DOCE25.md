# 🌐 Configurar Dominio doce25.org en AWS Amplify

## ⚠️ IMPORTANTE: No afectar el correo electrónico

**Los registros MX (correo) NO se tocan.** Solo agregaremos registros CNAME y A para el sitio web.

---

## 📋 Paso 1: Agregar Dominio en AWS Amplify

### 1.1. Ir a Amplify Console
1. Ve a: https://console.aws.amazon.com/amplify/
2. Selecciona tu app: **Doce25 Web**
3. En el menú lateral, click en **"Domain management"**
4. Click en **"Add domain"**

### 1.2. Ingresar Dominio
1. Escribe: `doce25.org`
2. Click **"Configure domain"**

### 1.3. Configurar Subdominios
Amplify te pedirá configurar:
- **Dominio raíz**: `doce25.org`
- **www**: `www.doce25.org` (opcional pero recomendado)

Amplify automáticamente:
- ✅ Solicitará certificado SSL gratuito
- ✅ Configurará HTTPS
- ✅ Redirigirá HTTP → HTTPS

---

## 📝 Paso 2: Obtener Registros DNS de Amplify

Después de agregar el dominio, Amplify te mostrará los registros DNS que necesitas agregar.

**Ejemplo de lo que verás:**

```
Tipo: CNAME
Nombre: _a1b2c3d4e5f6g7h8
Valor: [algo como].cloudfront.net
TTL: 300

Tipo: CNAME  
Nombre: www
Valor: [algo como].cloudfront.net
TTL: 300
```

**O podría ser:**

```
Tipo: A
Nombre: @ (o doce25.org)
Valor: [IP address]
TTL: 300

Tipo: CNAME
Nombre: www
Valor: [algo como].cloudfront.net
TTL: 300
```

**⚠️ IMPORTANTE:** Copia EXACTAMENTE estos valores que te da Amplify.

---

## 🔧 Paso 3: Agregar Registros DNS en Squarespace

### 3.1. Acceder a DNS en Squarespace

1. Inicia sesión en tu cuenta de Squarespace
2. Ve a **Settings** → **Domains**
3. Click en **doce25.org**
4. Click en **DNS Settings** o **Advanced DNS Settings**

### 3.2. Verificar Registros MX Existentes (NO TOCAR)

**ANTES de agregar nada, verifica que tienes registros MX como estos:**

```
Tipo: MX
Nombre: @ (o doce25.org)
Valor: mail.squarespace.com (o similar)
Prioridad: 10
```

**⚠️ NO MODIFIQUES NI ELIMINES ESTOS REGISTROS MX**

### 3.3. Agregar Registros de Amplify

Agrega los registros que te dio Amplify. **Ejemplo:**

#### Opción A: Si Amplify te da CNAME para el dominio raíz

```
Tipo: CNAME
Nombre: @ (o doce25.org)
Valor: [el valor que te dio Amplify]
TTL: 300 (o el que te indique)
```

**Nota:** Algunos proveedores DNS no permiten CNAME en el dominio raíz (@). Si Squarespace no lo permite:

#### Opción B: Si necesitas usar registros A

```
Tipo: A
Nombre: @ (o doce25.org)
Valor: [IP que te dio Amplify]
TTL: 300
```

#### Agregar www (siempre recomendado)

```
Tipo: CNAME
Nombre: www
Valor: [el valor que te dio Amplify para www]
TTL: 300
```

### 3.4. Verificar que NO se afectaron los MX

Después de agregar, verifica que los registros MX siguen ahí:

```
✅ MX - @ - mail.squarespace.com - Prioridad: 10
✅ (o el que tengas configurado)
```

---

## ⏱️ Paso 4: Esperar Propagación DNS

### Tiempos estimados:
- **Propagación inicial**: 5-15 minutos
- **Propagación completa**: 24-48 horas (normalmente menos)

### Verificar propagación:

Puedes verificar en:
- https://www.whatsmydns.net/#CNAME/doce25.org
- https://dnschecker.org/

### Verificar en Amplify:

1. Ve a **Domain management** en Amplify
2. Verás el estado:
   - 🟡 **Pending validation** - Esperando DNS
   - 🟢 **Available** - Listo y funcionando

---

## ✅ Paso 5: Verificar que Todo Funciona

### 5.1. Verificar Sitio Web
- Abre: `https://doce25.org`
- Debe cargar tu aplicación
- Debe tener SSL (candado verde)

### 5.2. Verificar Correo (CRÍTICO)
- Envía un email de prueba a: `tu-email@doce25.org`
- Verifica que recibes el email
- Si no recibes, los MX están mal configurados

### 5.3. Verificar www
- Abre: `https://www.doce25.org`
- Debe redirigir a `doce25.org` o cargar directamente

---

## 🔄 Paso 6: Actualizar FRONTEND_URL en Lambdas

Una vez que el dominio esté funcionando, actualiza la variable de entorno:

### 6.1. En `sam-template.yaml`

Busca las lambdas que usan `FRONTEND_URL` y actualiza:

```yaml
Environment:
  Variables:
    FRONTEND_URL: https://doce25.org  # Cambiar de Amplify URL a dominio
```

### 6.2. Redesplegar

```bash
cd "/Users/gardo/Doce25 - Web"
sam build
sam deploy
```

Esto actualizará los emails para que usen `doce25.org` en lugar de la URL de Amplify.

---

## 📊 Registros DNS Finales en Squarespace

**Tu configuración debería verse así:**

```
✅ A o CNAME - @ - [valor de Amplify] - TTL: 300
✅ CNAME - www - [valor de Amplify] - TTL: 300
✅ MX - @ - mail.squarespace.com - Prioridad: 10
✅ (otros registros MX si los tienes)
✅ (otros registros que ya tenías)
```

**NO deberías tener:**
- ❌ Múltiples registros A para @
- ❌ CNAME y A al mismo tiempo para @ (conflicto)
- ❌ Registros MX modificados o eliminados

---

## 🚨 Troubleshooting

### Problema: "Domain validation failed"
- **Causa**: Los registros DNS no se propagaron aún
- **Solución**: Espera 15-30 minutos y verifica en Amplify

### Problema: "Site no carga"
- **Causa**: DNS no propagado o registro incorrecto
- **Solución**: 
  1. Verifica que los registros están correctos en Squarespace
  2. Espera más tiempo (hasta 48 horas)
  3. Verifica en https://dnschecker.org/

### Problema: "Correo no funciona"
- **Causa**: Registros MX eliminados o modificados
- **Solución**: 
  1. Verifica que los MX siguen en Squarespace
  2. Si faltan, agrégalos de nuevo:
     ```
     Tipo: MX
     Nombre: @
     Valor: mail.squarespace.com
     Prioridad: 10
     ```

### Problema: "Solo funciona www, no el dominio raíz"
- **Causa**: Squarespace no permite CNAME en @
- **Solución**: Usa registros A en lugar de CNAME para @

---

## 📝 Checklist Final

- [ ] Dominio agregado en AWS Amplify
- [ ] Registros DNS copiados de Amplify
- [ ] Registros agregados en Squarespace
- [ ] Registros MX verificados (no modificados)
- [ ] Esperado 15-30 minutos para propagación
- [ ] Dominio validado en Amplify (estado "Available")
- [ ] Sitio carga en https://doce25.org
- [ ] Correo funciona (test enviado y recibido)
- [ ] FRONTEND_URL actualizada en lambdas
- [ ] Lambdas redesplegadas

---

## 🎯 Resultado Final

Después de completar estos pasos:

✅ **Sitio web**: `https://doce25.org` → Tu aplicación en Amplify
✅ **www**: `https://www.doce25.org` → Redirige o carga tu app
✅ **Correo**: `tu-email@doce25.org` → Sigue funcionando con Squarespace
✅ **SSL**: Certificado automático de AWS (gratis)
✅ **HTTPS**: Forzado automáticamente

---

## 💡 Tips Adicionales

1. **Mantén backup**: Antes de cambiar DNS, toma screenshot de tu configuración actual
2. **Haz cambios en horario de bajo tráfico**: Si es posible
3. **Prueba primero en staging**: Si tienes ambiente de pruebas
4. **Documenta cambios**: Guarda los valores exactos que agregaste

---

## 📞 Si Necesitas Ayuda

Si algo no funciona:
1. Verifica los logs en Amplify Console
2. Verifica DNS en https://dnschecker.org/
3. Revisa que los MX no se modificaron
4. Contacta soporte de Squarespace si los MX desaparecieron

¡Listo para configurar! 🚀



## ⚠️ IMPORTANTE: No afectar el correo electrónico

**Los registros MX (correo) NO se tocan.** Solo agregaremos registros CNAME y A para el sitio web.

---

## 📋 Paso 1: Agregar Dominio en AWS Amplify

### 1.1. Ir a Amplify Console
1. Ve a: https://console.aws.amazon.com/amplify/
2. Selecciona tu app: **Doce25 Web**
3. En el menú lateral, click en **"Domain management"**
4. Click en **"Add domain"**

### 1.2. Ingresar Dominio
1. Escribe: `doce25.org`
2. Click **"Configure domain"**

### 1.3. Configurar Subdominios
Amplify te pedirá configurar:
- **Dominio raíz**: `doce25.org`
- **www**: `www.doce25.org` (opcional pero recomendado)

Amplify automáticamente:
- ✅ Solicitará certificado SSL gratuito
- ✅ Configurará HTTPS
- ✅ Redirigirá HTTP → HTTPS

---

## 📝 Paso 2: Obtener Registros DNS de Amplify

Después de agregar el dominio, Amplify te mostrará los registros DNS que necesitas agregar.

**Ejemplo de lo que verás:**

```
Tipo: CNAME
Nombre: _a1b2c3d4e5f6g7h8
Valor: [algo como].cloudfront.net
TTL: 300

Tipo: CNAME  
Nombre: www
Valor: [algo como].cloudfront.net
TTL: 300
```

**O podría ser:**

```
Tipo: A
Nombre: @ (o doce25.org)
Valor: [IP address]
TTL: 300

Tipo: CNAME
Nombre: www
Valor: [algo como].cloudfront.net
TTL: 300
```

**⚠️ IMPORTANTE:** Copia EXACTAMENTE estos valores que te da Amplify.

---

## 🔧 Paso 3: Agregar Registros DNS en Squarespace

### 3.1. Acceder a DNS en Squarespace

1. Inicia sesión en tu cuenta de Squarespace
2. Ve a **Settings** → **Domains**
3. Click en **doce25.org**
4. Click en **DNS Settings** o **Advanced DNS Settings**

### 3.2. Verificar Registros MX Existentes (NO TOCAR)

**ANTES de agregar nada, verifica que tienes registros MX como estos:**

```
Tipo: MX
Nombre: @ (o doce25.org)
Valor: mail.squarespace.com (o similar)
Prioridad: 10
```

**⚠️ NO MODIFIQUES NI ELIMINES ESTOS REGISTROS MX**

### 3.3. Agregar Registros de Amplify

Agrega los registros que te dio Amplify. **Ejemplo:**

#### Opción A: Si Amplify te da CNAME para el dominio raíz

```
Tipo: CNAME
Nombre: @ (o doce25.org)
Valor: [el valor que te dio Amplify]
TTL: 300 (o el que te indique)
```

**Nota:** Algunos proveedores DNS no permiten CNAME en el dominio raíz (@). Si Squarespace no lo permite:

#### Opción B: Si necesitas usar registros A

```
Tipo: A
Nombre: @ (o doce25.org)
Valor: [IP que te dio Amplify]
TTL: 300
```

#### Agregar www (siempre recomendado)

```
Tipo: CNAME
Nombre: www
Valor: [el valor que te dio Amplify para www]
TTL: 300
```

### 3.4. Verificar que NO se afectaron los MX

Después de agregar, verifica que los registros MX siguen ahí:

```
✅ MX - @ - mail.squarespace.com - Prioridad: 10
✅ (o el que tengas configurado)
```

---

## ⏱️ Paso 4: Esperar Propagación DNS

### Tiempos estimados:
- **Propagación inicial**: 5-15 minutos
- **Propagación completa**: 24-48 horas (normalmente menos)

### Verificar propagación:

Puedes verificar en:
- https://www.whatsmydns.net/#CNAME/doce25.org
- https://dnschecker.org/

### Verificar en Amplify:

1. Ve a **Domain management** en Amplify
2. Verás el estado:
   - 🟡 **Pending validation** - Esperando DNS
   - 🟢 **Available** - Listo y funcionando

---

## ✅ Paso 5: Verificar que Todo Funciona

### 5.1. Verificar Sitio Web
- Abre: `https://doce25.org`
- Debe cargar tu aplicación
- Debe tener SSL (candado verde)

### 5.2. Verificar Correo (CRÍTICO)
- Envía un email de prueba a: `tu-email@doce25.org`
- Verifica que recibes el email
- Si no recibes, los MX están mal configurados

### 5.3. Verificar www
- Abre: `https://www.doce25.org`
- Debe redirigir a `doce25.org` o cargar directamente

---

## 🔄 Paso 6: Actualizar FRONTEND_URL en Lambdas

Una vez que el dominio esté funcionando, actualiza la variable de entorno:

### 6.1. En `sam-template.yaml`

Busca las lambdas que usan `FRONTEND_URL` y actualiza:

```yaml
Environment:
  Variables:
    FRONTEND_URL: https://doce25.org  # Cambiar de Amplify URL a dominio
```

### 6.2. Redesplegar

```bash
cd "/Users/gardo/Doce25 - Web"
sam build
sam deploy
```

Esto actualizará los emails para que usen `doce25.org` en lugar de la URL de Amplify.

---

## 📊 Registros DNS Finales en Squarespace

**Tu configuración debería verse así:**

```
✅ A o CNAME - @ - [valor de Amplify] - TTL: 300
✅ CNAME - www - [valor de Amplify] - TTL: 300
✅ MX - @ - mail.squarespace.com - Prioridad: 10
✅ (otros registros MX si los tienes)
✅ (otros registros que ya tenías)
```

**NO deberías tener:**
- ❌ Múltiples registros A para @
- ❌ CNAME y A al mismo tiempo para @ (conflicto)
- ❌ Registros MX modificados o eliminados

---

## 🚨 Troubleshooting

### Problema: "Domain validation failed"
- **Causa**: Los registros DNS no se propagaron aún
- **Solución**: Espera 15-30 minutos y verifica en Amplify

### Problema: "Site no carga"
- **Causa**: DNS no propagado o registro incorrecto
- **Solución**: 
  1. Verifica que los registros están correctos en Squarespace
  2. Espera más tiempo (hasta 48 horas)
  3. Verifica en https://dnschecker.org/

### Problema: "Correo no funciona"
- **Causa**: Registros MX eliminados o modificados
- **Solución**: 
  1. Verifica que los MX siguen en Squarespace
  2. Si faltan, agrégalos de nuevo:
     ```
     Tipo: MX
     Nombre: @
     Valor: mail.squarespace.com
     Prioridad: 10
     ```

### Problema: "Solo funciona www, no el dominio raíz"
- **Causa**: Squarespace no permite CNAME en @
- **Solución**: Usa registros A en lugar de CNAME para @

---

## 📝 Checklist Final

- [ ] Dominio agregado en AWS Amplify
- [ ] Registros DNS copiados de Amplify
- [ ] Registros agregados en Squarespace
- [ ] Registros MX verificados (no modificados)
- [ ] Esperado 15-30 minutos para propagación
- [ ] Dominio validado en Amplify (estado "Available")
- [ ] Sitio carga en https://doce25.org
- [ ] Correo funciona (test enviado y recibido)
- [ ] FRONTEND_URL actualizada en lambdas
- [ ] Lambdas redesplegadas

---

## 🎯 Resultado Final

Después de completar estos pasos:

✅ **Sitio web**: `https://doce25.org` → Tu aplicación en Amplify
✅ **www**: `https://www.doce25.org` → Redirige o carga tu app
✅ **Correo**: `tu-email@doce25.org` → Sigue funcionando con Squarespace
✅ **SSL**: Certificado automático de AWS (gratis)
✅ **HTTPS**: Forzado automáticamente

---

## 💡 Tips Adicionales

1. **Mantén backup**: Antes de cambiar DNS, toma screenshot de tu configuración actual
2. **Haz cambios en horario de bajo tráfico**: Si es posible
3. **Prueba primero en staging**: Si tienes ambiente de pruebas
4. **Documenta cambios**: Guarda los valores exactos que agregaste

---

## 📞 Si Necesitas Ayuda

Si algo no funciona:
1. Verifica los logs en Amplify Console
2. Verifica DNS en https://dnschecker.org/
3. Revisa que los MX no se modificaron
4. Contacta soporte de Squarespace si los MX desaparecieron

¡Listo para configurar! 🚀

