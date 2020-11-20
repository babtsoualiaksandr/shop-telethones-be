const AWS = require('aws-sdk');
const postCreateProducts = require('./postProducts')
export function getUserFromCsv(event) {
    console.log(event);
    const products = event.Records.map(({ body }) => body);
    const sns = new AWS.SNS();
    console.log('typeof products', typeof products)
    products.forEach(product => {
        console.log(product);
        console.log({body: JSON.stringify(product)})
        postCreateProducts.post({body: product})       
    });
    console.log('process.env.SNS_ARN = ', process.env.SNS_ARN)
    sns.publish(
        {
            Subject: 'Subject',
            Message: JSON.stringify(products),
            TopicArn: process.env.SNS_ARN,
            
        },
        () => {
            console.log('Send email for ' + JSON.stringify(products));
        }
    );

    console.log('products ', products);
}
