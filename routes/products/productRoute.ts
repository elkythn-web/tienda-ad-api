import express from 'express';
import {
    getProducts,
    getProductBySKU,
    getProductByID,
    createProduct,
    updateProduct,
    deleteProduct,
    activateProduct,
    updateCompleteProduct
}  from '../../controllers/products/productController';

const router = express.Router();

router.get('/', getProducts);
router.get('/:sku', getProductBySKU);
router.get('/:product_id', getProductByID);
router.post('/create', createProduct);
router.put('/update/:sku', updateProduct);
router.put('/update-complete/:sku', updateCompleteProduct);
router.delete('/delete/:sku', deleteProduct);
router.put('/activate/:sku', activateProduct);


export default router;
