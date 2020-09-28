import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import statusCode from '../../status';
import MongoDB from '../../db/Mongodb';

dotenv.config();
let conn = null;

/**
 * function that get all services on database
 * @param  {object} params request params
 * @param  {object} body request data
 * @returns {object} containt status, success data or error
 */
export const login = async (event) => {
  const { username, password } = JSON.parse(event.body);

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

    const Users = conn.model('users');
    const user = await Users.findOne({ username });

    if (!user) {
      return ({
        statusCode: statusCode.UNAUTHORIZED.code,
        headers: {
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'user/not-found' }),
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return ({
        statusCode: statusCode.UNAUTHORIZED.code,
        headers: {
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'user/wrong-password' }),
      });
    }

    const token = jwt.sign({ username, ida: user._id }, SECRET, {
      expiresIn: '7d',
    });

    const userData = {
      ida: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      last_login: user.last_login,
    };

    return ({
      statusCode: statusCode.ACCEPTED.code,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...userData, token }),
    });
  } catch (error) {
    return ({
      statusCode: statusCode.INTERNAL_SERVER_ERROR.code,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error }),
    });
  }
};

export default login;
