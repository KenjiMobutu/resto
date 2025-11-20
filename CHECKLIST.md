# ✅ Checklist de Mise en Production - RestoManager

Utilisez cette checklist avant de déployer l'application en production.

## 📋 Configuration Initiale

### Environnement
- [ ] Node.js 18+ installé
- [ ] npm/yarn installé
- [ ] Git configuré
- [ ] Compte Expo créé
- [ ] EAS CLI installé (`npm install -g eas-cli`)

### Services Externes
- [ ] Projet Supabase créé
- [ ] Tables database créées (supabase-schema.sql exécuté)
- [ ] Compte Stripe configuré (optionnel)
- [ ] Compte Twilio configuré (optionnel)
- [ ] Compte Apple Developer actif (iOS)
- [ ] Compte Google Play Developer actif (Android)

### Fichiers de Configuration
- [ ] `.env` créé avec toutes les variables
- [ ] `app.json` mis à jour avec les bonnes infos
- [ ] `eas.json` configuré
- [ ] Bundle IDs corrects (iOS et Android)

## 🗄️ Base de Données

### Supabase Setup
- [ ] Toutes les tables créées
- [ ] Indexes créés
- [ ] RLS (Row Level Security) activé
- [ ] Policies créées et testées
- [ ] Triggers configurés
- [ ] Edge Functions déployées (si utilisées)
- [ ] Secrets configurés pour Edge Functions

### Données de Test
- [ ] Restaurant de test créé
- [ ] Utilisateurs de test créés avec différents rôles
- [ ] Quelques clients de test
- [ ] Tables configurées
- [ ] Menu items ajoutés

## 🔐 Sécurité

### Credentials
- [ ] Toutes les clés API en place
- [ ] `.env` dans `.gitignore`
- [ ] Pas de secrets hardcodés dans le code
- [ ] Variables d'environnement vérifiées

### Authentication
- [ ] Login fonctionne
- [ ] Logout fonctionne
- [ ] Session persistence fonctionne
- [ ] Tokens expirés gérés correctement
- [ ] RLS vérifié pour toutes les tables

### Permissions
- [ ] Rôles testés (owner, manager, waiter, etc.)
- [ ] Permissions vérifiées par rôle
- [ ] Actions non autorisées bloquées

## 🧪 Tests Fonctionnels

### Réservations
- [ ] Créer une réservation
- [ ] Modifier une réservation
- [ ] Annuler une réservation
- [ ] Changer le statut
- [ ] Assigner une table
- [ ] Voir les réservations du jour
- [ ] Navigation entre dates

### Clients
- [ ] Créer un client
- [ ] Modifier un client
- [ ] Supprimer un client
- [ ] Rechercher un client
- [ ] Ajouter/retirer des tags
- [ ] Ajouter des allergies
- [ ] Voir l'historique client

### Liste d'Attente
- [ ] Ajouter à la liste d'attente
- [ ] Notifier un client (SMS)
- [ ] Installer un client
- [ ] Retirer de la liste
- [ ] Voir le temps d'attente

### Commandes
- [ ] Créer une commande
- [ ] Ajouter des items
- [ ] Modifier quantité
- [ ] Supprimer des items
- [ ] Changer le statut
- [ ] Calculer le total correctement
- [ ] Voir les commandes actives

### Plan de Salle
- [ ] Voir le plan
- [ ] Mode édition
- [ ] Drag & drop tables
- [ ] Ajouter une table
- [ ] Modifier une table
- [ ] Supprimer une table
- [ ] Changer statut table
- [ ] Voir statuts en temps réel

### Paiements (si Stripe configuré)
- [ ] Créer un payment intent
- [ ] Traiter un paiement
- [ ] Gérer les erreurs de paiement
- [ ] Voir l'historique

## 📱 Tests Devices

### iOS
- [ ] Testé sur iPhone (divers modèles)
- [ ] Testé sur iPad
- [ ] Testé sur différentes versions iOS
- [ ] Permissions caméra/notifications demandées
- [ ] App fonctionne en mode portrait
- [ ] Rotation écran gérée

### Android
- [ ] Testé sur différents devices
- [ ] Testé sur différentes versions Android
- [ ] Permissions demandées correctement
- [ ] Back button géré correctement
- [ ] App fonctionne en mode portrait

### Tests Généraux
- [ ] Performance acceptable (pas de lag)
- [ ] Pas de memory leaks
- [ ] Navigation fluide
- [ ] Animations smooth
- [ ] Gestures fonctionnent bien
- [ ] Pas de crash observé

## 🌐 Tests Réseau

### Connectivité
- [ ] App fonctionne avec WiFi
- [ ] App fonctionne avec 4G/5G
- [ ] Gestion perte de connexion
- [ ] Reconnexion automatique
- [ ] Messages d'erreur clairs

### API Calls
- [ ] Tous les endpoints testés
- [ ] Timeouts gérés
- [ ] Retry logic en place
- [ ] Loading states visibles
- [ ] Error states gérés

## 📦 Build & Deploy

### Configuration Build
- [ ] `app.json` complet
- [ ] Icons et splash screens ajoutés
- [ ] Bundle identifiers corrects
- [ ] Version numbers corrects
- [ ] Build number incrémenté

