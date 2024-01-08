import UserModel from '../models/users.model.js';
import loggers from '../config/logger.js';
import admin from 'firebase-admin';

class UserController {
    async createUser(req, res) {
        try {
            const { email, password, displayName, photoURL } = req.body;

            if (!email || !password) {
                throw { status: 400, message: 'Email y contraseña son campos obligatorios.' };
            }

            const uid = await UserModel.createUser({ email, password, displayName, photoURL });
            res.status(201).json({ uid });
        } catch (error) {
            loggers.error('Error al crear el usuario:', error.message);

            res.status(error.status || 500).json({ error: 'Error interno del servidor' });
        }
    }

    async getUser(req, res) {
        try {
            const uid = req.params.uid;
            const user = await UserModel.getUser(uid);
            res.json(user);
        } catch (error) {
            loggers.error('Error al obtener el usuario:', error.message);
            res.status(error.status || 500).json({ error: 'Error interno del servidor' });
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

    async updateUser(req, res) {
        const uid = req.params.uid;
        const updatedUserData = req.body;

        try {
            await UserModel.updateUser(uid, updatedUserData);
            res.status(200).json({ message: 'Usuario actualizado exitosamente' });
        } catch (error) {
            loggers.error('Error al actualizar el usuario:', error);
            res.status(error.status || 500).json({ error: 'Error interno del servidor' });
        }
    }

    async deleteUser(req, res) {
        const uid = req.params.uid;
    
        try {
            await admin.auth().deleteUser(uid);
            res.status(200).json({ message: 'Usuario eliminado exitosamente' });
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
    
            // Devuelve un mensaje JSON con el error en caso de un error
            res.status(500).json({ error: 'Error al eliminar el usuario' });
        }
    }   
    
}

export default new UserController();
