import Header from './components/Header/Header';
import Footer from './components/Footer/Footer'
import Main from './components/Main/Main'
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <Main />
          <Footer />
        </BrowserRouter>
      </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;

