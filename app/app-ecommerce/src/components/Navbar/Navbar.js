import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../assets/img/logo.svg'
import CartWidget from '../CartWidget/CartWidget';
import './Navbar.css';

const Navbar = () => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const navLinks = [
        { to: '/', text: 'Inicio' },
        { to: '/productos', text: 'Productos' },
        { to: '/contacto', text: 'Contáctenos' },
    ];

    return (
        <AppBar position="sticky" className="appBar">
            <Toolbar>
                <Link to="/" className="logo-navbar">
                    <img src={logo} alt='ArmoTuSitio.com' />
                </Link>
                <div className="spacer" />
                <div className="navLinksDesktop">
                    {navLinks.map((link, index) => (
                        <Link to={link.to} key={index}>
                            {link.text}
                        </Link>
                        
                    ))}
                    <CartWidget />
                </div>
                <IconButton
                    className="burger"
                    onClick={toggleDrawer(!isDrawerOpen)}
                >
                    {isDrawerOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
                <Drawer
                    anchor="right"
                    open={isDrawerOpen}
                    onClose={toggleDrawer(false)}
                    className='Contenido'
                >
                    <List>
                        {navLinks.map((link, index) => (
                            <ListItem button key={index}>
                                <Link
                                    to={link.to}
                                    onClick={toggleDrawer(false)}
                                >
                                    <ListItemText primary={link.text} />
                                </Link>
                            </ListItem>
                        ))}
                        <CartWidget /> 
                    </List>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
