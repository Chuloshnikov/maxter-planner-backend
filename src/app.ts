import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { setupSwagger } from './config/swagger';
import authRouter from "./routes/auth.route";

const app = express();
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Настройка Swagger
setupSwagger(app);

// Middleware
app.use(express.json());
app.use(cors());

// Маршруты
app.use("/api/auth", authRouter);
app.get("/", (req, res ) => res.send("Welcome to PostgreSQL version"));

export default app;
