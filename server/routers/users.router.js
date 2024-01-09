import express from 'express';
import { multerUpload } from '../middlewares/multer.middleware.js';
import UserController from '../controllers/users.controller.js';

const router = express.Router();

// Ruta para obtener todos los usuarios
router.get('/', UserController.getAllUsers);
// Ruta para crear un Usuario nuevo
router.post('/', multerUpload.single('profileImage'), UserController.createUser);
// Ruta para actualizar un usuario
router.put('/:uid', UserController.updateUser);
// Ruta para eliminar un usuario
router.delete('/:uid', UserController.deleteUser);

export default router;
