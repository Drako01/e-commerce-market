import express from 'express';
import compression from 'compression';
import config from './config/config.js';
import loggers from './config/logger.js'
const app = express();

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
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Configuracion del puerto
let dominio = program.opts().mode === 'local' ? config.urls.urlProd : config.urls.urlLocal;
const PORT = program.opts().mode === 'dev' ? config.ports.prodPort : config.ports.devPort;

// Ruta principal
app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

// Inicializar el servidor
function startServer() {
    const httpServer = app.listen(PORT, () => {
        loggers.http(`Server Up! => ${dominio}:${PORT}`);        
    });    
}

startServer()