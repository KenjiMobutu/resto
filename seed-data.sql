-- ============================================
-- SEED DATA pour RestoManager
-- ============================================
-- Exécutez ce fichier dans Supabase SQL Editor pour avoir des données de test

-- 1. CLIENTS (10 clients)
INSERT INTO clients (id, restaurant_id, first_name, last_name, email, phone, tags, allergies, dietary_restrictions, visit_count, total_spent) VALUES
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000001', 'Marie', 'Dupont', 'marie.dupont@email.com', '+33612345678', ARRAY['VIP', 'Regular'], ARRAY['Gluten'], ARRAY[]::text[], 15, 450.50),
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-0000-0000-0000-000000000001', 'Pierre', 'Martin', 'pierre.martin@email.com', '+33623456789', ARRAY['Regular'], ARRAY[]::text[], ARRAY['Végétarien'], 8, 280.00),
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-0000-0000-0000-000000000001', 'Sophie', 'Bernard', 'sophie.bernard@email.com', '+33634567890', ARRAY['VIP'], ARRAY['Arachides', 'Fruits de mer'], ARRAY[]::text[], 22, 890.75),
('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-0000-0000-0000-000000000001', 'Jean', 'Dubois', 'jean.dubois@email.com', '+33645678901', ARRAY['New'], ARRAY[]::text[], ARRAY[]::text[], 2, 75.50),
('55555555-5555-5555-5555-555555555555', 'aaaaaaaa-0000-0000-0000-000000000001', 'Emma', 'Thomas', 'emma.thomas@email.com', '+33656789012', ARRAY['Regular'], ARRAY['Lactose'], ARRAY['Sans gluten'], 12, 420.30),
('66666666-6666-6666-6666-666666666666', 'aaaaaaaa-0000-0000-0000-000000000001', 'Lucas', 'Robert', 'lucas.robert@email.com', '+33667890123', ARRAY['VIP', 'Business'], ARRAY[]::text[], ARRAY[]::text[], 18, 650.00),
('77777777-7777-7777-7777-777777777777', 'aaaaaaaa-0000-0000-0000-000000000001', 'Léa', 'Richard', 'lea.richard@email.com', '+33678901234', ARRAY['New'], ARRAY[]::text[], ARRAY['Vegan'], 1, 35.00),
('88888888-8888-8888-8888-888888888888', 'aaaaaaaa-0000-0000-0000-000000000001', 'Thomas', 'Petit', 'thomas.petit@email.com', '+33689012345', ARRAY['Regular'], ARRAY['Œufs'], ARRAY[]::text[], 10, 325.80),
('99999999-9999-9999-9999-999999999999', 'aaaaaaaa-0000-0000-0000-000000000001', 'Camille', 'Durand', 'camille.durand@email.com', '+33690123456', ARRAY['VIP'], ARRAY[]::text[], ARRAY[]::text[], 25, 1120.45),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-0000-0000-0000-000000000001', 'Hugo', 'Moreau', 'hugo.moreau@email.com', '+33601234567', ARRAY['New'], ARRAY['Soja'], ARRAY['Végétarien'], 3, 95.50)
ON CONFLICT (id) DO NOTHING;

