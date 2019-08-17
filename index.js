
import { login } from './src/controllers/user/login';
import { signup } from './src/controllers/user/signup';
import { validateToken } from './src/controllers/user/validateToken';

export const loginFunction = login;
export const signupFunction = signup;
export const validateTokenFunction = validateToken;

export const isAliveFunction = (event) => {
  console.log('body: ', event.body);
  console.log('httpMethod: ', event.httpMethod);
  console.log('queryStringParameters: ', event.queryStringParameters);
  console.log('multiValueQueryStringParameters: ', event.multiValueQueryStringParameters);
  console.log('stageVariables: ', event.stageVariables);
  console.log('resource: ', event.resource);
  console.log('pathParameters: ', event.pathParameters);
};

export const vtnc = (event) => {
  console.log('event: ', event);
};
