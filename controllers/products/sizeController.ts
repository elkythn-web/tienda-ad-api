import { Request, Response } from 'express';
import { prisma } from "../../config/prisma";

const getAllSizes = async (req: Request, res: Response) => {
    try {
        const sizes = await prisma.size.findMany();
        res.json(sizes);
    } catch (error) {
        res.status(500).json({error: 'Error al obtener los tamaños'});
    }
};

const getSizeByProductID = async (req: Request, res: Response) => {
    try {
        const sizes = await prisma.size.findMany({
            include: {
                product: true
            },
        });
        res.json(sizes);
    } catch (error) {
        res.status(500).json({error: 'Error al obtener los tamaños'});
    }
};

const createSizeProduct = async (req: Request, res: Response) => {
    const { size } = req.body;

    try {
        const existingSize = await prisma.size.findFirst({
            where: {
                size: size
            }
        });

        if (existingSize) {
            return res.status(400).json({ error: 'El tamaño ya existe' });
        }

        await prisma.size.create({
            data: {
                size: size,
            }
        });
        res.status(201).json({ message: 'Tamaño creado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el tamaño' });
    }
}

const updateSizeProduct = async (req: Request, res: Response) => {
    const { size_id } = req.params;
    const { size } = req.body;

    try {
        const sizeProduct = await prisma.size.update({
            where: {
                size_id: size_id
            },
            data: {
                size: size,
            }
        });
        res.json(sizeProduct);
    } catch (error) {
        res.status(500).json({error: 'Error al actualizar el tamaño'});
    }
}

const deleteSizeProduct = async (req: Request, res: Response) => {
    const { size_id } = req.params;

    try {
        await prisma.size.delete({
            where: {
                size_id: size_id,
            }
        });
        res.status(200).json({message: 'Tamaño eliminado'});
    } catch (error) {
        res.status(500).json({error: 'Error al eliminar el tamaño'});
    }
}

export {
    getAllSizes,
    getSizeByProductID,
    createSizeProduct,
    updateSizeProduct,
    deleteSizeProduct
};