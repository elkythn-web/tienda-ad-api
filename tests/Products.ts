import axios from "axios";

const sku = 'CLOT462'

async function ObtenerProductos() {
    const products = await axios.get(`http://localhost:5000/api/products/${sku}`);
    console.log(products.data);
}

ObtenerProductos();