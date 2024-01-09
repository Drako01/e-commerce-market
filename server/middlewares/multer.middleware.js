import multer from 'multer';

// Configuración de Multer
const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Solo se permiten archivos de imagen'), false);
    }
    cb(null, true);
};

const multerUpload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: imageFilter,
});

export { multerUpload };
