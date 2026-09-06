import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
    getCategories,
    createCategory,
    deleteCategory,
} from '../controllers/category.controller.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', getCategories);
router.post('/', createCategory);
router.delete('/:id', deleteCategory);

export default router;