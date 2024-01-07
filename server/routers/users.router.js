import express from 'express';
import UserController from '../controllers/users.controller.js';

const router = express.Router();

// Otra configuración de enrutamiento

// Ruta para obtener todos los usuarios
router.get('/', UserController.getAllUsers);

export default router;
