import express from 'express';
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    updateCategoryStatus
} from '../../controllers/products/categoryController';

const router = express.Router();

router.get('/', getCategories);
router.post('/', createCategory);
router.put('/update/:category_id', updateCategory);
router.put('/update-status/:category_id', updateCategoryStatus);
router.delete('/delete/:category_id', deleteCategory);

export default router;