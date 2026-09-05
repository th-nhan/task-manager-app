import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    getTask,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} from "../controllers/task.controller.js";

const router = express.Router();

router.use(verifyToken);

router.get('/', getTask);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;