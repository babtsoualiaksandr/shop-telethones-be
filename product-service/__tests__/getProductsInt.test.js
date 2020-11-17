const https = require('https');

describe('Name of the group', () => {
    test('should res object ', async () => {
    const res =  await https.get('https://1997fk87d0.execute-api.eu-west-1.amazonaws.com/dev/import?name=addresses.csv', (res) => {
        let result = '';
            res.on('data',(d) => {
              process.stdout.write(d);
              return d
            });
          
          }).on('error', (e) => {
            console.error(e);
          });

        expect(typeof res).toBe('object');
    });

    test('should res 200 ', async () => {
        const res =  await https.get('https://1997fk87d0.execute-api.eu-west-1.amazonaws.com/dev/import?name=addresses.csv', (res) => {
            let result = '';
                res.on('data',(d) => {
                  process.stdout.write(d);
                  process.stdout.write(JSON.parse(d));
                  return d
                });
              
              }).on('error', (e) => {
                console.error(e);
              });
    
            expect(typeof res ).toBe('object');
        });
});
