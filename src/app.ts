import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { setupSwagger } from './config/swagger';
import authRouter from "./routes/auth.route";
import tasksRouter from './routes/tasks.routes';

const app = express();

/**
 * Middleware
 */

// CORS
app.use(cors({
  origin: ["https://maxter-planner.vercel.app", "http://localhost:3000"], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Парсинг JSON тела запросов
app.use(express.json({ limit: "10mb" }));

// Cookie парсер
app.use(cookieParser());

/**
 * Swagger документация
 */
setupSwagger(app);

/**
 * Роуты
 */
app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);

app.get("/", (req, res) => {
  res.send("Welcome to PostgreSQL version");
});

export default app;