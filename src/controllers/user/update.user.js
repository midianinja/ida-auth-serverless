// import mongoose from 'mongoose';

// import { hashPassword } from '../utils';

// update func

// route -> /auth/update-password

// method: PUT

// auth required: yes

// receives token with userId and body with password
// search for existing userId
// hash new password update user on db
// return userId

export const update = async (/* params, body, token */) => {
  // const Users = mongoose.model('users');

  // try {
  //   const hashedPassword = await hashPassword(body.senha);
  //   const data = await Users.findOneAndUpdate(
  //     { _id: token.userId },
  //     { $set: { password: hashedPassword } },
  //     { new: true },
  //   );
  //   if (!data) return { status: 200, data: { message: 'userNot found' } };
  //   return { status: 200, data: { message: 'update password succesful', userId: data._id } };
  // } catch (e) {
  //   return { status: 500, data: e };
  // }
};

export default update;
