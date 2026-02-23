# 🚀 Plataforma White Label para ONGs - Arquitectura Completa

## 📋 Tabla de Contenidos
1. [Visión General](#visión-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura Multi-Tenant](#arquitectura-multi-tenant)
4. [Modelo de Datos](#modelo-de-datos)
5. [Fases de Desarrollo](#fases-de-desarrollo)
6. [Seguridad y Escalabilidad](#seguridad-y-escalabilidad)

---

## 🎯 Visión General

### Producto Final
Una plataforma SaaS que permite a organizaciones sin fines de lucro crear y gestionar:
- ✅ Su propia app móvil con branding personalizado
- ✅ Sistema de eventos y registro de voluntarios
- ✅ Check-in con QR codes
- ✅ Mapas de impacto personalizados
- ✅ Dashboard administrativo
- ✅ Analytics e informes

### Modelo de Negocio
- **Freemium**: Plan gratuito con límites (ej: 3 eventos/mes, 50 voluntarios)
- **Pro**: $49/mes - Eventos ilimitados, branding completo
- **Enterprise**: $199/mes - White label completo, subdominios personalizados

---

## 🛠 Stack Tecnológico

### Frontend Móvil
```
├── Expo (React Native) - v50+
├── React Navigation - Navegación
├── React Query - Estado y cache
├── Zustand - Estado global ligero
├── NativeWind - Tailwind para React Native
└── Expo Router - File-based routing
```

### Frontend Web (Admin Panel)
```
├── Next.js 14+ - App Router
├── TypeScript
├── Tailwind CSS
├── shadcn/ui - Componentes
├── React Query - Data fetching
└── Zustand - Estado global
```

### Backend (Serverless)
```
├── AWS Lambda - Funciones
├── API Gateway - REST API
├── DynamoDB - Base de datos NoSQL
├── Cognito - Autenticación
├── S3 - Almacenamiento de assets
├── CloudFront - CDN
└── EventBridge - Eventos y automatización
```

### DevOps
```
├── AWS SAM - IaC (Infrastructure as Code)
├── GitHub Actions - CI/CD
├── EAS (Expo Application Services) - Build y deploy de apps
└── AWS Amplify - Deploy frontend
```

---

## 🏗 Arquitectura Multi-Tenant

### Estrategia: Single Database, Tenant Isolation by Key

```
┌─────────────────────────────────────────────────────────┐
│                    USUARIO FINAL                        │
│            (Voluntario de cualquier ONG)                │
└────────────────┬────────────────────────────────────────┘
                 │
        ┌────────┴─────────┐
        │                  │
   ┌────▼─────┐      ┌────▼──────┐
   │  Mobile  │      │    Web    │
   │   App    │      │  (Admin)  │
   │  (Expo)  │      │ (Next.js) │
   └────┬─────┘      └────┬──────┘
        │                 │
        └────────┬────────┘
                 │
        ┌────────▼────────────────┐
        │   API Gateway + Lambda  │
        │   (Tenant Middleware)   │
        └────────┬────────────────┘
                 │
        ┌────────▼────────────────┐
        │      DynamoDB           │
        │  (Multi-Tenant Data)    │
        │  PK: ORG#123#TYPE       │
        │  SK: ITEM#456           │
        └─────────────────────────┘
```

### Tenant Isolation
Cada request incluye:
1. **orgId** en el token JWT (Cognito claims)
2. Middleware valida que el usuario pertenece a la org
3. Todas las queries filtran por `orgId`

---

## 📊 Modelo de Datos (DynamoDB)

### Single Table Design

#### Tabla Principal: `nonprofit-platform`

| Entity Type | PK | SK | Attributes |
|------------|----|----|------------|
| Organization | `ORG#123` | `METADATA` | name, slug, branding, plan, createdAt |
| Organization Settings | `ORG#123` | `SETTINGS` | colors, logo, features, domain |
| User | `ORG#123#USER#abc` | `USER#abc` | email, name, role, phone |
| Event | `ORG#123#EVENT#xyz` | `EVENT#xyz` | name, date, location, status |
| Registration | `ORG#123#EVENT#xyz` | `REG#userId` | userData, checkedIn, timestamp |
| Impact Location | `ORG#123#IMPACT` | `LOC#xyz` | coordinates, cleanups, waste |

#### GSI 1: Query by Email (Global)
- **PK**: `EMAIL#user@email.com`
- **SK**: `ORG#123#USER#abc`
- Uso: Login, encontrar usuario en múltiples orgs

#### GSI 2: Query by Slug (Public lookups)
- **PK**: `SLUG#doce25`
- **SK**: `ORG#123`
- Uso: App carga datos de org por slug

#### GSI 3: Events by Date
- **PK**: `ORG#123#EVENTS`
- **SK**: `DATE#2026-03-15#EVENT#xyz`
- Uso: Listar eventos próximos

### Ejemplo de Items:

```json
// Organization
{
  "PK": "ORG#doce25",
  "SK": "METADATA",
  "orgId": "doce25",
  "name": "Doce25",
  "slug": "doce25",
  "email": "info@doce25.org",
  "plan": "enterprise",
  "branding": {
    "primaryColor": "#0891B2",
    "secondaryColor": "#14B8A6",
    "logo": "https://cdn.example.com/doce25/logo.png",
    "heroImage": "https://cdn.example.com/doce25/hero.jpg"
  },
  "features": {
    "maxEvents": -1,
    "maxVolunteers": -1,
    "customDomain": true,
    "analytics": true,
    "whiteLabel": true
  },
  "createdAt": "2026-01-01T00:00:00Z"
}

// User (Admin)
{
  "PK": "ORG#doce25#USER#user123",
  "SK": "USER#user123",
  "orgId": "doce25",
  "userId": "user123",
  "cognitoId": "cognito-sub-123",
  "email": "admin@doce25.org",
  "name": "Edgardo",
  "role": "admin", // admin, staff, volunteer
  "permissions": ["events.create", "events.edit", "users.view"],
  "createdAt": "2026-01-15T00:00:00Z"
}

// Event
{
  "PK": "ORG#doce25#EVENT#evt123",
  "SK": "EVENT#evt123",
  "GSI2PK": "ORG#doce25#EVENTS",
  "GSI2SK": "DATE#2026-03-15#EVENT#evt123",
  "orgId": "doce25",
  "eventId": "evt123",
  "name": "Limpieza Playa Luquillo",
  "slug": "limpieza-luquillo-marzo",
  "date": "2026-03-15",
  "time": "09:00",
  "location": "Playa Luquillo",
  "coordinates": {
    "lat": 18.3722,
    "lng": -65.7167
  },
  "description": "...",
  "status": "published",
  "maxParticipants": 100,
  "registrationCount": 45,
  "checkedInCount": 0,
  "createdBy": "user123",
  "createdAt": "2026-02-01T00:00:00Z"
}

// Registration
{
  "PK": "ORG#doce25#EVENT#evt123",
  "SK": "REG#user456",
  "orgId": "doce25",
  "eventId": "evt123",
  "userId": "user456",
  "registrationId": "reg789",
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "phone": "+1787...",
  "checkedIn": false,
  "checkedInAt": null,
  "qrCode": "QR#doce25#evt123#reg789",
  "registeredAt": "2026-02-20T15:30:00Z"
}
```

---

## 🔐 Seguridad y Aislamiento

### Autenticación Multi-Tenant

```javascript
// Lambda Authorizer
const validateToken = async (token) => {
  const decoded = jwt.verify(token, COGNITO_PUBLIC_KEY);
  
  return {
    userId: decoded.sub,
    orgId: decoded['custom:orgId'],
    role: decoded['custom:role'],
    permissions: decoded['custom:permissions']
  };
};

// Middleware en cada Lambda
const withTenantIsolation = (handler) => {
  return async (event, context) => {
    const { orgId, userId, role } = event.requestContext.authorizer;
    
    // Inyectar orgId en el contexto
    context.tenant = { orgId, userId, role };
    
    return handler(event, context);
  };
};
```

### Row Level Security
```javascript
// SIEMPRE filtrar por orgId
const getEvents = async (orgId) => {
  return await dynamoDB.query({
    TableName: 'nonprofit-platform',
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `ORG#${orgId}#EVENTS`,
      ':sk': 'EVENT#'
    }
  });
};
```

---

## 📱 App Móvil - Arquitectura Expo

### Estructura del Proyecto
```
nonprofit-app/
├── app/                    # Expo Router
│   ├── (auth)/            # Auth screens
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/            # Main app tabs
│   │   ├── index.tsx      # Home/Events
│   │   ├── impact.tsx     # Impact map
│   │   ├── profile.tsx    # User profile
│   │   └── _layout.tsx    # Tab navigation
│   ├── event/[id].tsx     # Event details
│   └── _layout.tsx        # Root layout
├── components/            # Shared components
│   ├── ui/               # Design system
│   ├── EventCard.tsx
│   └── ImpactMap.tsx
├── lib/                  # Business logic
│   ├── api/             # API client
│   ├── auth/            # Auth logic
│   ├── hooks/           # Custom hooks
│   └── store/           # Zustand stores
├── config/              # Configuration
│   └── tenant.ts        # Tenant config loader
└── assets/              # Static assets
```

### Tenant Configuration
```typescript
// config/tenant.ts
export interface TenantConfig {
  orgId: string;
  name: string;
  slug: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo: string;
    heroImage: string;
  };
  features: {
    eventsEnabled: boolean;
    impactMapEnabled: boolean;
    donationsEnabled: boolean;
  };
}

