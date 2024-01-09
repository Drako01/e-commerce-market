import React from 'react';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import logo from '../../logo.svg'
import './Index.css';

const Index = () => {
    const urlServer = process.env.REACT_APP_URL_SERVER;
    const auth = getAuth();
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);    
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState({
        uid: null,
        email: null,
        displayName: null,
        photoURL: null,
    });

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

    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowEditModal(true);
        setShowDetailsModal(false);
    };

    //Cambiar por la que esta en Signup
    const handleSaveChanges = async () => {
        try {
            const updatedUserData = {
                displayName: editingUser.displayName,
                photoURL: editingUser.photoURL, 
            };

            const response = await fetch(`${urlServer}/users/${editingUser.uid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUserData),
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }

            setShowEditModal(false);            
        } catch (error) {
            console.error('Error al guardar cambios:', error.message);
            // Puedes manejar otros errores aquí si es necesario
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al guardar los cambios del usuario',
            });
        }
    };

    return (
        <div className="App-index container inicio">
            {currentUser ? (
                <>
                    <h1>Bienvenido {currentUser.displayName}</h1>
                    <img src={currentUser.photoURL || currentUser.metadata.photoURL} alt={currentUser.displayName} className='avatar' />
                    <Button variant="primary" onClick={() => handleViewDetails(currentUser)} className='LinkProfile'>Ver Perfil</Button>
                </>
            ) : (
                <>
                    <h1>Inicie sesión para ver contenido!</h1>
                    <img src={logo} alt='Armotusitio.com' className='logotipo' />
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
                    <Button variant="primary" onClick={() => handleEditUser(currentUser)} className='LinkProfile'>
                        Editar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para editar usuarios */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formEmailEdit">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese el correo electrónico"
                                value={editingUser.email}
                                readOnly // Cambiado a readOnly en lugar de disabled
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDisplayNameEdit">
                            <Form.Label>Nombre:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese el nombre"
                                value={editingUser.displayName}
                                onChange={(e) => setEditingUser({ ...editingUser, displayName: e.target.value })}
                            />
                        </Form.Group>
                        
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges} className='LinkProfile'>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Index;
