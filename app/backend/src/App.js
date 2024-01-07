import { BrowserRouter } from 'react-router-dom';
import UserManage from './components/UserManage/UserManage';
// import { AuthProvider } from './context/AuthContext.js';

function App() {
  return (
    <>
      {/* <AuthProvider> */}
        <BrowserRouter>
          <UserManage />
        </BrowserRouter>
      {/* </AuthProvider> */}
    </>
  );
}

export default App;
