import express from 'express';
import {
    getAllStock,
    getStockByProductID,
    createStockProduct,
    updateStockProduct,
    deleteStockProduct
} from '../../controllers/products/stockController';

const router = express.Router();


router.route('/').get(getAllStock).post(createStockProduct);

router.get('/:product_id', getStockByProductID);
router.put('/:product_id', updateStockProduct);
router.delete('/:product_id', deleteStockProduct);


export default router;

