import React, { useEffect, useState, useCallback } from 'react';
import './UserManage.css';

const UserManage = () => {
    const urlServer = process.env.REACT_APP_URL_SERVER || 'http://localhost:8080';

    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleAddUser = async () => {
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
            // Actualizar la lista de usuarios después de agregar uno nuevo
            fetchUsers();
        } catch (error) {
            console.error('Error al agregar usuario:', error.message);
        }
    };
    
    

    return (
        <>
            <section>
                <h1>Listado de Usuarios</h1>
                {users && (
                    <ul>
                        {users.map((user) => (
                            <li key={user.uid}>
                                {user.email} - {user.displayName} - {user.uid}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
            <section>
                <h1>Agregar un Usuario</h1>
                <form>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleInputChange}
                    />
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={newUser.password}
                        onChange={handleInputChange}
                    />
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="displayName"
                        value={newUser.displayName}
                        onChange={handleInputChange}
                    />
                    <button type="button" onClick={handleAddUser}>
                        Agregar Usuario
                    </button>
                </form>

            </section>
        </>
    );
};

export default UserManage;
