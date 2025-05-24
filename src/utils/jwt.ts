import jwt from "jsonwebtoken";
import { Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};