import { BrowserRouter } from 'react-router-dom';
import Main from './components/Main/Main.js';
import Header from './components/Header/Header.js';
import { db, auth, storage } from './Firebase/firebaseConfig.js'; 
// import { AuthProvider } from './context/AuthContext.js';

function App() {
  console.log(db, auth, storage);
  return (
    <>
      <BrowserRouter>
        <Header />
        <Main />
      </BrowserRouter>
    </>
  );
}

export default App;
