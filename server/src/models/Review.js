import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '', maxlength: 500 },
    hidden: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

reviewSchema.index({ recipe: 1, user: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
