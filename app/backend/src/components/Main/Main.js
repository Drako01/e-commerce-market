import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UserManage from '../UserManage/UserManage';
import ProductsManage from '../ProductsManage/ProductsManage';
import Login from '../Login/Login.js';
import Index from '../Index/Index.js';
import './Main.css'

const Main = () => {

    return (
        <main className="App-main">
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/api/usuarios" element={<UserManage />} />
                <Route path="/api/products" element={<ProductsManage />} />
            </Routes>
        </main>
    );
};

export default Main;
