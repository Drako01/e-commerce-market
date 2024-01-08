import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UserManage from '../UserManage/UserManage';
import Login from '../Login/Login.js';


const Main = () => {   

    return (
        <main className="App-main">       
            <Routes>
                <Route path="/" />
                <Route path="/login" element={<Login />} />
                <Route path="/api" element={<UserManage />} />
            </Routes>
        </main>
    );
};

export default Main;
