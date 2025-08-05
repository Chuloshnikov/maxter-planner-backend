import { User } from '@prisma/client';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

declare global {
  declare namespace Express {
  export interface Request {
    user?: {
      id: string;
    };
  }
}
}