import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import Button from '../Boton/Boton';
import Favoritos from '../Favoritos/Favoritos';
import { makeStyles } from '@material-ui/core';
import './ProductCard.css';
import { useCart } from '../../context/CartContext';

const useStyles = makeStyles({
    productCard: {
        width: 280,
        margin: 10,
        height: 540,
        border: '0.1px solid #eee',
        display: 'flex',
        flexDirection: 'column',
    },
    media: {
        maxHeight: 240,
        maxWidth: 240,
        objectFit: 'cover',
        marginTop: '1rem',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    },
    price: {},
    actions: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        margin: ' 0 .5rem',
        marginBottom: '1rem',
    },
});

const ProductCard = ({ product, buttonVariant, buttonColor, buttonName, clase, classButton, stock = 0, initial = 1, onAdd }) => {
    const classes = useStyles();
    const [isFavoritoAdded, setFavoritoAdded] = useState(false);
    const [quantity, setQuantity] = useState(initial);
    const { addItem } = useCart();
    const handleFavoritosClick = () => {
        setFavoritoAdded(!isFavoritoAdded);
    };

    const increment = () => {
        if (quantity < stock) {
            setQuantity(prevQuantity => {
                const newQuantity = prevQuantity + 1;
                return newQuantity;
            });
        } else {
            console.log('No se puede incrementar, alcanzado el stock máximo');
        }
    };

    const decrement = () => {
        if (quantity > 1) {
            setQuantity(prevQuantity => {
                const newQuantity = prevQuantity - 1;
                return newQuantity;
            });
        } else {
            console.log('No se puede decrementar, cantidad mínima alcanzada');
        }
    };
    const handleAddToCart = (quantity) => {       
        addItem(product, quantity);
    };
    

    return (
        <Card className={classes.productCard}>
            <div className='cardMediaImage'>
                <CardMedia
                    className={`${classes.media} `}
                    component="img"
                    alt={product.descripcion}
                    image={product.foto}
                />
            </div>
            <CardContent className={classes.content}>
                <Typography variant="h6" component="div">
                    {product.descripcion}
                </Typography>
                <Typography variant="body2" color="textPrimary">
                    Precio: <span>${product.precio}</span>
                </Typography>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    className={`${classes.price}`}
                >
                    Categoría: {product.categoria}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Stock: {product.stock}
                </Typography>
            </CardContent>
            <div className={classes.actions}>
                <Favoritos onClick={handleFavoritosClick} clase={isFavoritoAdded ? 'IconFavoritoAdded' : clase} />
                {product.stock === 0 ? (
                    <span>Sin stock</span>
                ) : (
                    <div>
                        <div className='AddedQuantity'>
                            <button className='ButtonControls' onClick={decrement}>
                                -
                            </button>
                            <h4 className='Number'>{quantity}</h4>
                            <button className='ButtonControls' onClick={increment}>
                                +
                            </button>
                        </div>

                        <Button variant={buttonVariant} color={buttonColor} nombre={buttonName} classButton={classButton}
                            onClick={() => handleAddToCart(quantity)} />{' '}

                    </div>

                )}
            </div>
        </Card>
    );
};

export default ProductCard;
