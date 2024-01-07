import { getAuth, createUserWithEmailAndPassword, deleteUser, updateProfile } from 'firebase/auth';
import { firebaseApp } from '../controllers/firebase.controller.js';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

class UserModel {
    async createUser(userData) {
        const auth = getAuth(firebaseApp);

        try {
            // Validar que se proporcionen los datos necesarios
            if (!userData.email || !userData.password) {
                throw new Error('Email y contraseña son campos obligatorios.');
            }

            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            const user = userCredential.user;

            // Actualizar perfil del usuario (opcional)
            if (userData.displayName) {
                await updateProfile(user, { displayName: userData.displayName });
            }

            return user.uid;
        } catch (error) {
            throw new Error(`Error al crear el usuario: ${error.message}`);
        }
    }

    async getUser(uid) {
        const auth = getAuth(firebaseApp);

        try {
            // Validar que se proporcione un UID válido
            if (!uid) {
                throw new Error('UID del usuario es obligatorio.');
            }

            const user = await getUser(auth, uid);
            return user;
        } catch (error) {
            throw new Error(`Error al obtener el usuario: ${error.message}`);
        }
    }

    async updateUser(uid, updatedUserData) {
        const auth = getAuth(firebaseApp);

        try {
            // Validar que se proporcione un UID válido
            if (!uid) {
                throw new Error('UID del usuario es obligatorio.');
            }

            // Actualizar perfil del usuario (opcional)
            if (updatedUserData.displayName) {
                await updateProfile(auth.currentUser, { displayName: updatedUserData.displayName });
            }

            // Puedes agregar lógica para actualizar otras propiedades del usuario si es necesario
            // ...

            return 'Usuario actualizado exitosamente';
        } catch (error) {
            throw new Error(`Error al actualizar el usuario: ${error.message}`);
        }
    }

    async deleteUser(uid) {
        const auth = getAuth(firebaseApp);

        try {
            // Validar que se proporcione un UID válido
            if (!uid) {
                throw new Error('UID del usuario es obligatorio.');
            }

            await deleteUser(auth.currentUser);
            return 'Usuario eliminado exitosamente';
        } catch (error) {
            throw new Error(`Error al eliminar el usuario: ${error.message}`);
        }
    }

    async getAllUsers() {
        const db = getFirestore(firebaseApp);
        const usersCollection = collection(db, 'users');
        const auth = getAuth(firebaseApp);

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
}

export default new UserModel();
