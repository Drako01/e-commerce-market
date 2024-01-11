import { Routes, Route} from 'react-router-dom';
import Index from '../Index/Index';
import Products from '../Products/Products';

const Main = () => {
    return (
        <main className="App-main">
            <Routes>
                <Route path="/" element={<Index />} />         
                <Route path="/productos" element={<Products />} />        
            </Routes>
            
        </main>
    )
}

export default Main;
