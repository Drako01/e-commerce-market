import React, { useState, useEffect, useCallback } from 'react';
import './Index.css';
import ProductList from '../ProductList/ProductList.js';
import { Typography } from '@material-ui/core';

const Index = ({ greeting }) => {
    const urlServer = process.env.REACT_APP_URL_SERVER;
    const [ofertaProducts, setOfertaProducts] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(`${urlServer}/api/products/getAll`);
            const data = await response.json();
            // Filtra los productos que tienen "oferta: 'si'"
            const filteredProducts = data.filter((product) => product.oferta === 'si');
            setOfertaProducts(filteredProducts);
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
                <ProductList products={ofertaProducts} />
            </div>
        </>
    );
};

export default Index;
