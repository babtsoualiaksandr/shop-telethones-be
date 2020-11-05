// eslint-disable-next-line import/prefer-default-export
// import products from './data/products';
import pg_client from './data/pg_client';

export async function post(event) {
  const products = event.pathParameters.products;
  console.log(products)
  const product = await pg_client.postProducts(products);
  if (product === undefined) {
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
        body: JSON.stringify({product}),
    };
}
