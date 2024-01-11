import { Routes, Route} from 'react-router-dom';
import Index from '../Index/Index';
import ProductsPage from '../ProductsPage/ProductsPage';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';

const Main = () => {
    return (
        <main className="App-main">
            <Routes>
                <Route path="/" element={<Index />} />         
                <Route path="/productos" element={<ProductsPage />} />  
                <Route path="/login" element={<Login />} />  
                <Route path="/signup" element={<Signup />} />     
            </Routes>
            
        </main>
    )
}

export default Main;
