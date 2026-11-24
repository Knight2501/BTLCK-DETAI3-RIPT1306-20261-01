import Recipe from '../models/Recipe.js';


export const listByStatus = async (req, res) => {
  const status = req.query.status ?? 'pending';
  const items = await Recipe.find({ status })
    .sort({ createdAt: -1 })
    .populate('author', 'username')
    .populate('category', 'name');
  res.json({ items });
};


export const topRated = async (req, res) => {
  const items = await Recipe.aggregate([
    { $match: { status: 'approved', ratingCount: { $gte: 1 } } },
    { $sort: { avgRating: -1, ratingCount: -1 } },
    { $limit: 10 },
    { $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author' } },
    { $unwind: '$author' },
    { $project: { title: 1, image: 1, avgRating: 1, ratingCount: 1, 'author.username': 1 } },
  ]);
  res.json({ items });
};
