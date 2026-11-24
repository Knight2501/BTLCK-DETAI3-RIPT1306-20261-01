import MealPlan from '../models/MealPlan.js';
import { HttpError } from '../utils/httpError.js';

const MEALS = ['sang', 'trua', 'toi'];

export const getMyPlan = async (req, res) => {
  const plan = await MealPlan.findOne({ user: req.user.id }).populate({
    path: 'items.recipe',
    select: 'title image servings cookTime ingredients',
  });
  res.json({ items: (plan?.items ?? []).filter((i) => i.recipe) });
};


export const savePlan = async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length > 21) {
    throw new HttpError(400, 'Thực đơn tối đa 7 ngày × 3 bữa');
  }
  const invalid = items.some((i) => !(i.day >= 0 && i.day <= 6) || !MEALS.includes(i.meal) || !i.recipe);
  if (invalid) throw new HttpError(400, 'Có ô thực đơn không hợp lệ');

  const plan = await MealPlan.findOneAndUpdate(
    { user: req.user.id },
    { items },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json({ items: plan.items });
};
