import dotenv from 'dotenv';
import model from '../database/models';

const BookBorrowing = model.bookborrowing;

dotenv.config();

const BorrowBook =  async (req, res) => {
  
  try {
    const { Book_Type, Book_Level, Book_Number, Student_Name, Student_Class, Borrowing_Date } = req.body;

    if (!Book_Type || !Book_Level || !Book_Number || !Student_Name || !Student_Class ) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }
    
    const data =  await BookBorrowing.create({
      Book_Type,
      Book_Level,
      Book_Number,
      Student_Name,
      Student_Class,
      Borrowing_Date
    });
    
    return res.status(201).json({
      message: 'The book is successfully borrowed.',
      data,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const allBorrowedBooks = async (req,res)=>{
    try {
      const response = await BookBorrowing.findAll();
      if(response){
        return res.status(200).json({
          message:"Borrowed books found well",
          data:response
        })
      }
      return res.status(404).json({message:"No records found"})
    } catch (err) {
      res.status(500).json({
        error:err.message
      })
    }
}

const deleteBorrowedBook = async (req, res) => {
    try {
        const { id } = req.params; // Assuming the ID is passed as a route parameter

        const book = await BookBorrowing.findOne({ where: { id } });

        if (!book) {
            return res.status(404).json({ message: "Book record not found." });
        }

        await BookBorrowing.destroy({
            where: { id }
        });

        return res.status(200).json({ message: "Book record deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete book record.", error: error.message });
    }
};

const updateBorrowedBook = async (req, res) => {
    try {
        const { id } = req.params; // Assuming the ID is passed as a route parameter

        const book = await BookBorrowing.findOne({ where: { id } });
        //console.log(book);

        if (!book) {
            return res.status(404).json({ message: "Book record not found." });
        }
        const updatedBookRecord = req.body
        console.log("The request from body is this one :",updatedBookRecord)

        const updatedrecord = await BookBorrowing.update(updatedBookRecord,{
            where: { id }
        });

        return res.status(200).json({
           message: "Book record updated successfully.",
           updatedrecord 
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update book record.", error: error.message });
    }
};

export {BorrowBook,allBorrowedBooks,deleteBorrowedBook,updateBorrowedBook}