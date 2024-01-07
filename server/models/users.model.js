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
    

    async updateUser(uid, updatedUserData) {
        const auth = getAuth(firebaseApp);
    
        try {
            // Validate that a valid UID is provided
            if (!uid) {
                throw new Error('UID del usuario es obligatorio.');
            }
    
            // Fetch the user details using the Admin SDK
            const userRecord = await getUser(auth, uid);
    
            // Update user profile (optional)
            if (updatedUserData.displayName) {
                await updateProfile(userRecord, { displayName: updatedUserData.displayName });
            }
    
            // You can add logic to update other user properties if necessary
            // ...
    
            return 'Usuario actualizado exitosamente';
        } catch (error) {
            throw new Error(`Error al actualizar el usuario: ${error.message}`);
        }
    }
    

    async deleteUser(uid) {
        const adminAuth = getAdminAuth();

        try {
            if (!uid) {
                throw new Error('UID del usuario es obligatorio.');
            }

            // Eliminar el usuario de la autenticación
            await deleteAdminUser(adminAuth, uid);

            return `Usuario ${uid} eliminado exitosamente`;
        } catch (error) {
            throw new Error(`Error al eliminar el usuario: ${error.message}`);
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
    
}

export default new UserModel();
