# Scripts Utiles - RestoManager

Collection de scripts et commandes utiles pour le développement et le déploiement.

## 📦 Installation et Setup

```bash
# Installation des dépendances
npm install

# ou avec yarn
yarn install

# Installation EAS CLI globalement
npm install -g eas-cli

# Connexion à Expo
eas login

# Configuration initiale EAS
eas build:configure
```

## 🚀 Développement

### Lancer l'application

```bash
# Démarrer le serveur de développement
npm start

# Lancer sur iOS Simulator
npm run ios

# Lancer sur Android Emulator
npm run android

# Lancer sur web
npm run web

# Lancer avec cache clear
npx expo start -c
```

### Debugging

```bash
# Ouvrir React Native Debugger
# Installer d'abord : brew install --cask react-native-debugger

# Logs iOS
npx react-native log-ios

# Logs Android
npx react-native log-android

# Inspecter le bundle
npx expo export
```

## 🏗️ Build

### Development Builds

```bash
# iOS Development
eas build --platform ios --profile development

# Android Development
eas build --platform android --profile development

# Les deux plateformes
eas build --platform all --profile development
```

### Preview Builds

```bash
# iOS Preview
eas build --platform ios --profile preview

# Android Preview (APK)
eas build --platform android --profile preview

# Les deux
eas build --platform all --profile preview
```

### Production Builds

```bash
# iOS Production
npm run build:ios
# ou
eas build --platform ios --profile production

# Android Production
npm run build:android
# ou
eas build --platform android --profile production

# Preview des deux avant production
npm run build:preview
```

## 📤 Déploiement

### Soumettre aux stores

```bash
# Soumettre à App Store
npm run submit:ios
# ou
eas submit --platform ios

# Soumettre à Google Play
npm run submit:android
# ou
eas submit --platform android
```

### Over-The-Air (OTA) Updates

```bash
# Publier une update sur le canal production
eas update --branch production --message "Bug fixes and improvements"

# Publier sur canal preview
eas update --branch preview --message "New feature X"

# Publier sur canal de développement
eas update --branch development --message "Testing Y"

# Voir les updates publiées
eas update:list

# Voir les détails d'une update
eas update:view [updateId]
```

## 🗄️ Base de Données (Supabase)

### Setup initial

```bash
# Installer Supabase CLI
npm install -g supabase

# Login
supabase login

# Initialiser le projet local (optionnel)
supabase init

# Link au projet Supabase
supabase link --project-ref YOUR_PROJECT_REF
```

### Migrations

```bash
# Créer une migration
supabase migration new migration_name

# Appliquer les migrations localement
supabase db push

# Réinitialiser la base locale
supabase db reset
```

### Edge Functions

```bash
# Créer une nouvelle fonction
supabase functions new function-name

# Tester localement
supabase functions serve

# Déployer une fonction
supabase functions deploy function-name

# Déployer toutes les fonctions
supabase functions deploy

# Voir les logs
supabase functions logs function-name

# Définir des secrets
supabase secrets set KEY=value

# Lister les secrets
supabase secrets list
```

### Backup et Restore

```bash
# Backup de la base de données
supabase db dump -f backup.sql

# Restore
supabase db reset --db-url postgresql://...
```

## 🔑 Gestion des Credentials

### Expo/EAS

```bash
# Voir les credentials
eas credentials

# Régénérer les certificats iOS
eas credentials -p ios

# Régénérer keystore Android
eas credentials -p android

# Build avec credentials locaux
eas build --local
```

### Variables d'environnement

```bash
# Créer le fichier .env à partir de l'exemple
cp .env.example .env

# Vérifier les variables (custom script)
cat .env | grep -v '^#' | grep -v '^$'
```

## 🧪 Tests

```bash
# Lancer les tests (à configurer)
npm test

# Tests avec coverage
npm run test:coverage

# Tests en mode watch
npm run test:watch

# E2E tests avec Detox (à configurer)
detox build -c ios.sim.debug
detox test -c ios.sim.debug
```

## 🧹 Maintenance

### Nettoyage

```bash
# Nettoyer le cache Expo
npx expo start -c

# Nettoyer node_modules
rm -rf node_modules && npm install

# Nettoyer le cache npm
npm cache clean --force

# Nettoyer Metro bundler
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*

# Tout nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npx expo start -c
```

### Updates

```bash
# Vérifier les updates disponibles
npm outdated

# Update les packages (attention aux breaking changes)
npm update

# Update Expo SDK
npx expo install --fix

# Update un package spécifique
npm install package@latest
```

## 📊 Monitoring et Logs

### Expo

