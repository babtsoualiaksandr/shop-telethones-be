// eslint-disable-next-line import/prefer-default-export
// import products from './data/products';
import pg_client from './data/pg_client';
import { patternProduct } from './Models/insertProducts';
const jpv = require('jpv');

export async function post(event) {
    console.log(event);
    // const products = event.queryStringParameters;
 
    const products = (event.body);
    const validRequest = jpv.validate(products, patternProduct);
    if (validRequest !== true) {
        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            statusCode: 400,
            body: JSON.stringify({ error: ' Oxx  product data is invalid', event_Input: event }),
        };
    }
    console.log(typeof products);
    const response = await pg_client.postProducts(products);


    if (response === undefined) {
        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            statusCode: 500,
            body: JSON.stringify({ error: 'DB connection, any unhandled error in code',
                                   event_Input: event, 
                                   productFromDb: {res: response, err: "Ошибочка"} }),
        };
    }
    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        statusCode: 200,
        body: JSON.stringify({ response }),
    };
}
