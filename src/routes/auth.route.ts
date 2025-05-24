import { Router } from 'express';
import {
  signUp,
  logIn,
  logOut,
  updateProfile,
  checkAuth,
} from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth.middleware';

const authRouter = Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', logIn);
authRouter.post('/sign-out', logOut);

authRouter.put('/update-profile', verifyToken, updateProfile);
authRouter.get('/check', verifyToken, checkAuth);

export default authRouter;