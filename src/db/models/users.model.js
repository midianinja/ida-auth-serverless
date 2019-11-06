import { Schema } from 'mongoose';

const usersModel = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  active: { type: Boolean, default: true },
  email: {
    address: { type: String, required: true },
    valid: { type: Boolean, default: false },
  },
  phone: [{
    number: { type: String, required: true },
    valid: { type: Boolean, default: false },
    confirmation_code: { type: String, required: true },
  }],
  last_login: { type: Date, default: Date.now() },
}, {
  usePushEach: true,
  timestamps: { updatedAt: 'updated_at', createdAt: 'created_at' },
});

export default usersModel;
