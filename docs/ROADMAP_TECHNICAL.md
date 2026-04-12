# 🗺 Roadmap Técnico - Plataforma White Label

## Fase 1: Foundation & Backend Multi-Tenant (Semanas 1-6)

### Week 1-2: Database & Infrastructure Setup

#### 1.1 DynamoDB Schema Implementation
```bash
# Crear tabla con GSIs
aws dynamodb create-table \
  --table-name nonprofit-platform-prod \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
    AttributeName=GSI1PK,AttributeType=S \
    AttributeName=GSI1SK,AttributeType=S \
    AttributeName=GSI2PK,AttributeType=S \
    AttributeName=GSI2SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --global-secondary-indexes \
    '[
      {
        "IndexName": "GSI1",
        "KeySchema": [
          {"AttributeName":"GSI1PK","KeyType":"HASH"},
          {"AttributeName":"GSI1SK","KeyType":"RANGE"}
        ],
        "Projection": {"ProjectionType":"ALL"},
        "ProvisionedThroughput": {
          "ReadCapacityUnits": 5,
          "WriteCapacityUnits": 5
        }
      },
      {
        "IndexName": "GSI2",
        "KeySchema": [
          {"AttributeName":"GSI2PK","KeyType":"HASH"},
          {"AttributeName":"GSI2SK","KeyType":"RANGE"}
        ],
        "Projection": {"ProjectionType":"ALL"},
        "ProvisionedThroughput": {
          "ReadCapacityUnits": 5,
          "WriteCapacityUnits": 5
        }
      }
    ]' \
  --billing-mode PAY_PER_REQUEST
```

**Tareas:**
- [x] Diseñar single-table schema completo
- [ ] Crear script de setup de DynamoDB
- [ ] Implementar seeding de datos de prueba
- [ ] Crear diagramas de access patterns

#### 1.2 Cognito Multi-Tenant Setup
```yaml
# SAM template addition
  NonProfitUserPool:
    Type: AWS::Cognito::UserPool
    Properties:
      UserPoolName: nonprofit-platform-users
      UsernameAttributes:
        - email
      Schema:
        - Name: email
          Required: true
        - Name: orgId
          AttributeDataType: String
          Mutable: true
        - Name: role
          AttributeDataType: String
          Mutable: true
        - Name: orgName
          AttributeDataType: String
          Mutable: true
      Policies:
        PasswordPolicy:
          MinimumLength: 8
          RequireUppercase: true
          RequireLowercase: true
          RequireNumbers: true
```

**Tareas:**
- [ ] Configurar Cognito User Pool con custom attributes
- [ ] Crear User Pool Client para web
- [ ] Crear User Pool Client para mobile
- [ ] Configurar custom claims (orgId, role)
- [ ] Setup pre-token generation Lambda

#### 1.3 API Gateway & Lambda Base
**Tareas:**
- [ ] Crear estructura de carpetas para Lambdas multi-tenant
- [ ] Implementar Lambda Authorizer con tenant validation
- [ ] Crear middleware de tenant isolation
- [ ] Setup SAM template para multi-tenant architecture

### Week 3-4: Core APIs - Organizations & Users

#### 2.1 Organization Management APIs

**POST /api/organizations** - Create Organization
```typescript
// lambda/create-organization/index.ts
interface CreateOrgRequest {
  name: string;
  slug: string;
  email: string;
  adminUser: {
    email: string;
    name: string;
    password: string;
  };
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
}

// Response
{
  orgId: string;
  slug: string;
  adminUserId: string;
  cognitoPoolId: string;
}
```

**GET /api/organizations/{slug}/public** - Get Org Config (Public)
```typescript
// Para que la app móvil cargue config sin auth
interface PublicOrgConfig {
  orgId: string;
  name: string;
  slug: string;
  branding: BrandingConfig;
  features: FeatureFlags;
  contact: {
    email: string;
    website?: string;
    social?: SocialLinks;
  };
}
```

**PUT /api/organizations/{orgId}** - Update Organization
**DELETE /api/organizations/{orgId}** - Delete Organization (soft delete)

**Tareas:**
- [ ] Implementar create-organization Lambda
- [ ] Implementar get-organization Lambda
- [ ] Implementar update-organization Lambda
- [ ] Implementar delete-organization Lambda
- [ ] Validación de slug único
- [ ] Setup default branding

