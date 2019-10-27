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
  const {
    SECRET,
    MONGO_URL,
  } = event.stageVariables || ({
    SECRET: 'weednaoehganja',
    MONGO_URL: 'weednaoehganja',
  });

  try {
    conn = await MongoDB({
      conn,
      mongoUrl: event.stageVariables ? `mongodb+${MONGO_URL}` : undefined,
    });
    const Users = conn.model('users');


    const user = await Users.findOne({ username });
    console.log('user: ', user);
    if (user) {
      console.log('user: ', user);
      return ({
        statusCode: statusCode.UNAUTHORIZED.code,
        headers: {
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        error: 'auth/duplicated-user',
      });
    }
    const hashedPassword = await hashPassword(password);
    console.log('hashedPassword: ', hashedPassword);
    const newUser = new Users({
      username,
      password: hashedPassword,
    });
    await newUser.save();
    console.log('newUser: ', newUser);
    const token = jwt.sign({
      username,
      ida: newUser._id,
    }, SECRET, { expiresIn: '1h' });
    return ({
      statusCode: statusCode.CREATED.code,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { ida: newUser._id, token } }),
    });
  } catch (error) {
    console.log('error: ', error);
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

export default signup;
