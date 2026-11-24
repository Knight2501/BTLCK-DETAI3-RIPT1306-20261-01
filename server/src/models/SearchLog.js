import mongoose from 'mongoose';

const searchLogSchema = new mongoose.Schema({
  keyword: { type: String, required: true, lowercase: true, trim: true, maxlength: 50 },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 },
});

export default mongoose.model('SearchLog', searchLogSchema);