#### 2.2 User Management APIs

**POST /api/users** - Create User (Signup)
**GET /api/users** - List Users (Admin only)
**GET /api/users/{userId}** - Get User
**PUT /api/users/{userId}** - Update User
**DELETE /api/users/{userId}** - Delete User

**Tareas:**
- [ ] Migrar existing user lambdas a multi-tenant
- [ ] Implementar role-based permissions
- [ ] Add orgId to all user operations

### Week 5-6: Events & Registrations Multi-Tenant

#### 3.1 Events APIs

**Modificar existing lambdas:**
- [ ] `create-event` - Add orgId
- [ ] `get-event` - Filter by orgId
- [ ] `get-events` - Filter by orgId
- [ ] `update-event` - Validate orgId ownership
- [ ] `delete-event` - Validate orgId ownership

#### 3.2 Registrations APIs

**Modificar existing lambdas:**
- [ ] `register-event` - Add orgId
- [ ] `get-registrations` - Filter by orgId
- [ ] `checkin-user` - Validate orgId

#### 3.3 QR Code Generation
```typescript
// lambda/generate-qr/index.ts
const generateQRCode = async (orgId: string, eventId: string, regId: string) => {
  const qrData = {
    o: orgId,      // org
    e: eventId,    // event
    r: regId,      // registration
    t: Date.now()  // timestamp
  };
  
  const encrypted = encrypt(JSON.stringify(qrData));
  return `QR:${encrypted}`;
};
```

**Tareas:**
- [ ] Crear Lambda de generación de QR
- [ ] Crear Lambda de validación de QR
- [ ] Implementar encriptación de QR codes
- [ ] Add QR to registration response

---

## Fase 2: Admin Panel Multi-Tenant (Semanas 7-11)

### Week 7-8: Org Dashboard & Setup

#### 4.1 Organization Onboarding Flow
```
/onboarding
  ├── /step1 - Organization Info
  ├── /step2 - Branding Setup
  ├── /step3 - Admin Account
  └── /complete - Success & Next Steps
```

**Components:**
- [ ] Multi-step form component
- [ ] Image uploader (logo, hero)
- [ ] Color picker
- [ ] Form validation
- [ ] Progress indicator

#### 4.2 Organization Settings Page
```
/dashboard/settings
  ├── /general - Name, description, contact
  ├── /branding - Logo, colors, images
  ├── /team - Invite admins/staff
  ├── /billing - Subscription management
  └── /danger - Delete organization
```

**Tareas:**
- [ ] Create settings layout
- [ ] Implement branding editor
- [ ] Image upload to S3
- [ ] Color customization with preview
- [ ] Team invitation system

#### 4.3 Dashboard Home
**Tareas:**
- [ ] Stats cards (events, volunteers, impact)
- [ ] Upcoming events list
- [ ] Recent activity feed
- [ ] Quick actions (create event, invite user)

### Week 9-10: Events Management

#### 5.1 Events List Page
**Tareas:**
- [ ] Tabs: Upcoming, Past, Drafts, Cancelled
- [ ] Search and filters
- [ ] Bulk actions
- [ ] Export to CSV

#### 5.2 Event Editor
**Tareas:**
- [ ] Rich text editor for description
- [ ] Date/time picker
- [ ] Location picker (map)
- [ ] Image upload
- [ ] Custom form fields builder
- [ ] Preview mode

#### 5.3 Event Details & Registrations
**Tareas:**
- [ ] Registrations table with search
- [ ] Check-in status indicator
- [ ] Manual check-in button
- [ ] Export registrations
- [ ] Send email to participants

### Week 11: Users & Analytics

#### 6.1 Volunteers Management
**Tareas:**
- [ ] Volunteers list with filters
- [ ] Individual volunteer profile
- [ ] Participation history
- [ ] Export volunteers data
- [ ] Tag/segment volunteers

#### 6.2 Basic Analytics
**Tareas:**
- [ ] Events over time chart
- [ ] Volunteer growth chart
- [ ] Check-in rate metrics
- [ ] Top volunteers leaderboard
- [ ] Impact summary

---

## Fase 3: Mobile App (Expo) (Semanas 12-16)

### Week 12: Expo Setup & Base Architecture

