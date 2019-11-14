import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';
import statusCode from '../../status';
import MongoDB from '../../db/Mongodb';

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
        Data: `Clique <a href="${webBaseUri}/ativacao/${ida}?token=${to.token}">aqui</a> para validar sua conta.`,
      },
      Text: {
        Charset: 'UTF-8',
        Data: `Seu link de ativação: ${webBaseUri}/ativacao/${ida}?token=${to.token}`,
      },
    },
    Subject: {
      Charset: 'UTF-8',
      Data: 'Confirme sua conta no SOM',
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
export const sendEmailValidation = async (event) => {
  const { email, ida } = JSON.parse(event.body);
  const idaExpressionValidator = /^[0-9a-fA-F]{24}$/;
  const emailExpressionValidator = /^[a-z0-9._-]{2,}@[a-z0-9]{2,}\.[a-z]{2,}(\.[a-z]{2})?$/;

  const { SECRET, MONGO_URL, WEB_URI } = event.stageVariables || ({
    SECRET: 'weednaoehganja',
    MONGO_URL: process.env.MONGO_URL,
    WEB_URI: 'http://localhost:8080',
  });

  let isValid = emailExpressionValidator.test(email);
  if (!isValid) {
    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: 'email/invalid-email' }),
    });
  }

  isValid = idaExpressionValidator.test(ida);
  if (!isValid) {
    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: 'email/invalid-ida' }),
    });
  }

  const token = jwt.sign({ email, ida }, SECRET, {
    expiresIn: '1h',
  });

  const data = {
    email: {
      address: email,
      valid: false,
      token,
    },
  };

  conn = await MongoDB({
    conn,
    mongoUrl: MONGO_URL,
  });

  const Users = conn.model('users');
  let user;
  try {
    user = await Users.findOneAndUpdate({ _id: ida }, data, { new: true });
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
      body: JSON.stringify({ error: 'phone/invalid-ida' }),
    });
  }

  let sendEmailResult;

  try {
    sendEmailResult = await send(ida, data.email, WEB_URI);
  } catch (err) {
    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: 'email/to-send' }),
    });
  }

  return ({
    statusCode: statusCode.SUCCESS.code,
    headers,
    body: JSON.stringify(sendEmailResult),
  });
};

/**
 * function that validate email with token
 * @param  {object} params request params
 * @param  {object} body request data
 * @returns {object} containt status, success data or error
 */
export const validateEmailToken = async (event) => {
  const { ida, token } = JSON.parse(event.body);
  const idaExpressionValidator = /^[0-9a-fA-F]{24}$/;

  const { SECRET, MONGO_URL } = event.stageVariables || ({
    SECRET: 'weednaoehganja',
    MONGO_URL: process.env.MONGO_URL,
  });

  const isValid = idaExpressionValidator.test(ida);
  if (!isValid) {
    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: 'email/invalid-ida' }),
    });
  }

  conn = await MongoDB({
    conn,
    mongoUrl: MONGO_URL,
  });

  const Users = conn.model('users');
  let user;
  try {
    user = await Users.findOne({ _id: ida });
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
      body: JSON.stringify({ error: 'email/invalid-ida' }),
    });
  }

  if (user.email.token !== token) {
    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: 'email/invalid-token' }),
    });
  }

  const promise = () => new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });

  try {
    await promise();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return ({
        statusCode: statusCode.BAD_REQUEST.code,
        headers,
        body: JSON.stringify({ error: 'email/expired-token' }),
      });
    }

    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: 'email/invalid-token' }),
    });
  }

  try {
    await Users.findOneAndUpdate({ _id: ida }, { 'email.valid': true }, { new: true });
  } catch (error) {
    return ({
      statusCode: statusCode.INTERNAL_SERVER_ERROR.code,
      headers,
      body: JSON.stringify({ error }),
    });
  }

  const sessionToken = jwt.sign({ username: user.username, ida: user._id }, SECRET, {
    expiresIn: '1h',
  });

  return ({
    statusCode: statusCode.SUCCESS.code,
    headers,
    body: JSON.stringify({ data: { ida, email: user.email.address, sessionToken } }),
  });
};
