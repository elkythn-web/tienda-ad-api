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
    let imagesData;
    let product_id;

    if (Array.isArray(req.body)) {
        // Si el cuerpo es directamente un array de imágenes
        imagesData = req.body;
        // Tomamos el product_id del primer elemento (asumiendo que todos tienen el mismo product_id)
        product_id = imagesData[0]?.product_id;
    } else {
        // Si el cuerpo tiene una estructura con product_id e images
        const { product_id: id, images } = req.body;
        imagesData = images;
        product_id = id;
    }

    if (!product_id) {
        return res.status(400).json({ error: 'Se requiere product_id' });
    }

    // Verificar que el producto existe mediante el product_id
    const product = await prisma.product.findUnique({
        where: { product_id },
    });

    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    try {

        if (!Array.isArray(imagesData)) {
            return res.status(400).json({ error: 'Las imágenes deben estar en formato de arreglo' });
        }

        // Si los elementos del array no tienen product_id, añadirlo
        const dataToCreate = imagesData.map(img => ({
            image_url: img.image_url,
            image_text: img.image_text,
            type: img.type,
            product_id: img.product_id || product_id
        }));

        // Crear múltiples imágenes usando createMany
        await prisma.image.createMany({
            data: dataToCreate
        });

        res.status(201).json({
            message: 'Imágenes agregadas correctamente al producto',
            count: dataToCreate.length
        });
    } catch (error) {
        console.error('Error al crear las imágenes:', error);
        res.status(500).json({ error: 'Error al crear las imágenes' });
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

