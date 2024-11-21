import express from 'express';
import {
    getAllSizes,
    getSizeByProductID,
    createSizeProduct,
    updateSizeProduct,
    deleteSizeProduct
} from '../../controllers/products/sizeController';

const router = express.Router();

router.route('/').get(getAllSizes).post(createSizeProduct);

router.get('/:size_id', getSizeByProductID);
router.put('/:size_id', updateSizeProduct);
router.delete('/:size_id', deleteSizeProduct);


export default router;