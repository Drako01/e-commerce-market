import Header from './components/Header/Header';
import Footer from './components/Footer/Footer'
import Main from './components/Main/Main'
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritosProvider } from './context/FavoritosContext'
import './App.css';

function App() {
  return (
    <>
      <AuthProvider>
        <FavoritosProvider>
          <CartProvider>
            <BrowserRouter>
              <Header />
              <Main />
              <Footer />
            </BrowserRouter>
          </CartProvider>
        </FavoritosProvider>
      </AuthProvider>
    </>
  );
}

export default App;

