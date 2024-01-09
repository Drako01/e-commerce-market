import './ProductsManage.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar el CSS de Bootstrap

const ProductsManage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Realizar la solicitud HTTP al servidor para obtener la lista de productos
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/products/getAll');
                setProducts(response.data);
            } catch (error) {
                console.error('Error al obtener la lista de productos:', error);
            }
        };

        fetchData();
    }, []); // La dependencia [] significa que useEffect se ejecutará solo una vez al montar el componente

    return (
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
    );
};

export default ProductsManage;
