import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { hashPassword } from '../utils';
import MongoDB from '../../db/Mongodb';
import statusCode from '../../status';

dotenv.config();
let conn = null;

/**
 * function that save a user on database
 * @param  {object} params request params
 * @param  {object} body request data
 * @returns {object} containt status, success data or error
 */
export const signup = async (event) => {
  const { username, password } = JSON.parse(event.body);
  console.log('password: ', password);
  console.log('username: ', username);
  const {
    SECRET,
    MONGO_URL,
  } = event.stageVariables || ({
    SECRET: 'weednaoehganja',
    MONGO_URL: process.env.MONGO_URL,
  });

  try {
    conn = await MongoDB({
      conn,
      mongoUrl: MONGO_URL,
    });
    const Users = conn.model('users');

    const user = await Users.findOne({ username });
    if (user) {
      return ({
        statusCode: statusCode.UNAUTHORIZED.code,
        headers: {
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'auth/duplicated-user' }),
      });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new Users({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    const token = jwt.sign({ username, ida: newUser._id },
      SECRET, { expiresIn: '1h' });

    return ({
      statusCode: statusCode.CREATED.code,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { ida: newUser._id, token } }),
    });
  } catch (error) {
    return ({
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: error.Error }),
    });
  }
};

export default signup;
