import dotenv from 'dotenv';
import statusCode from '../../status';
import MongoDB from '../../db/Mongodb';

dotenv.config();
let conn = null;

const headers = {
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

/**
 * function get user on ida by id
 * @returns {object} containt status, success data or error
 */
export const getUser = async (event) => {
  const { ida } = event.pathParameters;
  const { MONGO_URL } = event.stageVariables || ({
    MONGO_URL: process.env.MONGO_URL,
  });
  const idaExpressionValidator = /^[0-9a-fA-F]{24}$/;
  const isValid = idaExpressionValidator.test(ida);
  if (!isValid) {
    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: 'email/invalid-email' }),
    });
  }

  try {
    conn = await MongoDB({
      conn,
      mongoUrl: MONGO_URL,
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

  const Users = conn.model('users');
  const user = await Users.findOne({ _id: ida });
  if (!user) {
    return ({
      status: statusCode.BAD_REQUEST.code,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'user/not-found' }),
    });
  }

  const userData = {
    ida: user._id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    last_login: user.last_login,
  };

  return ({
    statusCode: statusCode.SUCCESS.code,
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: { user: userData } }),
  });
};

export default getUser;
