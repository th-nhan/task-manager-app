import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import categoryRoutes from "./routes/category.route.js";
import timetableRoutes from "./routes/timetable.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/timetable', timetableRoutes);

app.get('/api/health',(req,res) =>{
    res.json({message: 'Server is running normally'});
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})