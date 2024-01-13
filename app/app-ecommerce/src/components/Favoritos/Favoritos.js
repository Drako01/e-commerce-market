import React, { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useFavoritos } from '../../context/FavoritosContext';
import { auth } from '../../Firebase/firebaseConfig';
import './Favoritos.css';

const Favoritos = ({ product }) => {
    const { favoritos, addFavorito, removeFavorito } = useFavoritos();
    const [authenticated, setAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const isFavorito = product && favoritos.some((fav) => fav.id === product.id);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setAuthenticated(true);
                setUserProfile(user);
            } else {
                setAuthenticated(false);
                setUserProfile(null);
            }
        });
        return unsubscribe;
    }, []);
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
        <>
        {authenticated && userProfile ? (
                    <>
        <IconButton onClick={handleClick} color="primary">
            {isFavorito ? <FavoriteIcon className='IconoFavorito' /> : <FavoriteBorderIcon className='IconoBorderFavorito' />}
        </IconButton>
        </>
        ) : (
            <div className='hiden'></div>
        )}
</>
    );
};

export default Favoritos;
