import UserModel from '../models/users.model.js';
import loggers from '../config/logger.js';
import admin from 'firebase-admin';

class UserController {
    async createUser(req, res) {
        try {
            const { email, password, displayName } = req.body;

            if (!email || !password) {
                throw { status: 400, message: 'Email y contraseña son campos obligatorios.' };
            }

            const uid = await UserModel.createUser({ email, password, displayName }); 
            res.status(201).json({ uid });
        } catch (error) {
            loggers.error('Error al crear el usuario:', error.message);
            
            res.status(error.status || 500).json({ error: 'Error interno del servidor' });
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
            const userRecords = await admin.auth().listUsers();
            const userList = userRecords.users.map((user) => ({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                creationTime: user.metadata.creationTime,
                lastSignInTime: user.metadata.lastSignInTime,
                photoURL: user.photoURL,
            }));
    
            res.json(userList);
        } catch (error) {
            loggers.error('Error fetching users:', error);
    
            // Devuelve una respuesta JSON con el error en caso de un error
            res.status(500).json({ error: 'Error fetching users' });
        }
    }
}

export default new UserController();
