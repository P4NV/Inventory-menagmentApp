-- ================================================================
-- StockPilot DB – Schema & Mock Data
-- Runs automatically on first `docker compose up`
-- ================================================================

CREATE
EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS categories
(
    id
    BIGSERIAL
    PRIMARY
    KEY,
    name
    VARCHAR
(
    100
) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW
(
)
    );

CREATE TABLE IF NOT EXISTS suppliers
(
    id
    BIGSERIAL
    PRIMARY
    KEY,
    name
    VARCHAR
(
    150
) NOT NULL,
    contact_email VARCHAR
(
    200
),
    phone VARCHAR
(
    30
),
    created_at TIMESTAMPTZ DEFAULT NOW
(
)
    );

CREATE TABLE IF NOT EXISTS products
(
    id
    BIGSERIAL
    PRIMARY
    KEY,
    sku
    VARCHAR
(
    50
) NOT NULL UNIQUE,
    name VARCHAR
(
    200
) NOT NULL,
    description TEXT,
    category_id BIGINT REFERENCES categories
(
    id
),
    supplier_id BIGINT REFERENCES suppliers
(
    id
),
    unit_price NUMERIC
(
    10,
    2
) NOT NULL DEFAULT 0,
    stock_qty BIGINT NOT NULL DEFAULT 0,
    reorder_level BIGINT NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW
(
),
    updated_at TIMESTAMPTZ DEFAULT NOW
(
)
    );

CREATE TABLE IF NOT EXISTS inventory_transactions
(
    id
    BIGSERIAL
    PRIMARY
    KEY,
    product_id
    BIGINT
    REFERENCES
    products
(
    id
),
    type VARCHAR
(
    20
) NOT NULL CHECK
(
    type
    IN
(
    'IN',
    'OUT',
    'ADJUST'
)),
    quantity BIGINT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW
(
)
    );

INSERT INTO categories (name)
VALUES ('Electronics'),
       ('Office Supplies'),
       ('Furniture'),
       ('Clothing'),
       ('Tools & Hardware') ON CONFLICT DO NOTHING;

INSERT INTO suppliers (name, contact_email, phone)
VALUES ('TechSource Ltd', 'orders@techsource.com', '+1-800-111-2233'),
       ('OfficeWorld Inc', 'supply@officeworld.com', '+1-800-444-5566'),
       ('FurniturePro', 'sales@furniturepro.com', '+1-800-777-8899'),
       ('ApparelHub', 'stock@apparelhub.com', '+1-800-222-3344'),
       ('ToolMaster Supply', 'orders@toolmaster.com', '+1-800-555-6677') ON CONFLICT DO NOTHING;

INSERT INTO products (sku, name, description, category_id, supplier_id, unit_price, stock_qty, reorder_level)
VALUES ('ELEC-001', 'Wireless Keyboard', 'Bluetooth 5.0, compact layout', 1, 1, 49.99, 120, 20),
       ('ELEC-002', 'USB-C Hub 7-in-1', 'HDMI, USB-A x3, SD card, PD 100W', 1, 1, 34.99, 85, 15),
       ('ELEC-003', '27" 4K Monitor', 'IPS panel, 144Hz, USB-C', 1, 1, 349.99, 40, 10),
       ('ELEC-004', 'Noise Cancelling Headset', 'Over-ear, ANC, 30h battery', 1, 1, 89.99, 60, 12),
       ('ELEC-005', 'Webcam 1080p', 'Full HD, built-in mic, privacy cover', 1, 1, 59.99, 75, 15),
       ('OFF-001', 'A4 Copy Paper (500 sheets)', '80gsm, ream', 2, 2, 6.99, 500, 100),
       ('OFF-002', 'Ballpoint Pen Box (50)', 'Blue ink, medium tip', 2, 2, 8.49, 300, 50),
       ('OFF-003', 'Sticky Notes Pack', '76x76mm, 6 colours, 600 sheets', 2, 2, 4.99, 250, 40),
       ('OFF-004', 'Stapler Heavy Duty', 'Up to 50 sheets', 2, 2, 14.99, 80, 15),
       ('OFF-005', 'Whiteboard Markers (8pk)', 'Dry-erase, assorted colours', 2, 2, 7.99, 150, 25),
       ('FURN-001', 'Ergonomic Office Chair', 'Lumbar support, armrests, mesh back', 3, 3, 299.99, 25, 5),
       ('FURN-002', 'Standing Desk 140cm', 'Electric height adjustment, oak top', 3, 3, 549.99, 15, 3),
       ('FURN-003', 'Filing Cabinet 3-Drawer', 'Steel, lockable, A4', 3, 3, 129.99, 18, 4),
       ('FURN-004', 'Bookshelf 5-Tier', 'Pine wood, 180cm', 3, 3, 89.99, 20, 5),
       ('CLTH-001', 'Branded Polo Shirt S', '100% cotton, company logo, size S', 4, 4, 24.99, 60, 10),
       ('CLTH-002', 'Branded Polo Shirt M', '100% cotton, company logo, size M', 4, 4, 24.99, 80, 10),
       ('CLTH-003', 'Branded Polo Shirt L', '100% cotton, company logo, size L', 4, 4, 24.99, 70, 10),
       ('CLTH-004', 'Hi-Vis Safety Vest', 'EN ISO 20471 Class 2, yellow', 4, 4, 12.99, 100, 20),
       ('TOOL-001', 'Cordless Drill 18V', 'Brushless motor, 2-speed, 2 batteries', 5, 5, 119.99, 30, 5),
       ('TOOL-002', 'Tape Measure 8m', 'Magnetic tip, rubber grip', 5, 5, 9.99, 100, 20),
       ('TOOL-003', 'Socket Set 108pc', '1/4" & 1/2" drive, CrV steel', 5, 5, 79.99, 22, 5) ON CONFLICT DO NOTHING;

INSERT INTO inventory_transactions (product_id, type, quantity, note)
VALUES (1, 'IN', 200, 'Initial stock intake'),
       (1, 'OUT', 80, 'Shipped to warehouse B'),
       (2, 'IN', 100, 'Initial stock intake'),
       (2, 'OUT', 15, 'Office restock'),
       (3, 'IN', 50, 'Initial stock intake'),
       (3, 'OUT', 10, 'Customer order #1042'),
       (4, 'IN', 80, 'Initial stock intake'),
       (4, 'OUT', 20, 'Customer order #1043'),
       (5, 'IN', 90, 'Initial stock intake'),
       (5, 'OUT', 15, 'Internal use'),
       (6, 'IN', 600, 'Bulk purchase Q1'),
       (6, 'OUT', 100, 'Office replenishment'),
       (11, 'IN', 30, 'Initial stock intake'),
       (11, 'OUT', 5, 'New employee setup'),
       (12, 'IN', 20, 'Office renovation project'),
       (12, 'OUT', 5, 'Remote team order'),
       (19, 'IN', 40, 'Workshop restock'),
       (19, 'OUT', 10, 'Maintenance team'),
       (1, 'ADJUST', 0, 'Cycle count correction'),
       (6, 'ADJUST', -10, 'Damaged goods written off');

CREATE
OR REPLACE VIEW product_inventory AS
SELECT p.id,
       p.sku,
       p.name,
       c.name                                                            AS category,
       s.name                                                            AS supplier,
       p.unit_price,
       p.stock_qty,
       p.reorder_level,
       CASE WHEN p.stock_qty <= p.reorder_level THEN true ELSE false END AS needs_reorder,
       p.updated_at
FROM products p
         LEFT JOIN categories c ON c.id = p.category_id
         LEFT JOIN suppliers s ON s.id = p.supplier_id;