# 🎯 Scripts de Tracking y Analytics - Doce25

## 📊 Scripts Implementados

### 1. **Google Analytics 4** ✅
Rastreo completo de visitantes, páginas, conversiones.

**Configuración:**
1. Ve a: https://analytics.google.com
2. Crea cuenta/propiedad para Doce25
3. Copia el ID (formato: G-XXXXXXXXXX)
4. Agrega a tus variables de entorno en Amplify:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

**Eventos que rastreamos:**
- ✅ Page views (automático)
- ✅ Registros a eventos (`trackEventRegistration`)
- ✅ Clicks en "Donar" (`trackDonationClick`)
- ✅ Formulario de contacto (`trackContactFormSubmit`)
- ✅ Interacciones con mapa (`trackMapInteraction`)
- ✅ Clicks en banner de eventos (`trackBannerClick`)

---

### 2. **Meta Pixel (Facebook/Instagram Ads)** ✅
Tracking para campañas de Facebook e Instagram.

**Configuración:**
1. Ve a: https://business.facebook.com
2. Event Manager → Create Pixel
3. Copia el Pixel ID
4. Agrega a variables de entorno:
   ```
   NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXX
   ```

**Beneficios:**
- Crear audiencias personalizadas
- Retargeting de visitantes
- Optimizar ads
- Medir conversiones

---

### 3. **Google Search Console Verification** ✅
Verificación automática de tu sitio.

**Configuración:**
1. Ve a: https://search.google.com/search-console
2. Añade tu propiedad (doce25.precotracks.org)
3. Método: "HTML tag"
4. Copia el código de verificación
5. Agrega a variables de entorno:
   ```
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=tu_codigo_aqui
   ```

---

## 🚀 Cómo Configurar en AWS Amplify

### Paso 1: Variables de Entorno
1. Ve a tu app en Amplify Console
2. App Settings → Environment Variables
3. Añade estas variables:

```bash
# Google Analytics (OBLIGATORIO para tracking)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Meta Pixel (OPCIONAL - solo si haces ads)
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXX

# Google Search Console (OPCIONAL - para verificación)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=tu_codigo_verificacion

# Ya existentes (no tocar)
NEXT_PUBLIC_API_ENDPOINT=https://moo5jpvl56.execute-api.us-east-1.amazonaws.com/prod
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_jK2m3C6w6
NEXT_PUBLIC_COGNITO_CLIENT_ID=39hhotrvehs8rck3sbua8sabab
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_SITE_URL=https://doce25.precotracks.org
```

### Paso 2: Redeploy
Después de agregar variables, haz un redeploy:
```bash
git commit --allow-empty -m "Trigger redeploy for env vars"
git push origin main
```

---

## 📈 Usar los Eventos de Tracking

### En cualquier componente:
```typescript
import { trackEventRegistration, trackDonationClick } from '@/lib/analytics'

// Cuando alguien se registra a un evento
trackEventRegistration('Limpieza Playa Luquillo', 'event-123')

// Cuando alguien hace click en donar
trackDonationClick('homepage_button')

// Interacción con el mapa
trackMapInteraction('Manatí')
```

---

## 🎯 Dashboards que tendrás

### Google Analytics:
- Visitantes en tiempo real
- Páginas más visitadas
- Eventos de conversión
- Fuentes de tráfico (Google, Facebook, directo)
- Demografía de usuarios
- Comportamiento por dispositivo

### Meta Pixel:
- Audiencias para retargeting
- Conversiones de ads
- Eventos personalizados
- ROI de campañas

---

## 🔍 Verificar que Funciona

### Google Analytics:
1. Ve a analytics.google.com
2. Realtime → Overview
3. Visita tu sitio en otra pestaña
4. Deberías verte aparecer en tiempo real

### Meta Pixel:
1. Instala extensión: Meta Pixel Helper (Chrome)
2. Visita tu sitio
3. El ícono de la extensión se pondrá verde si detecta el pixel

---

## ⚡ Performance Optimizations

Ya incluidos:
- ✅ `preconnect` para cargar scripts más rápido
- ✅ `dns-prefetch` para resolver DNS antes
- ✅ Scripts `async` para no bloquear renderizado
- ✅ Verificación de variables antes de cargar scripts

---

## 📊 Métricas Clave a Monitorear

1. **Registros a Eventos**
   - Cuántos por día/semana
   - Tasa de conversión (visitantes → registros)
   - Fuente de tráfico con más registros

2. **Donaciones**
   - Clicks en botón donar
   - Páginas que generan más clicks
   - Tasa de conversión

3. **Engagement**
   - Tiempo en sitio
   - Páginas por sesión
   - Interacciones con mapa
   - Rebote vs conversión

---

## 🎁 BONUS: Scripts Adicionales Recomendados

### Hotjar (Heatmaps y Grabaciones)
```html
<!-- Ver cómo usan el sitio visualmente -->
Costo: Gratis hasta 35 sesiones/día
```

### Mailchimp (Email Marketing)
```html
<!-- Formularios de newsletter -->
Costo: Gratis hasta 500 contactos
```

### Microsoft Clarity (Analytics Gratis)
```html
<!-- Similar a GA pero con heatmaps incluidos -->
Costo: GRATIS sin límites
```

---

## 🚀 Próximos Pasos

1. **AHORA:** Configura Google Analytics (30 min)
2. **Esta semana:** Envía sitemap a Search Console
3. **Si haces ads:** Configura Meta Pixel
4. **Mes 1:** Analiza datos, optimiza páginas lentas
5. **Mes 2:** Crea campaña de ads basada en datos

---

¿Necesitas ayuda configurando alguno de estos? ¡Dime cuál! 🎯

