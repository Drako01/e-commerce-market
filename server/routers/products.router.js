import express from 'express';
import ProductsController from '../controllers/products.controler.js';

const router = express.Router();

// Ruta para obtener todos los productos
router.get('/getAll', ProductsController.getAllProducts);

// Ruta para obtener un producto por ID
router.get('/getById/:id', ProductsController.getProductById);

// Ruta para agregar un nuevo producto
router.post('/add', ProductsController.addProduct);

// Ruta para actualizar un producto por ID
router.put('/update/:id', ProductsController.updateProduct);

// Ruta para eliminar un producto por ID
router.delete('/delete/:id', ProductsController.deleteProduct);

// Ruta para obtener productos por categoría
router.get('/getByCategory/:category', ProductsController.getProductsByCategory);

export default router;

