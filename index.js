
import { login } from './src/controllers/user/login';
import { signup } from './src/controllers/user/signup';
import { validateToken } from './src/controllers/user/validateToken';
import { generateCode, validateCode } from './src/controllers/user/phone';

export const loginFunction = login;
export const signupFunction = signup;
export const validateTokenFunction = validateToken;
export const generateCodeFunction = generateCode;
export const validateCodeFunction = validateCode;

export const isAliveFunction = () => ({
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({}),
});
