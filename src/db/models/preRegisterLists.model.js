import { Schema } from 'mongoose';

const preRegisterListsModel = new Schema({
  category: { type: String, required: true },
  answers: [{ type: Object, required: true }],
  quiz: [{ type: String, required: true }],
  questions: [{ type: String, required: true }],
}, {
  usePushEach: true,
  timestamps: { updatedAt: 'updated_at', createdAt: 'created_at' },
});

export default preRegisterListsModel;
