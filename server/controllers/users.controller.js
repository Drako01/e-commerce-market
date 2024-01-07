import UserModel from '../models/users.model.js';
import loggers from '../config/logger.js';

class UserController {
    async createUser(userData) {
        try {
            const uid = await UserModel.createUser(userData);
            loggers.info(`Usuario creado exitosamente con UID: ${uid}`);
            return uid;
        } catch (error) {
            loggers.error('Error al crear el usuario:', error.message);
            throw error;
        }
    }

    async getUser(uid) {
        try {
            const user = await UserModel.getUser(uid);
            loggers.info('Usuario obtenido exitosamente:', user);
            return user;
        } catch (error) {
            loggers.error('Error al obtener el usuario:', error.message);
            throw error;
        }
    }

    async updateUser(uid, updatedUserData) {
        try {
            await UserModel.updateUser(uid, updatedUserData);
            loggers.info('Usuario actualizado exitosamente');
        } catch (error) {
            loggers.error('Error al actualizar el usuario:', error.message);
            throw error;
        }
    }

    async deleteUser(uid) {
        try {
            await UserModel.deleteUser(uid);
            loggers.info('Usuario eliminado exitosamente');
        } catch (error) {
            loggers.error('Error al eliminar el usuario:', error.message);
            throw error;
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await UserModel.getAllUsers();
            res.json(users);
        } catch (error) {
            loggers.error('Error al obtener todos los usuarios:', error);
            res.status(500).json({ error: 'Error al obtener usuarios' });
        }
    }
}

export default new UserController();
