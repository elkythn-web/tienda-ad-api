import express from 'express';
import bodyParser from 'body-parser';
import { db } from './config/db.js';
import cors from "cors";
import { Request, Response } from 'express';
import categoryRouter from './routes/products/categoryRoute';
import productRouter from './routes/products/productRoute';
import imageRouter from './routes/products/imageRoute';
import stockRouter from './routes/products/stockRoute';
import sizeRouter from './routes/products/sizeRoute';

const app = express();
const port = process.env.PORT || 5000;

//TODO: Conectar a la base de datos
db();
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json());

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.get('/api', (req: Request, res: Response) => {
    res.json('API de productos');
});


app.use('/api/v1/products', productRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/images', imageRouter);
app.use('/api/v1/stock', stockRouter);
app.use('/api/v1/sizes', sizeRouter);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});