#### 7.1 Project Setup
```bash
npx create-expo-app@latest nonprofit-mobile-app --template tabs
cd nonprofit-mobile-app

# Install dependencies
npx expo install expo-router
npx expo install react-native-safe-area-context
npx expo install react-native-screens
npx expo install expo-constants
npx expo install expo-secure-store
npx expo install @tanstack/react-query
npx expo install zustand
npx expo install nativewind
npx expo install tailwindcss
```

**Estructura:**
```
nonprofit-mobile-app/
├── app/
│   ├── (public)/
│   │   └── welcome.tsx          # Landing screen
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── _layout.tsx
│   ├── (app)/
│   │   ├── (tabs)/
│   │   │   ├── index.tsx        # Events list
│   │   │   ├── impact.tsx       # Impact map
│   │   │   ├── profile.tsx      # User profile
│   │   │   └── _layout.tsx      # Tab bar
│   │   ├── event/
│   │   │   └── [id].tsx         # Event details
│   │   └── _layout.tsx
│   ├── _layout.tsx              # Root layout
│   └── +not-found.tsx
├── components/
│   ├── ui/                      # Base components
│   ├── EventCard.tsx
│   ├── ImpactMap.tsx
│   └── ThemedView.tsx
├── lib/
│   ├── api/
│   │   └── client.ts           # API client
│   ├── auth/
│   │   └── auth-service.ts     # Auth logic
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useEvents.ts
│   │   └── useTenant.ts
│   └── store/
│       ├── auth.ts             # Auth store
│       └── tenant.ts           # Tenant config store
├── config/
│   └── constants.ts            # API URLs, etc.
└── app.json
```

**Tareas:**
- [ ] Setup Expo project con Expo Router
- [ ] Configure NativeWind (Tailwind)
- [ ] Setup React Query
- [ ] Setup Zustand stores
- [ ] Create folder structure
- [ ] Setup TypeScript types

#### 7.2 Tenant Config System
```typescript
// lib/store/tenant.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TenantConfig {
  orgId: string;
  name: string;
  slug: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo: string;
    heroImage: string;
  };
  features: Record<string, boolean>;
}

interface TenantStore {
  config: TenantConfig | null;
  isLoaded: boolean;
  loadConfig: (slug: string) => Promise<void>;
  clearConfig: () => void;
}

export const useTenantStore = create<TenantStore>()(
  persist(
    (set) => ({
      config: null,
      isLoaded: false,
      loadConfig: async (slug: string) => {
        const response = await fetch(`${API_URL}/public/organizations/${slug}`);
        const config = await response.json();
        set({ config, isLoaded: true });
      },
      clearConfig: () => set({ config: null, isLoaded: false }),
    }),
    {
      name: 'tenant-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

**Tareas:**
- [ ] Implement tenant store
- [ ] Create API client with tenant context
- [ ] Implement config loader
- [ ] Add config validation

### Week 13: Auth Flow

#### 8.1 Authentication Implementation
```typescript
// lib/auth/auth-service.ts
import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import * as SecureStore from 'expo-secure-store';

export class AuthService {
  async login(email: string, password: string, orgId: string) {
    const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });
    
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });
    
    const response = await client.send(command);
    
    // Store tokens securely
    await SecureStore.setItemAsync('accessToken', response.AuthenticationResult.AccessToken);
    await SecureStore.setItemAsync('refreshToken', response.AuthenticationResult.RefreshToken);
    
    return response;
  }
  
  async logout() {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  }
  
  async getToken() {
    return await SecureStore.getItemAsync('accessToken');
  }
}
```

**Screens:**
- [ ] Welcome screen (select org or login)
- [ ] Login screen
- [ ] Signup screen
- [ ] Forgot password screen

**Tareas:**
- [ ] Implement AuthService
- [ ] Create auth screens
- [ ] Setup protected routes
- [ ] Handle token refresh
- [ ] Add loading states

### Week 14: Events & Registration

#### 9.1 Events List Screen
```typescript
// app/(app)/(tabs)/index.tsx
import { useEvents } from '@/lib/hooks/useEvents';
import { EventCard } from '@/components/EventCard';

