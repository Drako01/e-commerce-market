import whatsapp from '../assets/icons/whatsapp.svg';
import instagram from '../assets/icons/instagram.svg';
import facebook from '../assets/icons/facebook.svg';
import logo from '../../logo.svg'
import { NavLink } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Footer.css';

const Footer = () => {
    const mensajeWhatsApp = () => {
        window.open("https://wa.me/5492257548207?text=Hola!%20Me%20gustaría%20tener%20información%20sobre%20los%20servicios%20que%20ofrecen.!")
    }
    const mensajeInstagram = () => {
        window.open("https://www.instagram.com/lonneopentenis/?hl=es")
    }
    const mensajeFacebook = () => {
        window.open("https://www.facebook.com/people/Lonn%C3%A9-Open-Tenis/100063638766614/?locale=es_LA")
    }
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);



    return (
        <div className="Footer oculto-impresion">
            <footer className='Top'>
                <img src={logo} alt='Lonne Open' />
                <section className='Links'>
                    <div>
                        <NavLink to='/'><li>Inicio</li></NavLink>
                        <NavLink to='/'><li>Productos</li></NavLink>
                        <NavLink to='/'><li>Contactenos</li></NavLink>     
                    </div>
                    
                </section>
            </footer>
            <footer className='Bottom'>
                <div className='Legal'>
                    <p>
                        &copy; <NavLink className={'LinkToArmoTuSitio'} to={'https://armotusitio.com/'}>ArmoTuSitio.com</NavLink>  | Todos los derechos reservados | Año {currentYear}
                    </p>


                </div>
                <section className='Iconos-social Links'>
                    <img src={whatsapp} alt="icono WhatsApp" onClick={mensajeWhatsApp} />
                    <img src={instagram} alt="icono Instagram" onClick={mensajeInstagram} />
                    <img src={facebook} alt="icono Facebook" onClick={mensajeFacebook} />
                </section>
            </footer>

        </div>
    )
}

export default Footer;