import bcrypt from 'bcrypt';
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
export const login = async (event) => {
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
    if (!user) {
      return ({
        status: statusCode.UNAUTHORIZED.code,
        body: JSON.stringify({ error: 'user/not-found' }),
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return ({
        statusCode: statusCode.UNAUTHORIZED.code,
        body: JSON.stringify({ error: 'user/wrong-password' }),
      });
    }
    const token = jwt.sign({ username, ida: user._id }, SECRET, {
      expiresIn: '1h',
    });

    return ({
      statusCode: statusCode.ACCEPTED.code,
      body: JSON.stringify({ data: { ida: user._id, token } }),
    });
  } catch (error) {
    return ({
      statusCode: statusCode.INTERNAL_SERVER_ERROR.code,
      body: JSON.stringify({ error }),
    });
  }
};

export default login;
