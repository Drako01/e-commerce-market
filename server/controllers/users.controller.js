import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import UserModel from '../models/users.model.js';
import loggers from '../config/logger.js';
import admin from 'firebase-admin';

class UserController {

    async createUser(req, res) {
        try {
            const { email, password, displayName, phoneNumber } = req.body;

            if (!email || !password) {
                throw { status: 400, message: 'Email y contraseña son campos obligatorios.' };
            }

            let photoURL;
            function convertToSlug(text) {
                return text
                    .toLowerCase() 
                    .replace(/[\s_]+/g, '_') 
                    .replace(/[^\w-]+/g, ''); 
            }
            
            const slug = convertToSlug(displayName);
            
            
            // Verifica si hay un archivo en la carga
            if (req.file) {
                const profileImage = req.file;

                // Guarda la imagen en Firebase Storage y obtén la URL de descarga
                const storage = getStorage();
                const storageRef = ref(storage, `profileImages/${slug}/${profileImage.originalname}`);                
                await uploadBytes(storageRef, profileImage.buffer);


                // Obtiene la URL de descarga de la imagen
                photoURL = await getDownloadURL(storageRef);
            }


            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Actualiza el perfil del usuario con la URL de la imagen
            await updateProfile(user, {
                displayName: displayName,
                photoURL: photoURL,
                phoneNumber: phoneNumber,
            });

            const uid = user.uid;

            if (uid === undefined) {
                res.status(500).json({ error: 'El UID es undefined' });
            } else {
                res.status(201).json({ uid });
            }
            
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
                phoneNumber: user.phoneNumber,
            }));

            res.json(userList);
        } catch (error) {
            loggers.error('Error fetching users:', error);

            // Devuelve una respuesta JSON con el error en caso de un error
            res.status(500).json({ error: 'Error fetching users' });
        }
    }

    async updateUser(req, res) {
        try {
            if (req.user && req.user.getIdToken) {
                const uid = req.params.uid;
                const updatedUserData = req.body;
    
                await UserModel.updateUser(uid, updatedUserData);
                res.status(200).json({ message: 'Usuario actualizado exitosamente' });
            } else {
                // Manejar el caso cuando req.user es null o req.user.getIdToken no es una función
                res.status(401).json({ error: 'Usuario no autenticado' });
            }
        } catch (error) {
            console.error('Error al actualizar el usuario desde controller:', error);
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
