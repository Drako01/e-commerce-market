// Rutas
import indexRouter from '../routers/index.router.js';
import userRouter from '../routers/users.router.js';
import productsRouter from '../routers/products.router.js'; 

// Vistas
const views = [
    { path: '/', router: indexRouter },
    { path: '/api/get-all-users', router: userRouter },
    { path: '/api/create-user', router: userRouter },
    { path: '/api/users', router: userRouter },
    { path: '/api/products', router: productsRouter }, 
];

export default views;
