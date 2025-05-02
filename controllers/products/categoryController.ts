import { prisma } from "../../config/prisma";
import { Request, Response } from 'express';

const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany(
            {
                select: {
                    category_id: true,
                    name: true,
                    description: true,
                    status: true,
                    created_at: true,
                }
            }
        );
        res.json(categories);
    } catch (error) {
        res.status(500).json({error: 'Error al obtener las categorías'});
    }
};

const createCategory = async (req: Request, res: Response) => {

    const { name, description } = req.body;

    if (name === '') {
        return res.status(400).json({ error: 'name no puede estar vacío' });
    }

    try {
        const category = await prisma.category.create({
            data: {
                name: name,
                description: description
            }
        });
        res.status(201).json({ message: 'Categoría creada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la categoría' });
    }
};

const updateCategory = async (req: Request, res: Response) => {

    const { category_id }  = req.params
    const {name, description } = req.body;

    if (name === '') {
        return res.status(400).json({ error: 'name no puede estar vacío' });
    }

    try {
        await prisma.category.update({
            where: {
                category_id: category_id,
            },
            data: {
                name: name,
                description: description
            }
        });
        res.status(200).json({message: 'Categoría actualizada'});
    } catch (error) {
        res.status(500).json({error: 'Error al actualizar la categoría'});
    }
};

const deleteCategory = async (req: Request, res: Response) => {

    const { category_id } = req.params;

    if (category_id === '') {
        return res.status(400).json({ error: 'category_id debe ser un número válido' });
    }

    try {
        await prisma.category.delete({
            where: {
                category_id: category_id
            }
        });
        res.status(200).json({message: 'Categoría eliminada'});
    } catch (error) {
        res.status(500).json({error: 'Error al eliminar la categoría'});
    }
};

const updateCategoryStatus = async (req: Request, res: Response) => {
    const { category_id } = req.params;
    const { status } = req.body;

    if (category_id === '') {
        return res.status(400).json({ error: 'category_id debe ser un número válido' });
    }

    try {
        await prisma.category.update({
            where: {
                category_id: category_id
            },
            data: {
                status: status
            }
        });
        res.status(200).json({message: 'Categoría actualizada'});
    } catch (error) {
        res.status(500).json({error: 'Error al actualizar la categoría'});
    }
}

export { getCategories, createCategory, updateCategory, deleteCategory, updateCategoryStatus };