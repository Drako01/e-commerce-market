import React, { useEffect, useState, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import './UserManage.css';
import { auth } from '../../Firebase/firebaseConfig';

const UserManage = () => {
    const urlServer = process.env.REACT_APP_URL_SERVER;
    const [authenticated, setAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        email: null,
        password: null,
        displayName: null,
        photoURL: null,
    });
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [formattedDateTime, setFormattedDateTime] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
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

        return () => unsubscribe();
    }, []);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${urlServer}/api/get-all-users`);
            const userList = await response.json();
            setUsers(userList);
        } catch (error) {
            console.error('Error al obtener datos:', error);
        } finally {
            setLoading(false);
        }
    }, [urlServer]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers, urlServer]);

    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
                <div className="loader2"></div>
            </div>
        );
    }

    const handleAddUser = async () => {
        const formData = new FormData();
        formData.append("email", newUser.email);
        formData.append("password", newUser.password);
        formData.append("displayName", newUser.displayName);
        formData.append("profileImage", newUser.photoURL, newUser.photoURL.name);

        // Verificar si la contraseña tiene al menos 6 caracteres
        if (newUser.password.length < 6) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La contraseña debe tener al menos 6 caracteres.',
            });
            return;
        }

        try {
            const response = await fetch(`${urlServer}/api/create-user`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }

            await response.text();
            fetchUsers();
            // Cerrar el modal después de agregar usuario
            setShowAddModal(false);
        } catch (error) {
            console.error('Error al agregar usuario:', error.message);
            // Puedes manejar otros errores aquí si es necesario
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al crear el usuario',
            });
        }
    };

    const handleProfileImageChange = (event) => {
        const file = event.target.files[0];
        setNewUser((prevUser) => ({
            ...prevUser,
            photoURL: file,
        }));
    };

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
    
        const addLeadingZero = (num) => (num < 10 ? `0${num}` : num);
        const day = addLeadingZero(date.getDate());
        const month = addLeadingZero(date.getMonth() + 1);
        const year = date.getFullYear();
        const hours = addLeadingZero(date.getHours());
        const minutes = addLeadingZero(date.getMinutes());
        const seconds = addLeadingZero(date.getSeconds());
    
        return `${day}/${month}/${year} | ${hours}:${minutes}:${seconds} hr`;
    };

    const handleViewDetails = (user) => {
        setSelectedUserDetails(user);
        const formattedDateTime = formatDateTime(user.lastSignInTime);
        setFormattedDateTime(formattedDateTime);
        setShowDetailsModal(true);
    };
    

    const handleDeleteUser = async (uid) => {
        try {
            const confirmDelete = await Swal.fire({
                title: '¿Estás seguro?',
                text: '¡No podrás revertir esto!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminarlo',
                cancelButtonText: 'Cancelar',
            });

            if (confirmDelete.isConfirmed) {
                const response = await fetch(`${urlServer}/api/users/${uid}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    const responseData = await response.json();
                    // Mostrar SweetAlert de éxito
                    Swal.fire({
                        icon: 'success',
                        title: responseData.message || 'Usuario eliminado correctamente',
                    });
                } else {
                    const errorData = await response.json();
                    throw new Error(`Error en la solicitud: ${errorData.error}`);
                }
            }
        } catch (error) {
            console.error('Error al eliminar usuario:', error.message);
            // Puedes manejar otros errores aquí si es necesario
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al eliminar el usuario',
            });
        } finally {
            // Asegurarse de que fetchUsers se ejecute después de eliminar, tanto si hay éxito como si hay un error
            fetchUsers();
        }
    };


    return (
        <>
            {currentUser && authenticated ? (
                <>
                    <section className="container mt-5">
                        <h1>Listado de Usuarios</h1>
                        {users && (
                            <>
                                {/* Botón para abrir el modal de agregar usuario */}
                                <Button variant="primary" onClick={() => setShowAddModal(true)} className='LinkProfile Agregarproducto'>
                                    <FontAwesomeIcon icon={faPlus} /> Agregar Usuario
                                </Button>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>Nombre</th>
                                            <th>Ultima Vez</th>
                                            <th>Eliminar</th>
                                            <th>Detalles</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => {
                                            const formattedDateTime = formatDateTime(user.lastSignInTime);
                                            return (
                                                <tr key={user.uid}>
                                                    <td>{user.email}</td>
                                                    <td>{user.displayName}</td>
                                                    <td>{formattedDateTime}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-danger"
                                                            onClick={() => handleDeleteUser(user.uid)}
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-info"
                                                            onClick={() => handleViewDetails(user)}
                                                        >
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>

                                </table>
                            </>
                        )}


                    </section>

                    {/* Modal para agregar usuarios */}
                    <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Agregar Usuario</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3" controlId="formEmailAdd">
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Ingrese el correo electrónico"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formPasswordAdd">
                                    <Form.Label>Password:</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Ingrese la contraseña"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formDisplayNameAdd">
                                    <Form.Label>Nombre:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese el nombre"
                                        value={newUser.displayName}
                                        onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formProfileImageAdd">
                                    <Form.Label>Imagen de Perfil:</Form.Label>
                                    <Form.Control
                                        type="file"
                                        label="Selecciona una imagen"
                                        name="profileImage"
                                        onChange={handleProfileImageChange}
                                        accept="image/*"
                                    />
                                </Form.Group>



                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                                Cerrar
                            </Button>
                            <Button variant="primary" onClick={handleAddUser}>
                                Agregar Usuario
                            </Button>
                        </Modal.Footer>
                    </Modal>

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
                                    <p><strong>Última Conexión:</strong> {formattedDateTime}</p>
                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </Modal>


                </>
            ) : (
                <div className='container inicio '>
                    <h1>No esta autorizado a ver esta Página.!!</h1>
                    <img src='https://static.vecteezy.com/system/resources/previews/009/381/293/non_2x/prohibition-sign-clipart-design-illustration-free-png.png' alt='Prohibido' className='Prohibido' />
                </div>
            )}


        </>
    );
};

export default UserManage;
