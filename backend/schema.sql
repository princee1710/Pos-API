DROP TABLE IF EXISTS products;
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'available'
);

-- Data Awal (Seed Data)
INSERT INTO products (name, price, category) VALUES 
('Kopi Susu Gula Aren', 22000, 'Coffee'),
('Latte Jawain', 25000, 'Coffee'),
('Matcha Latte', 26000, 'Non-Coffee'),
('Croissant Almond', 28000, 'Pastry');
