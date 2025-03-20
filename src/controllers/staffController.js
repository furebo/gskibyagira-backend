import db from '../database/models/index.js';
import upload from '../utils/multer.js'; // Import the multer setup with Cloudinary

//const staff = models.staff;
//controller to create an event
const CreateStaff = async (req, res) => {
    console.log("I am hitting the endpoint")
    // Use multer to handle file upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
  
      // If file uploaded successfully, process the rest
      if (req.file && req.file.path) {
        req.body.image_url = req.file.path; // The file.path will be the Cloudinary URL
      }
  
      const { image_url, firstname, lastname,role,description } = req.body;
  
      if (firstname && lastname) {
        try {
          const data = await db.staff.create({
            firstname,
            lastname,
            role,
            description,
            image_url,
          });
  
          res.status(201).json({
            message: 'The staff member Is Created Successfully',
            data,
          });
        } catch (error) {
          res.status(400).json({
            error: error.message,
          });
        }
      } else {
        res.status(400).json({
          error: 'first name and last name are required.',
        });
      }
    });
  };
  
//controller to get all staff

const allStaff = async (req,res)=>{
    try {
      const response = await db.staff.findAll();
      if(response){
        return res.status(200).json({
          message:"All Staff are found well",
          data:response
        })
      }
      return res.status(404).json({message:"No staff member found"})
    } catch (err) {
      res.status(500).json({
        error:err.message
      })
    }
  };

  //controller to update a staff

const updateStaff = async (req, res) => {
    const { id } = req.params; // The ID of the event to update
  
    // Use multer to handle file upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
  
      // If a file is uploaded, update the image_url
      if (req.file && req.file.path) {
        req.body.image_url = req.file.path; // The file.path will be the Cloudinary URL
      }
  
      const { image_url, firstname, lastname, role, description } = req.body;
  
      if (firstname && lastname) {
        try {
          // Check if the event exists
          const staffToEdit = await db.staff.findOne({ where: { id } });
          if (!staffToEdit) {
            return res.status(404).json({ message: "staff record not found." });
          }
  
          // Update the event
          const updatedRecord = await db.staff.update(
            {
              firstname,
              lastname,
              role,
              description,
              image_url,         
            },
            { where: { id } }
          );
  
          // Check if the update was successful
          if (updatedRecord[0] === 0) {
            return res.status(400).json({ message: "No changes detected, update skipped." });
          }
  
          res.status(200).json({
            message: "Staff record updated successfully.",
            updatedRecord: updatedRecord[0] // This will return the number of affected rows
          });
        } catch (error) {
          res.status(500).json({
            error: error.message,
          });
        }
      } else {
        res.status(400).json({
          error: 'FirstName and LastName are required.',
        });
      }
    });
  };

  //controller to delete a staff
const deleteStaff = async (req, res) => {
    try {
      const { id } = req.params; // Get the staff ID from the request parameters
  
      // Find the staff by ID
      const staffToDelete = await db.staff.findOne({ where: { id } });
  
      if (!staffToDelete) {
        return res.status(404).json({ message: "Staff record not found." });
      }
  
      // Delete the staff
      await staff.destroy({ where: { id } });
  
      return res.status(200).json({
        message: "Staff record deleted successfully."
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete staff record.", error: error.message });
    }
  };

  export {CreateStaff,allStaff,updateStaff,deleteStaff}