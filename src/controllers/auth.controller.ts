import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/jwt';
import cloudinary from '@/lib/claudinary';

const prisma = new PrismaClient();

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters' });
    return;
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    res.status(409).json({ message: 'User already exists' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: { username, email, password: hashedPassword },
  });

  generateToken(newUser.id, res);

  res.status(201).json({
    id: newUser.id,
    username,
    email,
    profilePic: newUser.profilePic,
  });
};

export const logIn = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(400).json({ message: 'User not found' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400).json({ message: 'Invalid credentials' });
    return;
  }

  generateToken(user.id, res);

  res.status(200).json({
    id: user.id,
    username: user.username,
    email,
    profilePic: user.profilePic,
  });
};

export const logOut = (req: Request, res: Response): void => {
  res.cookie('jwt', '', { maxAge: 0 });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { profilePic } = req.body;

  const uploadRes = await cloudinary.uploader.upload(profilePic);

  const updated = await prisma.user.update({
    where: { id: req.user.id },
    data: { profilePic: uploadRes.secure_url },
  });

  res.status(200).json(updated);
};

export const checkAuth = (req: Request, res: Response): void => {
  res.status(200).json(req.user);
};