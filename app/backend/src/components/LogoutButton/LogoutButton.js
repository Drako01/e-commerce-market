import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.js';

const LogoutButton = () => {
    const { signOut } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await signOut();
            // Lógica adicional después del logout si es necesario
        } catch (error) {
            console.error('Error al cerrar sesión:', error.message);
        }
    };

    return (
        <button onClick={handleLogout}>Cerrar Sesión</button>
    );
};

export default LogoutButton;