// La app carga config al inicio
export const loadTenantConfig = async (slug: string): Promise<TenantConfig> => {
  const response = await fetch(`${API_URL}/public/organizations/${slug}`);
  return response.json();
};
```

### Dynamic Branding
```typescript
// App aplica colores dinámicamente
import { useTenantStore } from '@/lib/store/tenant';

const EventCard = () => {
  const { branding } = useTenantStore();
  
  return (
    <View style={{ backgroundColor: branding.primaryColor }}>
      <Image source={{ uri: branding.logo }} />
      {/* ... */}
    </View>
  );
};
```

---

## 🌐 Admin Panel - Features

### Dashboard Principal
- Overview de eventos (próximos, pasados, draft)
- Estadísticas de voluntarios
- Gráficas de impacto
- Actividad reciente

### Gestión de Eventos
- Crear/editar/cancelar eventos
- Ver registros en tiempo real
- Exportar lista de participantes
- Check-in manual

### Gestión de Voluntarios
- Lista de todos los voluntarios
- Ver historial de participación
- Exportar datos

### Configuración de Organización
- **Branding**: Logo, colores, imágenes
- **Información**: Nombre, descripción, contacto
- **Dominio personalizado** (Enterprise)
- **Integraciones**: Google Analytics, Meta Pixel

### Gestión de Usuarios (Staff)
- Invitar admins/staff
- Roles y permisos
- Actividad de usuarios

---

## 🚀 Fases de Desarrollo

### **Fase 1: MVP Foundation (4-6 semanas)**
- [ ] Setup de infraestructura AWS multi-tenant
- [ ] Tabla DynamoDB con modelo multi-tenant
- [ ] APIs básicas (auth, orgs, events, registrations)
- [ ] Admin panel: Dashboard + Gestión de eventos
- [ ] Sistema de branding básico

**Entregable**: Panel web funcional para crear org y eventos

### **Fase 2: Mobile App (4-5 semanas)**
- [ ] Setup proyecto Expo con Expo Router
- [ ] Tenant config loader
- [ ] Auth flow (login/signup)
- [ ] Lista de eventos
- [ ] Detalle de evento + registro
- [ ] Perfil de usuario

**Entregable**: App móvil funcional para voluntarios

### **Fase 3: Advanced Features (4-5 semanas)**
- [ ] QR Code check-in
- [ ] Mapa de impacto en app móvil
- [ ] Push notifications (Expo Notifications)
- [ ] Offline mode (registro sin internet)
- [ ] Analytics dashboard

**Entregable**: Features avanzadas funcionando

### **Fase 4: Multi-Org & Production (3-4 semanas)**
- [ ] Onboarding flow para nuevas orgs
- [ ] Billing con Stripe
- [ ] Subdominios personalizados
- [ ] White label completo
- [ ] Tests y QA
- [ ] Launch en stores

**Entregable**: Plataforma en producción lista para clientes

---

## 💰 Pricing & Plans

### Free Tier
- 1 organización
- 3 eventos activos simultáneos
- 50 voluntarios máx
- Branding básico (logo + colores)
- "Powered by [Nombre Plataforma]"

### Pro - $49/mes
- Eventos ilimitados
- Voluntarios ilimitados
- Branding completo
- Analytics básico
- Email support

### Enterprise - $199/mes
- Todo lo de Pro +
- Subdominios personalizados (app.tuong.org)
- White label completo (sin marca)
- API access
- Priority support
- Onboarding asistido

---

## 📈 Métricas de Éxito

### Para ONGs
- Tiempo de setup < 15 minutos
- Tasa de registro de voluntarios > 80%
- Check-in rate > 90%
- NPS > 50

### Para la Plataforma
- Time to value < 1 día
- Churn rate < 5%
- Monthly Active Orgs growth
- LTV/CAC > 3:1

---

## 🎨 Nombre de la Plataforma (Ideas)

1. **Impactly** - Para crear impacto fácilmente
2. **VolunteerHub** - Hub para voluntarios
3. **NonProfitKit** - Kit todo-en-uno
4. **CauseCraft** - Craftea tu causa
5. **MissionApp** - App para tu misión
6. **GiveFlow** - Flujo de voluntariado
7. **DoGoodHub** - Hub para hacer el bien

---

## 🔧 Próximos Pasos Inmediatos

1. ✅ Documentación de arquitectura (este documento)
2. [ ] Diseñar schema DynamoDB detallado
3. [ ] Setup repo del proyecto Expo
4. [ ] Crear Lambda functions multi-tenant
5. [ ] Setup Admin Panel base
6. [ ] Migrar Doce25 como primera org

---

## 📞 Stack de Comunicación

### Para desarrollo
- GitHub Projects - Project management
- Linear/Jira - Issue tracking
- Figma - Diseño UI/UX
- Notion - Documentación

---

**¿Listo para empezar? 🚀**

Próximo paso: Crear el proyecto Expo base y configurar la estructura inicial.

