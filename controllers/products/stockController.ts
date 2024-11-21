import { Request, Response } from 'express';
import { prisma } from "../../config/prisma";

const getAllStock = async (req: Request, res: Response) => {
    try {
        const stock = await prisma.inventory.findMany({
            select: {
                product_id: true,
                quantity: true,
                size:{
                    select:{
                        size: true
                    }
                },

            }
        });
        res.json(stock);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el stock' });
    }
}

const getStockByProductID = async (req: Request, res: Response) => {
    const { product_id } = req.params;

    const product = await prisma.product.findUnique({
        where: { product_id },
        include: {
            inventory: true
        }
    });

    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    try {
        const stock = await prisma.inventory.findMany({
            select: {
                product_id: true,
                quantity: true
            },
            where: {
                product_id: product_id
            }
        });
        res.json(stock);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el stock' });
    }
}

const createStockProduct = async (req: Request, res: Response) => {
    const { product_id, size_id, quantity, price } = req.body;

    if (!product_id) {
        return res.status(400).json({ error: 'Debe proporcionar product_id' });
    }

    const product = await prisma.product.findUnique({
        where: { product_id },
    });

    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (size_id) {
        const size = await prisma.size.findUnique({
            where: { size_id },
        });

        if (!size) {
            return res.status(404).json({ error: 'Talla no encontrada' });
        }

        const existingInventory = await prisma.inventory.findFirst({
            where: { product_id, size_id },
        });

        if (existingInventory) {
            return res.status(400).json({ error: 'El producto ya tiene inventario para esta talla' });
        }
    }

    try {
        await prisma.inventory.create({
            data: {
                product_id: product_id,
                size_id: size_id || null,
                quantity: quantity,
                price: price
            }
        });
        res.status(201).json({ message: 'Stock agregado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el stock' });
    }
}

const updateStockProduct = async (req: Request, res: Response) => {
    const { inventory_id } = req.params;
    const { quantity, price } = req.body;

    const inventory = await prisma.inventory.findUnique({
        where: { inventory_id },
    });

    if (!inventory) {
        return res.status(404).json({ error: 'Inventario no encontrado' });
    }

    try {
        await prisma.inventory.update({
            where: {
                inventory_id: inventory_id
            },
            data: {
                quantity: quantity,
                price: price
            }
        });
        res.status(201).json({ message: `Stock del producto actualizado` });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el stock' });
    }
}

const deleteStockProduct = async (req: Request, res: Response) => {
    const { inventory_id } = req.params;

    const inventory = await prisma.inventory.findUnique({
        where: { inventory_id },
    });

    if (!inventory) {
        return res.status(404).json({ error: 'Inventario no encontrado' });
    }

    try {
        await prisma.inventory.delete({
            where: {
                inventory_id: inventory_id
            }
        });
        res.status(200).json({ message: 'Stock eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el stock' });
    }
}

export {
    getAllStock,
    getStockByProductID,
    createStockProduct,
    updateStockProduct,
    deleteStockProduct
};