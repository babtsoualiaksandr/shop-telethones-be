const { Client } = require('pg');

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD} = process.env;
const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000
}

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
      );`
    );
    const ddlResult1 = await client.query(`
    create table  if not exists stocks (
      id uuid primary key default uuid_generate_v4(),
        product_id uuid,
        count integer,
        foreign key ("product_id") references "products" ("id")
    );`
  );
    const { rows: products } = await client.query(`SELECT * from products`);
    console.log(products);
    
  } catch (error) {
    console.log("Error DB")
  } finally {
    client.end()
  }
}