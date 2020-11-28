const AWS = require('aws-sdk');
const BUCKET = 'storage-pothes-store';

const HEADER_CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
};
export async function get(event) {
    let status = 200;
    const nameFileCsv = event.queryStringParameters.name;
    const s3Params = {
        Bucket: BUCKET,
        Key: `uploaded/${nameFileCsv}`,
        ContentType: 'text/csv',
        Expires: 60
    };
    console.log(s3Params);
    let url ='';

    try {
        const s3 = new AWS.S3({ region: 'eu-west-1', signatureVersion: 'v4' });
        console.log(s3);
        url = s3.getSignedUrl('putObject', s3Params);
    } catch (err) {
       status = 500;
        return {
            statusCode: status,
            headers: HEADER_CORS,
            body: JSON.stringify({ error: err, event: event }),
        }; 
    }
    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: url
    };
}

export async function getThumbnails(event) {
    console.log(event);
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    let status = 200;
    let thumbnails = [];
    const params = {
        bucket: BUCKET,
        prefix: 'uploaded/',
    };
    try {
        const s3Response = await s3.listObjectsV2(params).promise();
        thumbnails = s3Response.Contents;
    } catch (error) {
        console.log(error);
        status = 500;
    }

    const response = {
        statusCode: status,
        headers: HEADER_CORS,
        body: JSON.stringify(
            thumbnails
                .filter((thumbnail) => thumbnail.Size)
                .map(
                    (thumbnail) =>
                        `https://${BUCKET}.s3.amasonaws.com/${thumbnail.key}`
                )
        ),
    };
}
