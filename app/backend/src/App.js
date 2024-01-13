import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Main from './components/Main/Main.js';
import Header from './components/Header/Header.js';
import Footer from './components/Footer/Footer.js';

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
