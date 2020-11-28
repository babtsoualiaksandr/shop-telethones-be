// eslint-disable-next-line import/prefer-default-export
// import products from './data/products'

import pg_client from './data/pg_client';

export async function get(event) {
  console.log(event);
  const products =  await pg_client.getListProducts();
  if (products === []) {
    return {
      statusCode: 404,
      body: JSON.stringify({error: 'Not found'}),
  };
  }
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(
        products,
        null,
        2
      ),
    };
}
