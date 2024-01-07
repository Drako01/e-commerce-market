import React, { useEffect, useState, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './UserManage.css';

const UserManage = () => {
    const urlServer = process.env.REACT_APP_URL_SERVER;

    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        displayName: '',
    });

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState({
        uid: '',
        email: '',
        displayName: '',
    });

    const fetchUsers = useCallback(async () => {
        try {
            const response = await fetch(`${urlServer}/get-all-users`);
            const userList = await response.json();
            setUsers(userList);
        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
    }, [urlServer]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers, urlServer]);

    const handleAddUser = async () => {
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
            const response = await fetch(`${urlServer}/create-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
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
    

    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowEditModal(true);
    };

    const handleSaveChanges = async () => {
        try {
            const updatedUserData = {
                displayName: editingUser.displayName,
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
            fetchUsers();
        } catch (error) {
            console.error('Error al guardar cambios:', error.message);
        }
    };

    const handleDeleteUser = async (uid) => {
        try {
            const response = await fetch(`${urlServer}/users/${uid}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }

            await response.json();
            fetchUsers();
        } catch (error) {
            console.error('Error al eliminar usuario:', error.message);
        }
    };

    return (
        <>
            <section className="container mt-5">
                <h1>Listado de Usuarios</h1>
                {users && (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Nombre</th>
                                <th>ID</th>
                                <th>Editar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.uid}>
                                    <td>{user.email}</td>
                                    <td>{user.displayName}</td>
                                    <td>{user.uid}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => handleEditUser(user)}
                                        >
                                            Editar
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDeleteUser(user.uid)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Botón para abrir el modal de agregar usuario */}
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                    Agregar Usuario
                </Button>
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
                                onChange={(e) => setNewUser({ ...editingUser, displayName: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
};

export default UserManage;
