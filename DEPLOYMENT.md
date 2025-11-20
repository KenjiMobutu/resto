# Guide de Déploiement - RestoManager

Ce guide vous accompagne étape par étape pour déployer RestoManager sur iOS et Android.

## 📋 Prérequis

### Comptes requis
- [ ] Compte Expo (gratuit) - [expo.dev](https://expo.dev)
- [ ] Compte Supabase (gratuit) - [supabase.com](https://supabase.com)
- [ ] Compte Apple Developer ($99/an) - pour iOS
- [ ] Compte Google Play Developer ($25 one-time) - pour Android
- [ ] Compte Stripe (gratuit en test) - pour paiements
- [ ] Compte Twilio (gratuit en test) - pour SMS

### Outils
- Node.js 18+
- npm ou yarn
- Git
- EAS CLI

## 🚀 Étape 1 : Configuration Initiale

### 1.1 Installer les dépendances

```bash
npm install

# Installer EAS CLI globalement
npm install -g eas-cli
```

### 1.2 Se connecter à Expo

```bash
eas login
```

## 🗄️ Étape 2 : Configuration Supabase

### 2.1 Créer le projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Cliquer sur "New Project"
3. Remplir :
   - Nom du projet : `resto-manager`
   - Database password : choisir un mot de passe fort
   - Region : choisir la plus proche de vos utilisateurs
4. Attendre la création du projet (2-3 minutes)

### 2.2 Exécuter le schéma de base de données

1. Dans le projet Supabase, aller dans "SQL Editor"
2. Créer une nouvelle query
3. Copier-coller le contenu de `supabase-schema.sql`
4. Exécuter (bouton "Run")
5. Vérifier qu'il n'y a pas d'erreurs

### 2.3 Récupérer les clés API

1. Aller dans "Settings" > "API"
2. Copier :
   - Project URL (EXPO_PUBLIC_SUPABASE_URL)
   - anon/public key (EXPO_PUBLIC_SUPABASE_ANON_KEY)

### 2.4 Créer le fichier .env

```bash
cp .env.example .env
```

Remplir avec vos valeurs :
```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 💳 Étape 3 : Configuration Stripe (Optionnel)

### 3.1 Créer le compte Stripe

1. Aller sur [stripe.com](https://stripe.com)
2. Créer un compte
3. Activer le mode test

### 3.2 Récupérer les clés

1. Aller dans "Developers" > "API keys"
2. Copier :
   - Publishable key (commence par pk_)
   - Secret key (commence par sk_)
3. Ajouter dans `.env`

### 3.3 Créer les Edge Functions Stripe

Créer `supabase/functions/create-payment-intent/index.ts` :

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@11.1.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2022-11-15',
})

serve(async (req) => {
  try {
    const { amount, currency, orderId } = await req.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { orderId }
    })

    return new Response(
      JSON.stringify({
        success: true,
        data: { clientSecret: paymentIntent.client_secret }
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

Déployer :
```bash
# Installer Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy function
supabase functions deploy create-payment-intent --no-verify-jwt

# Set secrets
supabase secrets set STRIPE_SECRET_KEY=sk_test_xxxxx
```

## 📱 Étape 4 : Configuration SMS (Optionnel)

### 4.1 Créer le compte Twilio

1. Aller sur [twilio.com](https://twilio.com)
2. Créer un compte
3. Vérifier votre numéro de téléphone
4. Acheter un numéro Twilio ($1-2/mois)

### 4.2 Récupérer les credentials

1. Dans le Dashboard Twilio, copier :
   - Account SID
   - Auth Token
   - Phone Number
2. Ajouter dans `.env`

### 4.3 Créer l'Edge Function SMS

Créer `supabase/functions/send-sms/index.ts` :

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Twilio from 'https://esm.sh/twilio@4.10.0'

const twilioClient = Twilio(
  Deno.env.get('TWILIO_ACCOUNT_SID'),
  Deno.env.get('TWILIO_AUTH_TOKEN')
)

serve(async (req) => {
  try {
    const { to, message } = await req.json()

    const result = await twilioClient.messages.create({
      body: message,
      to: to,
      from: Deno.env.get('TWILIO_PHONE_NUMBER')
    })

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

Déployer :
```bash
supabase functions deploy send-sms --no-verify-jwt

supabase secrets set TWILIO_ACCOUNT_SID=ACxxxxx
supabase secrets set TWILIO_AUTH_TOKEN=xxxxx
supabase secrets set TWILIO_PHONE_NUMBER=+1234567890
```

## 📦 Étape 5 : Configuration EAS Build

### 5.1 Initialiser EAS

```bash
eas build:configure
```

Cela crée/met à jour :
- `eas.json`
- `app.json`

### 5.2 Mettre à jour app.json

Ouvrir `app.json` et vérifier/modifier :

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "VOTRE_PROJECT_ID_ICI"
      }
    }
  }
}
```

Le `projectId` est généré automatiquement lors de `eas build:configure`.

## 🍎 Étape 6 : Build iOS

### 6.1 Prérequis iOS

- Mac avec macOS (pour développement local)
- Xcode installé (optionnel)
- Compte Apple Developer actif

### 6.2 Configuration Apple Developer

1. Aller sur [developer.apple.com](https://developer.apple.com)
2. Se connecter avec Apple ID
3. Accepter les termes
4. Payer les $99/an si pas déjà fait

### 6.3 Build de développement

```bash
# Première fois, EAS va demander vos credentials Apple
eas build --platform ios --profile development

# Suivre les instructions
# Entrer votre Apple ID
# Accepter la 2FA
```

### 6.4 Build de production

```bash
eas build --platform ios --profile production
```

Cela :
- Crée les certificats et provisioning profiles
- Build l'app
- Fournit un fichier .ipa téléchargeable

### 6.5 Soumettre à l'App Store

```bash
eas submit --platform ios
```

Ou manuellement :
1. Télécharger le .ipa depuis EAS
2. Ouvrir Transporter (app Mac)
3. Drag & drop le .ipa
4. Upload

Ensuite dans App Store Connect :
1. Créer une nouvelle app
2. Remplir les métadonnées
3. Ajouter screenshots
4. Soumettre pour review

## 🤖 Étape 7 : Build Android

### 7.1 Prérequis Android

- Compte Google Play Developer ($25 one-time)

### 7.2 Configuration Google Play

1. Aller sur [play.google.com/console](https://play.google.com/console)
2. Payer les $25 si pas déjà fait
3. Créer une application

### 7.3 Build de développement/preview

```bash
# APK pour test
eas build --platform android --profile preview
```

### 7.4 Build de production

```bash
# Pour Google Play (AAB)
eas build --platform android --profile production
```

### 7.5 Soumettre à Google Play

```bash
eas submit --platform android
```

Ou manuellement :
1. Télécharger le .aab depuis EAS
2. Aller dans Google Play Console
3. Aller dans "Production" > "Create new release"
4. Upload le .aab
5. Remplir les notes de version
6. Review et publier

## 🔄 Étape 8 : Updates Over-The-Air (OTA)

Pour publier des mises à jour sans rebuild :

```bash
# Publier une update
eas update --branch production --message "Fix bug X"

# Pour un canal spécifique
eas update --branch preview --message "New feature Y"
```

Les utilisateurs recevront automatiquement les updates au prochain lancement.

## 🧪 Étape 9 : Tests

### 9.1 TestFlight (iOS)

Après le build iOS :
```bash
eas build --platform ios --profile preview
```

Inviter des testeurs :
1. Aller dans App Store Connect
2. TestFlight > Testers
3. Inviter par email

### 9.2 Internal Testing (Android)

Dans Google Play Console :
1. "Internal testing" > "Create new release"
2. Upload l'APK
3. Inviter testeurs par email

## 📊 Étape 10 : Monitoring

### 10.1 Expo Dashboard

- Voir les builds : [expo.dev/accounts/[account]/projects/resto-manager/builds](https://expo.dev)
- Voir les updates
- Voir les analytics

### 10.2 Supabase Dashboard

- Monitorer la base de données
- Voir les logs des Edge Functions
- Surveiller l'usage

### 10.3 Stripe Dashboard

- Voir les transactions
- Monitorer les paiements
- Gérer les remboursements

## 🐛 Dépannage

### Problème : Build iOS échoue

**Solution** : Vérifier les certificats
```bash
eas credentials
# Regenerate certificates if needed
```

### Problème : Variables d'environnement non chargées

**Solution** : Les variables avec `EXPO_PUBLIC_` sont nécessaires pour qu'elles soient accessibles dans l'app.

### Problème : Edge Functions timeout

**Solution** : Augmenter le timeout dans Supabase ou optimiser la fonction.

### Problème : SMS non envoyés

**Solution** :
- Vérifier que le numéro Twilio est vérifié
- Vérifier les credits Twilio
- Vérifier les logs dans Supabase Functions

## 📝 Checklist Finale

Avant de publier en production :

- [ ] Tester toutes les fonctionnalités
- [ ] Vérifier les permissions iOS/Android
- [ ] Tester les paiements en production
- [ ] Configurer les webhooks Stripe
- [ ] Ajouter screenshots App Store/Play Store
- [ ] Écrire description et keywords
- [ ] Définir la politique de confidentialité
- [ ] Configurer les analytics
- [ ] Préparer le support utilisateur
- [ ] Faire review par quelqu'un d'autre
- [ ] Tester sur plusieurs devices

## 🎉 Publication

Une fois approuvé par Apple/Google :
1. L'app sera disponible dans les stores
2. Surveiller les reviews
3. Répondre aux utilisateurs
4. Itérer sur les feedbacks

## 🔄 Maintenance Continue

- Publier des updates régulières
- Monitorer les crashes
- Répondre aux reviews
- Ajouter de nouvelles fonctionnalités
- Optimiser les performances

Bon déploiement ! 🚀
