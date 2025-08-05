import express from 'express';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} from '../controllers/tasks.controller';
import { verifyToken } from '../middleware/auth.middleware';

const tasksRouter = express.Router();

tasksRouter.use(verifyToken); // Защищаем все роуты задач

tasksRouter.post('/', createTask);
tasksRouter.get('/', getTasks);
tasksRouter.put('/:id', updateTask);
tasksRouter.delete('/:id', deleteTask);

export default tasksRouter;