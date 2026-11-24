import { Router } from 'express';
import { hideReview } from '../controllers/review.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler as h } from '../utils/httpError.js';

const router = Router();
router.patch('/:id/hide', authenticate, authorize('admin'), h(hideReview));
export default router;
