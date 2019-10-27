import mongoose from 'mongoose';
import usersModel from './models/users.model';

mongoose.Promise = global.Promise;

export default async ({ conn, mongoUrl = 'mongodb://localhost/auth-ida' }) => {
  console.log('mongoUrl: ', mongoUrl);
  try {
    if (!conn) {
      console.log('=> using new database connection');

      mongoose.model('users', usersModel);

      const newConnection = await mongoose.createConnection(mongoUrl, {
        bufferCommands: false,
        bufferMaxEntries: 0,
        keepAlive: true,
      });

      newConnection.model('users', usersModel);
      return newConnection;
    }
    console.log('=> using existing database connection');
    return conn;
  } catch (err) {
    throw err;
  }
};
