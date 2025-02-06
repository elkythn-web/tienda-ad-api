import { Request, Response } from 'express';
import { prisma } from '../../config/prisma';

// Crear carrito de compra de los productos
export const createCard = async (req: Request, res: Response) => {
    const { user_id, items } = req.body;
    try {
        const newCart = await prisma.cart.create({
            data: {
                user_id,
                items: {
                    create: items
                }
            }
        });
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el carrito de compra' });
    }
};