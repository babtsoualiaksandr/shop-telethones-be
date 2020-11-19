'use strict';

// tests for importCSVtoS
// Generated by serverless-jest-plugin

var AWS = require('aws-sdk-mock');

const mod = require('./../importProductsFile');

// const url = await s3.getSignedUrlPromise('putObject', s3Params)

const jestPlugin = require('serverless-jest-plugin');
const lambdaWrapper = jestPlugin.lambdaWrapper;
const wrapped = lambdaWrapper.wrap(mod, { handler: 'get' });

describe('importCSVtoS', () => {
    beforeAll((done) => {
        //  lambdaWrapper.init(liveFunction); // Run the deployed lambda

        AWS.mock('S3', 'getSignedUrl', (action, _params, callback) => {
            console.log('S3', 'getSignedUrl', 'mock called');
            callback(null, mockSignedUrl);
        });

        done();
    });

    it('implement tests here', () => {
      const event = {
        httpMethod: 'GET',
        queryStringParameters: {
          name: 'my.csv',
        },
        body: '{}',
      };

        return wrapped.run({}).then((response) => {
            expect(response).toBeDefined();
        });
    });
});