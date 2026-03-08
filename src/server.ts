import dotenv from 'dotenv';
import express from 'express';
import type { Application, Request, Response } from 'express';
import cors from 'cors';

dotenv.config();

const app: Application = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Testinf Route
app.get('/', (req: Request, res: Response) => {
    res.send('Note App API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})