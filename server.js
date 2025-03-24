import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';

const port = 4001;

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', serviceRoutes);

app.listen(port,()=>{
    console.log(`app is running at http://localhost:${port}`);
});
