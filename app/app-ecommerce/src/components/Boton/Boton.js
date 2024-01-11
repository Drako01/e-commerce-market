import React from 'react';
import Button from '@mui/material/Button';

const Boton = ({ nombre, onClick, color, variant }) => {
    return (
        <Button variant={variant} color={color} onClick={onClick}>
            {nombre}
        </Button>
    );
};

export default Boton;
