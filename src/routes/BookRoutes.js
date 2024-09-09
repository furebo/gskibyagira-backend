import express from 'express';
import { createBook,getAllBooks,deleteBook,editBook } from '../controllers/booksController';


const router = express.Router();

router.post('/books',createBook);
router.get('/books',getAllBooks);
router.delete('/books/:id',deleteBook);
router.put('/books/:id',editBook);
export default router;