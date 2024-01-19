// cart.model.js
import { getFirestore, collection, doc, getDoc, setDoc } from '@firebase/firestore';
import { firebaseConexion } from '../controllers/firebase.controller.js';

const db = getFirestore(firebaseConexion);
const cartCollection = collection(db, 'cart');

class CartModel {
    async getCart(userId) {
        try {
            const cartDoc = doc(cartCollection, userId);
            const cartSnapshot = await getDoc(cartDoc);
            return cartSnapshot.exists() ? cartSnapshot.data() : null;
        } catch (error) {
            console.error('Error al obtener el carrito desde el modelo:', error);
            throw error;
        }
    }

    async addToCart(userId, productId, quantity) {
        try {
            const cartDoc = doc(cartCollection, userId);
            const cartSnapshot = await getDoc(cartDoc);
            const cart = cartSnapshot.exists() ? cartSnapshot.data() : { items: [] };
    
            const existingItem = cart.items.find((item) => item.product.id === productId);
    
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                // Aquí asumo que productId es el documento de tu producto en Firestore
                const productDoc = doc(productsCollection, productId);
                const productSnapshot = await getDoc(productDoc);
    
                if (!productSnapshot.exists()) {
                    throw new Error('Product not found');
                }
    
                const product = { ...productSnapshot.data(), id: productId };
                cart.items.push({ userId, product, quantity });
            }
    
            await setDoc(cartDoc, cart);
            return cart;
        } catch (error) {
            console.error('Error al agregar al carrito desde el modelo:', error);
            throw error;
        }
    }
    

    async removeFromCart(userId, productId) {
        try {
            // Implementa la lógica para quitar un producto del carrito
            // ...
        } catch (error) {
            console.error('Error al quitar del carrito desde el modelo:', error);
            throw error;
        }
    }

    async updateCartItemQuantity(userId, productId, quantity) {
        try {
            const cartDoc = doc(cartCollection, userId);
            const cartSnapshot = await getDoc(cartDoc);
            const cart = cartSnapshot.exists() ? cartSnapshot.data() : { items: [] };

            const existingItemIndex = cart.items.findIndex(item => item.product === productId);

            if (existingItemIndex !== -1) {
                cart.items[existingItemIndex].quantity = quantity;
                await updateDoc(cartDoc, { items: cart.items });
            }

            return cart;
        } catch (error) {
            console.error('Error al cambiar la cantidad del producto en el carrito desde el modelo:', error);
            throw error;
        }
    }

    async createCart(userId) {
        try {
            const userCartRef = doc(cartCollection, userId);
            const cartSnapshot = await getDoc(userCartRef);

            if (!cartSnapshot.exists()) {
                // El carrito no existe, crear uno nuevo
                const newCart = { user: userId, items: [] };
                await setDoc(userCartRef, newCart);
                return newCart;
            }

            // El carrito ya existe
            const existingCart = cartSnapshot.data();
            return existingCart;
        } catch (error) {
            console.error('Error al crear el carrito desde el modelo:', error);
            throw error;
        }
    }
}

export default new CartModel();
