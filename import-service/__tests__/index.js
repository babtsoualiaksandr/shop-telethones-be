const AWS = require('aws-sdk')
const s3 = new AWS.S3()

s3.putObject({},()=> {
  return 2;
});