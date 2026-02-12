-- Lazeez Gourmet - Supabase Schema
-- Run this in your Supabase SQL editor to set up the database

-- ============================================
-- AUTH & ADMIN
-- ============================================

-- Admin users (for menu management via secret page / app)
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('owner', 'admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MENU STRUCTURE
-- ============================================

-- Menu categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu subcategories
CREATE TABLE IF NOT EXISTS subcategories (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu items
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  subcategory_id INTEGER REFERENCES subcategories(id) ON DELETE SET NULL,
  image_url TEXT,
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_spicy BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RESTAURANT INFO
-- ============================================

-- Gallery images
CREATE TABLE IF NOT EXISTS gallery_images (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Operating hours
CREATE TABLE IF NOT EXISTS operating_hours (
  id SERIAL PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN DEFAULT FALSE,
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Restaurant settings (key-value store for contact, social, etc.)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CUSTOMER INTERACTIONS
-- ============================================

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reservations (for future app feature)
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  party_size INTEGER NOT NULL DEFAULT 2,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders (for future pre-order / delivery via app)
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  order_type TEXT NOT NULL DEFAULT 'dine_in' CHECK (order_type IN ('dine_in', 'takeaway', 'delivery')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  service_charge DECIMAL(10,2) NOT NULL DEFAULT 0,
  gst DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE operating_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read access (website visitors)
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read subcategories" ON subcategories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read menu items" ON menu_items FOR SELECT USING (is_available = true);
CREATE POLICY "Public read gallery" ON gallery_images FOR SELECT USING (is_active = true);
CREATE POLICY "Public read hours" ON operating_hours FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);

-- Public insert for contact form & reservations
CREATE POLICY "Public insert contact" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert reservations" ON reservations FOR INSERT WITH CHECK (true);

-- Admin access (authenticated users with admin profile)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Admin full access policies
CREATE POLICY "Admin manage categories" ON categories FOR ALL USING (is_admin());
CREATE POLICY "Admin manage subcategories" ON subcategories FOR ALL USING (is_admin());
CREATE POLICY "Admin manage menu items" ON menu_items FOR ALL USING (is_admin());
CREATE POLICY "Admin manage gallery" ON gallery_images FOR ALL USING (is_admin());
CREATE POLICY "Admin manage hours" ON operating_hours FOR ALL USING (is_admin());
CREATE POLICY "Admin manage settings" ON site_settings FOR ALL USING (is_admin());
CREATE POLICY "Admin read contact" ON contact_submissions FOR ALL USING (is_admin());
CREATE POLICY "Admin manage reservations" ON reservations FOR ALL USING (is_admin());
CREATE POLICY "Admin manage orders" ON orders FOR ALL USING (is_admin());
CREATE POLICY "Admin manage order items" ON order_items FOR ALL USING (is_admin());
CREATE POLICY "Admin manage profiles" ON admin_profiles FOR ALL USING (is_admin());

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER subcategories_updated_at BEFORE UPDATE ON subcategories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER operating_hours_updated_at BEFORE UPDATE ON operating_hours FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER admin_profiles_updated_at BEFORE UPDATE ON admin_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SEED DATA
-- ============================================

-- Seed categories
INSERT INTO categories (slug, label, sort_order) VALUES
  ('levant_flavours', 'Levant Flavours', 1),
  ('all_day_eats', 'All Day Eats', 2),
  ('thirsty', 'Thirsty', 3),
  ('sweet_endings', 'Sweet Endings', 4),
  ('high_tea', 'High Tea', 5)
ON CONFLICT (slug) DO NOTHING;

-- Seed subcategories for Levant Flavours (category_id = 1)
INSERT INTO subcategories (category_id, name, sort_order) VALUES
  (1, 'Breakfast', 1),
  (1, 'Cold Mezze', 2),
  (1, 'Hot Mezze', 3),
  (1, 'Salads', 4),
  (1, 'Soup', 5),
  (1, 'Shawarmas & Wraps', 6),
  (1, 'From the Grill', 7),
  (1, 'Oriental Dishes', 8),
  (1, 'Sawani', 9),
  (1, 'Advance Order', 10),
  (1, 'Sides', 11);

-- Seed site settings
INSERT INTO site_settings (key, value) VALUES
  ('phone_primary', '+960 778 2460'),
  ('phone_secondary', '+960 335 0505'),
  ('whatsapp', '9607782460'),
  ('email', 'info@lazeez.mv'),
  ('address', 'H. Thiyara, Male'' 20081, Maldives'),
  ('facebook', 'https://facebook.com/lazeezgourmet'),
  ('instagram', 'https://instagram.com/lazeezgourmet/'),
  ('service_charge', '10'),
  ('gst', '8')
ON CONFLICT (key) DO NOTHING;

-- Seed operating hours (0=Sunday, 6=Saturday)
INSERT INTO operating_hours (day_of_week, open_time, close_time, is_closed, label) VALUES
  (0, '12:00', '00:00', false, 'Sunday'),
  (1, '12:00', '00:00', false, 'Monday'),
  (2, '12:00', '00:00', false, 'Tuesday'),
  (3, '12:00', '00:00', false, 'Wednesday'),
  (4, '12:00', '00:00', false, 'Thursday'),
  (5, '15:00', '00:00', false, 'Friday'),
  (6, '12:00', '00:00', false, 'Saturday');
