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
export const create = async (event) => {
  const { answers, quiz, category } = JSON.parse(event.body);
  const { MONGO_URL } = event.stageVariables || ({
    MONGO_URL: process.env.MONGO_URL,
  });

  try {
    conn = await MongoDB({
      conn,
      mongoUrl: MONGO_URL,
    });
    const PreRegisterLists = conn.model('pre-register-lists');

    const newList = new PreRegisterLists({
      answers,
      quiz,
      category,
    });

    await newList.save();
    return ({
      statusCode: statusCode.CREATED.code,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          _id: newList._id,
          answers: newList.csv,
          category: newList.category,
          quiz: newList.quiz,
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

export default create;
