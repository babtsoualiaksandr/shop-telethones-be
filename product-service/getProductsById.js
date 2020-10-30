// eslint-disable-next-line import/prefer-default-export
import products from './data/products'
export async function get(event) {
  const id = event.pathParameters.productId;
  const product = products.find(x => x.id == id);
  if (product === undefined) {
    return {
      statusCode: 404,
      body: JSON.stringify({error: 'Not found'}),
  };
  }
    return {
        statusCode: 200,
        body: JSON.stringify({product}),
    };
}
