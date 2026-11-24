import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    day: { type: Number, min: 0, max: 6, required: true }, 
    meal: { type: String, enum: ['sang', 'trua', 'toi'], required: true },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  },
  { _id: false }
);

const mealPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [itemSchema],
  },
  { timestamps: true }
);

export default mongoose.model('MealPlan', mealPlanSchema);
