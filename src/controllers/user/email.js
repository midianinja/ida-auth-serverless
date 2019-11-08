import AWS from 'aws-sdk';
import statusCode from '../../status';
import MongoDB from '../../db/Mongodb';

AWS.config.region = 'us-west-2';

let conn = null;

const headers = {
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

export const sendEmailValidation = async (event) => {
  const { email, ida } = JSON.parse(event.body);
  const idaExpressionValidator = /^[0-9a-fA-F]{24}$/;
  const emailExpressionValidator = /^[a-z0-9._-]{2,}@[a-z0-9]{2,}\.[a-z]{2,}(\.[a-z]{2})?$/;

  let isValid = emailExpressionValidator.test(email);
  if (!isValid) {
    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: 'phone/invalid-email' }),
    });
  }

  isValid = idaExpressionValidator.test(ida);
  if (!isValid) {
    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: 'phone/invalid-ida' }),
    });
  }

  const data = {
    // email: {
    //   address: email,
    //   valid: false,
    //   token: getToken(ida, token),
    // },
  };

  const { MONGO_URL } = event.stageVariables || ({
    MONGO_URL: process.env.MONGO_URL,
  });

  conn = await MongoDB({
    conn,
    mongoUrl: MONGO_URL,
  });

  const Users = conn.model('users');
  let user;
  try {
    user = await Users.findOneAndUpdate({ _id: ida }, data, { new: true });
  } catch (error) {
    return ({
      statusCode: statusCode.INTERNAL_SERVER_ERROR.code,
      headers,
      body: JSON.stringify({ error }),
    });
  }

  if (!user) {
    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: 'phone/invalid-ida' }),
    });
  }

  return ({
    statusCode: statusCode.SUCCESS.code,
    headers,
    body: JSON.stringify({}),
  });
};

export const ignore = null;
