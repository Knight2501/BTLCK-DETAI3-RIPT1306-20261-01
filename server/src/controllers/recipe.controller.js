import mongoose from 'mongoose';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import SearchLog from '../models/SearchLog.js';
import { HttpError } from '../utils/httpError.js';
import { validateRecipe } from '../utils/validate.js';

const LIMIT_DEFAULT = 12;
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


export const listRecipes = async (req, res) => {
  const { q, category, maxTime, difficulty, ingredients } = req.query;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || LIMIT_DEFAULT, 50);

  const match = { status: 'approved' };
  if (q?.trim()) match.title = { $regex: escapeRegex(q.trim()), $options: 'i' };
  if (category) {
    if (!mongoose.isValidObjectId(category)) throw new HttpError(400, 'ID loại món không hợp lệ');
    match.category = new mongoose.Types.ObjectId(category);
  }
  if (maxTime) match.cookTime = { $lte: Number(maxTime) };
  if (difficulty) match.difficulty = difficulty;

  const wanted = (ingredients ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const sortStages = wanted.length
    ? [
        { $match: { ...match, ingredientNames: { $in: wanted } } },
        { $addFields: { matchCount: { $size: { $setIntersection: ['$ingredientNames', { $literal: wanted }] } } } },
        { $sort: { matchCount: -1, avgRating: -1, createdAt: -1 } },
      ]
    : [{ $match: match }, { $sort: { createdAt: -1 } }];

  const pipeline = [
    ...sortStages,
    {
      $facet: {
        items: [
          { $skip: (page - 1) * limit },
          { $limit: limit },
          { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'category' } },
          { $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author' } },
          { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
          { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
          {
            $project: {
              title: 1, image: 1, cookTime: 1, difficulty: 1, avgRating: 1, ratingCount: 1,
              matchCount: 1, ingredientNames: 1, 'category._id': 1, 'category.name': 1,
              'author._id': 1, 'author.username': 1,
            },
          },
        ],
        total: [{ $count: 'count' }],
      },
    },
  ];


  const keyword = q?.trim();
  if (keyword && page === 1 && keyword.length >= 2 && keyword.length <= 50 && !wanted.length) {
    SearchLog.create({ keyword }).catch(() => {});
  }

  const [result] = await Recipe.aggregate(pipeline);
  const total = result.total[0]?.count ?? 0;
  res.json({ items: result.items, total, page, totalPages: Math.ceil(total / limit) });
};

export const getRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id)
    .populate('category', 'name')
    .populate('author', 'username');
  if (!recipe) throw new HttpError(404, 'Không tìm thấy công thức');
  const isOwner = req.user && String(recipe.author._id) === req.user.id;
  const isAdmin = req.user?.role === 'admin';
  if (recipe.status !== 'approved' && !isOwner && !isAdmin) {
    throw new HttpError(404, 'Không tìm thấy công thức');
  }
  res.json(recipe);
};


const buildPayload = (req, existing) => {
  let data;
  try {
    data = JSON.parse(req.body.data ?? '{}');
  } catch {
    throw new HttpError(400, 'Trường data không phải JSON hợp lệ');
  }
  validateRecipe(data);

  const cover = req.files?.image?.[0];
  const stepFiles = req.files?.stepImages ?? [];

  const steps = data.steps.map((s) => ({
    content: s.content.trim(),
    image: Number.isInteger(s.imageIdx) && stepFiles[s.imageIdx]
      ? `/uploads/${stepFiles[s.imageIdx].filename}`
      : s.image ?? '',
  }));

  const ingredients = data.ingredients.map(({ name, quantity, unit }) => ({
    name: name.trim(),
    quantity: Number(quantity),
    unit: (unit ?? '').trim(),
  }));

  return {
    title: data.title.trim(),
    description: data.description ?? '',
    category: data.category,
    cookTime: Number(data.cookTime),
    difficulty: data.difficulty,
    servings: Number(data.servings) || 2,
    ingredients,
    ingredientNames: ingredients.map((i) => i.name.toLowerCase()),
    steps,
    image: cover ? `/uploads/${cover.filename}` : existing?.image ?? '',
  };
};

export const createRecipe = async (req, res) => {
  const payload = buildPayload(req);
  const recipe = await Recipe.create({
    ...payload,
    author: req.user.id,
    status: req.user.role === 'admin' ? 'approved' : 'pending', 
  });
  res.status(201).json(recipe);
};

export const updateRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) throw new HttpError(404, 'Không tìm thấy công thức');

  if (String(recipe.author) !== req.user.id && req.user.role !== 'admin') {
    throw new HttpError(403, 'Bạn chỉ được sửa công thức của mình');
  }
  Object.assign(recipe, buildPayload(req, recipe));
  if (req.user.role !== 'admin') recipe.status = 'pending'; 
  await recipe.save();
  res.json(recipe);
};

export const deleteRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) throw new HttpError(404, 'Không tìm thấy công thức');
  if (String(recipe.author) !== req.user.id && req.user.role !== 'admin') {
    throw new HttpError(403, 'Bạn chỉ được xóa công thức của mình');
  }
  await recipe.deleteOne();
  res.status(204).end();
};


export const myRecipes = async (req, res) => {
  const items = await Recipe.find({ author: req.user.id })
    .sort({ createdAt: -1 })
    .populate('category', 'name');
  res.json({ items });
};


export const toggleFavorite = async (req, res) => {
  const recipe = await Recipe.exists({ _id: req.params.id, status: 'approved' });
  if (!recipe) throw new HttpError(404, 'Không tìm thấy công thức');
  const user = await User.findById(req.user.id);
  const has = user.favorites.some((id) => String(id) === req.params.id);
  await User.updateOne(
    { _id: user._id },
    has ? { $pull: { favorites: req.params.id } } : { $addToSet: { favorites: req.params.id } }
  );
  res.json({ favorited: !has });
};


export const listFavorites = async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: 'favorites',
    match: { status: 'approved' },
    select: 'title image cookTime difficulty avgRating ratingCount',
  });
  res.json({ items: user.favorites, ids: user.favorites.map((r) => r._id) });
};


export const updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    throw new HttpError(400, 'Trạng thái không hợp lệ');
  }
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!recipe) throw new HttpError(404, 'Không tìm thấy công thức');
  res.json(recipe);
};


export const trendingKeywords = async (req, res) => {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const items = await SearchLog.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: '$keyword', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    { $limit: 8 },
    { $project: { _id: 0, keyword: '$_id', count: 1 } },
  ]);
  res.json({ items, updatedAt: new Date() });
};

export const topRatedPublic = async (req, res) => {
  const items = await Recipe.find({ status: 'approved', ratingCount: { $gte: 1 } })
    .sort({ avgRating: -1, ratingCount: -1 })
    .limit(8)
    .select('title image cookTime difficulty avgRating ratingCount');
  res.json({ items });
};
