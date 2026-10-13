import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    getTeachingSessions,
    generateMonthlySessions,
    createTeachingSession,
    updateTeachingSession,
    batchUpdateStatus,
    deleteTeachingSession,
    clearMonthlySessions
} from "../controllers/teachingSession.controller.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getTeachingSessions);
router.post("/generate-month", generateMonthlySessions);
router.post("/", createTeachingSession);
router.put("/batch-status", batchUpdateStatus);
router.put("/:id", updateTeachingSession);
router.delete("/clear-month", clearMonthlySessions);
router.delete("/:id", deleteTeachingSession);

export default router;
