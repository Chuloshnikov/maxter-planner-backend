import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { title, description, priority, status, dueDate, project }: {
      title: string;
      description?: string;
      priority: "high" | "medium" | "low";
      status: "pending" | "in-progress" | "completed";
      dueDate: string;
      project: "alpha" | "development" | "marketing" | "docs";
    } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const task = await prisma.task.create({
      data: {
        userId,
        title,
        description,
        priority,
        status,
        dueDate: new Date(dueDate),
        project
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = req.params.id;
    const userId = req.user?.id;
    const updates = req.body;

    if (updates.dueDate) {
      updates.dueDate = new Date(updates.dueDate);
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    if (task.userId !== userId) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updates
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = req.params.id;
    const userId = req.user?.id;

    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    if (task.userId !== userId) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    await prisma.task.delete({
      where: { id: taskId }
    });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};