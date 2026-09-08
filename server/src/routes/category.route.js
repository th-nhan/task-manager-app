import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import {
    getCategories,
    createCategory,
    deleteCategory,
} from '../controllers/category.controller.js';

const router = express.Router();
router.use(verifyToken);

router.get('/', getCategories);
router.post('/', createCategory);
router.delete('/:id', deleteCategory);

export default router;