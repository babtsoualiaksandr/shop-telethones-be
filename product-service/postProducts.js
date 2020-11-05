// eslint-disable-next-line import/prefer-default-export
// import products from './data/products';
import pg_client from './data/pg_client';
import { patternProduct } from './Models/insertProducts';
const jpv = require('jpv');

export async function post(event) {
    console.log(event);
    const products = event.pathParameters.products;
    const validRequest = jpv.validate(products, patternProduct);
    if (validRequest !== true) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'product data is invalid' }),
        };
    }
    const product = await pg_client.postProducts(products);
    if (product === undefined) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'DB connection, any unhandled error in code' }),
        };
    }
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ product }),
    };
}
