import { Routes, Route } from 'react-router-dom';
import IndexFirebase from '../Index/IndexFirebase';
import ProductsPageFirebase from '../ProductsPage/ProductsPageFirebase';
import Index from '../Index/IndexLocal';
import ProductsPage from '../ProductsPage/ProductsPageLocal';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import Contact from '../Contact/Contact';

const Main = () => {
    const shouldUseLocalComponents = 'Local'; // Si se saca va a Firebase

    return (
        <main className="App-main">
            <Routes>
                {shouldUseLocalComponents === 'Local' ? (
                    <>
                        <Route path="/" element={<Index greeting={'Ofertas'} />} />         
                        <Route path="/productos" element={<ProductsPage greeting={'Listado de Productos'} />} />
                    </>
                ) : (
                    <>
                        <Route path="/" element={<IndexFirebase greeting={'Ofertas'} />} />         
                        <Route path="/productos" element={<ProductsPageFirebase greeting={'Listado de Productos'} />} />
                    </>
                )}
                <Route path="/login" element={<Login greeting={'Ingresar'} />} />
                <Route path="/signup" element={<Signup greeting={'Crear Cuenta'} />} />
                <Route path="/contacto" element={<Contact greeting={'Contáctenos'} />} />
            </Routes>
        </main>
    );
}

export default Main;
