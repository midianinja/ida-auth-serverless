import AWS from 'aws-sdk';
import MongoDB from '../../db/Mongodb';
import statusCode from '../../status';

AWS.config.region = 'us-west-2';
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
  const phoneExpressionValidator = /^\+[0-9]{13}$/;
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
  console.log('heree', isValid, ida);
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

  console.log('heree 2', user);
  if (!user) {
    return ({
      statusCode: statusCode.BAD_REQUEST.code,
      headers,
      body: JSON.stringify({ error: 'phone/invalid-ida' }),
    });
  }

  const sns = new AWS.SNS();
  const snsData = {
    Message: `IDA-${data.phone.confirmation_code} é o código de confirmação de seu telefone para sua conta no SOM/IDA.`,
    MessageStructure: 'string',
    PhoneNumber: phone,
  };

  const publish = await sns.publish(snsData);
  const send = await publish.send();

  if (send.error) {
    return ({
      statusCode: statusCode.INTERNAL_SERVER_ERROR.code,
      headers,
      body: JSON.stringify({ error: send.error }),
    });
  }

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

export const validateCode = async () => {

};
