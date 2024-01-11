import React from 'react';
import './Index.css';
import { products } from '../ProductList/products.js'; 
import ProductList from '../ProductList/ProductList';

const Index = () => {

    return (
        <div className="App-index inicio">           
            <ProductList products={products} />
        </div>
    );
};

export default Index;
