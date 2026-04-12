# 📧 Script de Envío de Email de Postergación

Este script envía un email masivo a todos los participantes registrados en un evento, notificándoles sobre la postergación de la limpieza de playa.

## 🚀 Uso

```bash
node scripts/send-postponement-email.js <eventId>
```

### Ejemplo:

```bash
node scripts/send-postponement-email.js 507f1f77bcf86cd799439011
```

## 📋 Requisitos

1. **Variables de entorno configuradas** en `.env.local`:
   ```
   AWS_REGION=us-east-1
   SES_FROM_EMAIL=doce25@precotracks.org
   REGISTRATIONS_TABLE=Dosce25-Registrations
   ```

2. **Credenciales AWS** configuradas:
   - Las credenciales deben estar disponibles en tu sistema (via `~/.aws/credentials` o variables de entorno)
   - El usuario debe tener permisos para:
     - `dynamodb:Query` en la tabla de registros
     - `ses:SendEmail` para enviar emails

3. **Dependencias instaladas**:
   ```bash
   npm install
   ```

## 📧 Contenido del Email

El email incluye:
- ✅ Saludo personalizado
- ✅ Agradecimiento por el registro
- ✅ Explicación de la postergación
- ✅ Nueva fecha: **12 de abril**
- ✅ Confirmación de que el registro sigue siendo válido
- ✅ Diseño HTML profesional
- ✅ Versión de texto plano

## 🔄 Flujo del Script

1. **Obtiene el eventId** de los argumentos
2. **Consulta DynamoDB** para obtener todos los registros del evento
3. **Envía emails** a cada participante con delay de 100ms entre ellos
4. **Muestra resumen** con cantidad de exitosos y fallidos

## 📊 Salida Esperada

```
🚀 Iniciando envío de emails de postergación...

📧 De: doce25@precotracks.org
🎯 Evento: 507f1f77bcf86cd799439011

📋 Obteniendo registros del evento: 507f1f77bcf86cd799439011
📊 Total de registros encontrados: 45

Enviando emails...

✅ Email enviado a: juan@example.com (Juan Pérez)
✅ Email enviado a: maria@example.com (María García)
...

==================================================
📊 RESUMEN DE ENVÍO
==================================================
✅ Exitosos: 45
❌ Fallidos: 0
📧 Total: 45
==================================================

🎉 ¡Todos los emails fueron enviados exitosamente!
```

## ⚠️ Notas Importantes

- **Sin notificaciones de AWS**: El script usa SES directamente sin generar notificaciones
- **Delay entre emails**: 100ms entre cada email para evitar throttling
- **Manejo de errores**: Si un email falla, continúa con los siguientes
- **Logs detallados**: Cada email muestra su estado (✅ o ❌)

## 🔧 Troubleshooting

### Error: "No se encontraron registros"
- Verifica que el `eventId` sea correcto
- Asegúrate de que hay registros en la tabla para ese evento

### Error: "Permiso denegado"
- Verifica que tus credenciales AWS tienen permisos para DynamoDB y SES
- Revisa que la región es correcta

### Error: "Email no enviado"
- Verifica que el email está verificado en SES (si estás en sandbox)
- Revisa que el formato del email es válido

## 📝 Personalización

Para cambiar el contenido del email, edita las variables:
- `EMAIL_SUBJECT`: Asunto del email
- `EMAIL_HTML`: Contenido HTML
- `EMAIL_TEXT`: Contenido de texto plano

## 🛡️ Seguridad

- ✅ No almacena credenciales en el código
- ✅ Usa variables de entorno
- ✅ No genera notificaciones de AWS
- ✅ Logs locales solamente
