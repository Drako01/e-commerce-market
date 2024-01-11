import { Routes, Route} from 'react-router-dom';
import Index from '../Index/Index';
import ProductsPage from '../ProductsPage/ProductsPage';

const Main = () => {
    return (
        <main className="App-main">
            <Routes>
                <Route path="/" element={<Index />} />         
                <Route path="/productos" element={<ProductsPage />} />        
            </Routes>
            
        </main>
    )
}

export default Main;
