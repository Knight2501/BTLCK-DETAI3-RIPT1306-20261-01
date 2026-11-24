import { HttpError } from '../utils/httpError.js';

export const notFound = (req, res, next) =>
  next(new HttpError(404, `Không tìm thấy ${req.method} ${req.originalUrl}`));

export const errorHandler = (err, req, res, next) => {
  let status = err.status ?? 500;
  let message = err.message || 'Lỗi máy chủ';
  let details = err.details;

  if (err.name === 'ValidationError') {
    status = 400;
    details = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]));
    message = 'Dữ liệu không hợp lệ';
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'ID không hợp lệ';
  } else if (err.code === 11000) {
    status = 409;
    message = 'Dữ liệu đã tồn tại';
  } else if (err.name === 'MulterError') {
    status = 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? 'Ảnh vượt quá 2MB' : err.message;
  }

  if (status >= 500) console.error(err);
  res.status(status).json({ message, ...(details && { details }) });
};
