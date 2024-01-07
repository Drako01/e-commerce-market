// Rutas
import indexRouter from '../routers/index.router.js';
import userRouter from '../routers/users.router.js';

// Vistas
const views = [
    { path: '/', router: indexRouter },
    { path: '/get-all-users', router: userRouter},
    { path: '/create-user', router: userRouter},
    { path: '/users', router: userRouter},
];

export default views;

