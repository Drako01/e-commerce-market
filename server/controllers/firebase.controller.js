import config from '../config/config.js';
import loggers from '../config/logger.js'
import 'core-js';
import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";

export const firebaseConfig = {
    apiKey: config.firebase.apiKey,
    authDomain: config.firebase.authDomain,
    projectId: config.firebase.projectId,
    storageBucket: config.firebase.storageBucket,
    messagingSenderId: config.firebase.messagingSenderId,
    appId: config.firebase.appId,
};


// Conexion y Manejo de errores en la inicialización de Firebase
let firebaseConexion;
try {
    firebaseConexion = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseConexion); 
    const auth = getAuth(firebaseConexion);     
} catch (error) {
    loggers.error('Error al inicializar Firebase:', error);
}

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseConexion); 
const db = getFirestore(firebaseConexion); 
// Exportar la conexión de Firebase
export { firebaseConexion, firebaseApp, auth, db};