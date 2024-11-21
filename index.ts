import express from 'express';
import bodyParser from 'body-parser';
import { db } from './config/db.js';
import { Request, Response } from 'express';
import productRouter from './routes/products/productRoute';
import categoryRouter from './routes/products/categoryRoute';
import imageRouter from './routes/products/imageRoute';
import stockRouter from './routes/products/stockRoute';
import sizeRouter from './routes/products/sizeRoute';

const app = express();
const port = process.env.PORT || 5000;

//TODO: Conectar a la base de datos
db();

app.use(express.json());
app.use(bodyParser.json());

app.get('/api', (req: Request, res: Response) => {
    res.json('API de productos');
});

app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/images', imageRouter);
app.use('/api/stock', stockRouter);
app.use('/api/sizes', sizeRouter);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});