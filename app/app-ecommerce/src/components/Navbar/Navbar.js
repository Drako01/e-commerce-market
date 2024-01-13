import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../assets/img/logo.svg'
import CartWidget from '../CartWidget/CartWidget';
import FavoriteWidget from '../FavoriteWidget/FavoriteWidget';
import { auth } from '../../Firebase/firebaseConfig';
import Swal from 'sweetalert2';
import './Navbar.css';

const Navbar = () => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const navigate = useNavigate();

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const navLinks = [
        { to: '/', text: 'Inicio' },
        { to: '/productos', text: 'Productos' },
        { to: '/contacto', text: 'Contáctenos' },
        authenticated ? { to: '/logout', text: 'Logout' } : { to: '/login', text: 'Login' },
    ];


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

    const handleLogout = () => {    
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Deseas cerrar sesión?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--colour-second)",
            cancelButtonColor: "var(--brick)",
            confirmButtonText: "Sí, cerrar sesión",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                auth.signOut()
                    .then(() => {
                        Swal.fire({
                            title: "Cerrando sesión...",
                            icon: "info",
                            showConfirmButton: false,
                            timer: 1500,
                        });

                        localStorage.removeItem('user');
                        setUserProfile(null);
                        navigate('/');
                    })
                    .catch((error) => {
                        Swal.fire('Error', error.message, 'error');
                    });
            }
        });
    };


    return (
        <AppBar position="sticky" className="appBar">
            <Toolbar>
                {authenticated && userProfile ? (
                    <>
                        <Link to="/" className="logo-navbar Avatar">
                            <Avatar alt={userProfile.displayName} src={userProfile.photoURL} />
                            <p>{userProfile.displayName}</p>
                        </Link>
                        <FavoriteWidget />
                    </>
                ) : (
                    <Link to="/" className="logo-navbar">
                        <Avatar src={logo} alt='ArmoTuSitio.com' />
                    </Link>
                )}

                <div className="spacer" />
                <div className="navLinksDesktop">
                    {navLinks.map((link, index) => (
                        link.text === 'Logout' ? (
                            <Link to="#" key={index} onClick={handleLogout}>
                                {link.text}
                            </Link>
                        ) : (
                            <Link to={link.to} key={index}>
                                {link.text}
                            </Link>
                        )
                    ))}
                    {authenticated && userProfile && (
                        <CartWidget />
                    )}
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
                        {authenticated && userProfile && (
                            <CartWidget />
                        )}
                    </List>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
