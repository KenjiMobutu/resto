# RestoManager - Application Mobile pour Restaurateurs

Application mobile complète pour la gestion de restaurants, développée avec React Native (Expo) pour iOS et Android.

## 🚀 Fonctionnalités

### Gestion des Réservations
- Création et modification de réservations
- Vue calendrier avec navigation par date
- Gestion du statut des réservations (en attente, confirmée, installée, terminée)
- Affichage des informations clients et allergies
- Attribution automatique de tables

### Gestion Clients
- Base de données clients complète
- Système de tags personnalisables
- Suivi des allergies et restrictions alimentaires
- Historique des visites et dépenses
- Notes et préférences personnalisées
- Recherche avancée

### Liste d'Attente
- Ajout rapide de clients en attente
- Estimation du temps d'attente
- Notifications SMS automatiques
- Gestion du statut (en attente, notifié, installé)

### Prise de Commandes
- Interface intuitive pour prendre les commandes
- Gestion des articles et modificateurs
- Calcul automatique des totaux (sous-total, taxes, pourboire)
- Suivi du statut des commandes (en attente, en cours, prête, servie, payée)
- Association aux tables

### Plan de Salle Interactif
- Vue en temps réel du plan de salle
- Drag & drop pour organiser les tables
- Statuts visuels des tables (disponible, occupée, réservée, nettoyage)
- Formes personnalisables (ronde, carrée, rectangulaire)
- Ajout d'éléments de décoration

### Système de Paiement
- Intégration Stripe complète
- Paiement par carte
- Gestion des pourboires
- Historique des transactions

### Gestion Utilisateurs
- Système de rôles (Propriétaire, Manager, Serveur, Hôte, Cuisine)
- Authentification sécurisée
- Vues personnalisées par rôle
- Permissions granulaires

### Notifications
- Notifications push
- SMS pour liste d'attente
- Rappels de réservation
- Alertes commandes

## 📱 Stack Technique

- **Framework**: React Native avec Expo SDK 54
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **Paiements**: Stripe
- **SMS**: Twilio (via Supabase Edge Functions)
- **Animations**: React Native Reanimated
- **Drag & Drop**: React Native Gesture Handler
- **UI**: Components personnalisés
- **Build**: EAS Build

## 🛠 Installation

### Prérequis
- Node.js 18+ et npm/yarn
- Compte Expo (gratuit)
- Compte Supabase (gratuit)
- Compte Stripe (optionnel)
- Compte Twilio (optionnel pour SMS)

### 1. Cloner et installer

```bash
# Installer les dépendances
npm install

# Ou avec yarn
yarn install
```

### 2. Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Copier l'URL du projet et la clé anonyme
3. Exécuter le fichier `supabase-schema.sql` dans l'éditeur SQL Supabase
4. Créer un fichier `.env` à la racine :

```bash
cp .env.example .env
```

5. Remplir les variables d'environnement dans `.env`

### 3. Configuration des Edge Functions (optionnel)

Pour les SMS et paiements, créer les Edge Functions Supabase :

#### Fonction SMS (`supabase/functions/send-sms/index.ts`)
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Twilio from 'https://esm.sh/twilio@4.10.0'

const twilioClient = Twilio(
  Deno.env.get('TWILIO_ACCOUNT_SID'),
  Deno.env.get('TWILIO_AUTH_TOKEN')
)