```bash
# Voir les builds
eas build:list

# Voir les détails d'un build
eas build:view [buildId]

# Voir les updates
eas update:list

# Voir les channels
eas channel:list

# Voir les devices enregistrés
eas device:list
```

### Supabase

```bash
# Logs des Edge Functions
supabase functions logs function-name

# Logs en temps réel
supabase functions logs function-name --tail

# Stats de la base de données
# Aller sur le dashboard Supabase
```

## 🔧 Utilitaires Personnalisés

### Créer un utilisateur admin (script à créer)

```typescript
// scripts/create-admin.ts
import { supabase } from './src/services/supabase';

async function createAdmin() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@restaurant.com',
    password: 'secure_password',
    email_confirm: true,
  });

  if (error) {
    console.error('Error:', error);
    return;
  }

  // Créer le profil
  await supabase.from('users').insert({
    id: data.user.id,
    email: 'admin@restaurant.com',
    first_name: 'Admin',
    last_name: 'User',
    role: 'owner',
    restaurant_id: 'YOUR_RESTAURANT_ID',
  });

  console.log('Admin created:', data.user);
}

createAdmin();
```

Exécuter :
```bash
npx ts-node scripts/create-admin.ts
```

### Seed la base de données

```bash
# Créer scripts/seed.sql
# Puis exécuter dans Supabase SQL Editor
# Ou via CLI :
supabase db execute --file scripts/seed.sql
```

### Générer des données de test

```typescript
// scripts/generate-test-data.ts
import { supabase } from './src/services/supabase';
import { faker } from '@faker-js/faker';

async function generateClients(count: number) {
  const clients = Array.from({ length: count }, () => ({
    restaurant_id: 'YOUR_RESTAURANT_ID',
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    tags: [faker.helpers.arrayElement(['VIP', 'Regular', 'New'])],
    allergies: [],
    dietary_restrictions: [],
  }));

  const { error } = await supabase.from('clients').insert(clients);
  console.log(error ? 'Error' : `Created ${count} clients`);
}

generateClients(50);
```

## 🐛 Debugging

### Problèmes courants

#### App ne lance pas

```bash
# Vérifier la version de Node
node --version  # Doit être 18+

# Réinstaller tout
rm -rf node_modules package-lock.json
npm install

# Clear cache
npx expo start -c
```

#### Erreurs de build

```bash
# Voir les logs détaillés
eas build --platform ios --profile production --no-wait
# Puis voir les logs sur le dashboard

# Build local pour debug
eas build --platform ios --local
```

#### Problèmes Supabase

```bash
# Vérifier la connexion
curl https://YOUR_PROJECT.supabase.co/rest/v1/

# Tester une Edge Function
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/function-name \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## 📱 Device Testing

### iOS

```bash
# Lister les simulateurs disponibles
xcrun simctl list devices

# Ouvrir un simulateur spécifique
open -a Simulator --args -CurrentDeviceUDID <UDID>

# Installer sur device physique
# 1. Build development
eas build --platform ios --profile development
# 2. Download .ipa
# 3. Install via Apple Configurator
```

### Android

```bash
# Lister les devices/emulators
adb devices

# Installer l'APK
adb install app.apk

# Logs en temps réel
adb logcat | grep -i "expo\|react"

# Reverse port pour développement
adb reverse tcp:8081 tcp:8081
```

## 🎯 Scripts Git

```bash
# Créer une nouvelle feature
git checkout -b feature/feature-name

# Commit avec message formaté
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug X"
git commit -m "docs: update README"

# Push et créer PR
git push origin feature/feature-name

# Merge main dans votre branch
git fetch origin
git merge origin/main
```

## 📦 Release Management

### Versionning

```bash
# Bump version
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# Mettre à jour app.json aussi
# "version": "1.0.1"
```

### Release Process

1. Update version dans `package.json` et `app.json`
2. Update CHANGELOG.md
3. Commit : `git commit -m "chore: bump version to 1.0.1"`
4. Tag : `git tag v1.0.1`
5. Push : `git push && git push --tags`
6. Build production
7. Submit aux stores
8. Publish OTA update

## 🔐 Sécurité

### Audit des dépendances

```bash
# Audit npm
npm audit

# Fix les vulnérabilités automatiquement
npm audit fix

# Audit avec fix majeur (attention!)
npm audit fix --force
```

### Rotation des secrets

```bash
# Générer une nouvelle clé
openssl rand -base64 32

# Update dans Supabase
supabase secrets set NEW_KEY=new_value

# Redéployer les fonctions
supabase functions deploy

# Update .env
# Et rebuild l'app
```

---

Ces scripts couvrent la plupart des besoins quotidiens. N'hésitez pas à les adapter !
