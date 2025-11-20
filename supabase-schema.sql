-- RestoManager Database Schema
-- Execute this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('owner', 'manager', 'waiter', 'host', 'kitchen');
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show');
CREATE TYPE waitlist_status AS ENUM ('waiting', 'notified', 'seated', 'cancelled');
CREATE TYPE order_status AS ENUM ('pending', 'in_progress', 'ready', 'served', 'paid');
CREATE TYPE table_status AS ENUM ('available', 'occupied', 'reserved', 'cleaning');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'mobile');
CREATE TYPE element_type AS ENUM ('table', 'bar', 'wall', 'door', 'window', 'plant');

-- Restaurants table
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    settings JSONB DEFAULT '{}'::jsonb,
    stripe_account_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'waiter',
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    phone TEXT,
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    allergies TEXT[] DEFAULT '{}',
    dietary_restrictions TEXT[] DEFAULT '{}',
    preferences TEXT[] DEFAULT '{}',
    notes TEXT,
    visit_count INTEGER DEFAULT 0,
    total_spent NUMERIC(10, 2) DEFAULT 0,
    average_rating NUMERIC(3, 2),
    last_visit TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tables
CREATE TABLE tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    number TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    status table_status DEFAULT 'available',
    position JSONB NOT NULL,
    shape TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    current_reservation_id UUID,
    current_order_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(restaurant_id, number)
);

-- Floor elements
CREATE TABLE floor_elements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    type element_type NOT NULL,
    position JSONB NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    rotation INTEGER DEFAULT 0,
    label TEXT,
    table_id UUID REFERENCES tables(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TIME NOT NULL,
    party_size INTEGER NOT NULL,
    status reservation_status DEFAULT 'pending',
    table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
    special_requests TEXT,
    notes TEXT,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Waitlist
CREATE TABLE waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    party_size INTEGER NOT NULL,
    status waitlist_status DEFAULT 'waiting',
    estimated_wait_time INTEGER,
    notified_at TIMESTAMP WITH TIME ZONE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    seated_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu items
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    image TEXT,
    available BOOLEAN DEFAULT true,
    preparation_time INTEGER,
    allergens TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    status order_status DEFAULT 'pending',
    subtotal NUMERIC(10, 2) NOT NULL,
    tax NUMERIC(10, 2) NOT NULL,
    tip NUMERIC(10, 2),
    total NUMERIC(10, 2) NOT NULL,
    payment_method payment_method,
    payment_intent_id TEXT,
    notes TEXT,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(restaurant_id, name, category)
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_restaurant ON users(restaurant_id);
CREATE INDEX idx_clients_restaurant ON clients(restaurant_id);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_tables_restaurant ON tables(restaurant_id);
CREATE INDEX idx_reservations_restaurant ON reservations(restaurant_id);
CREATE INDEX idx_reservations_date ON reservations(date);
CREATE INDEX idx_reservations_client ON reservations(client_id);
CREATE INDEX idx_waitlist_restaurant ON waitlist(restaurant_id);
CREATE INDEX idx_waitlist_status ON waitlist(status);
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Enable Row Level Security (RLS)
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE floor_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can view colleagues in same restaurant"
    ON users FOR SELECT
    USING (restaurant_id IN (
        SELECT restaurant_id FROM users WHERE id = auth.uid()
    ));

-- RLS Policies for restaurants
CREATE POLICY "Users can view their restaurant"
    ON restaurants FOR SELECT
    USING (id IN (
        SELECT restaurant_id FROM users WHERE id = auth.uid()
    ));

CREATE POLICY "Owners can update their restaurant"
    ON restaurants FOR UPDATE
    USING (owner_id = auth.uid());

-- RLS Policies for clients
CREATE POLICY "Users can view clients in their restaurant"
    ON clients FOR ALL
    USING (restaurant_id IN (
        SELECT restaurant_id FROM users WHERE id = auth.uid()
    ));

-- RLS Policies for tables
CREATE POLICY "Users can manage tables in their restaurant"
    ON tables FOR ALL
    USING (restaurant_id IN (
        SELECT restaurant_id FROM users WHERE id = auth.uid()
    ));

-- RLS Policies for reservations
CREATE POLICY "Users can manage reservations in their restaurant"
    ON reservations FOR ALL
    USING (restaurant_id IN (
        SELECT restaurant_id FROM users WHERE id = auth.uid()
    ));

-- RLS Policies for waitlist
CREATE POLICY "Users can manage waitlist in their restaurant"
    ON waitlist FOR ALL
    USING (restaurant_id IN (
        SELECT restaurant_id FROM users WHERE id = auth.uid()
    ));

-- RLS Policies for menu_items
CREATE POLICY "Users can manage menu items in their restaurant"
    ON menu_items FOR ALL
    USING (restaurant_id IN (
        SELECT restaurant_id FROM users WHERE id = auth.uid()
    ));

-- RLS Policies for orders
CREATE POLICY "Users can manage orders in their restaurant"
    ON orders FOR ALL
    USING (restaurant_id IN (
        SELECT restaurant_id FROM users WHERE id = auth.uid()
    ));

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (user_id = auth.uid());

-- Functions to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tables_updated_at BEFORE UPDATE ON tables
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_waitlist_updated_at BEFORE UPDATE ON waitlist
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