serve(async (req) => {
  const { to, message } = await req.json()

  try {
    const result = await twilioClient.messages.create({
      body: message,
      to: to,
      from: Deno.env.get('TWILIO_PHONE_NUMBER')
    })

    return new Response(JSON.stringify({ success: true, data: result }))
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})
```

#### Fonction Paiement (`supabase/functions/create-payment-intent/index.ts`)
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@11.1.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2022-11-15',
})

serve(async (req) => {
  const { amount, currency, orderId } = await req.json()

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { orderId }
    })

    return new Response(JSON.stringify({
      success: true,
      data: { clientSecret: paymentIntent.client_secret }
    }))
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})
```

Déployer les fonctions :
```bash
supabase functions deploy send-sms
supabase functions deploy create-payment-intent
```

### 4. Configuration Stripe (optionnel)

1. Créer un compte sur [stripe.com](https://stripe.com)
2. Récupérer les clés API (test/production)
3. Ajouter les clés dans `.env`

### 5. Configuration Twilio (optionnel)

1. Créer un compte sur [twilio.com](https://twilio.com)
2. Acheter un numéro de téléphone
3. Récupérer Account SID et Auth Token
4. Ajouter dans `.env`

## 🏃 Lancer l'application

### Développement

```bash
# Démarrer Expo
npm start

# Ou
npx expo start
```

Puis :
- Presser `i` pour iOS Simulator
- Presser `a` pour Android Emulator
- Scanner le QR code avec Expo Go sur votre téléphone

### Build pour production

1. Installer EAS CLI :
```bash
npm install -g eas-cli
```

2. Se connecter à Expo :
```bash
eas login
```

3. Configurer le projet :
```bash
eas build:configure
```

4. Mettre à jour `app.json` avec votre `projectId` (obtenu lors de la configuration)

5. Build iOS :
```bash
# Simulator
eas build --platform ios --profile development

# Production
eas build --platform ios --profile production
```

6. Build Android :
```bash
# APK
eas build --platform android --profile preview

# Production
eas build --platform android --profile production
```

## 📂 Structure du Projet

```
resto/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── common/         # Boutons, Inputs, Cards, etc.
│   │   ├── reservations/   # Composants réservations
│   │   ├── clients/        # Composants clients
│   │   ├── orders/         # Composants commandes
│   │   ├── floor/          # Composants plan de salle
│   │   └── payments/       # Composants paiements
│   ├── screens/            # Écrans de l'application
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── ReservationsScreen.tsx
│   │   ├── ClientsScreen.tsx
│   │   ├── OrdersScreen.tsx
│   │   └── FloorScreen.tsx
│   ├── navigation/         # Configuration navigation
│   │   └── AppNavigator.tsx
│   ├── stores/             # State management (Zustand)
│   │   ├── authStore.ts
│   │   ├── reservationStore.ts
│   │   ├── clientStore.ts
│   │   ├── orderStore.ts
│   │   ├── waitlistStore.ts
│   │   └── floorStore.ts
│   ├── services/           # Services externes
│   │   ├── supabase.ts
│   │   ├── stripe.ts
│   │   └── sms.ts
│   ├── types/              # Types TypeScript
│   │   └── index.ts
│   └── utils/              # Utilitaires
├── assets/                 # Images, fonts, etc.
├── supabase-schema.sql     # Schéma base de données
├── eas.json               # Configuration EAS Build
├── app.json               # Configuration Expo
├── .env.example           # Variables d'environnement exemple
└── README.md
```

## 🔒 Sécurité

- Authentification sécurisée via Supabase Auth
- Row Level Security (RLS) activé sur toutes les tables
- Stockage sécurisé des tokens avec Expo SecureStore
- Variables d'environnement pour les clés sensibles
- HTTPS uniquement pour toutes les communications

## 🌍 Déploiement

### iOS (App Store)

1. Avoir un compte Apple Developer (99€/an)
2. Configurer les certificats et provisioning profiles
3. Build avec EAS :
```bash
eas build --platform ios --profile production
```
4. Soumettre via EAS Submit :
```bash
eas submit --platform ios
```

### Android (Google Play)

1. Avoir un compte Google Play Developer (25$ one-time)
2. Créer un keystore Android
3. Build avec EAS :
```bash
eas build --platform android --profile production
```
4. Soumettre via EAS Submit :
```bash
eas submit --platform android
```

## 📊 Base de données

Le schéma complet est dans `supabase-schema.sql` avec :
- Tables relationnelles PostgreSQL
- Indexes pour performances optimales
- Row Level Security (RLS)
- Triggers pour timestamps automatiques
- Types ENUM pour données structurées

### Tables principales :
- `restaurants` - Informations restaurant
- `users` - Utilisateurs et permissions
- `clients` - Base clients
- `reservations` - Réservations
- `waitlist` - Liste d'attente
- `tables` - Tables du restaurant
- `orders` - Commandes
- `menu_items` - Carte/menu
- `notifications` - Notifications

## 🔧 Personnalisation

### Couleurs
Modifier les couleurs dans les fichiers de composants ou créer un fichier `theme.ts`.

### Rôles utilisateurs
Ajouter/modifier dans `src/types/index.ts` enum `UserRole`.

### Statuts
Personnaliser les statuts dans les enums TypeScript.

## 📱 Fonctionnalités à venir

- [ ] Analytics et rapports
- [ ] Export de données (PDF, Excel)
- [ ] QR Code pour menus
- [ ] Intégration caméra pour photos
- [ ] Mode offline avec sync
- [ ] Multi-restaurants
- [ ] Programme fidélité
- [ ] Gestion du stock
- [ ] Planning du personnel

## 🤝 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Consulter la documentation Expo : [docs.expo.dev](https://docs.expo.dev)
- Documentation Supabase : [supabase.com/docs](https://supabase.com/docs)

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

## 🙏 Crédits

Développé avec :
- React Native & Expo
- Supabase
- Stripe
- Twilio
