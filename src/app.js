import express from 'express';
import cors from 'cors';
import pollRoutes from './routes/pollRoutes.js';
import choiceRoutes from './routes/choiceRoutes.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use(pollRoutes, choiceRoutes);

app.listen(process.env.PORT, () => console.log(`Servidor rodando porta ${process.env.PORT}`));
