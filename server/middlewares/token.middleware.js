import { getAuth, onAuthStateChanged, getIdToken } from 'firebase/auth';

const auth = getAuth();

const verifyTokenMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        // Verificar y decodificar el token usando la biblioteca de autenticación de Firebase
        const user = await new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                resolve(user);
                unsubscribe();
            });
        });

        if (!user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        // Ahora, utiliza getIdToken() directamente en el usuario autenticado
        const decodedToken = await getIdToken(user);

        if (!decodedToken) {
            return res.status(401).json({ error: 'Error al obtener el token' });
        }

        // Puedes acceder a la información del usuario desde decodedToken
        req.user = decodedToken;

        // Continuar con el siguiente middleware o controlador
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error.message);
        return res.status(401).json({ error: 'Token no válido', specificError: error.message });
    }
};

export default verifyTokenMiddleware;
