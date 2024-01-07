import { BrowserRouter } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext.js';
import Main from './components/Main/Main.js';
import Header from './components/Header/Header.js'

function App() {
  return (
    <>
      {/* <AuthProvider> */}
      <BrowserRouter>
        <Header />
        <Main />
      </BrowserRouter>
      {/* </AuthProvider> */}
    </>
  );
}

export default App;
