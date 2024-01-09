import multer from 'multer';

// Configuración de Multer
const storage = multer.memoryStorage();

const multerUpload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, 
    },
});

export { multerUpload };
