// Rutas
import indexRouter from '../routers/index.router.js';
import userRouter from '../routers/users.router.js';

// Vistas
const views = [
    { path: '/api', router: indexRouter },
    { path: '/api/get-all-users', router: userRouter},
    { path: '/api/create-user', router: userRouter},
    { path: '/api/users', router: userRouter},
];

export default views;

