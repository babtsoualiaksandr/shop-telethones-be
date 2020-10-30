// eslint-disable-next-line import/prefer-default-export
import products from './data/products'
export const get = (event, context, cb) => {
  const p = new Promise(resolve => {
    resolve('success');
  });

  const response = {
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
  
  p.then(() => cb(null, response)).catch(e => cb(e));
};
