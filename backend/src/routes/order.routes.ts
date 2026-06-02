import { Router } from 'express';
import { body } from 'express-validator';
import { createOrder, getOrders } from '../controllers/order.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'pharmacy_app_secret_key_123';

// Helper middleware to optionally decode user token for guest/user ordering
const optionalAuthMiddleware = (req: any, _res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (e) {
      // Ignore invalid token, treat as guest
    }
  }
  next();
};

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - phone
 *               - email
 *               - items
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: "+380991234567"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - medicineId
 *                     - quantity
 *                   properties:
 *                     medicineId:
 *                       type: string
 *                       example: med_1
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Insufficient stock or invalid parameters
 */
router.post(
  '/',
  optionalAuthMiddleware,
  [
    body('customerName').notEmpty().withMessage('Customer name is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.medicineId').notEmpty().withMessage('Medicine ID is required for all items'),
    body('items.*.quantity').isInt({ gt: 0 }).withMessage('Quantity must be an integer greater than 0')
  ],
  createOrder
);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get order history for the authenticated user (or all orders for Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, getOrders);

export default router;
