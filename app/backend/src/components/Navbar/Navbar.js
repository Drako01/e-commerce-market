import { NavLink } from 'react-router-dom';
import logo from '../../logo.svg'
import './Navbar.css';

const Navbar = () => {
    return (
        <section>
            <div className='menu'>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container">
                        <img src={logo} alt=' ' />
                        <NavLink className="navbar-brand" to='/'>Inicio</NavLink>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">                            
                                <li className="nav-item">
                                    <NavLink className="nav-link" to='/api'>Usuarios</NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </section>
    );
};

export default Navbar;
