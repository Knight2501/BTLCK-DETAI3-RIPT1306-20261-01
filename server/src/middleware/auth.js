import jwt from 'jsonwebtoken';
import { HttpError } from '../utils/httpError.js';

const readToken = (req) => {
  const header = req.headers.authorization ?? '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
};

export const authenticate = (req, res, next) => {
  const token = readToken(req);
  if (!token) return next(new HttpError(401, 'Bạn cần đăng nhập'));
  try {
    const { id, role } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id, role };
    next();
  } catch {
    next(new HttpError(401, 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn'));
  }
};

export const optionalAuth = (req, res, next) => {
  const token = readToken(req);
  if (token) {
    try {
      const { id, role } = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id, role };
    } catch {
    }
  }
  next();
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new HttpError(403, 'Bạn không có quyền thực hiện thao tác này'));
  }
  next();
};
