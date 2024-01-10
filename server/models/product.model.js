import { products } from './products.js';

class ProductModel {
    async addProduct(productData) {
        try {
            const imageUrl = generateImageUrl(productData); // Ajusta según tu lógica
            const newProduct = { ...productData, imageUrl, uid: products.length + 1 };
            products.push(newProduct);
            return newProduct.uid;
        } catch (error) {
            loggers.error('Error al agregar el producto:', error);
            throw error;
        }
    }

    async getAllProducts() {
        try {
            return products;
        } catch (error) {
            loggers.error('Error al obtener los productos:', error);
            throw error;
        }
    }

    async getProductById(productId) {
        try {
            const product = products.find((p) => p.uid === productId);
            return product || null;
        } catch (error) {
            loggers.error('Error al obtener el producto por ID:', error);
            throw error;
        }
    }

    async updateProductById(productId, updatedProductData) {
        try {
            const index = products.findIndex((p) => p.uid === productId);
            if (index !== -1) {
                products[index] = { ...products[index], ...updatedProductData };
            } else {
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            loggers.error('Error al actualizar el producto:', error);
            throw error;
        }
    }

    async deleteProduct(productId) {
        try {
            const index = products.findIndex((p) => p.uid === productId);
            if (index !== -1) {
                products.splice(index, 1);
                loggers.info('Producto eliminado con éxito');
            } else {
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            loggers.error('Error al eliminar el producto desde Model:', error);
            throw error;
        }
    }

    async getProductsByCategory(category) {
        try {
            const filteredProducts = products.filter((p) => p.categoria === category);
            return filteredProducts;
        } catch (error) {
            loggers.error('Error al obtener los productos por categoría:', error);
            throw error;
        }
    }
}

export default new ProductModel();
