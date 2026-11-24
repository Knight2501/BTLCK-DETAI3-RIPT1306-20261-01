import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const stepSchema = new mongoose.Schema(
  { content: { type: String, required: true, trim: true }, image: { type: String, default: '' } },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: '', maxlength: 1000 },
    image: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cookTime: { type: Number, required: true, min: 1 }, 
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
    servings: { type: Number, default: 2, min: 1 },
    ingredients: { type: [ingredientSchema], validate: (v) => v.length > 0 },
    steps: { type: [stepSchema], validate: (v) => v.length > 0 },
    ingredientNames: { type: [String], index: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    avgRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Recipe', recipeSchema);
