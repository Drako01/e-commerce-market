import React from 'react';
import './Products.css';
import { products } from '../ProductList/products.js';
import ProductList from '../ProductList/ProductList.js';

const Products = () => {

    return (
        <>
            <section className='Titulo'>
                <h1>Listado de Productos</h1>
            </section>
            <div className="App-index inicio">
                <ProductList products={products} />
            </div>
        </>
    );
};

export default Products;
