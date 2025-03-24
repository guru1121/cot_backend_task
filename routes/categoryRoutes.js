import express from 'express';
import { addCategory, getCategories, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/category', authenticateToken, addCategory);
router.get('/categories', authenticateToken, getCategories);
router.put('/category/:categoryId', authenticateToken, updateCategory);
router.delete('/category/:categoryId', authenticateToken, deleteCategory);

export default router;
