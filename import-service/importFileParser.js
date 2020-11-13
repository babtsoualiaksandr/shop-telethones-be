const AWS = require('aws-sdk');
const csv = require('csv-parser');

const BUCKET = 'storage-pothes-store';

const HEADER_CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
};
export async function parser(event) {
    console.log('event ================', event);

    const s3 = new AWS.S3({ region: 'eu-west-1' });
    event.Records.forEach(function (record) {
        console.log('record', record);
    });

    event.Records.forEach((record) => {
        console.log('record ', record);
        console.log(
            ' record.s3.object.key===================',
            record.s3.object.key
        );

         const s3Stream = s3
                .getObject({
                    Bucket: BUCKET,
                    Key: record.s3.object.key,
                })
                .createReadStream();

          console.log('s3Stream', s3Stream);

          s3Stream.pipe(csv())
          .on('data', (data) => {
            console.log(data)
          }).on('end', (dataEnd) => {
            console.log(dataEnd)
          }).on('error', (e) => {
            console.log(e)
          });
          console.log('(*********)');

            s3Stream
                .pipe(csv())
                .on('data', (data) => {
                    console.log('data===================',data);
                })
                .end('end', async () => {
                    console.log(
                      'Copy from ' + BUCKET + '/' + record.s3.object.key
                    );
                    console.log(BUCKET + '/' + record.s3.object.key)
                    console.log(record.s3.object.key.replace(
                      'uploaded',
                      'parsed'
                    ))
                    await s3
                      .copyObject({
                        Bucket: BUCKET,
                        CopySource: BUCKET + '/' + record.s3.object.key,
                        Key: record.s3.object.key.replace(
                          'uploaded',
                          'parsed'
                        ),
                      })
                      .promise();

                    console.log(
                      'Copied into ' +
                      BUCKET +
                      '/' +
                      record.s3.object.key.replace('uploaded', 'parsed')
                    );
                  }); 
    });

    return {
        statusCode: 202,
        headers: HEADER_CORS,
        body: JSON.stringify({ event }),
    };
}
