import { getAuth, createUserWithEmailAndPassword, updateProfile, deleteUser, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp } from '../controllers/firebase.controller.js';
import { getFirestore, collection, getDocs } from 'firebase/firestore';


class UserModel {

    async createUser(userData) {
        const auth = getAuth(firebaseApp);

        try {
            if (!userData.email || !userData.password) {
                throw new Error('Email y contraseña son campos obligatorios.');
            }

            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            const user = userCredential.user;

            if (userData.displayName || userData.photoURL) {
                await updateProfile(user, { displayName: userData.displayName, photoURL: userData.photoURL });
            }

            return user.uid;
        } catch (error) {
            throw new Error(`Error al crear el usuario: ${error.message}`);
        }
    }

    async getUser(uid) {
        const auth = getAuth(firebaseApp);

        try {
            // Validate that a valid UID is provided
            if (!uid) {
                throw new Error('UID del usuario es obligatorio.');
            }

            const userRecord = await getUser(auth, uid);
            return {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                providerData: userRecord.providerData,
                photoURL: userRecord.photoURL,
            };
        } catch (error) {
            throw new Error(`Error al obtener el usuario: ${error.message}`);
        }
    }

    async getAllUsers() {
        const db = getFirestore(firebaseApp);
        const usersCollection = collection(db, 'users');

        try {
            const querySnapshot = await getDocs(usersCollection);
            const users = [];
            querySnapshot.forEach(doc => {
                users.push({ id: doc.id, ...doc.data() });
            });
            return users;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(uid, updatedUserData) {
        const auth = getAuth(firebaseApp);


        try {
            // Validate that a valid UID is provided
            if (!uid) {
                throw new Error('UID del usuario es obligatorio.');
            }

            // Obtén el usuario actual de manera síncrona
            const currentUser = auth.currentUser;           

            // Continuar con la actualización del perfil
            await updateProfile(currentUser, {
                displayName: updatedUserData.displayName,
                photoURL: updatedUserData.photoURL,
            });


            return 'Usuario actualizado exitosamente';
        } catch (error) {
            if (error.message === 'Usuario no autenticado.') {
                // Manejar el error de usuario no autenticado en el cliente
                console.error('Usuario no autenticado:', error.message);
                // Mostrar un mensaje de error al usuario si es necesario
            } else {
                console.error('Error al guardar cambios:', error.message);
                // Otros manejos de errores
            }
        }
        
    }


    async deleteUser(uid) {
        const auth = getAuth(firebaseApp);

        try {
            // Eliminar el usuario de la autenticación usando getAuth().deleteUser
            await deleteUser(auth, uid);

            return `Usuario ${uid} eliminado exitosamente`;
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                // El usuario no existe
                return `Usuario con UID ${uid} no encontrado`;
            } else {
                throw new Error(`Error al eliminar el usuario: ${error.message}`);
            }
        }
    }

}

export default new UserModel();
