import loggers from '../config/logger.js'
import { getFirestore, collection, addDoc, getDocs, query, where } from '@firebase/firestore';
import { firebaseConexion } from '../controllers/firebase.controller.js';

const db = getFirestore(firebaseConexion);
const productCollection = collection(db, 'productos');

class ProductModel {
    // Método para agregar un nuevo producto
    async addProduct(productData) {
        try {
            const docRef = await addDoc(productCollection, productData);            
            return docRef.id;
        } catch (error) {
            loggers.error('Error al agregar el producto:', error);
            throw error;
        }
    }

    // Método para obtener todos los productos
    async getAllProducts() {
        try {
            const querySnapshot = await getDocs(productCollection);
            const products = [];
            querySnapshot.forEach((doc) => {
                products.push({ id: doc.id, ...doc.data() });
            });
            return products;
        } catch (error) {
            loggers.error('Error al obtener los productos:', error);
            throw error;
        }
    }

    // Método para obtener un producto por ID
    async getProductById(productId) {
        try {
            const productDoc = doc(productCollection, productId);
            const productSnapshot = await getDocs(productDoc);
            if (productSnapshot.exists()) {
                return { id: productSnapshot.id, ...productSnapshot.data() };
            } else {
                loggers.warn('Producto no encontrado');
                return null;
            }
        } catch (error) {
            loggers.error('Error al obtener el producto por ID:', error);
            throw error;
        }
    }

    // Método para actualizar un producto por ID
    async updateProduct(productId, updatedProductData) {
        try {
            const productDoc = doc(productCollection, productId);
            await updateDoc(productDoc, updatedProductData);
            loggers.info('Producto actualizado con éxito');
        } catch (error) {
            loggers.error('Error al actualizar el producto:', error);
            throw error;
        }
    }

    // Método para eliminar un producto por ID
    async deleteProduct(productId) {
        try {
            const productDoc = doc(productCollection, productId);
            await deleteDoc(productDoc);
            loggers.info('Producto eliminado con éxito');
        } catch (error) {
            loggers.error('Error al eliminar el producto:', error);
            throw error;
        }
    }

    // Método para obtener productos por algún criterio (ej. categoría)
    async getProductsByCategory(category) {
        try {
            const q = query(productCollection, where('categoria', '==', category));
            const querySnapshot = await getDocs(q);
            const products = [];
            querySnapshot.forEach((doc) => {
                products.push({ id: doc.id, ...doc.data() });
            });
            return products;
        } catch (error) {
            loggers.error('Error al obtener los productos por categoría:', error);
            throw error;
        }
    }

}

export default new ProductModel();
