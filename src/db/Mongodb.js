import mongoose from 'mongoose';
import usersModel from './models/users.model';

mongoose.Promise = global.Promise;

export default async ({ conn, mongoUrl = 'srv://som:ZyzdIdWWHvZIjmJB@cluster0-qqrtz.mongodb.net/som?retryWrites=true&w=majority' }) => {
  console.log('mongoUrl: ', mongoUrl);
  try {
    if (!conn) {
      console.log('=> using new database connection');

      mongoose.model('users', usersModel);

      const newConnection = await mongoose.createConnection('mongodb+srv://som:ZyzdIdWWHvZIjmJB@cluster0-qqrtz.mongodb.net/som?retryWrites=true&w=majority', {
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
