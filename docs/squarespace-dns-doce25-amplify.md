# DNS: doce25.org → AWS Amplify (doce25-web)

**Amplify App ID:** `d10lzd121ayedb`  
**Estado actual (última verificación por CLI):** `PENDING_VERIFICATION` hasta que agregues los registros en Squarespace.

**CloudFront (destino para `www` y apex según Amplify):** `d34xg9ra77sfb.cloudfront.net`

Agrega estos registros en **Squarespace → Dominios → doce25.org → DNS / DNS avanzado**.

## 1. Verificación SSL (ACM) — obligatoria primero

| Host / Nombre | Tipo | Valor (apunta a) |
|---------------|------|------------------|
| `_1ec9f8b1aca89d84b943482cea2cc729` | CNAME | `_499538278a3d6730141fdbeee5023b11.jkddzztszm.acm-validations.aws.` |

En algunos paneles el nombre completo es: `_1ec9f8b1aca89d84b943482cea2cc729.doce25.org`  
El valor debe terminar en punto final si el proveedor lo permite (es válido en DNS).

## 2. `www.doce25.org`

| Host / Nombre | Tipo | Valor |
|---------------|------|--------|
| `www` | CNAME | `d34xg9ra77sfb.cloudfront.net` |

## 3. Apex `doce25.org` (raíz, sin `www`)

Amplify muestra: **` CNAME d34xg9ra77sfb.cloudfront.net`** (registro en el dominio raíz).

Muchos paneles de Squarespace **no permiten CNAME en el apex**. Opciones:

1. **Delegar DNS a Route 53:** en Amplify, al configurar el dominio, elige administrar DNS con Amazon Route 53 y en Squarespace cambia los **nameservers** a los que Route 53 te indique (permite ALIAS en el apex).
2. **Solo usar `www`:** configura en Squarespace un redirect del apex a `https://www.doce25.org` si el panel lo permite; la app ya tiene regla en Amplify que redirige apex → `www` cuando el dominio quede activo.

## 4. Comprobar estado

```bash
aws amplify list-domain-associations --app-id d10lzd121ayedb --region us-east-1 \
  --query "domainAssociations[?domainName=='doce25.org'].[domainName,domainStatus,statusReason]" --output table
```

Cuando el certificado se valide y el DNS propaguen, el estado debe pasar a **AVAILABLE**.

## 5. Si reconfiguras el dominio en Amplify

Los CNAME de verificación y el hostname de CloudFront **pueden cambiar**. Vuelve a leer los valores en **Amplify Console → doce25-web → Hosting → Dominios personalizados → doce25.org**.
