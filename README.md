# shop-telethones-be
A phone store built on a microservice architecture AWS 

## sls create --template aws-nodejs-ecma-script --path product-service

## sls deploy --region eu-west-1

AWS - Invoke Local
This runs your code locally by emulating the AWS Lambda environment. Please keep in mind, it's not a 100% perfect emulation, there may be some differences, but it works for the vast majority of users. We mock the context with simple mock data:
## serverless invoke local --function getProductsById

npm install --save-dev serverless-jest-plugin
https://github.com/nordcloud/serverless-jest-plugin

## feature: add swagger yaml https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-export-api.html

## aws apigateway get-export --parameters extensions='apigateway' --rest-api-id dhsvydcw18 --stage-name dev --export-type swagger latestswagger2.json