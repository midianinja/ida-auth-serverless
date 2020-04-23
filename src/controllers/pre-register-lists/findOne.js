import dotenv from 'dotenv';

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
export const findOne = async (event) => {
  const { id } = event.pathParameters;
  const { MONGO_URL } = event.stageVariables || ({
    MONGO_URL: process.env.MONGO_URL,
  });

  try {
    conn = await MongoDB({
      conn,
      mongoUrl: MONGO_URL,
    });

    const PreRegisterLists = conn.model('pre-register-lists');
    const list = await PreRegisterLists.find({ _id: id });
    return ({
      statusCode: statusCode.SUCCESS.code,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          list: list[0],
        },
      }),
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

export default findOne;
