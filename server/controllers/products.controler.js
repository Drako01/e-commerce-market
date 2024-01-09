import ProductModel from '../models/product.model.js';
import loggers from '../config/logger.js';

class ProductsController {
    // Agregar un nuevo producto


    async addProduct(req, res) {
        try {
            const productData = req.body;
            const productId = await ProductModel.addProduct(productData, res); // Pasar res como parámetro
            const imageUrl = generateImageUrl(productData);
            res.status(201).json({ message: 'Producto agregado con éxito', productId });
        } catch (error) {
            res.status(500).json({ error: 'Error al agregar el producto' });
        }
    }

    // Obtener todos los productos
    async getAllProducts(req, res) {
        try {
            const products = await ProductModel.getAllProducts();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los productos' });
        }
    }

    // Obtener un producto por ID
    async getProductById(req, res) {
        try {
            const productId = req.params.id;
            const product = await ProductModel.getProductById(productId);

            if (product) {
                res.status(200).json(product);
            } else {
                res.status(404).json({ message: 'Producto no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el producto por ID' });
        }
    }

    // Actualizar un producto por ID
    async updateProduct(req, res) {
        try {
            const productId = req.params.id;
            const updatedProductData = req.body;
            await ProductModel.updateProduct(productId, updatedProductData);
            res.status(200).json({ message: 'Producto actualizado con éxito' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el producto' });
        }
    }

    // Eliminar un producto por ID
    async deleteProduct(req, res) {
        const uid = req.params.uid;
        try {
            await ProductModel.deleteProduct(uid);
            res.status(200).json({ message: 'Producto eliminado con éxito' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    }

    // Obtener productos por categoría
    async getProductsByCategory(req, res) {
        try {
            const category = req.params.category;
            const products = await ProductModel.getProductsByCategory(category);
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los productos por categoría' });
        }
    }
}

export default new ProductsController();

export function generateImageUrl(productData) {
    const imageUrl = `Products/${productData.categoria}/${productData.subcategoria}/${productData.marca}/${productData.foto.name}`;
    return imageUrl;
}





