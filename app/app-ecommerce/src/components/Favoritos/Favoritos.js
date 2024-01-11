import React from 'react';
import { IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Favoritos = ({ onClick, clase }) => {
    return (
        <IconButton className={clase} onClick={onClick}>
            <FavoriteIcon />
        </IconButton>
    );
};

export default Favoritos;
