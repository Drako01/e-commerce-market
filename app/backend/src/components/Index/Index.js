import React from 'react';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import logo from '../../logo.svg'
import './Index.css';

const Index = () => {
    const auth = getAuth();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // El usuario está autenticado
                setCurrentUser(user);
            } else {
                // El usuario no está autenticado
                setCurrentUser(null);
            }
        });

        // Asegúrate de desuscribirte cuando el componente se desmonte
        return () => unsubscribe();
    }, [auth]);

    return (
        <div className="App-index container inicio">
            {currentUser ? (
                <>
                    <h1>Bienvenido {currentUser.displayName}</h1>
                    <img src={currentUser.photoURL || currentUser.metadata.photoURL} alt={currentUser.displayName} className='avatar' />
                </>
            ) : (
                <>
                    <h1>Inicie sesión para ver contenido!</h1>
                    <img src={logo} alt='Armotusitio.com' className='logotipo' />
                </>
            )}
        </div>
    );
};

export default Index;
