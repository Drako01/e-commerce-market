//cart.router.js
import { Router } from 'express';
import CartController from '../controllers/cart.controller.js';

const router = Router();


// Ruta para obtener el carrito de un usuario
router.get('/getCart/:userId', CartController.getCart);

// Ruta para agregar un producto al carrito
router.post('/addToCart/:userId/:productId/:quantity', CartController.addToCart);

// Ruta para quitar un producto del carrito
router.delete('/removeFromCart/:userId/:productId', CartController.removeFromCart);

// Ruta para cambiar la cantidad de un producto en el carrito
router.put('/updateCartItemQuantity/:userId/:productId/:quantity', CartController.updateCartItemQuantity);

// Ruta para crear un nuevo carrito para un usuario
router.post('/createCart/:userId', CartController.createCart);

export default router;
