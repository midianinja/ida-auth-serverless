import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import statusCode from '../../status';

dotenv.config();

/**
 * function that get all services on database
 * @param  {object} params request params
 * @param  {object} body request data
 * @returns {object} containt status, success data or error
 */
export const validateToken = async (event) => {
  const { token } = JSON.parse(event.body);
  const {
    SECRET,
  } = event.stageVariables || ({
    SECRET: 'weednaoehganja',
  });

  try {
    const decoded = await jwt.verify(token, SECRET);
    return ({
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(decoded),
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
