import loggers from '../config/logger.js'


export const getIndexController = async (req, res) => { 

    try {
        res.render('index', {title: 'Server | BackEnd'});
    } catch (error) {
        loggers.error('Pagina no encontrada');
    }
}
