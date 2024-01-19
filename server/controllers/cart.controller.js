// cart.controller.js
import CartModel from '../models/cart.model.js';

class CartController {
    async getCart(req, res) {
        try {
            const userId = req.params.userId;
            const cart = await CartModel.getCart(userId);
            res.status(200).json(cart);
        } catch (error) {
            console.error('Error al obtener el carrito desde el controlador:', error);
            res.status(500).json({ error: 'Error al obtener el carrito' });
        }
    }

    async addToCart(req, res) {
        try {
            const { userId } = req.params;
            const { productId, quantity } = req.body;
            const cart = await CartModel.addToCart(userId, productId, quantity);
            res.status(200).json(cart);
        } catch (error) {
            console.error('Error al agregar al carrito desde el controlador:', error);
            res.status(500).json({ error: 'Error al agregar al carrito' });
        }
    }
    

    

    async removeFromCart(req, res) {
        try {
            const { userId, productId } = req.params;
            const cart = await CartModel.removeFromCart(userId, productId);
            res.status(200).json(cart);
        } catch (error) {
            console.error('Error al quitar del carrito desde el controlador:', error);
            res.status(500).json({ error: 'Error al quitar del carrito' });
        }
    }

    async updateCartItemQuantity(req, res) {
        try {
            const { userId, productId } = req.params;
            const { quantity } = req.body;
            const cart = await CartModel.updateCartItemQuantity(userId, productId, quantity);
            res.status(200).json(cart);
        } catch (error) {
            console.error('Error al cambiar la cantidad del producto en el carrito desde el controlador:', error);
            res.status(500).json({ error: 'Error al cambiar la cantidad del producto en el carrito' });
        }
    }

    async createCart(req, res) {
        try {
            const { userId } = req.params;
            const cart = await CartModel.createCart(userId);
            res.status(201).json(cart);
        } catch (error) {
            console.error('Error al crear el carrito desde el controlador:', error);
            res.status(500).json({ error: 'Error al crear el carrito' });
        }
    }
}

export default new CartController();
