import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const { 
    PORT, 
    NODE_ENV, 
    POSTGRES_URI, 
    LOG_LEVEL, 
    JWT_SECRET,
    ORIGIN,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET 
} = process.env;
