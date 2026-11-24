import { Router } from 'express';
import * as c from '../controllers/recipe.controller.js';
import { listReviews, createReview } from '../controllers/review.controller.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import { recipeUpload } from '../middleware/upload.js';
import { asyncHandler as h } from '../utils/httpError.js';

const router = Router();

router.get('/', h(c.listRecipes));
router.get('/trending', h(c.trendingKeywords));
router.get('/top-rated', h(c.topRatedPublic));
router.get('/mine', authenticate, h(c.myRecipes));
router.get('/favorites', authenticate, h(c.listFavorites));

router.post('/', authenticate, recipeUpload, h(c.createRecipe));
router.get('/:id', optionalAuth, h(c.getRecipe));
router.put('/:id', authenticate, recipeUpload, h(c.updateRecipe));
router.delete('/:id', authenticate, h(c.deleteRecipe));

router.post('/:id/favorite', authenticate, h(c.toggleFavorite));
router.patch('/:id/status', authenticate, authorize('admin'), h(c.updateStatus));

router.get('/:recipeId/reviews', h(listReviews));
router.post('/:recipeId/reviews', authenticate, h(createReview));

export default router;
