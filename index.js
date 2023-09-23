import { config as dotEnvConfig } from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { authRouter } from './router/authRouter.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

dotEnvConfig();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

app.use('/api/auth', authRouter);

app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL).then(() => console.log('DB OK'));
        app.listen(5000, () => console.log(`Server started on PORT: ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();
