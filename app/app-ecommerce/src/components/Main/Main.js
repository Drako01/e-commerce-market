import { Routes, Route} from 'react-router-dom';
import Index from '../Index/Index.js';

const Main = () => {
    return (
        <main className="App-main">
            <Routes>
                <Route path="/" element={<Index />} />                
            </Routes>
            
        </main>
    )
}

export default Main;
