import React from 'react';
import Button from '@mui/material/Button';
import './Boton.css'

const Boton = ({ nombre, onClick, color, variant, classButton }) => {
    return (
        <Button variant={variant} color={color} onClick={onClick} className={classButton}>
            {nombre}
        </Button>
    );
};

export default Boton;
