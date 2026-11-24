import { Router } from 'express';
import { getMyPlan, savePlan } from '../controllers/mealplan.controller.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler as h } from '../utils/httpError.js';

const router = Router();
router.use(authenticate);
router.get('/me', h(getMyPlan));
router.put('/me', h(savePlan));
export default router;
