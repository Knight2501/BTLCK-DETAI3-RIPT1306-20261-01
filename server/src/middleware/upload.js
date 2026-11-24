import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { HttpError } from '../utils/httpError.js';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) =>
    cb(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
});

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    ALLOWED.includes(file.mimetype)
      ? cb(null, true)
      : cb(new HttpError(400, 'Chỉ chấp nhận ảnh JPG, PNG, WEBP')),
});

export const recipeUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'stepImages', maxCount: 20 },
]);
