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

    // async updateUser(uid, updatedUserData) {
    //     const auth = getAuth(firebaseApp);
    //     const userAdmin = config.google.admin;
    //     console.log(uid, auth, userAdmin, updatedUserData)
    //     // try {
    //     //     // Validate that a valid UID is provided
    //     //     if (!uid) {
    //     //         throw new Error('UID del usuario es obligatorio.');
    //     //     }
    
    //     //     // Obtén el usuario actual de manera síncrona
    //     //     const currentUser = auth.currentUser;
            
    //     //     if (!currentUser) {
    //     //         throw new Error('Usuario no autenticado.');
    //     //     }
    //     //     if (currentUser.email === userAdmin) {
    //     //         await updateProfile(currentUser, {                
    //     //             displayName: updatedUserData.displayName,
    //     //             photoURL: updatedUserData.photoURL,
    //     //         });
    //     //     } else {

    //     //         throw new Error('No tienes permisos para realizar esta acción.');
    //     //     }
    //     //     // Actualiza el perfil del usuario (opcional)
            
    
    //     //     return 'Usuario actualizado exitosamente';
    //     // } catch (error) {
    //     //     throw new Error(`Error al actualizar el usuario: ${error.message}`);
    //     // }
    // }
    async updateUser(uid, updatedUserData) {
        const auth = getAuth(firebaseApp);
    
        try {
            // Espera hasta que el usuario esté autenticado
            await new Promise((resolve, reject) => {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    unsubscribe();
                    if (user) {
                        resolve();
                    } else {
                        reject(new Error('Usuario no autenticado.'));
                    }
                });
            });
    
            // Obtén el usuario actual
            const currentUser = auth.currentUser;
    
            if (!currentUser) {
                console.error('Error: currentUser es null después de la espera.');
                throw new Error('Usuario no autenticado.');
            }
    
            console.log('Usuario actual:', currentUser);
    
            // Actualiza el perfil del usuario
            await updateProfile(currentUser, {
                displayName: updatedUserData.displayName,
                photoURL: updatedUserData.photoURL,
            });
    
            console.log('Usuario actualizado exitosamente');
    
            return 'Usuario actualizado exitosamente';
        } catch (error) {
            console.error('Error al actualizar el usuario:', error.message);
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
