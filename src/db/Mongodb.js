import mongoose from 'mongoose';
import usersModel from './models/users.model';
import preRegisterListsModel from './models/preRegisterLists.model';
import appsModel from './models/apps.model';

mongoose.Promise = global.Promise;

export default async ({ conn, mongoUrl = '' }) => {
  console.log('mongoUrl:', mongoUrl);
  try {
    if (!conn) {
      console.log('=> using new database connection');
      mongoose.model('users', usersModel);

      const newConnection = await mongoose.createConnection(`mongodb+${mongoUrl}`, {
        bufferCommands: false,
        bufferMaxEntries: 0,
        keepAlive: true,
        useNewUrlParser: true,
      });

      newConnection.model('users', usersModel);
      newConnection.model('pre-register-lists', preRegisterListsModel);
      newConnection.model('apps', appsModel);
      return newConnection;
    }

    console.log('=> using existing database connection');
    return conn;
  } catch (err) {
    throw err;
  }
};
