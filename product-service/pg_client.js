const { Client } = require('pg');

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
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

module.exports.invoke = async (event) => {
    console.log('HhHHHHHHHH');
    console.log(dbOptions);
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

        console.log(ddlResult);
        const ddlResult1 = await client.query(`
    create table  if not exists stocks (
      id uuid primary key default uuid_generate_v4(),
        product_id uuid,
        count integer,
        foreign key ("product_id") references "products" ("id")
    );`);

        console.log(ddlResult1);
        const { rows: products } = await client.query(`
             SELECT products.id, stocks.count, products.title,
             products.description, products.price
             from products
             RIGHT JOIN stocks ON products.id = stocks.product_id;
        `);
        console.log(products);
        return products;
    } catch (error) {
        console.log('Error DB');
    } finally {
      console.log('finally')
        client.end();
    }
};
