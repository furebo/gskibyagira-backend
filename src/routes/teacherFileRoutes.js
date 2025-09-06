import express from 'express';
import auth from '../Middlewares/index.js';
import { 
     createTeacherFile, 
     listTeacherFiles,
     downloadTeacherFile,
     deleteTeacherFile, 
} from '../controllers/teacherFileController.js';


const router = express.Router();

router.post('/upload-file',auth,createTeacherFile);
router.get('/files', auth, listTeacherFiles);
router.get('/files/:id/download', auth, downloadTeacherFile);
router.delete('/files/:id', auth, deleteTeacherFile);

export default router;