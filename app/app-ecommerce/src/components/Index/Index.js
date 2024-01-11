import React from 'react';
import './Index.css';
import { products } from '../ProductList/products.js';
import ProductList from '../ProductList/ProductList';

const Index = () => {
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
                <h1>Ofertas</h1>
            </section>
            <div className="App-index inicio">
                <ProductList products={ofertaProducts} />
            </div>
        </>
    );
};

export default Index;
