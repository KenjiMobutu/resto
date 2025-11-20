# Architecture - RestoManager

Ce document décrit l'architecture technique de l'application RestoManager.

## 🏗️ Vue d'ensemble

RestoManager est une application mobile cross-platform construite avec React Native et Expo, utilisant une architecture moderne et scalable.

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile App (React Native)             │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────┐     │
│  │  Screens   │  │ Components  │  │  Navigation  │     │
│  └─────┬──────┘  └──────┬──────┘  └──────┬───────┘     │
│        │                │                 │              │
│  ┌─────▼────────────────▼─────────────────▼───────┐     │
│  │           Zustand State Management             │     │
│  └─────┬────────────────┬─────────────────┬───────┘     │
│        │                │                 │              │
│  ┌─────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐      │
│  │  Services  │  │   Supabase  │  │   Stripe    │      │
│  └────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │          Backend Services             │
        │  ┌──────────┐  ┌────────┐  ┌──────┐ │
        │  │ Supabase │  │ Stripe │  │Twilio│ │
        │  │PostgreSQL│  │  API   │  │ SMS  │ │
        │  └──────────┘  └────────┘  └──────┘ │
        └──────────────────────────────────────┘
```

## 📱 Frontend Architecture

### Stack Technique

- **Framework**: React Native 0.81 avec Expo SDK 54
- **Language**: TypeScript 5.9
- **Navigation**: React Navigation v7
- **State Management**: Zustand
- **UI**: Custom components
- **Animations**: React Native Reanimated v4
- **Gestures**: React Native Gesture Handler

### Structure des Dossiers

```
src/
├── components/          # Composants réutilisables
│   ├── common/         # UI de base (Button, Input, Card, etc.)
│   ├── reservations/   # Composants spécifiques réservations
│   ├── clients/        # Composants spécifiques clients
│   ├── orders/         # Composants spécifiques commandes
│   ├── floor/          # Composants plan de salle
│   └── payments/       # Composants paiements
│
├── screens/            # Écrans de l'app
│   ├── LoginScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── ReservationsScreen.tsx
│   ├── ClientsScreen.tsx
│   ├── OrdersScreen.tsx
│   └── FloorScreen.tsx
│
├── navigation/         # Configuration navigation
│   └── AppNavigator.tsx
│
├── stores/             # State management Zustand
│   ├── authStore.ts
│   ├── reservationStore.ts
│   ├── clientStore.ts
│   ├── orderStore.ts
│   ├── waitlistStore.ts
│   └── floorStore.ts
│
├── services/           # Services externes
│   ├── supabase.ts
│   ├── stripe.ts
│   └── sms.ts
│
├── types/              # Définitions TypeScript
│   └── index.ts
│
├── utils/              # Fonctions utilitaires
└── hooks/              # Custom React hooks
```

## 🧩 Patterns et Principes

### Component Pattern

Chaque composant suit la structure :
```typescript
interface ComponentProps {
  // Props typées
}

export const Component: React.FC<ComponentProps> = ({ props }) => {
  // Logique
  return (
    // JSX
  );
};

const styles = StyleSheet.create({
  // Styles
});
```

### Store Pattern (Zustand)

```typescript
interface StoreState {
  data: Type[];
  loading: boolean;
  fetchData: () => Promise<void>;
  updateData: (id: string, updates: Partial<Type>) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  data: [],
  loading: false,

  fetchData: async () => {
    set({ loading: true });
    // Fetch logic
    set({ data: result, loading: false });
  },

  updateData: async (id, updates) => {
    // Update logic
    set((state) => ({
      data: state.data.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  },
}));
```

### Service Pattern

Services encapsulent la logique externe :
```typescript
export const serviceMethod = async (params) => {
  try {
    const { data, error } = await externalAPI.method(params);
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};
```

## 🗄️ Backend Architecture

### Supabase

**PostgreSQL Database** :
- Tables relationnelles normalisées
- Row Level Security (RLS) activé
- Triggers pour timestamps automatiques
- Indexes pour performances

**Authentication** :
- JWT-based auth
- Secure token storage (Expo SecureStore)
- Session persistence

**Real-time** :
- WebSocket connections
- Live updates pour tables, commandes, réservations

**Storage** :
- Images (avatars, photos plats)
- Buckets avec permissions

**Edge Functions** (Deno) :
- `send-sms` : Envoi SMS via Twilio
- `create-payment-intent` : Création payment Stripe
- `confirm-payment` : Confirmation paiement
- `create-refund` : Remboursements

### Database Schema

```sql
restaurants (1) ──┬── (N) users
                  ├── (N) clients
                  ├── (N) tables
                  ├── (N) reservations
                  ├── (N) waitlist
                  ├── (N) orders
                  ├── (N) menu_items
                  └── (N) tags

reservations (N) ── (1) clients
reservations (N) ── (1) tables

orders (N) ── (1) tables
orders (N) ── (1) clients

waitlist (N) ── (1) clients
```

### Row Level Security (RLS)

Chaque table a des policies :
- SELECT : Users peuvent voir données de leur restaurant
- INSERT/UPDATE/DELETE : Basé sur le rôle utilisateur
- Owner a tous les droits
- Manager peut tout gérer
- Serveurs accès limité

Exemple :
```sql
CREATE POLICY "Users can view clients in their restaurant"
ON clients FOR SELECT
USING (restaurant_id IN (
  SELECT restaurant_id FROM users WHERE id = auth.uid()
));
```

## 🔐 Sécurité

### Authentication Flow

```
1. User enters credentials
   ↓
2. Supabase Auth validates
   ↓
3. JWT token returned
   ↓
4. Token stored in SecureStore
   ↓
5. Token attached to all requests
   ↓
6. RLS validates permissions
```

### Data Security

- **Encrypted Storage** : SecureStore pour tokens sensibles
- **HTTPS Only** : Toutes les communications
- **Environment Variables** : Secrets non commités
- **RLS** : Contrôle d'accès au niveau database
- **JWT** : Tokens avec expiration

### Validation

- **Client-side** : Validation immédiate UX
- **Server-side** : Validation dans RLS et Edge Functions
- **Type-safety** : TypeScript partout

## 📡 API Communication

### Supabase Client

```typescript
// Query
const { data, error } = await supabase
  .from('table')
  .select('*')
  .eq('field', value);

// Insert
const { data, error } = await supabase
  .from('table')
  .insert(newData);

// Update
const { error } = await supabase
  .from('table')
  .update(updates)
  .eq('id', id);

// Real-time
supabase
  .channel('table-changes')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'orders' },
    (payload) => handleChange(payload)
  )
  .subscribe();
