import jwt from 'jsonwebtoken';
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
export const validateToken = async (event) => {
  const { token } = JSON.parse(event.body);

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

    console.log(token);

    const decoded = await jwt.verify(token, SECRET);

    const Users = conn.model('users');
    const user = await Users.findOne({ _id: decoded.ida });

    if (!user) {
      return ({
        statusCode: statusCode.UNAUTHORIZED.code,
        headers: {
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: statusCode.UNAUTHORIZED.tag }),
      });
    }

    return ({
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...decoded,
        email: user.email,
        phone: user.phone,
        username: user.username,
      }),
    });
  } catch (error) {
    return ({
      statusCode: statusCode.UNAUTHORIZED.code,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: statusCode.UNAUTHORIZED.tag }),
    });
  }
};

export default validateToken;
