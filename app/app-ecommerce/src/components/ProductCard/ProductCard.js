import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import Button from '../Boton/Boton';
import Favoritos from '../Favoritos/Favoritos';
import { makeStyles } from '@material-ui/core';
import './ProductCard.css'

const useStyles = makeStyles({
    productCard: {
        width: 280,
        margin: 10,
        height: 480,
        border: '0.1px solid #eee',
        display: 'flex',
        flexDirection: 'column',
    },
    media: {
        maxHeight: 240,
        maxWidth: 240,
        objectFit: 'cover',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    },
    price: {},
    actions: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: '1rem',
    },
});

const ProductCard = ({ product, buttonVariant, buttonColor, buttonName, clase, classButton }) => {
    const classes = useStyles();
    const [isFavoritoAdded, setFavoritoAdded] = useState(false);

    const handleFavoritosClick = () => {
        setFavoritoAdded(!isFavoritoAdded);
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
                <Button variant={buttonVariant} color={buttonColor} nombre={buttonName} classButton={classButton} />
            </div>
        </Card>
    );
};

export default ProductCard;
