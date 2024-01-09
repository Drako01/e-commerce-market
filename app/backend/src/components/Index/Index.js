import React from 'react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import logo from '../../logo.svg'
import './Index.css';

const Index = () => {
    const auth = getAuth();
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);


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


    const handleViewDetails = (user) => {
        setSelectedUserDetails(user);
        setShowDetailsModal(true);
    };


    return (
        <div className="App-index container inicio">
            {currentUser ? (
                <>
                    <h1>Bienvenido {currentUser.displayName}</h1>
                    <img src={currentUser.photoURL || currentUser.metadata.photoURL} alt={currentUser.displayName} className='avatar'/>
                    <NavLink onClick={() => handleViewDetails(currentUser)} className='LinkProfile'>Ver Perfil</NavLink>
                </>
            ) : (
                <>
                    <h1>Inicie sesión para ver contenido!</h1>
                    <img src={logo} alt='Armotusitio.com' className='logotipo'/>
                </>
            )}
            {/* Modal para ver detalles del usuario */}
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Detalles del Usuario</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedUserDetails && (
                                <>
                                    <div className='userPhotoDiv'>
                                        <img src={selectedUserDetails.photoURL} alt={selectedUserDetails.displayName} className='userPhoto' />
                                        <div className='line'></div>
                                    </div>
                                    <p><strong>Email:</strong> {selectedUserDetails.email}</p>
                                    <p><strong>Nombre:</strong> {selectedUserDetails.displayName}</p>
                                    <p><strong>ID:</strong> {selectedUserDetails.uid}</p>
                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </Modal>
        </div>
    );
};

export default Index;
