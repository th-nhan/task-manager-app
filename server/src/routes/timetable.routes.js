import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    getTimetable,
    createTimetableItem,
    updateTimetableItem,
    deleteTimetableItem,
    syncBulkTimetable
} from "../controllers/timetable.controller.js";

const router = express.Router();

router.use(verifyToken);

router.get('/', getTimetable);
router.post('/', createTimetableItem);
router.put('/sync', syncBulkTimetable);
router.put('/:id', updateTimetableItem);
router.delete('/:id', deleteTimetableItem);

export default router;
