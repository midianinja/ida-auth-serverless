import jwt from 'jsonwebtoken';
import statusCode from '../../status';
import MongoDB from '../../db/Mongodb';
import { hashPassword } from '../utils';

let conn = null;

const headers = {
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
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

export const toDelete = '';
