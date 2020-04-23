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
export const find = async (event) => {
  const { MONGO_URL } = event.stageVariables || ({
    MONGO_URL: process.env.MONGO_URL,
  });

  try {
    conn = await MongoDB({
      conn,
      mongoUrl: MONGO_URL,
    });
    const PreRegisterLists = conn.model('pre-register-lists');

    const lists = await PreRegisterLists.aggregate([{
      $project: { category: 1, _id: 1, answers_count: { $size: '$answers' } },
    }]);

    return ({
      statusCode: statusCode.SUCCESS.code,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          pre_register_lists: lists,
        },
      }),
    });
  } catch (error) {
    console.log(error);
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

export default find;
