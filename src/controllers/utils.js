import bcrypt from 'bcrypt';
import AWS from 'aws-sdk';

AWS.config.region = 'us-west-2';

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
