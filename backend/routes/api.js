import express from 'express';
import storage from '../middleware/upload.js';
import {UploadController,downloadController} from '../Controller/uploadController.js';
const router = express.Router();
router.post('/upload', storage.single('file'), UploadController);
router.get('/files/:fileId', downloadController);

export default router;