```

### Error Handling

```typescript
try {
  const { data, error } = await operation();
  if (error) throw error;
  return { success: true, data };
} catch (error) {
  console.error('Operation failed:', error);
  return { success: false, error };
}
```

## 🎨 UI/UX Architecture

### Design System

**Colors** :
- Primary: #007AFF (iOS Blue)
- Success: #10B981 (Green)
- Warning: #F59E0B (Orange)
- Danger: #EF4444 (Red)
- Gray Scale: #111827 → #F9FAFB

**Typography** :
- Headers: 24-32px, Bold
- Body: 14-16px, Regular
- Small: 12-13px, Regular

**Spacing** :
- Base unit: 4px
- Common: 8px, 12px, 16px, 20px, 24px

### Component Library

Tous les composants suivent :
- Props typées TypeScript
- Variants (primary, secondary, etc.)
- Sizes (small, medium, large)
- Disabled states
- Loading states

### Navigation Structure

```
App
├── Auth Stack (not logged in)
│   └── Login
│
└── Main Tabs (logged in)
    ├── Dashboard (Home)
    ├── Reservations
    ├── Clients
    ├── Orders
    └── Floor Plan
```

## 🔄 State Management

### Zustand Stores

**authStore** :
- user, session
- signIn, signOut, loadUser

**reservationStore** :
- reservations[]
- fetchReservations, createReservation, updateReservation

**clientStore** :
- clients[]
- fetchClients, searchClients, createClient

**orderStore** :
- orders[]
- createOrder, updateOrder, addItem, removeItem

**waitlistStore** :
- waitlist[]
- addToWaitlist, notifyClient, removeFromWaitlist

**floorStore** :
- tables[], elements[]
- fetchFloor, updateTablePosition, changeTableStatus

### Data Flow

```
User Action
   ↓
Component calls Store method
   ↓
Store method calls Service/Supabase
   ↓
Service returns result
   ↓
Store updates state
   ↓
Components re-render (automatic via Zustand)
```

## 🧪 Testing Strategy

### Unit Tests
- Stores logic
- Utility functions
- Services

### Integration Tests
- API calls
- Store + Service integration

### E2E Tests
- Critical user flows
- Detox for React Native

## 📊 Performance

### Optimizations

**React** :
- Memoization (useMemo, useCallback)
- Lazy loading screens
- Virtualized lists (FlatList)

**Database** :
- Indexes sur colonnes fréquemment requêtées
- Pagination des résultats
- Select only necessary fields

**Images** :
- Compressed assets
- Lazy loading
- Caching

**Network** :
- Request batching
- Optimistic updates
- Offline-first approach (future)

### Monitoring

- Expo Application Services (EAS)
- Supabase Dashboard
- Sentry pour error tracking (future)
- Analytics (future)

## 🔮 Future Architecture

### Planned Improvements

1. **Offline-First** :
   - SQLite local database
   - Sync avec Supabase
   - Queue pour actions offline

2. **Microservices** :
   - Séparer certaines Edge Functions
   - Service indépendant pour analytics

3. **GraphQL** :
   - Remplacer REST par GraphQL
   - Meilleure gestion des requêtes complexes

4. **Push Notifications** :
   - FCM/APNS via Expo
   - In-app notifications real-time

5. **WebSockets** :
   - Real-time updates partout
   - Live collaboration

## 📚 Documentation

- **Code** : JSDoc pour fonctions complexes
- **Types** : Interfaces TypeScript documentées
- **APIs** : OpenAPI spec pour Edge Functions
- **Architecture** : Ce document

## 🤝 Contribution Guidelines

Pour contribuer :
1. Fork le repo
2. Créer une branch feature
3. Suivre les conventions de code
4. Écrire des tests
5. Soumettre une PR

### Code Style

- ESLint + Prettier
- TypeScript strict mode
- Naming conventions :
  - Components : PascalCase
  - Functions : camelCase
  - Constants : UPPER_SNAKE_CASE
  - Files : PascalCase for components, camelCase for utils

---

Cette architecture garantit :
✅ Scalabilité
✅ Maintenabilité
✅ Performance
✅ Sécurité
✅ Developer Experience
