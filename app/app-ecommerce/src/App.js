import Header from './components/Header/Header';
import Footer from './components/Footer/Footer'
import Main from './components/Main/Main'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <>
      <AuthProvider>
          <BrowserRouter>
            <Header />
            <Main />
            <Footer />
          </BrowserRouter>        
      </AuthProvider>
    </>
  );
}

export default App;

