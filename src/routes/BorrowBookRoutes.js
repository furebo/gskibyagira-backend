import express from 'express';
import { BorrowBook, allBorrowedBooks,deleteBorrowedBook,updateBorrowedBook,allBorrowedBooksByType } from '../controllers/bookBorrowingController.js';


const router = express.Router();

router.post('/borrowbook',BorrowBook);
router.get('/borrowbook',allBorrowedBooks);
router.delete('/borrowbook/:id',deleteBorrowedBook);
router.put('/borrowbook/:id',updateBorrowedBook);
router.get('/allborrowedbytype',allBorrowedBooksByType);
export default router;