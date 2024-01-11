import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css'

const ProductList = ({ products }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }} className='ProductList'>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          buttonVariant={'contained'}
          buttonColor={'primary'}
          buttonName={'Agregar al carrito'}
          clase={'IconFavorito'}
          classButton={'classButtonCards'}
        />
      ))}
    </div>
  );
};

export default ProductList;
