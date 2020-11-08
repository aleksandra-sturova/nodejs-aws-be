CREATE EXTENSION "uuid-ossp";

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  price integer CHECK (price > 0)
);

CREATE TABLE stocks (
  product_id uuid REFERENCES products,
  count integer
);

INSERT INTO products (id, title, description, price) VALUES
('c01cf184-961b-4de7-8aec-ace10c7469f4', 'iPhone 12 Pro', 'Shop iPhone 12 Pro', 999),
('2bc37684-e2ae-40a1-bb7e-06fda115057d', 'iPhone 12 Pro Max', 'Shop iPhone 12 Pro', 1099),
('3173beae-6354-4481-83b8-b3f5a78c7c9c', 'iPhone 12', 'Shop iPhone 12', 799),
('5322f1be-0f21-4f08-86df-443545096286', 'iPhone 12 mini', 'Shop iPhone 12 mini', 699),
('ead5fb0f-16f7-4f3e-95f3-ea14abdb1b85', 'iPhone 11', 'Shop iPhone 11, 64GB', 599),
('2ffeb134-0ee8-4e92-b061-5945217eab24', 'iPhone 11', 'Shop iPhone 11, 128GB', 649),
('58d49e31-ae9f-4df7-9c47-d6af9cd698ff', 'iPhone 11', 'Shop iPhone 11, 256GB', 749);

INSERT INTO stocks (product_id, count) VALUES
('c01cf184-961b-4de7-8aec-ace10c7469f4', 2),
('2bc37684-e2ae-40a1-bb7e-06fda115057d', 4),
('3173beae-6354-4481-83b8-b3f5a78c7c9c', 3),
('5322f1be-0f21-4f08-86df-443545096286', 5),
('ead5fb0f-16f7-4f3e-95f3-ea14abdb1b85', 1),
('2ffeb134-0ee8-4e92-b061-5945217eab24', 4),
('58d49e31-ae9f-4df7-9c47-d6af9cd698ff', 2);