import { router as appointmentRouter } from './routes/appointmentRoutes';
import cors from 'cors';

import express from 'express';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', appointmentRouter);
export default app;