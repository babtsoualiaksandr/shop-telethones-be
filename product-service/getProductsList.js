// eslint-disable-next-line import/prefer-default-export
import products from './data/products'

export async function get(event) {
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
