import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, IconButton } from '@mui/material';
import { makeStyles } from '@material-ui/core';
import FavoriteIcon from '@mui/icons-material/Favorite';
import './ProductList.css';

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

const ProductCard = ({ product }) => {
  const classes = useStyles();

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
        <IconButton className='IconFavorito'>
          <FavoriteIcon />
        </IconButton>
        <Button variant="contained" color="primary">
          Agregar al carrito
        </Button>
      </div>
    </Card>
  );
};

const ProductList = ({ products }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }} className='ProductList'>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
