import express from 'express';
import {
    getProducts,
    getProductBySKU,
    createProduct,
    updateProduct,
    deleteProduct
}  from '../../controllers/products/productController';

const router = express.Router();

router.get('/', getProducts);
router.get('/:sku', getProductBySKU);
router.post('/create', createProduct);
router.put('/update/:sku', updateProduct);
router.delete('/delete/:sku', deleteProduct);

export default router;
