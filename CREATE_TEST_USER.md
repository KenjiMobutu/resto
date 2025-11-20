# Créer un Utilisateur de Test

Vous avez un compte auth Supabase mais pas de profil dans la table `users`.

## Option 1 : Via SQL (Recommandé)

Allez dans votre **Supabase SQL Editor** et exécutez :

```sql
-- 1. D'abord, créer un restaurant
INSERT INTO restaurants (id, name, address, phone, email, owner_id)
VALUES (
  'aaaaaaaa-0000-0000-0000-000000000001',
  'Restaurant de Test',
  '123 Rue de Paris',
  '+33123456789',
  'contact@restaurant.com',
  '129abe62-2e47-4abf-9412-a359b3bf4e11'  -- Votre user ID
)
ON CONFLICT (id) DO NOTHING;

-- 2. Ensuite, créer le profil utilisateur
INSERT INTO users (id, email, first_name, last_name, role, restaurant_id)
VALUES (
  '129abe62-2e47-4abf-9412-a359b3bf4e11',  -- Votre user ID
  'test@test.com',                          -- Votre email
  'Test',
  'User',
  'owner',                                   -- Rôle owner
  'aaaaaaaa-0000-0000-0000-000000000001'    -- Restaurant ID
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  restaurant_id = EXCLUDED.restaurant_id;
```

## Option 2 : Via l'Interface Supabase

1. Aller dans **Table Editor** > **restaurants**
2. **Insert row** :
   - `id` : `aaaaaaaa-0000-0000-0000-000000000001`
   - `name` : `Restaurant de Test`
   - `address` : `123 Rue de Paris`
   - `phone` : `+33123456789`
   - `email` : `contact@restaurant.com`
   - `owner_id` : `129abe62-2e47-4abf-9412-a359b3bf4e11`
   - Laisser les autres champs par défaut

3. Aller dans **Table Editor** > **users**
4. **Insert row** :
   - `id` : `129abe62-2e47-4abf-9412-a359b3bf4e11`
   - `email` : `test@test.com`
   - `first_name` : `Test`
   - `last_name` : `User`
   - `role` : `owner`
   - `restaurant_id` : `aaaaaaaa-0000-0000-0000-000000000001`
   - Laisser les autres champs par défaut

## Option 3 : Créer un Nouveau Compte

Si vous préférez recommencer avec un mot de passe plus fort :

1. Dans votre app, créez un nouveau compte avec un mot de passe de **6+ caractères**
2. Ensuite, suivez l'Option 1 ou 2 ci-dessus avec le nouvel `user_id`

## Vérification

Après avoir exécuté le SQL, **relancez l'app** et connectez-vous avec :
- Email : `test@test.com`
- Mot de passe : celui que vous avez choisi (6+ caractères)

## Changement de Mot de Passe

Si vous voulez changer votre mot de passe actuel :

1. Aller dans **Supabase Authentication** > **Users**
2. Trouver votre utilisateur `test@test.com`
3. Cliquer sur les 3 points > **Reset Password**
4. Ou depuis l'app, ajouter un écran "Forgot Password"

## Vérifier que ça Marche

Dans **Supabase SQL Editor** :

```sql
-- Vérifier l'utilisateur
SELECT * FROM users WHERE id = '129abe62-2e47-4abf-9412-a359b3bf4e11';

-- Vérifier le restaurant
SELECT * FROM restaurants WHERE id = 'aaaaaaaa-0000-0000-0000-000000000001';
```

Vous devriez voir 1 ligne pour chaque requête.

## Astuce

Pour éviter ce problème à l'avenir, créez un écran d'onboarding après l'inscription qui :
1. Demande les infos du restaurant
2. Crée automatiquement le restaurant et le profil utilisateur

Voulez-vous que je crée cet écran d'onboarding ?
