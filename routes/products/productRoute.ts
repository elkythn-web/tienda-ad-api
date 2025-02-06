import express from 'express';
import {
    getProducts,
    getProductBySKU,
    getProductByID,
    createProduct,
    updateProduct,
    deleteProduct
}  from '../../controllers/products/productController';

const router = express.Router();

router.get('/', getProducts);
router.get('/:sku', getProductBySKU);
router.get('/:product_id', getProductByID);
router.post('/create', createProduct);
router.put('/update/:sku', updateProduct);
router.delete('/delete/:sku', deleteProduct);

export default router;
