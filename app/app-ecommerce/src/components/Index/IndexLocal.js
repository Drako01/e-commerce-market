import React from 'react';
import './Index.css';
import { products } from '../ProductList/products.js';
import ProductList from '../ProductList/ProductList.js';
import { Typography } from '@material-ui/core';


const Index = ({greeting}) => {
    const ofertaProducts = [];
    // Filtra los productos que tienen "stock: 0"
    
    products.forEach((product) => {
        if (product.oferta === 'si') {
            ofertaProducts.push(product);
        }
        
    });

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