export default function EventsScreen() {
  const { data: events, isLoading } = useEvents();
  
  return (
    <ScrollView>
      <Text className="text-2xl font-bold p-4">Próximos Eventos</Text>
      {events?.map(event => (
        <EventCard key={event.eventId} event={event} />
      ))}
    </ScrollView>
  );
}
```

**Tareas:**
- [ ] Create events list screen
- [ ] Implement EventCard component
- [ ] Add filters (upcoming, past)
- [ ] Implement pull-to-refresh
- [ ] Add empty states

#### 9.2 Event Details & Registration
```typescript
// app/(app)/event/[id].tsx
export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { data: event } = useEvent(id);
  const registerMutation = useRegisterForEvent();
  
  const handleRegister = () => {
    registerMutation.mutate({ eventId: id });
  };
  
  return (
    <ScrollView>
      <Image source={{ uri: event.image }} />
      <Text className="text-3xl font-bold">{event.name}</Text>
      <Text>{event.description}</Text>
      <Button onPress={handleRegister}>Registrarme</Button>
    </ScrollView>
  );
}
```

**Tareas:**
- [ ] Create event details screen
- [ ] Implement registration form
- [ ] Add location map
- [ ] Show registration status
- [ ] Generate QR code after registration

### Week 15: Profile & QR Check-in

#### 10.1 User Profile
**Tareas:**
- [ ] Display user info
- [ ] Show upcoming events
- [ ] Show past events & impact
- [ ] Edit profile
- [ ] Logout button

#### 10.2 QR Code Display
```typescript
// components/RegistrationQRCode.tsx
import QRCode from 'react-native-qrcode-svg';

export function RegistrationQRCode({ qrData }: { qrData: string }) {
  return (
    <View className="items-center p-4">
      <QRCode value={qrData} size={200} />
      <Text className="mt-4">Muestra este código en el evento</Text>
    </View>
  );
}
```

**Tareas:**
- [ ] Install QR code library
- [ ] Display QR code in event details
- [ ] Add to My Events section
- [ ] Implement QR scanner (for admins)

### Week 16: Impact Map & Polish

#### 11.1 Impact Map
```typescript
// app/(app)/(tabs)/impact.tsx
import MapView, { Marker } from 'react-native-maps';

export default function ImpactScreen() {
  const { data: locations } = useImpactLocations();
  
  return (
    <MapView className="flex-1">
      {locations?.map(loc => (
        <Marker
          key={loc.id}
          coordinate={{ latitude: loc.lat, longitude: loc.lng }}
          title={loc.name}
          description={`${loc.cleanups} limpiezas`}
        />
      ))}
    </MapView>
  );
}
```

**Tareas:**
- [ ] Install react-native-maps
- [ ] Display impact locations
- [ ] Add location details popup
- [ ] Add stats overlay
- [ ] Style map with brand colors

#### 11.2 Polish & Testing
**Tareas:**
- [ ] Add loading skeletons
- [ ] Implement error handling
- [ ] Add offline mode basics
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Fix responsive issues
- [ ] Add animations

---

## Fase 4: Advanced Features (Semanas 17-21)

### Week 17-18: Push Notifications

#### 12.1 Expo Notifications Setup
```typescript
// lib/notifications/push-service.ts
import * as Notifications from 'expo-notifications';

