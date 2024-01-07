import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {

    

    return (
        <section>
            
            <div className='menu'>
                <nav>
                    <NavLink to='/' ><li>Inicio</li></NavLink>                    
                    <NavLink to='/api/'><li>Listado de Usuarios</li></NavLink>
                    
                </nav>
            </div>
            
        </section>
    );
};

export default Navbar;
