import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import router from './routes/index';

export const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
