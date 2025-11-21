# 📱 Guide d'installation sur iPhone

## Méthode 1 : Expo Go (Développement) ⚡

### Avantages
- ✅ Rapide et simple
- ✅ Pas besoin de compte développeur
- ✅ Mises à jour instantanées
- ✅ Gratuit

### Inconvénients
- ❌ Nécessite l'app Expo Go
- ❌ Fonctionnalités limitées
- ❌ Ne fonctionne qu'en développement

### Installation

1. **Sur votre iPhone**
   ```
   App Store → Rechercher "Expo Go" → Installer
   ```

2. **Sur votre Mac**
   ```bash
   cd /Users/kenjimobutu/Desktop/resto
   npm start
   ```

3. **Scanner le QR Code**
   - Ouvrir l'appareil photo de l'iPhone
   - Scanner le QR code affiché dans le terminal
   - Cliquer sur la notification
   - L'app s'ouvre dans Expo Go

**Important** : Mac et iPhone sur le même WiFi !

---

## Méthode 2 : EAS Build Development (Test interne) 🔨

### Avantages
- ✅ Application standalone (sans Expo Go)
- ✅ Toutes les fonctionnalités natives
- ✅ Partage avec 100 appareils
- ✅ Pas besoin de publier sur l'App Store

### Prérequis
- Compte Apple (gratuit)
- Compte Expo (gratuit)

### Installation

#### Étape 1 : Configurer EAS

```bash
# Installer EAS CLI globalement
npm install -g eas-cli

# Se connecter à Expo
eas login

# Initialiser EAS dans le projet
cd /Users/kenjimobutu/Desktop/resto
eas build:configure
```

#### Étape 2 : Créer un build de développement

```bash
# Build pour iPhone (Development)
eas build --platform ios --profile development
```

Le processus va :
1. Créer un compte Expo si vous n'en avez pas
2. Vous demander de vous connecter avec votre compte Apple
3. Créer automatiquement les certificats nécessaires
4. Compiler l'application dans le cloud (15-30 minutes)

#### Étape 3 : Installer sur votre iPhone

Une fois le build terminé :

1. **Enregistrer votre iPhone**
   ```bash
   eas device:create
   ```
   - Suivre les instructions pour enregistrer l'UDID de votre iPhone

2. **Télécharger l'application**
   - Vous recevrez un lien par email ou dans le terminal
   - Ouvrir le lien sur votre iPhone
   - Suivre les instructions pour installer

---

## Méthode 3 : TestFlight (Distribution Beta) 🧪

### Avantages
- ✅ Application complète
- ✅ Distribution facile à 10,000 testeurs
- ✅ Mises à jour automatiques
- ✅ Feedback intégré

### Prérequis
- Compte Apple Developer (99$/an)

### Installation

#### Étape 1 : Configurer App Store Connect

1. Aller sur https://appstoreconnect.apple.com
2. Créer une nouvelle app
3. Noter le Bundle ID

#### Étape 2 : Mettre à jour app.json

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.votrenom.resto",
      "buildNumber": "1.0.0"
    }
  }
}
```

#### Étape 3 : Créer le build

```bash
# Build pour TestFlight
eas build --platform ios --profile production

# Soumettre à App Store Connect
eas submit --platform ios
```

#### Étape 4 : Distribuer via TestFlight

1. Aller sur App Store Connect
2. Sélectionner votre app
3. Onglet "TestFlight"
4. Ajouter des testeurs internes/externes
5. Les testeurs reçoivent une invitation par email

#### Étape 5 : Installer sur iPhone

1. **Installer TestFlight** (App Store)
2. **Accepter l'invitation** (email)
3. **Télécharger l'app** dans TestFlight

---

## Méthode 4 : Installation directe via Xcode (Local) 💻

### Avantages
- ✅ Gratuit
- ✅ Ne nécessite pas de serveur
- ✅ Contrôle total

### Inconvénients
- ❌ Nécessite un Mac avec Xcode
- ❌ Plus complexe
- ❌ Doit reconnecter l'iPhone tous les 7 jours (compte gratuit)

### Installation

#### Étape 1 : Générer le projet iOS

```bash
cd /Users/kenjimobutu/Desktop/resto

# Créer le projet natif iOS
npx expo prebuild --platform ios
```

#### Étape 2 : Ouvrir dans Xcode

```bash
# Ouvrir le workspace
open ios/resto.xcworkspace
```

#### Étape 3 : Configurer la signature

1. Sélectionner le projet "resto" dans la barre latérale
2. Onglet "Signing & Capabilities"
3. Cocher "Automatically manage signing"
4. Sélectionner votre Team (compte Apple)

#### Étape 4 : Connecter l'iPhone

1. Connecter l'iPhone avec un câble USB
2. Débloquer l'iPhone
3. Faire confiance à l'ordinateur si demandé

#### Étape 5 : Builder et installer

1. Sélectionner votre iPhone en haut (à côté de "resto")
2. Cliquer sur le bouton Play ▶️ (ou Cmd+R)
3. Xcode va compiler et installer sur l'iPhone

#### Étape 6 : Autoriser sur iPhone

1. Sur l'iPhone : Réglages → Général → VPN et gestion de l'appareil
2. Faire confiance au développeur
3. Lancer l'application

---

## 🎯 Quelle méthode choisir ?

| Besoin | Méthode recommandée |
|--------|-------------------|
| **Tests rapides pendant le développement** | Expo Go |
| **Tests internes (équipe)** | EAS Development |
| **Tests beta (clients)** | TestFlight |
| **Développement local sans internet** | Xcode |
| **Publication App Store** | TestFlight puis Production |

---

## 🚀 Commande rapide (Recommandé)

Pour commencer immédiatement avec Expo Go :

```bash
# Dans le terminal
cd /Users/kenjimobutu/Desktop/resto
npm start
```

Puis scanner le QR code avec l'iPhone ! 📱

---

## ⚠️ Résolution de problèmes courants

### Problème : QR Code ne fonctionne pas

**Solution 1 : Utiliser le tunnel**
```bash
npm start -- --tunnel
```

**Solution 2 : Se connecter manuellement**
```bash
# Noter l'adresse IP affichée (ex: exp://192.168.1.10:8081)
# Dans Expo Go : Onglet "Enter URL manually"
# Entrer l'adresse
```

### Problème : "Network response timed out"

Vérifier :
- Mac et iPhone sur le même WiFi
- Pare-feu Mac désactivé pour le réseau local
- Redémarrer le serveur : Ctrl+C puis `npm start`

### Problème : Certificat expiré (Xcode)

```bash
# Supprimer le cache
rm -rf ~/Library/Developer/Xcode/DerivedData
```

### Problème : "Unable to verify app"

Sur iPhone :
1. Réglages → Général → VPN et gestion de l'appareil
2. Cliquer sur le profil développeur
3. Faire confiance

---

## 📞 Support

Si vous rencontrez des problèmes :

1. **Documentation Expo** : https://docs.expo.dev
2. **Forum Expo** : https://forums.expo.dev
3. **Discord Expo** : https://chat.expo.dev

---

## ✅ Checklist avant installation

- [ ] Node.js installé (v18+)
- [ ] npm ou yarn disponible
- [ ] iPhone avec iOS 13+ minimum
- [ ] Compte Apple (gratuit suffit pour la plupart)
- [ ] Mac et iPhone sur le même réseau (pour Expo Go)
- [ ] Expo Go installé sur iPhone (pour méthode 1)

Bonne installation ! 🎉
