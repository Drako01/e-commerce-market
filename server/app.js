import express from 'express';
import compression from 'compression';
import config from './config/config.js';
import loggers from './config/logger.js'
import 'core-js';
import cors from 'cors';
import admin from 'firebase-admin';
import bodyParser from 'body-parser';
const app = express();
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
let httpServer;

// Configuracion de Compresion de Archivos Estaticos con Brotli
app.use(compression({
    brotli: { enabled: true, zlib: {} }
}));

// Configuracion de Commander
import { Command } from 'commander';
const program = new Command();
program
    .option('--mode <mode>', 'Puerto', 'prod')
program.parse();



// Configuracion de Path
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(new URL(import.meta.url).pathname);

//  Configuracion de Handlebars
import configureHandlebars from './manager/handlebars.manager.js';
import { registerHandlebarsHelpers } from './helpers/handlebars.helpers.js';
registerHandlebarsHelpers(app)
configureHandlebars(app);

// Configuracion de las Rutas y las Vistas Principales
import views from './manager/views.manager.js';
app.use(express.static(path.resolve('..', 'public')));
app.set('views', './views/');
// Configura las rutas
function setupRoutes(app, routes) {
    routes.forEach((route) => {
        const { path, router } = route;
        app.use(path, router);
    });
}
setupRoutes(app, views);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    loggers.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Utiliza el import para cargar el archivo JSON
const serviceAccountPath = path.join('./serviceAccountKey.json');

// Lee el contenido del archivo JSON utilizando readFileSync
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Configuracion del puerto
let dominio = program.opts().mode === 'local' ? config.urls.urlProd : config.urls.urlLocal;
const PORT = program.opts().mode === 'dev' ? config.ports.prodPort : config.ports.devPort;
const upServer = `Server Up! => ${dominio}:${PORT}`;


// Inicializar el servidor
function startServer() {
    httpServer = app.listen(PORT, () => {
        loggers.http(upServer);
    });
}

startServer();

// Cerrar conexiones de Firebase u otras tareas de limpieza antes de apagar el servidor
process.on('SIGTERM', () => {    
    if (httpServer) {
        httpServer.close(() => {
            loggers.info('Servidor cerrado.');
        });
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Aquí puedes agregar lógica adicional, como enviar alertas, registrar errores, etc.
});