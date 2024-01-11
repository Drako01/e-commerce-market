import React from 'react';
import { IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useFavoritos } from '../../context/FavoritosContext';
import './Favoritos.css';

const Favoritos = ({ product }) => {
    const { favoritos, addFavorito, removeFavorito } = useFavoritos();

    const isFavorito = product && favoritos.some((fav) => fav.id === product.id);

    const handleClick = () => {
        if (product && product.id) {
            if (isFavorito) {
                removeFavorito(product.id);
            } else {
                addFavorito(product);
            }
        }
    };

    return (
        <IconButton onClick={handleClick} color="primary">
            {isFavorito ? <FavoriteIcon className='IconoFavorito' /> : <FavoriteBorderIcon className='IconoBorderFavorito' />}
        </IconButton>
    );
};

export default Favoritos;
