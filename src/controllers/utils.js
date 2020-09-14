import bcrypt from 'bcrypt';
import AWS from 'aws-sdk';

AWS.config.region = 'us-west-2';


const POSSIBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export const generateKey = (length = 32) => {
  let text = '';
  for (let i = 0; i < length; i += 1) {
    text += POSSIBLE_CHARS.charAt(Math.floor(Math.random() * POSSIBLE_CHARS.length));
  }

  return text;
};

export const hashPassword = async (password) => {
  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });

  return hashedPassword;
};

export const sendSmsAws = snsData => new Promise((res, rej) => {
  console.log('snsData:', snsData);
  const sns = new AWS.SNS();
  sns.publish(snsData, (err, data) => {
    console.log('data:', data);
    if (err) return rej(err);
    return res(data);
  });
});

export default hashPassword;
