import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css'

const ProductList = ({ products }) => {

  const handleAddToCart = (quantity, productId) => {
    console.log(`Se agregó al carrito: ${quantity} del ID: ${productId}`);
  };


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
          stock={product.stock}
          onAdd={(quantity) => handleAddToCart(quantity, product.id)}
        />
      ))}
    </div>
  );
};

export default ProductList;