-- 2. TABLES (15 tables)
INSERT INTO tables (id, restaurant_id, number, capacity, status, position, shape, width, height) VALUES
('1a111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000001', '1', 2, 'available', '{"x": 50, "y": 50}', 'circle', 80, 80),
('2a222222-2222-2222-2222-222222222222', 'aaaaaaaa-0000-0000-0000-000000000001', '2', 2, 'available', '{"x": 150, "y": 50}', 'circle', 80, 80),
('3a333333-3333-3333-3333-333333333333', 'aaaaaaaa-0000-0000-0000-000000000001', '3', 4, 'occupied', '{"x": 50, "y": 150}', 'square', 100, 100),
('4a444444-4444-4444-4444-444444444444', 'aaaaaaaa-0000-0000-0000-000000000001', '4', 4, 'available', '{"x": 180, "y": 150}', 'square', 100, 100),
('5a555555-5555-5555-5555-555555555555', 'aaaaaaaa-0000-0000-0000-000000000001', '5', 6, 'reserved', '{"x": 50, "y": 280}', 'rectangle', 120, 80),
('6a666666-6666-6666-6666-666666666666', 'aaaaaaaa-0000-0000-0000-000000000001', '6', 6, 'available', '{"x": 200, "y": 280}', 'rectangle', 120, 80),
('7a777777-7777-7777-7777-777777777777', 'aaaaaaaa-0000-0000-0000-000000000001', '7', 2, 'available', '{"x": 350, "y": 50}', 'circle', 80, 80),
('8a888888-8888-8888-8888-888888888888', 'aaaaaaaa-0000-0000-0000-000000000001', '8', 2, 'occupied', '{"x": 450, "y": 50}', 'circle', 80, 80),
('9a999999-9999-9999-9999-999999999999', 'aaaaaaaa-0000-0000-0000-000000000001', '9', 4, 'available', '{"x": 350, "y": 150}', 'square', 100, 100),
('0aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-0000-0000-0000-000000000001', '10', 4, 'cleaning', '{"x": 480, "y": 150}', 'square', 100, 100),
('0bbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-0000-0000-0000-000000000001', '11', 8, 'available', '{"x": 350, "y": 280}', 'rectangle', 150, 100),
('0ccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-0000-0000-0000-000000000001', '12', 2, 'available', '{"x": 550, "y": 280}', 'circle', 80, 80),
('0ddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-0000-0000-0000-000000000001', '13', 2, 'available', '{"x": 50, "y": 400}', 'circle', 80, 80),
('0eeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-0000-0000-0000-000000000001', '14', 4, 'reserved', '{"x": 180, "y": 400}', 'square', 100, 100),
('0fffffff-ffff-ffff-ffff-ffffffffffff', 'aaaaaaaa-0000-0000-0000-000000000001', '15', 6, 'available', '{"x": 320, "y": 400}', 'rectangle', 120, 80)
ON CONFLICT (id) DO NOTHING;

