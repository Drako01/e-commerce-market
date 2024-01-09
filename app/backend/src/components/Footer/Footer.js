import React from 'react';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Footer.css';

const Footer = () => {

    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="App-footer">
            <p>
                &copy; <NavLink className={'LinkToArmoTuSitio'} to={'https://armotusitio.com/'}>ArmoTuSitio.com</NavLink>  | Todos los derechos reservados | Año {currentYear}
            </p>
        </footer>
    );
};

export default Footer;
