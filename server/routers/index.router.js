import { Router } from 'express';
import { getIndexController } from '../controllers/index.controller.js';
const router = Router();

router.get('/', getIndexController );

export default router;
