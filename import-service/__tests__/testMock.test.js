
'use strict';

const tap = require('tap');
const test = tap.test;
const awsMock = require('../index.js');
const AWS = require('aws-sdk');
const isNodeStream = require('is-node-stream');
const concatStream = require('concat-stream');
const Readable = require('stream').Readable;

AWS.config.paramValidation = false;

tap.afterEach(function (done) {
  awsMock.restore();
  done();
});

t.test('method with no input rules can be mocked even if paramValidation is set', function(st) {
    awsMock.mock('S3', 'getSignedUrl', 'message');
    const s3 = new AWS.S3({paramValidation: true});
    s3.getSignedUrl('getObject', {}, function(err, data) {
      st.equals(data, 'message');
      st.end();
    });
  });