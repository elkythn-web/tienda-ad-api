import axios from "axios";
import { AxiosResponse } from "axios";

interface Product {
    id: string;
    sku: string;
}

async function obtenerProductos(sku: string): Promise<Product[]> {
    try {
        const response: AxiosResponse<Product[]> = await axios.get(
            `http://localhost:5000/api/products/${sku}`
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
        throw error;
    }
}

// Ejemplo de uso
const SKU = 'CLOT462';
obtenerProductos(SKU)
    .then(products => console.log(products))
    .catch(error => console.error(error));