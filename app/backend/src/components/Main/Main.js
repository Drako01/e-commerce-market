import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UserManage from '../UserManage/UserManage';
import Login from '../Login/Login.js';
import Signup from '../Signup/Signup.js';
import Index from '../Index/Index.js';
import './Main.css'

const Main = () => {

    return (
        <main className="App-main">
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/api" element={<UserManage />} />
            </Routes>
        </main>
    );
};

export default Main;
