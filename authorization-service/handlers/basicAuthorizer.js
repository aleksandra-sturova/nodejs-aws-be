const generatePolicy = (principalId, effect, resource) => ({
  principalId,
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
});

export const basicAuthorizer = (event, context, cb) => {
  console.log('Entered basic authorizer lambda function, event: ', event);

  try {
    if (event.type !== 'TOKEN') {
      cb('Unauthorized: missing token');
    }

    const { authorizationToken = '', methodArn } = event || {};
    console.log('Authorization Token: ', authorizationToken);

    const token = authorizationToken.split(' ')[1];
    console.log('Token', token);
    if (!token) {
      cb(null, generatePolicy('login', 'Deny', methodArn));
    }

    const encodedToken = Buffer.from(token, 'base64').toString();
    const [login, password] = encodedToken.split(':');

    console.log('Login: ', login, 'Password: ', password);

    const isValidLogin = password === process.env[login];
    const effect = isValidLogin ? 'Allow' : 'Deny';

    return cb(null, generatePolicy(login, effect, methodArn));
  } catch (e) {
    console.log('Error: ', e);
    return cb('Unauthorized', e);
  }
};
