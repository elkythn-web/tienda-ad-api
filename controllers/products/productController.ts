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

const deleteProduct = async (req: Request, res: Response) => {

    if (!req.params.sku) {
        res.status(400).json({error: 'Falta el SKU del producto'});
        return;
    }

    try {
        const {sku} = req.params;
        await prisma.product.delete({
            where: {
                sku: sku
            }
        });
        res.status(200).json({message: 'Producto eliminado'});
    } catch (error) {
        res.status(500).json({error: 'Error al eliminar el producto'});
    }
};

export {
    getProducts,
    getProductBySKU,
    getProductByID,
    createProduct,
    updateProduct,
    deleteProduct
};