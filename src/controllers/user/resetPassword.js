import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';
import statusCode from '../../status';
import MongoDB from '../../db/Mongodb';
import { hashPassword, sendSmsAws } from '../utils';

AWS.config.region = 'us-west-2';
const ses = new AWS.SES();

let conn = null;

const headers = {
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

const getEmailParams = (ida, to, webBaseUri) => ({
  Destination: {
    ToAddresses: [to.address],
  },
  Message: {
    Body: {
      Html: {
        Charset: 'UTF-8',
        Data: `Clique <a href="${webBaseUri}/reset-password?token=${to.token}">aqui</a> para resetar sua senha.`,
      },
      Text: {
        Charset: 'UTF-8',
        Data: `Seu link de reset de senha: ${webBaseUri}/reset-password?token=${to.token}`,
      },
    },
    Subject: {
      Charset: 'UTF-8',
      Data: 'Link para resetar sua senha',
    },
  },
  Source: 'gabrielfurlan05@gmail.com',
});

const send = (ida, to, webBaseUri) => new Promise((resolve, reject) => {
  ses.sendEmail(getEmailParams(ida, to, webBaseUri), (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

/**
 * function that send email with url token for validation
 * @param  {object} params request params
 * @param  {object} body request data
 * @returns {object} containt status, success data or error
 */
export const requestResetPassword = async (event) => {
  const { input } = JSON.parse(event.body);
  const emailExpressionValidator = /^[a-z0-9._-]{2,}@[a-z0-9]{2,}\.[a-z0-9]{2,}(\.[a-z0-9]{2,})*?$/;
  const phoneExpressionValidator = /^\+[0-9]{9,}$/;

  const {
    SECRET,
    MONGO_URL,
    WEB_URI,
    DATABASE_NAME,
  } = event.stageVariables || ({
    SECRET: 'weednaoehganja',
    MONGO_URL: process.env.MONGO_URL,
    DATABASE_NAME: process.env.DATABASE_NAME,
    WEB_URI: 'http://localhost:8080',
  });

  const isValidEmail = emailExpressionValidator.test(input);
  const isValidPhone = phoneExpressionValidator.test(input);

  if (!isValidEmail && !isValidPhone) {
    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: 'reset-password/invalid-input' }),
    });
  }

  conn = await MongoDB({
    conn,
    mongoUrl: MONGO_URL.replace('_DATABASE_', DATABASE_NAME),
  });

  const filter = {
    $or: [{ 'phone.number': input }, { 'email.address': input }],
  };

  const Users = conn.model('users');
  let user;
  try {
    user = await Users.findOne(filter);
  } catch (error) {
    return ({
      statusCode: statusCode.INTERNAL_SERVER_ERROR.code,
      headers,
      body: JSON.stringify({ error }),
    });
  }

  if (!user) {
    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: 'reset-password/user-not-found' }),
    });
  }

  const token = jwt.sign({ email: user.email, phone: user.phone, ida: user._id }, SECRET, {
    expiresIn: '1h',
  });

  if (isValidEmail) {
    try {
      await send(user._id, { address: user.email.address, token }, WEB_URI);
    } catch (err) {
      return ({
        statusCode: statusCode.BAD_REQUEST.code,
        headers,
        body: JSON.stringify({ error: 'reset-password/to-send-reset-email' }),
      });
    }
  } else if (isValidPhone) {
    const snsData = {
      Message: `Seu link de reset de senha: ${WEB_URI}/reset-password?token=${token}`,
      MessageStructure: 'string',
      PhoneNumber: user.phone.number,
    };

    try {
      const publish = await sendSmsAws(snsData);
      console.log('publish:', publish);
    } catch (err) {
      return ({
        statusCode: statusCode.BAD_REQUEST.code,
        headers,
        body: JSON.stringify({ error: 'reset-password/to-send-reset-sms' }),
      });
    }
  }

  return ({
    statusCode: statusCode.SUCCESS.code,
    headers,
    body: JSON.stringify({ status: 'reset-password/success', data: { token } }),
  });
};

/**
 * function that validate reset password token
 * @param  {object} params request params
 * @param  {object} body request data
 * @returns {object} containt status, success data or error
 */
export const validateResetPasswordToken = async (event) => {
  const { token } = JSON.parse(event.body);
  const { SECRET } = event.stageVariables || ({
    SECRET: 'weednaoehganja',
    MONGO_URL: process.env.MONGO_URL,
  });

  const promise = () => new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });

  let decoded;

  try {
    decoded = await promise();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return ({
        statusCode: statusCode.BAD_REQUEST.code,
        headers,
        body: JSON.stringify({ error: 'validate-token/expired-token' }),
      });
    }

    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: 'validate-token/invalid-token' }),
    });
  }

  return ({
    statusCode: statusCode.SUCCESS.code,
    headers,
    body: JSON.stringify({ status: 'validate-token/success', data: decoded }),
  });
};

/**
 * function that reset the user password
 * @param  {object} params request params
 * @param  {object} body request data
 * @returns {object} containt status, success data or error
 */
export const resetPassword = async (event) => {
  const { token, password } = JSON.parse(event.body);

  const { SECRET, MONGO_URL, DATABASE_NAME } = event.stageVariables || ({
    SECRET: 'weednaoehganja',
    MONGO_URL: process.env.MONGO_URL,
    DATABASE_NAME: process.env.DATABASE_NAME,
  });

  const promise = () => new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });

  let decoded;
  try {
    decoded = await promise();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return ({
        statusCode: statusCode.BAD_REQUEST.code,
        headers,
        body: JSON.stringify({ error: 'reset-password/expired-token' }),
      });
    }

    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: 'reset-password/invalid-token' }),
    });
  }

  console.log(decoded);

  conn = await MongoDB({
    conn,
    mongoUrl: MONGO_URL.replace('_DATABASE_', DATABASE_NAME),
  });

  const Users = conn.model('users');
  let user;
  try {
    user = await Users.findOne({ _id: decoded.ida });
  } catch (error) {
    return ({
      statusCode: statusCode.INTERNAL_SERVER_ERROR.code,
      headers,
      body: JSON.stringify({ error }),
    });
  }

  if (!user) {
    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: 'reset-password/user-not-found' }),
    });
  }

  if (user.reseted_passwords.findIndex(row => row.token === token) !== -1) {
    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: 'reset-password/expired-token' }),
    });
  }

  user.reseted_passwords.push({ password: user.password, token });

  const hashedPassword = await hashPassword(password);
  user.password = hashedPassword;

  await Users.findOneAndUpdate({ _id: user._id }, user, { new: true });

  return ({
    statusCode: statusCode.SUCCESS.code,
    headers,
    body: JSON.stringify({ status: 'reset-password/success', data: { ida: user._id } }),
  });
};
