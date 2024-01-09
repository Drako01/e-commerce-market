import ProductModel from '../models/product.model.js';
import loggers from '../config/logger.js';
import { doc, collection, getDoc, updateDoc, deleteDoc } from '@firebase/firestore';


import { db } from '../controllers/firebase.controller.js';
const productCollection = collection(db, 'productos');

class ProductsController {

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
            const productDoc = doc(productCollection, productId);
            const productSnapshot = await getDoc(productDoc);

            if (productSnapshot.exists()) {
                const product = { id: productSnapshot.id, ...productSnapshot.data() };
                res.status(200).json(product);
            } else {
                res.status(404).json({ message: 'Producto no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el producto por ID' });
        }
    }

    // Actualizar un producto por ID
    async updateProductById(req, res) {
        try {
            const productId = req.params.id;
            const updatedProductData = req.body;            
            await ProductModel.updateProductById(productId, updatedProductData);
            res.status(200).json({ message: 'Producto actualizado con éxito' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el producto' });
        }
    }
    

    // Método para eliminar un producto por ID
    async deleteProduct(req, res) {
        const { id } = req.params;

        try {
            const productRef = doc(productCollection, id);  // Use doc function with the productCollection
            const deletedProduct = await getDoc(productRef);

            if (!deletedProduct.exists()) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            await deleteDoc(productRef);

            return res.json({ message: 'Producto eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar producto desde el controlador:', error.message);
            return res.status(500).json({ error: 'Error interno del servidor' });
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
    if (productData && productData.foto) {
        // Extraer el nombre de la foto de la URL
        const photoUrlParts = productData.foto.split('/');
        const photoName = photoUrlParts[photoUrlParts.length - 1];

        const imageUrl = `${photoName}`;
        return imageUrl;
    } else {
        loggers.error('Error: productData o productData.foto no están definidos');
        return 'URL_por_defecto_o_manejo_de_error';
    }
}





