import { NavLink } from 'react-router-dom';
import './Navbar.css'

const Navbar = () => {

    const toggleMenu = () => {
        const liElements = document.querySelectorAll('.menu li');
        const nonNavLinkElements = Array.from(liElements).filter(
            (li) => !li.querySelector('a')
        );
        document.body.classList.toggle('open');
        nonNavLinkElements.forEach((elem) =>
            elem.addEventListener('click', () => {
                document.body.classList.remove('open');
            })
        );
    };

    return (
        <section>
            <button className='burguer' onClick={toggleMenu}></button>
            <div className='menu'>
                <nav>
                    <NavLink to='/' className={'delay00'}><li>Inicio</li></NavLink>
                    <NavLink to='/' className={'delay01'}><li>Listado de Productos</li></NavLink>
                    <NavLink to='/' className={'delay02'}><li>Contactenos</li></NavLink>
                </nav>
            </div>
        </section>
    );
};

export default Navbar;
