import dotenv from 'dotenv';
import model from '../database/models/index.js';

const book = model.book;

dotenv.config();

const createBook = async (req, res) => {
  const { bookType, bookLevel, bookCode, bookAuthor, deliveryDate } = req.body;
  if (bookType === '' || bookLevel === ''||bookCode=='' || bookAuthor === '' || deliveryDate === '') {
    return res.status(500).json({
      message:"All fields are required.",
    });
  }  
      book.create({
      bookLevel,
      bookType,
      bookCode,
      bookAuthor,
      deliveryDate,
    })
      .then((data) => {
        if (data) {
             res.status(201).json({
            message:'The book is successfully registered.',
            data,
          });
        }
      })
      .catch((err) => {
        res.status(400).json({
          error: err.message,
        });
      });
  };

  //the function to get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await book.findAll({
      attributes: ['id', 'bookType', 'bookLevel', 'bookCode', 'bookAuthor','deliveryDate'], // Include the fields you want to retrieve
    });

    if (books.length === 0) {
      return res.status(404).json({
        message: 'No book found.',
      });
    }

    return res.status(200).json({
      message: 'Books retrieved successfully.',
      data: books,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to retrieve books.',
      error: error.message,
    });
  }
};

//function to delete a book
const deleteBook = async (req, res) => {
  try {
      const { id } = req.params; // Assuming the ID is passed as a route parameter
      const Book = await book.findOne({ where: { id } });
      if (!Book) {
          return res.status(404).json({ message: "Book record not found." });
      }
      await book.destroy({
          where: { id }
      });
      return res.status(200).json({ message: "Book record deleted successfully." });
  } catch (error) {
      return res.status(500).json({ message: "Failed to delete book record.", error: error.message });
  }
};

//The function to edit a book
const editBook = async (req, res) => {
  const { id } = req.params; // Assuming the book's ID is passed in the URL params
  const { bookType, bookLevel, bookCode, bookAuthor, deliveryDate } = req.body;

  // Validate required fields
  if (!bookType || !bookLevel || !bookCode || !bookAuthor || !deliveryDate) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }
  try {
    // Find the book by ID
    const Book = await book.findOne({ where: { id } });

    if (!Book) {
      return res.status(404).json({
        message: "Book not found.",
      });
    }
    const updatedBookRecord = req.body
    const updatedrecord = await book.update(updatedBookRecord,{
        where: { id }
    });
    // Respond with the updated user details
    return res.status(200).json({
      message: "Book updated successfully.",
      updatedrecord,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating the book.",
      error: error.message,
    });
  }
};


export {createBook,getAllBooks,deleteBook,editBook}