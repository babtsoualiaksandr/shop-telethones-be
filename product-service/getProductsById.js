// eslint-disable-next-line import/prefer-default-export
// import products from './data/products';
import pg_client from './data/pg_client';

export async function get(event) {
  console.log(event);
  const id = event.pathParameters.productId;
  // const listProducts =  await pg_client.getListProducts();
  // const product = listProducts.find(x => x.id == id);
  const product = await pg_client.getProduct(id);
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
