import { Request, Response } from 'express';
import { prisma } from "../../config/prisma";

const getAllImages = async (req: Request, res: Response) => {
    try {
        const images = await prisma.image.findMany({
            select: {
                image_id: true,
                image_url: true,
                image_text: true,
                type: true,
                product_id: true
            }
        });
        res.json(images);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las imagenes' });
    }
}

const getImagenByProductID = async (req: Request, res: Response) => {
    const { product_id } = req.params;

    const product = await prisma.product.findUnique({
        where: { product_id },
        include: {
            images: true
        }
    });

    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    try {
        const images = await prisma.image.findMany({
            select: {
                image_url: true,
                image_text: true,
                type: true,
                product_id: true
            },
            where: {
                product_id: product_id
            }
        });
        res.json(images);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la imagen' });
    }
}

const createImagesProduct = async (req: Request, res: Response) => {
    const { product_id, image_url, image_text, type } = req.body;

    const product = await prisma.product.findUnique({
        where: { product_id },
    });

    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    try {
        await prisma.image.createMany({
            data: {
                image_url: image_url,
                image_text: image_text,
                type: type,
                product_id: product_id
            }
        });
        res.status(201).json({message: 'Imagenes agregadas correctamente al producto'});
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la imagen' });
    }
}

const updateImageProduct = async (req: Request, res: Response) => {
    const { product_id, image_id, image_url, image_text, type } = req.body;

    const product = await prisma.product.findUnique({
        where: { product_id },
    });

    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    try {
        await prisma.image.update({
            where: {
                image_id: image_id
            },
            data: {
                image_url: image_url,
                image_text: image_text,
                type: type,
                product_id: product_id
            }
        });
        res.status(201).json({message: 'Imagen actualizada correctamente'});
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la imagen' });
    }
}

const deleteImageProduct = async (req: Request, res: Response) => {
    const { product_id, image_id } = req.body;

    const product = await prisma.product.findUnique({
        where: { product_id },
    });

    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    try {
        await prisma.image.delete({
            where: {
                image_id: image_id
            }
        });
        res.status(201).json({message: 'Imagen eliminada correctamente'});
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la imagen' });
    }
}

export {
    getImagenByProductID,
    getAllImages,
    createImagesProduct,
    deleteImageProduct,
    updateImageProduct
};