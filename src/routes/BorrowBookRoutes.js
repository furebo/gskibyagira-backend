import express from 'express';
import { BorrowBook, allBorrowedBooks,deleteBorrowedBook,updateBorrowedBook } from '../controllers/bookBorrowingController';


const router = express.Router();

router.post('/borrowbook',BorrowBook);
router.get('/borrowbook',allBorrowedBooks);
router.delete('/borrowbook/:id',deleteBorrowedBook);
router.put('/borrowbook/:id',updateBorrowedBook);
export default router;