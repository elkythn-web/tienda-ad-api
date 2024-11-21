import express from 'express';
import {
    getImagenByProductID,
    getAllImages,
    createImagesProduct,
    deleteImageProduct,
    updateImageProduct
} from '../../controllers/products/imageController';

const router = express.Router();

router.get('/', getAllImages);
router.get('/:product_id', getImagenByProductID);

router.post('/create', createImagesProduct);
router.delete('/delete/:image_id', deleteImageProduct);
router.put('/update', updateImageProduct);


export default router;