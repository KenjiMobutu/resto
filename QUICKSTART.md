# Quick Start - RestoManager

Guide rapide pour démarrer avec RestoManager en 10 minutes.

## ⚡ Installation Rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Créer le fichier .env
cp .env.example .env

# 3. Éditer .env avec vos clés Supabase
# EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
# EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# 4. Lancer l'app
npm start
```

## 🗄️ Setup Supabase (5 minutes)

### 1. Créer le projet
1. Aller sur [supabase.com](https://supabase.com)
2. Cliquer "New Project"
3. Nom : `resto-manager`
4. Choisir un mot de passe fort
5. Attendre la création (~2 min)

### 2. Créer les tables
1. Aller dans "SQL Editor"
2. Copier le contenu de `supabase-schema.sql`
3. Cliquer "Run"
4. ✅ Tables créées !

### 3. Récupérer les clés
1. "Settings" > "API"
2. Copier Project URL et anon key
3. Coller dans `.env`

### 4. Créer un utilisateur de test
Dans SQL Editor :
```sql
-- Créer un restaurant
INSERT INTO restaurants (id, name, address, phone, email, owner_id)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Mon Restaurant',
  '123 Rue de Paris',
  '+33123456789',
  'contact@restaurant.com',
  (SELECT id FROM auth.users LIMIT 1)
);

-- Note: Vous devrez d'abord créer un user via l'interface Supabase Auth
-- Puis mettre à jour owner_id avec le bon user ID
```

## 📱 Lancer l'App

### Sur iOS Simulator (Mac uniquement)
```bash
npm run ios
```

### Sur Android Emulator
```bash
npm run android
```

### Sur votre téléphone
```bash
npm start
# Scanner le QR code avec Expo Go
```

## 🎯 Premiers Pas

### 1. Login
- Email : votre email Supabase
- Password : votre mot de passe

### 2. Dashboard
Vue d'ensemble avec :
- Réservations du jour
- Liste d'attente
- Commandes actives

### 3. Créer un client
1. Aller dans "Clients"
2. Cliquer "Nouveau client"
3. Remplir les infos
4. Ajouter tags et allergies
5. Sauvegarder

### 4. Créer une réservation
1. Aller dans "Réservations"
2. Cliquer "Nouvelle réservation"
3. Sélectionner un client
4. Choisir date, heure, nombre de personnes
5. Ajouter demandes spéciales
6. Confirmer

### 5. Gérer la salle
1. Aller dans "Plan de salle"
2. Cliquer "Modifier"
3. Ajouter des tables (drag & drop)
4. Organiser la disposition
5. Cliquer "Terminer"

## 🚀 Déployer en Production

### Build iOS
```bash
# Installer EAS CLI
npm install -g eas-cli

# Login
eas login

# Build
eas build --platform ios --profile production
```

### Build Android
```bash
eas build --platform android --profile production
```

## 📚 Documentation Complète

- **README.md** : Documentation principale
- **ARCHITECTURE.md** : Architecture technique détaillée
- **DEPLOYMENT.md** : Guide de déploiement complet
- **SCRIPTS.md** : Commandes et scripts utiles

## 🆘 Besoin d'Aide ?

### Problèmes courants

#### "Cannot connect to Supabase"
- Vérifier que `.env` contient les bonnes clés
- Vérifier que l'URL Supabase est correcte
- Vérifier la connexion internet

#### "Tables not found"
- Exécuter `supabase-schema.sql` dans SQL Editor
- Vérifier que toutes les requêtes ont réussi

#### "Build failed"
```bash
# Nettoyer et réinstaller
rm -rf node_modules
npm install
npx expo start -c
```

## ✅ Checklist de Démarrage

- [ ] npm install terminé
- [ ] .env créé avec les clés Supabase
- [ ] Tables créées dans Supabase
- [ ] Utilisateur test créé
- [ ] App lancée et login réussi
- [ ] Premier client créé
- [ ] Première réservation créée
- [ ] Plan de salle configuré

## 🎓 Apprendre

### Tutoriels recommandés
1. [Expo Docs](https://docs.expo.dev)
2. [React Native](https://reactnative.dev)
3. [Supabase Docs](https://supabase.com/docs)
4. [TypeScript](https://www.typescriptlang.org/docs)

### Vidéos
- React Native Crash Course
- Supabase Full Tutorial
- Building Production Apps with Expo

## 🎯 Prochaines Étapes

1. **Personnaliser** : Modifier les couleurs, le logo
2. **Ajouter des données** : Importer votre menu
3. **Configurer** : SMS (Twilio) et Paiements (Stripe)
4. **Tester** : Inviter votre équipe
5. **Déployer** : Publier sur App Store/Play Store

## 💡 Tips

- **Développement** : Utilisez le hot reload (modifications en direct)
- **Debug** : Secouez votre téléphone pour ouvrir le menu dev
- **Performances** : Testez sur de vrais devices, pas que simulateurs
- **Sécurité** : Ne committez JAMAIS le fichier .env
- **Backup** : Sauvegardez régulièrement votre base Supabase

## 🎨 Personnalisation Rapide

### Changer les couleurs
Éditer les valeurs hexadécimales dans les fichiers de composants :
- Primary Blue : `#007AFF`
- Success Green : `#10B981`
- Warning Orange : `#F59E0B`
- Danger Red : `#EF4444`

### Changer le nom de l'app
Dans `app.json` :
```json
{
  "expo": {
    "name": "Votre Nom",
    "slug": "votre-slug"
  }
}
```

### Changer le logo
Remplacer les fichiers dans `assets/` :
- `icon.png` (1024x1024)
- `splash-icon.png` (1284x2778 ou 1242x2436)
- `adaptive-icon.png` (1024x1024)

## 🌟 Fonctionnalités Clés

✅ **Réservations** : Système complet de gestion
✅ **Clients** : Base de données avec tags et allergies
✅ **Liste d'attente** : Avec notifications SMS
✅ **Commandes** : Prise et suivi en temps réel
✅ **Plan de salle** : Drag & drop interactif
✅ **Paiements** : Intégration Stripe
✅ **Multi-utilisateurs** : Rôles et permissions
✅ **Notifications** : Push et SMS
✅ **Real-time** : Updates en direct
✅ **Offline-ready** : Structure pour mode hors ligne (à venir)

## 🔥 Mode Pro

Pour les utilisateurs avancés :

```bash
# Développement avec auto-reload
npm start

# Build local pour tester
eas build --platform ios --profile development --local

# Tests E2E
npm run test:e2e

# Profiling des performances
npx react-devtools

# Analyze bundle size
npx expo export && du -sh dist/
```

---

Vous êtes prêt ! 🚀

Des questions ? Consultez la documentation complète dans README.md
