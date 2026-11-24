import { Router } from 'express';
import { listByStatus, topRated } from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler as h } from '../utils/httpError.js';

const router = Router();
router.use(authenticate, authorize('admin'));
router.get('/recipes', h(listByStatus));
router.get('/top-rated', h(topRated));
export default router;
