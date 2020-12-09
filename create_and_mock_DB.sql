create table products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
    description text,
    price numeric
);

-- CREATE extension if not exists "uuid-ossp";

create table stocks (
	id uuid primary key default uuid_generate_v4(),
    product_id uuid UNIQUE,
    count numeric,
    foreign key ("product_id") references "products" ("id")
);

INSERT INTO products (title, description, price)
VALUES ('APPLE', 'description PRODUCTS ONE', 100);




do $$
DECLARE title text := 'title product';
DECLARE description text := 'description product';
begin
for r in 1..33 loop
title := 'title phone - ' || r;
description := 'description phone - ' || r;
insert into public.products(price, title, description) values(r, title, description);
end loop;
end;
$$;

TRUNCATE products CASCADE

DROP TABLE products;
DROP TABLE stocks;

INSERT INTO stocks (product_id, count) SELECT id, price FROM products;

	









