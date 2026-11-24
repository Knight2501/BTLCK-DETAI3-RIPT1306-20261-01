import Category from '../models/Category.js';
import Recipe from '../models/Recipe.js';
import { HttpError } from '../utils/httpError.js';

export const listCategories = async (req, res) => {
  res.json({ items: await Category.find().sort({ name: 1 }) });
};

export const createCategory = async (req, res) => {
  if (!req.body.name?.trim()) throw new HttpError(400, 'Vui lòng nhập tên loại món');
  res.status(201).json(await Category.create({ name: req.body.name }));
};

export const updateCategory = async (req, res) => {
  if (!req.body.name?.trim()) throw new HttpError(400, 'Vui lòng nhập tên loại món');
  const cat = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true, runValidators: true });
  if (!cat) throw new HttpError(404, 'Không tìm thấy loại món');
  res.json(cat);
};

export const deleteCategory = async (req, res) => {
  if (await Recipe.exists({ category: req.params.id })) {
    throw new HttpError(409, 'Loại món đang có công thức, không thể xóa');
  }
  const cat = await Category.findByIdAndDelete(req.params.id);
  if (!cat) throw new HttpError(404, 'Không tìm thấy loại món');
  res.status(204).end();
};
