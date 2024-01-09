import { BrowserRouter } from 'react-router-dom';
import Main from './components/Main/Main.js';
import Header from './components/Header/Header.js';
import Footer from './components/Footer/Footer.js';
import { db, auth, storage } from './Firebase/firebaseConfig.js'; 
// import { AuthProvider } from './context/AuthContext.js';

function App() {
  console.log(db, auth, storage);
  return (
    <>
      <BrowserRouter>
        <Header />
        <Main />
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
