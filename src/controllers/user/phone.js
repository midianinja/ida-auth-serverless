import MongoDB from '../../db/Mongodb';
import statusCode from '../../status';
import { sendSmsAws } from '../utils';

let conn = null;

const headers = {
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

/**
 * function that generate phone validation code and save phone in the user
 * @returns {string} random string to phone validation
 */
const getRandomCode = () => {
  const codeSize = 6;
  const fisrtPossibleChars = '123456789';
  const possibleChars = '0123456789';
  let text = '';
  for (let i = 0; i < codeSize; i += 1) {
    if (i === 0) {
      text += fisrtPossibleChars.charAt(Math.floor(Math.random() * fisrtPossibleChars.length));
    } else {
      text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    }
  }
  return text;
};

/**
 * function that generate phone validation code and save phone in the user
 * @param  {object} event request params
 * @returns {object} containt status, headers, success data or error
 */
export const generateCode = async (event) => {
  const { phone, ida } = JSON.parse(event.body);
  const phoneExpressionValidator = /^\+[0-9]{9,}$/;
  const idaExpressionValidator = /^[0-9a-fA-F]{24}$/;

  let isValid = phoneExpressionValidator.test(phone);
  if (!isValid) {
    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: 'phone/invalid-number' }),
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
    phone: {
      number: phone,
      valid: false,
      confirmation_code: getRandomCode(),
    },
  };
  console.log('data:', data);

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
    console.log('user:', user);
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

  const snsData = {
    Message: `IDA-${data.phone.confirmation_code} é o código de confirmação de seu telefone para sua conta no SOM/IDA.`,
    MessageStructure: 'string',
    PhoneNumber: phone,
  };

  const publish = await sendSmsAws(snsData);
  console.log('publish:', publish);

  // if (send.error) {
  //   return ({
  //     statusCode: statusCode.INTERNAL_SERVER_ERROR.code,
  //     headers,
  //     body: JSON.stringify({ error: send.error }),
  //   });
  // }

  return ({
    statusCode: statusCode.SUCCESS.code,
    headers,
    body: JSON.stringify({
      data: {
        ida: user._id,
        phone: {
          number: phone,
          valid: false,
        },
      },
    }),
  });
};

/**
 * function to validate phone confirmation code
 * @param  {object} event request params
 * @returns {object} containt status, headers, success data or error
 */
export const validateCode = async (event) => {
  const { code, ida } = JSON.parse(event.body);
  const idaExpressionValidator = /^[0-9a-fA-F]{24}$/;
  const isValid = idaExpressionValidator.test(ida);

  if (!isValid) {
    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: 'phone/invalid-ida' }),
    });
  }

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
    user = await Users.findOne({ _id: ida });
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

  if (user.phone.confirmation_code !== code) {
    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: 'phone/invalid-code' }),
    });
  }

  const data = {
    phone: {
      number: user.phone.number,
      valid: true,
      confirmation_code: null,
    },
  };

  try {
    user = await Users.findOneAndUpdate({ _id: ida }, data, { new: true });
  } catch (err) {
    return ({
      statusCode: statusCode.INTERNAL_SERVER_ERROR.code,
      headers,
      body: JSON.stringify({ err }),
    });
  }

  return ({
    statusCode: statusCode.SUCCESS.code,
    headers,
    body: JSON.stringify({
      data: {
        ida: user._id,
        phone: {
          number: user.phone.number,
          valid: true,
        },
      },
    }),
  });
};