-- 3. RÉSERVATIONS (pour aujourd'hui et demain)
INSERT INTO reservations (id, restaurant_id, client_id, date, time, party_size, status, table_id, special_requests, created_by) VALUES
-- Aujourd'hui
('1b111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', CURRENT_DATE, '12:00', 2, 'confirmed', '1a111111-1111-1111-1111-111111111111', 'Table près de la fenêtre', '129abe62-2e47-4abf-9412-a359b3bf4e11'),
('2b222222-2222-2222-2222-222222222222', 'aaaaaaaa-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', CURRENT_DATE, '12:30', 4, 'confirmed', '3a333333-3333-3333-3333-333333333333', 'Anniversaire', '129abe62-2e47-4abf-9412-a359b3bf4e11'),
('3b333333-3333-3333-3333-333333333333', 'aaaaaaaa-0000-0000-0000-000000000001', '66666666-6666-6666-6666-666666666666', CURRENT_DATE, '13:00', 6, 'confirmed', '5a555555-5555-5555-5555-555555555555', 'Repas d''affaires', '129abe62-2e47-4abf-9412-a359b3bf4e11'),
('4b444444-4444-4444-4444-444444444444', 'aaaaaaaa-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', CURRENT_DATE, '19:00', 2, 'pending', NULL, NULL, '129abe62-2e47-4abf-9412-a359b3bf4e11'),
('5b555555-5555-5555-5555-555555555555', 'aaaaaaaa-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555', CURRENT_DATE, '19:30', 4, 'confirmed', '9a999999-9999-9999-9999-999999999999', NULL, '129abe62-2e47-4abf-9412-a359b3bf4e11'),
('6b666666-6666-6666-6666-666666666666', 'aaaaaaaa-0000-0000-0000-000000000001', '99999999-9999-9999-9999-999999999999', CURRENT_DATE, '20:00', 6, 'confirmed', '0bbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Soirée spéciale', '129abe62-2e47-4abf-9412-a359b3bf4e11'),
-- Demain
('7b777777-7777-7777-7777-777777777777', 'aaaaaaaa-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', CURRENT_DATE + 1, '12:30', 2, 'pending', NULL, NULL, '129abe62-2e47-4abf-9412-a359b3bf4e11'),
('8b888888-8888-8888-8888-888888888888', 'aaaaaaaa-0000-0000-0000-000000000001', '88888888-8888-8888-8888-888888888888', CURRENT_DATE + 1, '19:00', 4, 'confirmed', '4a444444-4444-4444-4444-444444444444', NULL, '129abe62-2e47-4abf-9412-a359b3bf4e11')
ON CONFLICT (id) DO NOTHING;

-- 4. LISTE D'ATTENTE (3 personnes en attente)
INSERT INTO waitlist (id, restaurant_id, client_id, party_size, status, estimated_wait_time, notes) VALUES
('1c111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000001', '77777777-7777-7777-7777-777777777777', 2, 'waiting', 15, NULL),
('2c222222-2222-2222-2222-222222222222', 'aaaaaaaa-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, 'waiting', 20, 'Préfère le patio'),
('3c333333-3333-3333-3333-333333333333', 'aaaaaaaa-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 4, 'notified', 5, NULL)
ON CONFLICT (id) DO NOTHING;

-- 5. MENU (15 plats)
INSERT INTO menu_items (id, restaurant_id, name, description, category, price, available, preparation_time, allergens) VALUES
-- Entrées
('m1111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000001', 'Salade César', 'Salade romaine, poulet grillé, parmesan, croûtons', 'Entrées', 12.50, true, 10, ARRAY['Gluten', 'Lactose']),
('m2222222-2222-2222-2222-222222222222', 'aaaaaaaa-0000-0000-0000-000000000001', 'Soupe du jour', 'Velouté de légumes de saison', 'Entrées', 8.00, true, 5, ARRAY[]::text[]),
('m3333333-3333-3333-3333-333333333333', 'aaaaaaaa-0000-0000-0000-000000000001', 'Carpaccio de bœuf', 'Fines tranches de bœuf, roquette, parmesan', 'Entrées', 14.00, true, 8, ARRAY['Lactose']),
-- Plats
('m4444444-4444-4444-4444-444444444444', 'aaaaaaaa-0000-0000-0000-000000000001', 'Burger maison', 'Steak haché, cheddar, bacon, frites', 'Plats', 18.50, true, 20, ARRAY['Gluten', 'Lactose']),
('m5555555-5555-5555-5555-555555555555', 'aaaaaaaa-0000-0000-0000-000000000001', 'Saumon grillé', 'Pavé de saumon, légumes grillés, riz', 'Plats', 22.00, true, 25, ARRAY['Poisson']),
('m6666666-6666-6666-6666-666666666666', 'aaaaaaaa-0000-0000-0000-000000000001', 'Pâtes carbonara', 'Spaghetti, lardons, crème, parmesan', 'Plats', 16.00, true, 15, ARRAY['Gluten', 'Lactose', 'Œufs']),
('m7777777-7777-7777-7777-777777777777', 'aaaaaaaa-0000-0000-0000-000000000001', 'Pizza Margherita', 'Tomate, mozzarella, basilic', 'Plats', 14.50, true, 18, ARRAY['Gluten', 'Lactose']),
('m8888888-8888-8888-8888-888888888888', 'aaaaaaaa-0000-0000-0000-000000000001', 'Poulet rôti', 'Demi-poulet, frites maison, salade', 'Plats', 19.00, true, 30, ARRAY[]::text[]),
('m9999999-9999-9999-9999-999999999999', 'aaaaaaaa-0000-0000-0000-000000000001', 'Risotto aux champignons', 'Riz arborio, champignons de saison, parmesan', 'Plats', 17.50, true, 25, ARRAY['Lactose']),
-- Desserts
('maaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-0000-0000-0000-000000000001', 'Tiramisu', 'Mascarpone, café, cacao', 'Desserts', 8.50, true, 5, ARRAY['Gluten', 'Lactose', 'Œufs']),
('mbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-0000-0000-0000-000000000001', 'Crème brûlée', 'Crème vanille caramélisée', 'Desserts', 7.50, true, 5, ARRAY['Lactose', 'Œufs']),
('mcccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-0000-0000-0000-000000000001', 'Tarte tatin', 'Pommes caramélisées, glace vanille', 'Desserts', 9.00, true, 8, ARRAY['Gluten', 'Lactose']),
-- Boissons
('mdddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-0000-0000-0000-000000000001', 'Eau minérale', 'Plate ou gazeuse, 50cl', 'Boissons', 3.50, true, 1, ARRAY[]::text[]),
('meeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-0000-0000-0000-000000000001', 'Jus de fruits frais', 'Orange, pomme ou pamplemousse', 'Boissons', 5.00, true, 3, ARRAY[]::text[]),
('mffffff-ffff-ffff-ffff-ffffffffffff', 'aaaaaaaa-0000-0000-0000-000000000001', 'Café', 'Espresso, allongé ou noisette', 'Boissons', 2.50, true, 2, ARRAY[]::text[])
ON CONFLICT (id) DO NOTHING;

-- 6. COMMANDES (2 commandes en cours)
INSERT INTO orders (id, restaurant_id, table_id, client_id, items, status, subtotal, tax, total, created_by) VALUES
('o1111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000001', '3a333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333',
 '[
   {"id": "i1", "menuItemId": "m1111111-1111-1111-1111-111111111111", "quantity": 1, "price": 12.50},
   {"id": "i2", "menuItemId": "m4444444-4444-4444-4444-444444444444", "quantity": 2, "price": 18.50},
   {"id": "i3", "menuItemId": "mdddddd-dddd-dddd-dddd-dddddddddddd", "quantity": 2, "price": 3.50}
 ]'::jsonb,
 'in_progress', 56.50, 5.65, 62.15, '129abe62-2e47-4abf-9412-a359b3bf4e11'),

('o2222222-2222-2222-2222-222222222222', 'aaaaaaaa-0000-0000-0000-000000000001', '8a888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888',
 '[
   {"id": "i4", "menuItemId": "m5555555-5555-5555-5555-555555555555", "quantity": 1, "price": 22.00},
   {"id": "i5", "menuItemId": "m2222222-2222-2222-2222-222222222222", "quantity": 1, "price": 8.00},
   {"id": "i6", "menuItemId": "meeeeee-eeee-eeee-eeee-eeeeeeeeeeee", "quantity": 1, "price": 5.00}
 ]'::jsonb,
 'ready', 35.00, 3.50, 38.50, '129abe62-2e47-4abf-9412-a359b3bf4e11')
ON CONFLICT (id) DO NOTHING;

-- 7. TAGS
INSERT INTO tags (id, restaurant_id, name, color, category) VALUES
('tag1111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000001', 'VIP', '#FFD700', 'client'),
('tag2222-2222-2222-2222-222222222222', 'aaaaaaaa-0000-0000-0000-000000000001', 'Regular', '#4169E1', 'client'),
('tag3333-3333-3333-3333-333333333333', 'aaaaaaaa-0000-0000-0000-000000000001', 'New', '#32CD32', 'client'),
('tag4444-4444-4444-4444-444444444444', 'aaaaaaaa-0000-0000-0000-000000000001', 'Business', '#8B4513', 'client')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- FIN - Vos données de test sont maintenant prêtes !
-- ============================================
