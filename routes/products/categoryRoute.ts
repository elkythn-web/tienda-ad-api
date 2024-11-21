import express from 'express';
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../../controllers/products/categoryController';

const router = express.Router();

router.get('/', getCategories);
router.post('/', createCategory);
router.put('/update/:category_id', updateCategory);
router.delete('/delete/:category_id', deleteCategory);

export default router;