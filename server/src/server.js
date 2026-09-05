import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health',(req,res) =>{
    res.json({message: 'Server đang chạy bình thường'});
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại port http://localhost:${PORT}`);
})