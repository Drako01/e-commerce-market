import { Route, Routes } from 'react-router-dom';
import UserManage from '../UserManage/UserManage';
import Login from '../Login/Login.js';
// import { useContext } from 'react';
// import { AuthContext } from '../../context/AuthContext.js';

const Main = () => {

    // const { currentUser } = useContext(AuthContext);
    // if (!currentUser) {
    //     return <p>Inicia sesión para ver esta página</p>;
    // }
    return (
        <main className="App-main">
            <Routes>
                <Route path="/" exact component={<Login/>} />
                <Route path="/api" element={<UserManage />} />
            </Routes>
        </main>
    )
}

export default Main;
