USE ecommerce_db;

-- ⚠️ Foreign keys disable කරන්න
SET FOREIGN_KEY_CHECKS = 0;

-- Order items මුලින්ම delete කරන්න (children)
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM users;

-- AUTO_INCREMENT reset කරන්න
ALTER TABLE order_items AUTO_INCREMENT = 1;
ALTER TABLE orders AUTO_INCREMENT = 1;
ALTER TABLE products AUTO_INCREMENT = 1;
ALTER TABLE categories AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;

-- Foreign keys ආයෙත් enable කරන්න
SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- 📁 CATEGORIES (10)
-- ==========================================
INSERT INTO categories (name, slug) VALUES
('Electronics', 'electronics'),
('Clothing', 'clothing'),
('Home & Kitchen', 'home-kitchen'),
('Books', 'books'),
('Sports & Fitness', 'sports-fitness'),
('Beauty & Personal Care', 'beauty-care'),
('Toys & Games', 'toys-games'),
('Footwear', 'footwear'),
('Accessories', 'accessories'),
('Groceries', 'groceries');

-- ==========================================
-- 🛍️ PRODUCTS (30)
-- ==========================================

-- Electronics (1)
INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
('iPhone 15 Pro Max', 'Apple iPhone 15 Pro Max 256GB — Titanium design, A17 Pro chip, Pro camera system', 385000.00, 15, 'https://picsum.photos/seed/iphone15/400/400', 1),
('Samsung Galaxy S24 Ultra', 'Samsung flagship with 200MP camera, S Pen, Snapdragon 8 Gen 3', 350000.00, 12, 'https://picsum.photos/seed/galaxys24/400/400', 1),
('MacBook Air M3', 'Apple MacBook Air 13-inch M3 chip, 8GB RAM, 256GB SSD — Ultra thin & light', 425000.00, 8, 'https://picsum.photos/seed/macbookair/400/400', 1),
('Sony WH-1000XM5', 'Industry-leading noise cancelling wireless headphones with 30hr battery', 95000.00, 25, 'https://picsum.photos/seed/sonyheadphones/400/400', 1),
('iPad Air 5th Gen', 'Apple iPad Air 10.9-inch M1 chip, 64GB WiFi — Perfect for work & play', 195000.00, 10, 'https://picsum.photos/seed/ipadair/400/400', 1),
('Dell XPS 13 Plus', 'Premium ultrabook with Intel Core i7, 16GB RAM, 512GB SSD', 380000.00, 6, 'https://picsum.photos/seed/dellxps/400/400', 1);

-- Clothing (2)
INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
('Nike Dri-FIT Training T-Shirt', 'Moisture-wicking performance t-shirt for intense workouts', 4500.00, 80, 'https://picsum.photos/seed/nikeshirt/400/400', 2),
('Levi''s 501 Original Jeans', 'Classic straight-fit denim jeans — Iconic American style since 1873', 12500.00, 45, 'https://picsum.photos/seed/levisjeans/400/400', 2),
('Adidas Essentials Hoodie', 'Comfortable fleece hoodie with 3-stripes branding', 8900.00, 60, 'https://picsum.photos/seed/adidashoodie/400/400', 2),
('Premium Formal Shirt', 'Egyptian cotton formal shirt — Perfect for office & events', 6500.00, 55, 'https://picsum.photos/seed/formalshirt/400/400', 2);

-- Home & Kitchen (3)
INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
('Nespresso Coffee Machine', 'Automatic espresso maker with milk frother — Cafe quality at home', 68000.00, 20, 'https://picsum.photos/seed/coffeemachine/400/400', 3),
('Philips Air Fryer XL', '6.2L capacity air fryer — Healthy frying with 90% less oil', 42000.00, 18, 'https://picsum.photos/seed/airfryer/400/400', 3),
('KitchenAid Blender Pro', 'Professional-grade blender with 5-speed control & 1.5L jar', 35000.00, 15, 'https://picsum.photos/seed/blender/400/400', 3),
('Ceramic Dinner Set (16 pcs)', 'Elegant 16-piece ceramic dinnerware set for 4 people', 18500.00, 30, 'https://picsum.photos/seed/dinnerset/400/400', 3);

-- Books (4)
INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
('Atomic Habits — James Clear', 'Bestselling book on building good habits and breaking bad ones', 3200.00, 100, 'https://picsum.photos/seed/atomichabits/400/400', 4),
('The Psychology of Money', 'Timeless lessons on wealth, greed, and happiness by Morgan Housel', 2800.00, 85, 'https://picsum.photos/seed/psychmoney/400/400', 4),
('Rich Dad Poor Dad', 'Robert Kiyosaki''s classic on financial literacy and investing', 2500.00, 120, 'https://picsum.photos/seed/richdad/400/400', 4);

-- Sports & Fitness (5)
INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
('Premium Yoga Mat', 'Non-slip 6mm thick yoga mat with carrying strap', 5500.00, 70, 'https://picsum.photos/seed/yogamat/400/400', 5),
('Adjustable Dumbbell Set', '20kg adjustable dumbbells with quick-lock system', 28000.00, 22, 'https://picsum.photos/seed/dumbbells/400/400', 5),
('Cricket Bat — English Willow', 'Grade 1 English willow cricket bat for professional play', 45000.00, 12, 'https://picsum.photos/seed/cricketbat/400/400', 5);

-- Beauty & Personal Care (6)
INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
('Vitamin C Face Serum', 'Brightening serum with 20% Vitamin C and Hyaluronic Acid', 4800.00, 65, 'https://picsum.photos/seed/faceserum/400/400', 6),
('Luxury Perfume — 100ml', 'Long-lasting oriental fragrance for men and women', 15500.00, 40, 'https://picsum.photos/seed/perfume/400/400', 6),
('Professional Makeup Kit', 'Complete makeup set with 24 shades — Perfect gift', 12500.00, 35, 'https://picsum.photos/seed/makeupkit/400/400', 6);

-- Toys & Games (7)
INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
('LEGO Technic Set', 'Advanced building set with 1200+ pieces for ages 10+', 24000.00, 20, 'https://picsum.photos/seed/legoset/400/400', 7),
('Wooden Chess Set', 'Handcrafted wooden chess board with weighted pieces', 8500.00, 30, 'https://picsum.photos/seed/chessboard/400/400', 7);

-- Footwear (8)
INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
('Nike Air Max 270', 'Iconic Air Max sneakers with large Air unit for all-day comfort', 32000.00, 25, 'https://picsum.photos/seed/nikeairmax/400/400', 8),
('Formal Leather Shoes', 'Genuine leather Oxford shoes — Timeless professional style', 18500.00, 28, 'https://picsum.photos/seed/leathershoes/400/400', 8),
('Running Shoes — Ultra Boost', 'Responsive running shoes with energy-return cushioning', 28000.00, 32, 'https://picsum.photos/seed/runningshoes/400/400', 8);

-- Accessories (9)
INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
('Leather Wallet — RFID Safe', 'Premium leather bi-fold wallet with RFID blocking', 4500.00, 90, 'https://picsum.photos/seed/leatherwallet/400/400', 9),
('Polarized Sunglasses', 'UV400 polarized sunglasses with metal frame', 6800.00, 75, 'https://picsum.photos/seed/sunglasses/400/400', 9);