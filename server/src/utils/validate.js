import { HttpError } from './httpError.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = ({ username, email, password }) => {
  const errors = {};
  if (!username || username.trim().length < 3) errors.username = 'Tên tối thiểu 3 ký tự';
  if (!EMAIL_RE.test(email ?? '')) errors.email = 'Email không hợp lệ';
  if (!password || password.length < 6) errors.password = 'Mật khẩu tối thiểu 6 ký tự';
  if (Object.keys(errors).length) throw new HttpError(400, 'Dữ liệu không hợp lệ', errors);
};

export const validateRecipe = (data) => {
  const errors = {};
  if (!data.title?.trim()) errors.title = 'Vui lòng nhập tên món';
  if (!data.category) errors.category = 'Vui lòng chọn loại món';
  if (!(Number(data.cookTime) > 0)) errors.cookTime = 'Thời gian nấu phải lớn hơn 0';
  if (!['easy', 'medium', 'hard'].includes(data.difficulty)) errors.difficulty = 'Độ khó không hợp lệ';
  if (!Array.isArray(data.ingredients) || data.ingredients.length === 0) {
    errors.ingredients = 'Cần ít nhất 1 nguyên liệu';
  } else if (data.ingredients.some((i) => !i.name?.trim() || !(Number(i.quantity) >= 0))) {
    errors.ingredients = 'Mỗi nguyên liệu cần tên và số lượng hợp lệ';
  }
  if (!Array.isArray(data.steps) || data.steps.length === 0) {
    errors.steps = 'Cần ít nhất 1 bước làm';
  } else if (data.steps.some((s) => !s.content?.trim())) {
    errors.steps = 'Mỗi bước cần có nội dung';
  }
  if (Object.keys(errors).length) throw new HttpError(400, 'Dữ liệu không hợp lệ', errors);
};
