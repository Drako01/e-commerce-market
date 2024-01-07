import { BrowserRouter } from 'react-router-dom';
import UserManage from './components/UserManage/UserManage';

function App() {
  return (
    <>
      <BrowserRouter>
        <UserManage />
      </BrowserRouter>
    </>
  );
}

export default App;
