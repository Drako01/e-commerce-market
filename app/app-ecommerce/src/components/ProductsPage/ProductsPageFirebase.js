import React, { useState, useEffect, useCallback } from 'react';
import './ProductsPage.css';
import ProductList from '../ProductList/ProductList.js';
import { Typography } from '@material-ui/core';

const ProductsPage = ({ greeting }) => {
    const urlServer = process.env.REACT_APP_URL_SERVER;
    const [products, setProducts] = useState([]);
    
    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(`${urlServer}/api/products/getAll`);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error al obtener la lista de productos:', error);
        }
    }, [urlServer]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            <section className='Titulo'>
                <Typography variant="h1" className='Titular'>{greeting}</Typography>
            </section>
            <div className="App-index inicio">
                <ProductList products={products} />
            </div>
        </>
    );
};

export default ProductsPage;
