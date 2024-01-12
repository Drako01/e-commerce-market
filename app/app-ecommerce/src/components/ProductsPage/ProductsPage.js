import React from 'react';
import './ProductsPage.css';
import { products } from '../ProductList/products.js';
import ProductList from '../ProductList/ProductList.js';
import { Typography } from '@material-ui/core';

const ProductsPage = ({greeting}) => {

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
