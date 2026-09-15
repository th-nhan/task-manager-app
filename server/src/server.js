import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import categoryRoutes from "./routes/category.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/api/health',(req,res) =>{
    res.json({message: 'Server is running normally'});
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})