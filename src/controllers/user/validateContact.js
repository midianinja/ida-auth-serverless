
import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import statusCode from '../../status';
import MongoDB from '../../db/Mongodb';
import { sendSmsAws } from '../utils';

AWS.config.region = 'us-west-2';
const ses = new AWS.SES();

let conn = null;

const headers = {
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

/**
 * function that generate phone validation code and save phone in the user
 * @returns {string} random string to phone validation
 */
const getRandomCode = () => {
  const codeSize = 4;
  const fisrtPossibleChars = '123456789';
  const possibleChars = '0123456789';
  let text = '';
  for (let i = 0; i < codeSize; i += 1) {
    if (i === 0) {
      text += fisrtPossibleChars.charAt(Math.floor(Math.random() * fisrtPossibleChars.length));
    } else {
      text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    }
  }
  return text;
};


const getEmailParams = to => ({
  Destination: {
    ToAddresses: [to.email.address],
  },
  Message: {
    Body: {
      Html: {
        Charset: 'UTF-8',
        Data: `IDA-${to.email.confirmation_code} é o código de confirmação para sua conta no IDA.`,
      },
      Text: {
        Charset: 'UTF-8',
        Data: `IDA-${to.email.confirmation_code} é o código de confirmação para sua conta no IDA.`,
      },
    },
    Subject: {
      Charset: 'UTF-8',
      Data: 'Código de confirmação',
    },
  },
  Source: 'digital.oasi@gmail.com',
});

const send = (to, webBaseUri) => new Promise((resolve, reject) => {
  ses.sendEmail(getEmailParams(to, webBaseUri), (err, data) => {
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
export const requestCode = async (event) => {
  const { input, ida } = JSON.parse(event.body);
  console.log('input', input);
  const emailExpressionValidator = /^[a-z0-9._-]{2,}@[a-z0-9]{2,}\.[a-z0-9]{2,}(\.[a-z0-9]{2,})*?$/;
  const phoneExpressionValidator = /^\+[0-9]{9,}$/;
  const idaExpressionValidator = /^[0-9a-fA-F]{24}$/;

  const {
    // SECRET,
    MONGO_URL,
    // WEB_URI,
    DATABASE_NAME,
  } = event.stageVariables || ({
    SECRET: 'weednaoehganja',
    MONGO_URL: process.env.MONGO_URL,
    DATABASE_NAME: process.env.DATABASE_NAME,
    WEB_URI: 'http://localhost:8080',
  });

  const isValidEmail = emailExpressionValidator.test(input);
  const isValidPhone = phoneExpressionValidator.test(input);
  const isValidIda = idaExpressionValidator.test(ida);

  if (!isValidEmail && !isValidPhone) {
    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: 'reset-code/invalid-input' }),
    });
  }

  conn = await MongoDB({
    conn,
    mongoUrl: MONGO_URL.replace('_DATABASE_', DATABASE_NAME),
  });


  const inputFilter = {
    $or: [{ 'phone.number': input }, { 'email.address': input }],
  };
  const idaFilter = { _id: mongoose.Types.ObjectId(ida) };
  const filter = isValidIda ? idaFilter : inputFilter;

  const Users = conn.model('users');
  console.log('Users', Users);
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
      body: JSON.stringify({ error: 'reset-code/user-not-found' }),
    });
  }

  if (isValidEmail) {
    console.log('isValidEmail', isValidEmail);
    const data = {
      email: {
        address: input, // user.email.address,
        valid: false,
        confirmation_code: getRandomCode(),
      },
    };
    try {
      const uaer = await Users.findOneAndUpdate(
        { _id: user._id },
        data,
        { new: true, useFindAndModify: false },
      );
      console.log('uaer', uaer);
      const emailData = await send(data);
      console.log('emailData', emailData);
    } catch (err) {
      console.log('err', err);
      return ({
        statusCode: statusCode.BAD_REQUEST.code,
        headers,
        body: JSON.stringify({ error: 'reset-code/to-send-reset-email' }),
      });
    }
  } else if (isValidPhone) {
    const data = {
      phone: {
        number: input, // user.phone.number,
        valid: false,
        confirmation_code: getRandomCode(),
      },
    };
    const snsData = {
      Message: `IDA-${data.phone.confirmation_code} é o código de confirmação de seu telefone para sua conta no IDA.`,
      MessageStructure: 'string',
      PhoneNumber: input, // user.phone.number,
    };

    try {
      await Users.findOneAndUpdate({ _id: user._id }, data, { new: true });
      await sendSmsAws(snsData);
    } catch (err) {
      return ({
        statusCode: statusCode.BAD_REQUEST.code,
        headers,
        body: JSON.stringify({ error: 'reset-code/to-send-reset-sms' }),
      });
    }
  }

  return ({
    statusCode: statusCode.SUCCESS.code,
    headers,
    body: JSON.stringify({ status: 'reset-code/success' }),
  });
};


/**
 * function that validate reset code token
 * @param  {object} params request params
 * @param  {object} body request data
 * @returns {object} containt status, success data or error
 */
export const validateCode = async (event) => {
  try {
    const { code } = JSON.parse(event.body);
    const { SECRET, MONGO_URL, DATABASE_NAME } = event.stageVariables || ({
      SECRET: 'weednaoehganja',
      MONGO_URL: process.env.MONGO_URL,
      DATABASE_NAME: process.env.DATABASE_NAME,
    });

    try {
      conn = await MongoDB({
        conn,
        mongoUrl: MONGO_URL.replace('_DATABASE_', DATABASE_NAME),
      });
    } catch (error) {
      throw new TypeError('db/connection');
    }
    let codeOwner;

    try {
      codeOwner = await conn.model('users').findOne({
        $or: [
          { 'email.confirmation_code': code },
          { 'phone.confirmation_code': code },
        ],
      });
      if (!codeOwner) throw new TypeError('user/not_found');
    } catch (err) {
      if (err.message === 'user/not_found') throw err;
      throw new TypeError('db/findUser');
    }
    let user;
    const isEmail = codeOwner.email.confirmation_code === code;
    const isPhone = codeOwner.phone.confirmation_code === code;
    let data;
    if (!isEmail && !isPhone) throw new TypeError('unexpected_error');
    if (isEmail) {
      data = {
        email: {
          email: codeOwner.email,
          confirmation_code: null,
          valid: true,
        },
      };
    }
    if (isPhone) {
      data = {
        phone: {
          number: codeOwner.phone.number,
          confirmation_code: null,
          valid: true,
        },
      };
    }
    console.log('validateCode -> data', data);
    try {
      user = await conn.model('users').findOneAndUpdate(
        { _id: codeOwner._id },
        data,
      );
      if (!codeOwner) throw new TypeError('user_update/not_found');
    } catch (err) {
      if (err.message === 'user_update/not_found') throw err;
      throw new TypeError('db/findOneAndUpdate');
    }
    let token;
    try {
      token = jwt.sign({
        email: user.email.address,
        phone: user.phone.number,
        ida: user._id,
      }, SECRET, {
        expiresIn: '7d',
      });
    } catch (err) {
      throw err;
    }

    return ({
      statusCode: statusCode.SUCCESS.code,
      headers,
      body: JSON.stringify({
        token,
        email: user.email,
        phone: user.phone,
        username: user.username,
        ida: user._id,
      }),
    });
  } catch (err) {
    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: err.message }),
    });
  }
};
