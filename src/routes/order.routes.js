import { Router } from 'express';
import {
  cancelOrderController,
  createOrderController,
  getCurrentBusinessHourStatusController,
  getOrderByIdController,
  getOrderStatusOptionsController,
  listBusinessHoursController,
  listMyOrdersController,
  listOrdersController,
  updateDeliveryPersonController,
  updateBusinessHourController,
  updateOrderStatusController,
} from '../controllers/order.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/status-options', requireRole('admin', 'sales_manager', 'customer'), getOrderStatusOptionsController);
router.get(
  '/business-hours/current-status',
  requireRole('admin', 'sales_manager', 'customer'),
  getCurrentBusinessHourStatusController,
);
router.get('/business-hours', requireRole('admin', 'sales_manager', 'customer'), listBusinessHoursController);
router.patch('/business-hours/:dayOfWeek', requireRole('admin'), updateBusinessHourController);

router.post('/', requireRole('customer'), createOrderController);
router.get('/my', requireRole('customer'), listMyOrdersController);
router.get('/', requireRole('admin', 'sales_manager'), listOrdersController);
router.patch('/:id/status', requireRole('admin', 'sales_manager'), updateOrderStatusController);
router.patch('/:id/delivery-person', requireRole('admin', 'sales_manager'), updateDeliveryPersonController);
router.patch('/:id/cancel', requireRole('admin', 'sales_manager', 'customer'), cancelOrderController);
router.get('/:id', requireRole('admin', 'sales_manager', 'customer'), getOrderByIdController);

export default router;
