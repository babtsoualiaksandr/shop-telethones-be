module.exports = async (event, ctx, cb) => {
    console.log(JSON.stringify(event));

    if (event['type'] != 'TOKEN') {
        cb('Unauthorized');
    }

    try {
        const authorizationToken = event.authorizationToken;

        const encodedCredos = authorizationToken.split(' ')[1];
        
        const buff = Buffer.from(encodedCredos, 'base64')
        const plainCredos = buff.toString('utf-8').split(':');
        const userName = plainCredos[0];
        const password = plainCredos[1];

        console.log(`user Name: ${userName} and password ${password}`);

        const storedUserPassword = process.env['babtsoualiaksandr'];
        const effect = !storedUserPassword || storedUserPassword != password ? 'Deny' : 'Allow';

        const policy = generatePolicy(encodedCredos, event.methodArn, effect)
        
        cb(null, policy);

    } catch (error) {
        cb(`Unauthorized': ${error.message}`);
    }
};

const generatePolicy = (principalId, resource, effect = 'Allow') => {
    return {
        principalId: principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                },
            ],
        },
    };
};
