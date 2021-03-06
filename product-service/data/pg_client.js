'use strict';
const { Client } = require('pg');

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = JSON.parse(
    process.env.db_connect
);

const dbOptions = {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 10000,
};

module.exports.getListProducts = async (event) => {
    const client = new Client(dbOptions);
    await client.connect();
    try {
        const { rows: products } = await client.query(`
             SELECT products.id, stocks.count, products.title,
             products.description, products.price
             from products
             RIGHT JOIN stocks ON products.id = stocks.product_id;
        `);
        return products;
    } catch (error) {
        console.log('Error DB');
    } finally {
        console.log('finally');
        client.end();
    }
};

module.exports.getProduct = async (id) => {
    const client = new Client(dbOptions);
    await client.connect();
    try {
        const ddlResult = await client.query(`
    create table if not exists products (
      id uuid primary key default uuid_generate_v4(),
      title text not null,
        description text,
        price integer
    );`);

        const ddlResult1 = await client.query(`
  create table  if not exists stocks (
    id uuid primary key default uuid_generate_v4(),
      product_id uuid,
      count integer,
      foreign key ("product_id") references "products" ("id")
  );`);

        const sql = `
      SELECT products.id, stocks.count, products.title,
      products.description, products.price
      FROM products
      RIGHT JOIN stocks ON products.id = stocks.product_id
      WHERE products.id = '${id}';`;
        const { rows: products } = await client.query(sql);
        return products;
    } catch (error) {
        console.log('Error DB');
    } finally {
        console.log('finally');
        client.end();
    }
};

module.exports.postProducts_ = async (products) => {
    const client = new Client(dbOptions);
    await client.connect();

    try {
        const { title, description, price, count } = products;
        const sqlInsertProduct = `
    BEGIN;
    INSERT INTO products (title, description, price)
    VALUES ('${title}', '${description}', ${price})
    RETURNING id;`;
        const { rows: req } = await client.query(sqlInsertProduct);

        const sqlInsertStocks = `
      INSERT INTO stocks (product_id, count)
      VALUES ('${req[0]['id']}', ${count})
      RETURNING id;
      COMMIT;`;
        const { rows: id } = await client.query(sqlInsertStocks);
        return req;
    } catch (error) {
        console.log('Error DB');
    } finally {
        console.log('finally');
        client.end();
    }
};

module.exports.postProducts = async (prod) => {
    const client = new Client(dbOptions);
    const products = JSON.parse(prod);
    const { title, description, price, count } = products;
    await client.connect();
    try {
        await client.query('BEGIN');
        const sqlInsertProduct = `
          INSERT INTO products (title, description, price)
          VALUES ('${title}', '${description}', ${price})
          RETURNING id;`;
        console.log('sqlInsertProduct :', sqlInsertProduct);
        const resultInsertProducts = await client.query(sqlInsertProduct);
        console.log('resultInsertProducts ', resultInsertProducts);
        const productdIdNew = resultInsertProducts.rows[0]['id'];
        const sqlInsertStocks = `
             INSERT INTO stocks (product_id, count)
             VALUES ('${productdIdNew}', ${count})
             RETURNING id;`;
        console.log('sqlInsertStocks :', sqlInsertStocks);
        const resultInsertStocks = await client.query(sqlInsertStocks);
        console.log('resultInsertStocks ', resultInsertStocks);
        await client.query('COMMIT');
        return products;
    } catch (error) {
        await client.query('ROLLBACK');
        console.log('Error DB => ROLLBACK');
        return error;
    } finally {
        console.log('finally ALL');
        client.end();
    }
};
