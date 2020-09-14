import dotenv from 'dotenv';
import { generateKey } from '../utils';
import MongoDB from '../../db/Mongodb';
import statusCode from '../../status';

dotenv.config();
let conn = null;

/**
 * function that save a app on database
 * @param  {object} params request params
 * @param  {object} body request data
 * @returns {object} containt status, success data or error
 */
export const create = async (event) => {
  const { name, description } = JSON.parse(event.body);
  const { MONGO_URL } = event.stageVariables || ({
    MONGO_URL: process.env.MONGO_URL,
  });

  try {
    conn = await MongoDB({
      conn,
      mongoUrl: MONGO_URL,
    });

    const Apps = conn.model('apps');
    const newApp = new Apps({
      name, description, key: generateKey(),
    });

    await newApp.save();
    return ({
      statusCode: statusCode.CREATED.code,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          appId: newApp._id,
          appKey: newApp.key,
          name: newApp.name,
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
