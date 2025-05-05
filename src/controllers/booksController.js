import dotenv from 'dotenv';
import db from '../database/models/index.js';

dotenv.config();

const createBook = async (req, res) => {
  try {
    const { booktype, booklevel, bookcode, bookauthor, deliverydate } = req.body;

    if (!booktype || !booklevel || !bookcode || !bookauthor || !deliverydate) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const data = await db.book.create({
      booktype,
      booklevel,
      bookcode,
      bookauthor,
      deliverydate,
    });
    console.log(data);
    return res.status(201).json({
      message: "The book is successfully registered.",
      data,
    });

  } catch (err) {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Ensure CORS headers in errors
    return res.status(400).json({ error: err.message });
  }
};


  //the function to get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await db.book.findAll({
      attributes: ['id', 'booktype', 'booklevel', 'bookcode', 'bookauthor','deliverydate'], // Include the fields you want to retrieve
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
      const Book = await db.book.findOne({ where: { id } });
      if (!Book) {
          return res.status(404).json({ message: "Book record not found." });
      }
      await db.book.destroy({
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
  const { booktype, booklevel, bookcode, bookauthor, deliverydate } = req.body;

  // Validate required fields
  if (!booktype || !booklevel || !bookcode || !bookauthor || !deliverydate) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }
  try {
    // Find the book by ID
    const Book = await db.book.findOne({ where: { id } });

    if (!Book) {
      return res.status(404).json({
        message: "Book not found.",
      });
    }
    const updatedBookRecord = req.body
    console.log("This is the updated book: ", updatedBookRecord)
    const updatedrecord = await db.book.update(updatedBookRecord,{
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