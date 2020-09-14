import { Schema } from 'mongoose';

const apps = new Schema({
  key: { type: String, required: true },
  name: { type: String, required: true },
  image_uri: { type: String },
  description: { type: String },
}, {
  usePushEach: true,
  timestamps: { updatedAt: 'updated_at', createdAt: 'created_at' },
});

export default apps;
