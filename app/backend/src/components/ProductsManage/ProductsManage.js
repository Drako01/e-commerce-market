import './ProductsManage.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar el CSS de Bootstrap
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const ProductsManage = () => {
    const [products, setProducts] = useState([]);
    const auth = getAuth();
    const [authenticated, setAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

        return () => unsubscribe();
    }, [auth]);


    useEffect(() => {
        // Realizar la solicitud HTTP al servidor para obtener la lista de productos
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/products/getAll');
                setProducts(response.data);
            } catch (error) {
                console.error('Error al obtener la lista de productos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // La dependencia [] significa que useEffect se ejecutará solo una vez al montar el componente


    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
                <div className="loader2"></div>
            </div>
        );
    }

    return (
        <>
            {currentUser && authenticated ? (
                <>
                    <div className="container mt-5">
                        <h2>Lista de Productos</h2>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    {/* Generar las columnas de la tabla basadas en las claves del primer producto */}
                                    {products.length > 0 && Object.keys(products[0]).map((key) => (
                                        <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Generar filas y columnas de la tabla basadas en los productos */}
                                {products.map((product, index) => (
                                    <tr key={index}>
                                        {Object.values(product).map((value, index) => (
                                            <td key={index}>{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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

export default ProductsManage;
