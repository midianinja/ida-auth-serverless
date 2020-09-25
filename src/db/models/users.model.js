import { Schema } from 'mongoose';

const usersModel = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  active: { type: Boolean, default: true },
  email: {
    address: { type: String, default: null, lowercase: true },
    confirmation_code: { type: String, default: null },
    valid: { type: Boolean, default: false },
  },
  phone: {
    number: { type: String, default: null },
    valid: { type: Boolean, default: false },
    confirmation_code: { type: String, default: null },
  },
  reseted_passwords: [{
    password: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now() },
    used_token: { type: String, required: true },
  }],
  last_login: { type: Date, default: Date.now() },
}, {
  usePushEach: true,
  timestamps: { updatedAt: 'updated_at', createdAt: 'created_at' },
});

export default usersModel;
