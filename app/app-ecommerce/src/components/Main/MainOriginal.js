import { Routes, Route} from 'react-router-dom';
import Index from '../Index/IndexFirebase';
import ProductsPage from '../ProductsPage/ProductsPageFirebase';
// import Index from '../Index/IndexLocal';
// import ProductsPage from '../ProductsPage/ProductsPageLocal';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import Contact from '../Contact/Contact';

const Main = () => {
    return (
        <main className="App-main">
            <Routes>
                <Route path="/" element={<Index greeting={'Ofertas'}/>} />         
                <Route path="/productos" element={<ProductsPage greeting={'Listado de Productos'}/>} />  
                <Route path="/login" element={<Login greeting={'Ingresar'}/>} />  
                <Route path="/signup" element={<Signup greeting={'Crear Cuenta'}/>} /> 
                <Route path="/contacto" element={<Contact greeting={'Contactenos'}/>} />   
            </Routes>
            
        </main>
    )
}

export default Main;