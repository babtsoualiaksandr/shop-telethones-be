const AWS = require('aws-sdk');

const csv = require('csv-parser');

const BUCKET = 'storage-pothes-store';

const HEADER_CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
};
export function parser({ Records }) {
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const sqs = new AWS.SQS();
    console.log('process.env.SQS_URL = ',process.env.SQS_URL);
    console.log('sqs = ', sqs)

    Records.forEach((record) => {
        const s3Stream = s3
            .getObject({
                Bucket: BUCKET,
                Key: record.s3.object.key,
            })
            .createReadStream();
        s3Stream
            .pipe(csv())
            .on('data', (data) => {
                sqs.sendMessage(
                    {
                        QueueUrl: process.env.SQS_URL,
                        MessageBody: JSON.stringify(data),
                    },
                    (error) => {
                        console.error(error);
                    }
                );
            })

            .on('end', async () => {
                await s3
                    .copyObject({
                        Bucket: BUCKET,
                        CopySource: BUCKET + '/' + record.s3.object.key,
                        Key: record.s3.object.key.replace('uploaded', 'parsed'),
                    })
                    .promise();
                console.log(
                    'Copied into ' +
                        BUCKET +
                        '/' +
                        record.s3.object.key.replace('uploaded', 'parsed')
                );

                await s3
                    .deleteObject({
                        Bucket: BUCKET,
                        Key: record.s3.object.key,
                    })
                    .promise();

                console.log(
                    'Deleted into ' + BUCKET + '/' + record.s3.object.key
                );
            });
    });

    return {
        statusCode: 202,
        headers: HEADER_CORS,
        body: JSON.stringify({}),
    };
}
