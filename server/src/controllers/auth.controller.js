import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { HttpError } from '../utils/httpError.js';
import { validateRegister } from '../utils/validate.js';


const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  });

const publicUser = ({ _id, username, email, role }) => ({ _id, username, email, role });

export const register = async (req, res) => {
  validateRegister(req.body);
  const { username, email, password } = req.body;
  if (await User.findOne({ email: email.toLowerCase() })) {
    throw new HttpError(409, 'Email đã được sử dụng', { email: 'Email đã được sử dụng' });
  }
  const user = await User.create({ username, email, password: await bcrypt.hash(password, 10) });
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email ?? '').toLowerCase() }).select('+password');
  if (!user || !(await bcrypt.compare(password ?? '', user.password))) {
    throw new HttpError(401, 'Email hoặc mật khẩu không đúng');
  }
  res.json({ token: signToken(user), user: publicUser(user) });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new HttpError(401, 'Tài khoản không tồn tại');
  res.json({ user: publicUser(user) });
};
