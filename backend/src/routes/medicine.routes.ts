import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine
} from '../controllers/medicine.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = Router();

const medicineValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),
  body('inStock').isInt({ min: 0 }).withMessage('inStock must be a non-negative integer'),
  body('category').notEmpty().withMessage('Category is required'),
  body('manufacturer').notEmpty().withMessage('Manufacturer is required'),
  body('image').optional().isURL().withMessage('Image must be a valid URL')
];

/**
 * @swagger
 * /api/medicines:
 *   get:
 *     summary: Retrieve a list of medicines with filtering, search, pagination, and sorting
 *     tags: [Medicines]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query for name or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category (e.g., Tablets, Syrup)
 *       - in: query
 *         name: manufacturer
 *         schema:
 *           type: string
 *         description: Filter by manufacturer
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price, name, inStock]
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A paginated list of medicines
 */
router.get('/', getAllMedicines);

/**
 * @swagger
 * /api/medicines/{id}:
 *   get:
 *     summary: Get details of a single medicine
 *     tags: [Medicines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medicine details
 *       404:
 *         description: Medicine not found
 */
router.get('/:id', getMedicineById);

/**
 * @swagger
 * /api/medicines:
 *   post:
 *     summary: Create a new medicine (Admin only)
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - inStock
 *               - category
 *               - manufacturer
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               inStock:
 *                 type: integer
 *               category:
 *                 type: string
 *               manufacturer:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Medicine created successfully
 *       400:
 *         description: Invalid input parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.post('/', authMiddleware, adminMiddleware, medicineValidation, createMedicine);

/**
 * @swagger
 * /api/medicines/{id}:
 *   put:
 *     summary: Update an existing medicine (Admin only)
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               inStock:
 *                 type: integer
 *               category:
 *                 type: string
 *               manufacturer:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Medicine updated successfully
 *       404:
 *         description: Medicine not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.put('/:id', authMiddleware, adminMiddleware, medicineValidation, updateMedicine);

/**
 * @swagger
 * /api/medicines/{id}:
 *   delete:
 *     summary: Delete a medicine (Admin only)
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medicine deleted successfully
 *       404:
 *         description: Medicine not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.delete('/:id', authMiddleware, adminMiddleware, deleteMedicine);

export default router;
