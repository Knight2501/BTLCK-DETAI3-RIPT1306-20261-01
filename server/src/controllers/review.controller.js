import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Recipe from '../models/Recipe.js';
import { HttpError } from '../utils/httpError.js';

const recalc = async (recipeId) => {
  const [stat] = await Review.aggregate([
    { $match: { recipe: new mongoose.Types.ObjectId(recipeId), hidden: false } },
    { $group: { _id: '$recipe', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  await Recipe.findByIdAndUpdate(recipeId, {
    avgRating: stat ? Math.round(stat.avg * 10) / 10 : 0,
    ratingCount: stat?.count ?? 0,
  });
};

export const listReviews = async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = 10;
  const filter = { recipe: req.params.recipeId, hidden: false };
  const [items, total] = await Promise.all([
    Review.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
      .populate('user', 'username'),
    Review.countDocuments(filter),
  ]);
  res.json({ items, total, page, totalPages: Math.ceil(total / limit) });
};

export const createReview = async (req, res) => {
  const { rating, comment } = req.body;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new HttpError(400, 'Số sao phải từ 1 đến 5', { rating: 'Chọn từ 1 đến 5 sao' });
  }
  const recipe = await Recipe.findOne({ _id: req.params.recipeId, status: 'approved' });
  if (!recipe) throw new HttpError(404, 'Không tìm thấy công thức');

  try {
    const review = await Review.create({
      recipe: recipe._id, user: req.user.id, rating, comment: comment ?? '',
    });
    await recalc(recipe._id);
    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) throw new HttpError(409, 'Bạn đã đánh giá món này rồi');
    throw err;
  }
};

export const hideReview = async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { hidden: true }, { new: true });
  if (!review) throw new HttpError(404, 'Không tìm thấy đánh giá');
  await recalc(review.recipe);
  res.json(review);
};
