import models from '../database/models/index.js';
import upload from '../utils/multer.js'; // Import the multer setup with Cloudinary

const event = models.event;

//controller to create an event
const CreateEvent = async (req, res) => {
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

    const { image_url, heading, description,is_active } = req.body;

    if (heading && description) {
      try {
        const data = await event.create({
          heading,
          description,
          image_url,
          is_active
        });

        res.status(201).json({
          message: 'The Event Is Created Successfully',
          data,
        });
      } catch (error) {
        res.status(400).json({
          error: error.message,
        });
      }
    } else {
      res.status(400).json({
        error: 'Heading and description are required.',
      });
    }
  });
};

//controller to update an event

const updateEvent = async (req, res) => {
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

    const { image_url, heading, description, is_active } = req.body;

    if (heading && description) {
      try {
        // Check if the event exists
        const eventToEdit = await event.findOne({ where: { id } });
        if (!eventToEdit) {
          return res.status(404).json({ message: "Event record not found." });
        }

        // Update the event
        const updatedRecord = await event.update(
          {
            heading,
            description,
            image_url,
            is_active
          },
          { where: { id } }
        );

        // Check if the update was successful
        if (updatedRecord[0] === 0) {
          return res.status(400).json({ message: "No changes detected, update skipped." });
        }

        res.status(200).json({
          message: "Event record updated successfully.",
          updatedRecord: updatedRecord[0] // This will return the number of affected rows
        });
      } catch (error) {
        res.status(500).json({
          error: error.message,
        });
      }
    } else {
      res.status(400).json({
        error: 'Heading and description are required.',
      });
    }
  });
};

//controller to get all events

const allEvents = async (req,res)=>{
  try {
    const response = await event.findAll();
    if(response){
      return res.status(200).json({
        message:"All events are found well",
        data:response
      })
    }
    return res.status(404).json({message:"No event found"})
  } catch (err) {
    res.status(500).json({
      error:err.message
    })
  }
}
//controller to get all active events

const allActiveEventsForSliderData = async (req,res)=>{
  try {
    const response = await event.findAll(
      {
        where: {
          is_active: 'Yes'  // Filter for active events
        }
      }
    );
    if(response){
      return res.status(200).json({
        message:"All events are found well",
        data:response
      })
    }
    return res.status(404).json({message:"No event found"})
  } catch (err) {
    res.status(500).json({
      error:err.message
    })
  }
}
//controller to delete an event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params; // Get the event ID from the request parameters

    // Find the event by ID
    const eventToDelete = await event.findOne({ where: { id } });

    if (!eventToDelete) {
      return res.status(404).json({ message: "Event record not found." });
    }

    // Delete the event
    await event.destroy({ where: { id } });

    return res.status(200).json({
      message: "Event record deleted successfully."
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete event record.", error: error.message });
  }
};


export {CreateEvent,allEvents,allActiveEventsForSliderData,updateEvent,deleteEvent};