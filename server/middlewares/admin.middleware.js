import { getAuth, onAuthStateChanged } from 'firebase/auth';
import config from '../config/config.js';

const admin = config.google.email; 
const adminMiddleware = (req, res, next) => {
    const auth = getAuth();

    // Verificar la autenticación del usuario
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // Usuario autenticado
            if (user.email === admin) {
                // Usuario tiene el email permitido
                next();
            } else {
                // Usuario no tiene el email permitido
                res.status(403).json({ error: 'Acceso no autorizado' });
            }
        } else {
            // Usuario no autenticado
            res.status(401).json({ error: 'Usuario no autenticado' });
        }
    });

    // Asegurar que nos hemos suscrito una sola vez
    unsubscribe();
};

export default adminMiddleware;
