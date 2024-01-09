import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../../logo.svg';
import Swal from 'sweetalert2';
import './Navbar.css';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
    const auth = getAuth();
    const [authenticated, setAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    // Escucha los cambios en la autenticación y actualiza el estado del usuario
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // El usuario está autenticado
                setCurrentUser(user);
                if (user.email === process.env.REACT_APP_MAIL_Admin) {
                    setAuthenticated(true);
                } else {
                    setAuthenticated(false);
                }
            } else {
                // El usuario no está autenticado
                setCurrentUser(null);
                setAuthenticated(false);
            }
        });

        // Asegúrate de desuscribirte cuando el componente se desmonte
        return () => unsubscribe();
    }, [auth]);

    const handleLogout = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Deseas cerrar sesión?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--first)",
            cancelButtonColor: "var(--brick)",
            confirmButtonText: "Sí, cerrar sesión",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                signOut(auth)
                    .then(() => {
                        Swal.fire({
                            title: "Cerrando sesión...",
                            icon: "info",
                            showConfirmButton: false,
                            timer: 1500,
                        });

                        localStorage.removeItem('user');
                        setCurrentUser(null);
                        navigate('/');
                    })
                    .catch((error) => {
                        Swal.fire('Error', error.message, 'error');
                    });
            }
        });
    };

    return (
        <section>
            <div className='menu'>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container">
                        {currentUser ? (
                            <img src={currentUser.photoURL} alt={currentUser.displayName} className='AdminPhoto'/>
                        ) : (
                            <img src={logo} alt='Logo' />
                        )}

                        <NavLink className="navbar-brand" to='/'>Inicio</NavLink>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">
                                {authenticated && (
                                    <>
                                        <li className="nav-item">
                                            <NavLink className="nav-link" to='/api'>Usuarios</NavLink>
                                        </li>

                                    </>
                                )}
                                {currentUser ? (
                                    <li className="nav-item">
                                        <NavLink className="nav-link" onClick={handleLogout}>Logout</NavLink>
                                    </li>
                                ) : (
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to='/login'>Login</NavLink>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </section>
    );
};

export default Navbar;
