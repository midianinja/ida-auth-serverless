
import { getUser } from './src/controllers/user/find';
import { login } from './src/controllers/user/login';
import { signup } from './src/controllers/user/signup';
import { validateToken } from './src/controllers/user/validateToken';
import { generateCode, validateCode } from './src/controllers/user/phone';
import { sendEmailValidation, validateEmailToken } from './src/controllers/user/email';
import { requestResetPassword, validateResetPasswordToken, resetPassword } from './src/controllers/user/resetPassword';
import { create as registerPreRegisterList } from './src/controllers/pre-register-lists/create';
import { find as findPreRegisterLists } from './src/controllers/pre-register-lists/find';
import { findOne as findOnePreRegisterList } from './src/controllers/pre-register-lists/findOne';

export const getUserFunction = getUser;
export const loginFunction = login;
export const signupFunction = signup;
export const validateTokenFunction = validateToken;
export const generateCodeFunction = generateCode;
export const validateCodeFunction = validateCode;
export const sendEmailValidationFunction = sendEmailValidation;
export const validateEmailTokenFunction = validateEmailToken;
export const requestResetPasswordFunction = requestResetPassword;
export const validateResetPasswordTokenFunction = validateResetPasswordToken;
export const resetPasswordFunction = resetPassword;
export const registerPreRegisterListFunction = registerPreRegisterList;
export const findPreRegisterListsFunction = findPreRegisterLists;
export const findOnePreRegisterListFunction = findOnePreRegisterList;

export const isAliveFunction = () => ({
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({}),
});
