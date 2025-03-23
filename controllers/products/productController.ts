import { prisma } from "../../config/prisma";
import { Request, Response } from 'express';

const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            select: {
                product_id: true,
                name: true,
                description: true,
                sku: true,
                status: true,
                category: {
                    select: {
                        name: true
                    }
                },
                images: {
                    select: {
                        image_id: true,
                        image_url: true,
                        image_text: true,
                        type: true
                    }
                },
                inventory: {
                    select: {
                        quantity: true,
                        price: true,
                        status: true,
                        size: {
                            select: {
                                size: true
                            }
                        }
                    }
                }
            }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

const getProductBySKU = async (req: Request, res: Response) => {
    try {
        const {sku} = req.params;
        const product = await prisma.product.findUnique({
            select: {
                product_id: true,
                name: true,
                description: true,
                sku: true,
                status: true,
                category: {
                    select: {
                        name: true
                    }
                },
                images: {
                    select: {
                        image_id: true,
                        image_url: true,
                        image_text: true,
                        type: true
                    }
                },
                inventory: {
                    select: {
                        quantity: true,
                        price: true,
                        status: true,
                        size: {
                            select: {
                                size: true
                            }
                        }
                    }
                }
            },
            where: {
                sku: sku
            }
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({error: 'Error al obtener el producto'});
    }
};

const getProductByID = async (req: Request, res: Response) => {
    // try {
    //     const {product_id} = req.params;
    //     const product = await prisma.product.findFirst({
    //         select: {
    //             product_id: true,
    //             name: true,
    //             description: true,
    //             sku: true,
    //             status: true,
    //             category: {
    //                 select: {
    //                     name: true
    //                 }
    //             },
    //             images: {
    //                 select: {
    //                     image_url: true,
    //                     image_text: true,
    //                     type: true
    //                 }
    //             },
    //             inventory: {
    //                 select: {
    //                     quantity: true,
    //                     price: true,
    //                     size: {
    //                         select: {
    //                             size: true
    //                         }
    //                     }
    //                 }
    //             }
    //         },
    //         where: {
    //             sku: product_id
    //         }
    //     });
    //     res.json(product);
    // } catch (error) {
    //     res.status(500).json({error: 'Error al obtener el producto'});
    // }
};

const createProduct = async (req: Request, res: Response) => {

    const {name, description, sku, category_id} = req.body;

    const product = await prisma.product.findUnique({
        where: {
            sku: sku
        }
    });
    if (product) {
        res.status(400).json({error: 'El SKU ya existe'});
        return;
    }

    try {
        await prisma.product.create({
            data: {
                name: name,
                description: description,
                sku: sku,
                category_id: category_id
            }
        });
        res.status(201).json({message: 'Producto creado'});
    } catch (error) {
        res.status(500).json({error: 'Error al crear el producto'});
    }
};

const updateProduct = async (req: Request, res: Response) => {

    const {sku} = req.params;
    const {name, description, category_id} = req.body;

    try {
        await prisma.product.update({
            where: {
                sku: sku
            },
            data: {
                name: name,
                description: description,
                category_id: category_id
            }
        });
        res.status(200).json({message: 'Producto actualizado'});
    } catch (error) {
        res.status(500).json({error: 'Error al actualizar el producto'});
    }
};

const updateCompleteProduct = async (req: Request, res: Response) => {
    const { sku } = req.params;
    const { productData, images, inventory, imagesToDelete, inventoryToDelete } = req.body;

    if (!sku) {
        return res.status(400).json({ error: 'Falta el SKU del producto' });
    }

    try {
        // Buscar el producto para verificar que existe
        const existingProduct = await prisma.product.findUnique({
            where: { sku },
            select: { product_id: true }
        });

        if (!existingProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const product_id = existingProduct.product_id;

        // Usar transacción para asegurar integridad
        const result = await prisma.$transaction(async (tx) => {
            // 1. Actualizar datos básicos del producto
            const updatedProduct = await tx.product.update({
                where: { sku },
                data: productData
            });

            // 2. Eliminar imágenes marcadas para borrar
            if (imagesToDelete && imagesToDelete.length > 0) {
                await tx.image.deleteMany({
                    where: { image_id: { in: imagesToDelete } }
                });
            }

            // 3. Procesar imágenes nuevas y actualizaciones
            if (images && images.length > 0) {
                for (const image of images) {
                    if (image.image_id) {
                        // Actualizar imagen existente
                        await tx.image.update({
                            where: { image_id: image.image_id },
                            data: {
                                image_url: image.image_url,
                                image_text: image.image_text,
                                type: image.type
                            }
                        });
                    } else {
                        // Crear nueva imagen
                        await tx.image.create({
                            data: {
                                ...image,
                                product_id
                            }
                        });
                    }
                }
            }

            // 4. Eliminar registros de inventario marcados para borrar
            if (inventoryToDelete && inventoryToDelete.length > 0) {
                await tx.inventory.deleteMany({
                    where: { inventory_id: { in: inventoryToDelete } }
                });
            }

            // 5. Procesar inventario nuevo y actualizaciones
            if (inventory && inventory.length > 0) {
                for (const item of inventory) {
                    if (item.inventory_id) {
                        // Actualizar inventario existente
                        await tx.inventory.update({
                            where: { inventory_id: item.inventory_id },
                            data: {
                                quantity: item.quantity,
                                price: item.price,
                                size_id: item.size_id,
                                status: item.status
                            }
                        });
                    } else {
                        // Crear nuevo inventario
                        await tx.inventory.create({
                            data: {
                                ...item,
                                product_id
                            }
                        });
                    }
                }
            }

            return updatedProduct;
        });

        res.status(200).json({
            message: 'Producto actualizado completamente',
            product: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el producto completo' });
    }
};

const deleteProduct = async (req: Request, res: Response) => {
    if (!req.params.sku) {
        return res.status(400).json({error: 'Falta el SKU del producto'});
    }

    try {
        const { sku } = req.params;

        // Primero buscar el producto para obtener su ID
        const product = await prisma.product.findUnique({
            where: { sku },
            select: { product_id: true }
        });

        if (!product) {
            return res.status(404).json({error: 'Producto no encontrado'});
        }

        // Eliminar imágenes relacionadas
        await prisma.image.deleteMany({
            where: { product_id: product.product_id }
        });

        // Eliminar inventario relacionado
        await prisma.inventory.deleteMany({
            where: { product_id: product.product_id }
        });

        // Finalmente eliminar el producto
        await prisma.product.delete({
            where: { sku }
        });

        res.status(200).json({message: 'Producto y sus dependencias eliminados correctamente'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error al eliminar el producto y sus dependencias'});
    }
};

const activateProduct = async (req: Request, res: Response) => {
    const {sku} = req.params;

    try {
        await prisma.product.update({
            where: {
                sku: sku
            },
            data: {
                status: 'activo'
            }
        });
        res.status(200).json({message: 'Producto activado'});
    } catch (error) {
        res.status(500).json({error: 'Error al activar el producto'});
    }
}

export {
    getProducts,
    getProductBySKU,
    getProductByID,
    createProduct,
    updateProduct,
    deleteProduct,
    activateProduct,
    updateCompleteProduct
};