import { getAuth, createUserWithEmailAndPassword, updateProfile, deleteUser as deleteUserAuth } from 'firebase/auth';
import { firebaseApp } from '../controllers/firebase.controller.js';
import { getFirestore, collection } from 'firebase/firestore';

class UserModel {

    async createUser(userData) {
        const auth = getAuth(firebaseApp);

        try {
            if (!userData.email || !userData.password) {
                throw new Error('Email y contraseña son campos obligatorios.');
            }

            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            const user = userCredential.user;

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
            // Validate that a valid UID is provided
            if (!uid) {
                throw new Error('UID del usuario es obligatorio.');
            }

            const userRecord = await getUser(auth, uid);
            return {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
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
        try {
            // Verifica que el UID y los datos actualizados se proporcionen
            if (!uid || !updatedUserData) {
                throw new Error('UID del usuario y datos actualizados son obligatorios.');
            }
    
            const userRef = firestore.collection('users').doc(uid);
            await userRef.update(updatedUserData);
    
            return 'Usuario actualizado exitosamente';
        } catch (error) {
            throw new Error(`Error al actualizar el usuario: ${error.message}`);
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
