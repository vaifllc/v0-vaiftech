import express from 'express'
import { protect, authorize } from '../middleware/auth.middleware.js'
import {
  createMeeting,
  getMeetings,
  getMeeting,
  updateMeeting,
  deleteMeeting,
  sendReminder,
  getUpcomingMeetings,
} from '../controllers/meeting.controller.js'

const router = express.Router()

// Protect all routes
router.use(protect)

// Routes available to all authenticated users
router.route('/').post(createMeeting).get(getMeetings)

router.route('/upcoming').get(getUpcomingMeetings)

router.route('/:id').get(getMeeting).put(updateMeeting).delete(deleteMeeting)

router.route('/:id/reminder').post(sendReminder)

export default router