export class PushService {
  async registerForPushNotifications() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return null;
    
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  }
  
  async sendToBackend(token: string, userId: string) {
    await fetch(`${API_URL}/users/${userId}/push-token`, {
      method: 'PUT',
      body: JSON.stringify({ token }),
    });
  }
}
```

**Notification Types:**
- Event reminders (24h before, 1h before)
- New event published
- Registration confirmed
- Event updates/cancellations

**Tareas:**
- [ ] Setup Expo push notifications
- [ ] Store push tokens in backend
- [ ] Create Lambda for sending notifications
- [ ] Implement notification preferences
- [ ] Test notifications on devices

### Week 19: Offline Mode

#### 13.1 Offline Data Sync
```typescript
// lib/store/offline.ts
import NetInfo from '@react-native-community/netinfo';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingActions, setPendingActions] = useState([]);
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
      if (state.isConnected) {
        syncPendingActions();
      }
    });
    return unsubscribe;
  }, []);
  
  const syncPendingActions = async () => {
    for (const action of pendingActions) {
      await executeAction(action);
    }
    setPendingActions([]);
  };
};
```

**Tareas:**
- [ ] Install NetInfo
- [ ] Implement offline queue
- [ ] Cache events data
- [ ] Queue registrations offline
- [ ] Sync on reconnection
- [ ] Show offline indicator

### Week 20-21: Admin Features in Mobile

#### 14.1 Admin Mode Toggle
**Tareas:**
- [ ] Detect admin role from token
- [ ] Add admin menu in profile
- [ ] QR scanner for check-in
- [ ] Event stats view
- [ ] Manual check-in list

#### 14.2 QR Scanner for Check-in
```typescript
// app/(app)/admin/scanner.tsx
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function QRScannerScreen() {
  const checkinMutation = useCheckinUser();
  
  const handleBarCodeScanned = ({ data }) => {
    const qrData = parseQRCode(data);
    checkinMutation.mutate(qrData);
  };
  
  return (
    <BarCodeScanner
      onBarCodeScanned={handleBarCodeScanned}
      style={StyleSheet.absoluteFillObject}
    />
  );
}
```

**Tareas:**
- [ ] Request camera permissions
- [ ] Implement QR scanner
- [ ] Parse and validate QR
- [ ] Check-in user via API
- [ ] Show success/error feedback

---

## Fase 5: Production & Launch (Semanas 22-25)

### Week 22: Billing & Subscription

#### 15.1 Stripe Integration
**Tareas:**
- [ ] Setup Stripe account
- [ ] Create products & prices
- [ ] Implement checkout flow
- [ ] Create billing Lambda functions
- [ ] Subscription management UI
- [ ] Usage-based limits enforcement
- [ ] Webhooks for subscription events

### Week 23: White Label & Custom Domains

#### 16.1 Custom Domains (Enterprise)
**Tareas:**
- [ ] CloudFront distribution per org
- [ ] SSL certificate management
- [ ] DNS verification flow
- [ ] Subdomain setup UI

### Week 24: Testing & QA

#### 17.1 Testing Checklist
- [ ] Unit tests for critical functions
- [ ] Integration tests for APIs
- [ ] E2E tests for web (Playwright)
- [ ] Mobile app testing on real devices
- [ ] Load testing (1000 concurrent users)
- [ ] Security audit
- [ ] GDPR compliance check

### Week 25: Launch Preparation

#### 18.1 App Store Submissions
**Tareas:**
- [ ] Create App Store account
- [ ] Create Google Play account
- [ ] Prepare app icons & screenshots
- [ ] Write app descriptions
- [ ] Submit iOS app for review
- [ ] Submit Android app for review

#### 18.2 Marketing & Documentation
**Tareas:**
- [ ] Create landing page
- [ ] Write documentation
- [ ] Create video tutorials
- [ ] Setup help center
- [ ] Prepare launch announcement

#### 18.3 Soft Launch
**Tareas:**
- [ ] Migrate Doce25 as first org
- [ ] Invite 2-3 beta orgs
- [ ] Collect feedback
- [ ] Fix critical bugs
- [ ] Monitor performance

---

## 🎯 Success Metrics per Phase

### Fase 1 Success Criteria
- [ ] DynamoDB table created with all GSIs
- [ ] 10+ API endpoints working
- [ ] Multi-tenant auth flow tested
- [ ] Can create 2+ orgs with separate data

### Fase 2 Success Criteria
- [ ] Admin can create org in < 5 minutes
- [ ] Admin can create event in < 2 minutes
- [ ] Dashboard loads in < 2 seconds
- [ ] Can manage 100+ volunteers

### Fase 3 Success Criteria
- [ ] App builds successfully on iOS & Android
- [ ] User can register for event in < 1 minute
- [ ] QR code generates correctly
- [ ] App works offline (basic features)

### Fase 4 Success Criteria
- [ ] Push notifications deliver in < 10 seconds
- [ ] Offline actions sync on reconnection
- [ ] QR check-in works in < 2 seconds

### Fase 5 Success Criteria
- [ ] Apps approved in both stores
- [ ] 3+ paying organizations
- [ ] Zero critical bugs
- [ ] 95%+ uptime

---

## ⚠️ Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Expo limitations | Medium | Research before committing, have React Native bare workflow backup |
| DynamoDB hot partitions | High | Use composite keys, monitor metrics |
| App store rejection | High | Follow guidelines strictly, have pre-launch review |
| Multi-tenant data leak | Critical | Extensive testing, audit logs, encryption |
| Stripe integration complexity | Medium | Start simple, iterate on billing |

---

**Listo para comenzar Fase 1? 🚀**

Siguiente paso: Crear el schema de DynamoDB y los primeros Lambda functions.

