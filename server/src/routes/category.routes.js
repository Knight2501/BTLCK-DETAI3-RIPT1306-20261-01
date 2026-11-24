import { Router } from 'express';
import * as c from '../controllers/category.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler as h } from '../utils/httpError.js';

const router = Router();
router.get('/', h(c.listCategories));
router.post('/', authenticate, authorize('admin'), h(c.createCategory));
router.put('/:id', authenticate, authorize('admin'), h(c.updateCategory));
router.delete('/:id', authenticate, authorize('admin'), h(c.deleteCategory));
export default router;
