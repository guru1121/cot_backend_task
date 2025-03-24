import express from 'express';
import { addService, getServices, updateService, deleteService } from '../controllers/serviceController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/category/:categoryId/service', authenticateToken, addService);
router.get('/category/:categoryId/services', authenticateToken, getServices);
router.put('/category/:categoryId/service/:serviceId', authenticateToken, updateService);
router.delete('/category/:categoryId/service/:serviceId', authenticateToken, deleteService);

export default router;