### iOS Build
- [ ] EAS build iOS successful
- [ ] .ipa téléchargé et testé
- [ ] Certificats valides
- [ ] Provisioning profiles OK
- [ ] App fonctionne sur TestFlight
- [ ] Screenshots préparés pour App Store
- [ ] Description App Store rédigée
- [ ] Keywords optimisés

### Android Build
- [ ] EAS build Android successful
- [ ] .aab/.apk téléchargé et testé
- [ ] Signing key configuré
- [ ] App fonctionne en internal testing
- [ ] Screenshots préparés pour Play Store
- [ ] Description Play Store rédigée
- [ ] Catégorie choisie

## 📝 Documentation

### Code
- [ ] README.md à jour
- [ ] Comments dans le code complexe
- [ ] Types TypeScript documentés
- [ ] Fonctions importantes commentées

### Utilisateur
- [ ] Guide d'utilisation créé
- [ ] FAQ préparée
- [ ] Tutoriel première utilisation
- [ ] Support email configuré

### Technique
- [ ] ARCHITECTURE.md complet
- [ ] DEPLOYMENT.md complet
- [ ] API documentation (si API publique)
- [ ] Changelog initialisé

## 🎨 UI/UX

### Design
- [ ] UI cohérente partout
- [ ] Couleurs accessibles (contraste)
- [ ] Textes lisibles
- [ ] Boutons taille suffisante (touch targets)
- [ ] Feedback visuel sur interactions
- [ ] Loading indicators partout nécessaire

### Erreurs
- [ ] Messages d'erreur clairs
- [ ] Instructions pour corriger
- [ ] Pas de technical jargon
- [ ] Fallbacks en place

## 🔔 Notifications

### Push Notifications
- [ ] Permissions demandées
- [ ] Tokens enregistrés
- [ ] Notifications reçues
- [ ] Actions notifications fonctionnent
- [ ] Deep linking configuré

### SMS (si Twilio)
- [ ] SMS envoyés correctement
- [ ] Numéros formatés correctement
- [ ] Messages personnalisés
- [ ] Pas de spam (rate limiting)

## 💰 Paiements (si Stripe)

### Configuration
- [ ] Clés Stripe en production
- [ ] Webhooks configurés
- [ ] Test mode testé
- [ ] Production mode testé
- [ ] Monnaies correctes

### Fonctionnalités
- [ ] Paiements acceptés
- [ ] Remboursements fonctionnent
- [ ] Historique visible
- [ ] Reçus envoyés
- [ ] Erreurs paiement gérées

## 📊 Analytics & Monitoring

### Tracking
- [ ] Events importants trackés
- [ ] User flows analysés
- [ ] Erreurs remontées
- [ ] Crashes trackés

### Dashboards
- [ ] Supabase dashboard configuré
- [ ] EAS dashboard surveillé
- [ ] Stripe dashboard (si utilisé)
- [ ] Alertes configurées

## ⚖️ Legal

### Compliance
- [ ] Politique de confidentialité rédigée
- [ ] CGU (Terms of Service) rédigées
- [ ] RGPD compliant (si EU)
- [ ] Mentions légales
- [ ] Licences open-source respectées

### Store Requirements
- [ ] Age rating correct
- [ ] Catégorie correcte
- [ ] Contact info fourni
- [ ] Support URL fourni
- [ ] Privacy policy URL fourni

## 🚀 Pré-Lancement

### Final Checks
- [ ] Version finale testée exhaustivement
- [ ] Aucun console.log oublié
- [ ] Aucun TODO dans le code
- [ ] Performance optimisée
- [ ] Bundle size vérifié

### Communication
- [ ] Landing page créée
- [ ] Social media préparés
- [ ] Press release (si applicable)
- [ ] Email d'annonce rédigé
- [ ] Support team briefé

### Rollout Plan
- [ ] Plan de déploiement progressif
- [ ] Beta testers identifiés
- [ ] Rollback plan en place
- [ ] Hotfix process défini
- [ ] Monitoring intensifié

## 📈 Post-Lancement

### Monitoring
- [ ] Surveiller les reviews
- [ ] Surveiller les crashes
- [ ] Surveiller les performances
- [ ] Surveiller l'usage

### Support
- [ ] Équipe support prête
- [ ] FAQ mise à jour
- [ ] Process d'escalation défini
- [ ] Temps de réponse défini

### Itération
- [ ] Feedback collecté
- [ ] Roadmap priorisée
- [ ] Updates planifiées
- [ ] Communication continue

---

## 🎯 Score de Préparation

**Cocher toutes les cases critiques avant le lancement :**
- Minimum 90% pour beta
- 95%+ pour production
- 100% pour launch officiel

**Légende :**
- ⚠️ Critique : Doit être fait
- 🔶 Important : Fortement recommandé
- 💡 Optionnel : Nice to have

---

**Date de vérification :** _____________

**Vérifié par :** _____________

**Prêt pour production :** ☐ OUI  ☐ NON

**Notes :**
____________________________________________
____________________________________________
____________________________________________
