import { Router } from 'express';
import {
  createCategoryController,
  deactivateCategoryController,
  listCategoriesController,
  updateCategoryController,
} from '../controllers/category.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', requireRole('admin', 'sales_manager', 'customer'), listCategoriesController);
router.post('/', requireRole('admin'), createCategoryController);
router.patch('/:id', requireRole('admin'), updateCategoryController);
router.delete('/:id', requireRole('admin'), deactivateCategoryController);

export default router;
