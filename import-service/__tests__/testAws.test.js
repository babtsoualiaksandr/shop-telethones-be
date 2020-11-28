// your test under test folder
let AWS = require('aws-sdk');
describe('test', () => {
  let result;
  beforeEach(()=>{
    AWS.S3 = jest.fn().mockImplementation( ()=> {
      return {
        putObject (params, cb) {
          result = cb();
        }
      };
    });
    require('./index');
  });
  test('call s3', () => {
    expect(result).toBe(2);
  });
});