import React, { useEffect, useState } from 'react';
import './UserManage.css';

const UserManage = () => {
    const [users, setUsers] = useState([]);
    const urlServer = process.env.REACT_APP_URL_SERVER;

    useEffect(() => {
        const fetchUsers = async () => {
			try {
				const response = await fetch(`${urlServer}`);
				const userList = await response.json();
				setUsers(userList);
			} catch (error) {
                console.error('Error al obtener datos:', error.message);
            }
        };

        fetchUsers();
    }, [urlServer]);

    

    return (
        <>
            <section>
                <h1>Listado de Usuarios</h1>
            </section>
            {users && (
                <ul>
                    {users.map(user => (
                        <li key={user.uid}>{user.email} - {user.displayName}</li>
                    ))}
                </ul>
            )}
        </>
    );
};


export default UserManage;
