import express from 'express';
import { CreateEvent,allEvents,allActiveEventsForSliderData,updateEvent, deleteEvent } from '../controllers/eventController.js';

const router = express.Router();

router.post('/events',CreateEvent);
router.get('/events',allEvents);
router.get('/activeevents',allActiveEventsForSliderData);
router.put('/events/:id',updateEvent);
router.delete('/events/:id',deleteEvent);
export default router;