import { BrowserRouter } from 'react-router-dom';
import Main from './components/Main/Main.js';
import Header from './components/Header/Header.js';
// import { AuthProvider } from './context/AuthContext.js';

function App() {
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
