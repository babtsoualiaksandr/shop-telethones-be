'use strict';

// tests for getProductsList
// Generated by serverless-jest-plugin

import mod from './../getProductsList';

import { lambdaWrapper as _lambdaWrapper } from 'serverless-jest-plugin';
const lambdaWrapper = _lambdaWrapper;
const wrapped = lambdaWrapper.wrap(mod, { handler: 'getProductsList.get' });

describe('getProductsList', () => {
  beforeAll((done) => {
//  lambdaWrapper.init(liveFunction); // Run the deployed lambda

    done();
  });

  it('implement tests here', () => {
    return wrapped.run({}).then((response) => {
      expect(response).toBeDefined();
    });
  });
});