import { BrowserRouter } from 'react-router-dom';
import Main from './components/Main/Main.js';
import Header from './components/Header/Header.js';
import Footer from './components/Footer/Footer.js';
import { db, auth, storage } from './Firebase/firebaseConfig.js'; 

function App() {
  // eslint-disable-next-line no-unused-vars
  const unusedDbVariable = db;
  // eslint-disable-next-line no-unused-vars
  const unusedAuthVariable = auth;
  // eslint-disable-next-line no-unused-vars
  const unusedStorageVariable = storage;
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
