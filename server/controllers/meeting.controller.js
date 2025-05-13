import Meeting from '../models/meeting.model.js'
import Quote from '../models/quote.model.js'
import { sendEmail } from '../utils/email.js'
import { generateCalendarInvite } from '../utils/calendar.js'

// Create a new meeting
export const createMeeting = async (req, res) => {
  try {
    const {
      quoteId,
      title,
      description,
      date,
      duration,
      meetingType,
      meetingLink,
      location,
      attendees,
    } = req.body

    // Validate quote if provided
    if (quoteId) {
      const quote = await Quote.findById(quoteId)

      if (!quote) {
        return res.status(404).json({
          success: false,
          message: 'Quote not found',
        })
      }

      // Check if user owns the quote or is admin
      if (quote.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to schedule a meeting for this quote',
        })
      }
    }

    // Create new meeting
    const meeting = new Meeting({
      quote: quoteId || null,
      user: req.user.id,
      title,
      description,
      date,
      duration,
      meetingType,
      meetingLink,
      location,
      attendees,
      status: 'scheduled',
    })

    // Save meeting to database
    await meeting.save()

    // Send calendar invites to attendees
    if (attendees && attendees.length > 0) {
      const calendarEvent = generateCalendarInvite({
        title,
        description,
        startTime: new Date(date),
        duration, // in minutes
        location: meetingType === 'in-person' ? location : meetingLink,
        organizer: {
          name: req.user.name,
          email: req.user.email,
        },
        attendees,
      })

      // Send email with calendar invite to each attendee
      for (const attendee of attendees) {
        await sendEmail({
          to: attendee.email,
          subject: `Meeting Invitation: ${title}`,
          text: `You have been invited to a meeting: ${title}\nDate: ${new Date(
            date,
          ).toLocaleString()}\nDuration: ${duration} minutes\n${
            meetingType === 'in-person'
              ? `Location: ${location}`
              : `Meeting Link: ${meetingLink}`
          }`,
          html: `<p>You have been invited to a meeting: <strong>${title}</strong></p>
                 <p>Date: ${new Date(date).toLocaleString()}</p>
                 <p>Duration: ${duration} minutes</p>
                 <p>${
                   meetingType === 'in-person'
                     ? `Location: ${location}`
                     : `Meeting Link: ${meetingLink}`
                 }</p>`,
          attachments: [
            {
              filename: 'meeting.ics',
              content: calendarEvent,
            },
          ],
        })
      }
    }

    res.status(201).json({
      success: true,
      data: meeting,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

// Get all meetings for a user
export const getMeetings = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const skip = (page - 1) * limit

    let filter = { user: req.user.id }

    // If admin, allow filtering by user ID
    if (req.user.role === 'admin' && req.query.userId) {
      filter = { user: req.query.userId }
    }

    // Add status filter if provided
    if (req.query.status) {
      filter.status = req.query.status
    }

    // Add date range filter if provided
    if (req.query.startDate && req.query.endDate) {
      filter.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      }
    }

    // Add quote filter if provided
    if (req.query.quoteId) {
      filter.quote = req.query.quoteId
    }

    const meetings = await Meeting.find(filter)
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email')
      .populate('quote', 'title status')

    const total = await Meeting.countDocuments(filter)

    res.status(200).json({
      success: true,
      count: meetings.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: meetings,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

// Get a single meeting
export const getMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('user', 'name email')
      .populate('quote', 'title status')

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found',
      })
    }

    // Check if user owns the meeting or is admin
    if (
      meeting.user._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this meeting',
      })
    }

    res.status(200).json({
      success: true,
      data: meeting,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

// Update a meeting
export const updateMeeting = async (req, res) => {
  try {
    let meeting = await Meeting.findById(req.params.id)

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found',
      })
    }

    // Check if user owns the meeting or is admin
    if (meeting.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this meeting',
      })
    }

    // Check if meeting date or attendees are being updated
    const dateChanged =
      req.body.date &&
      new Date(req.body.date).getTime() !== new Date(meeting.date).getTime()
    const attendeesChanged =
      req.body.attendees &&
      JSON.stringify(req.body.attendees) !== JSON.stringify(meeting.attendees)

    // Update meeting
    meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    // If date or attendees changed, send updated calendar invites
    if (
      (dateChanged || attendeesChanged) &&
      meeting.attendees &&
      meeting.attendees.length > 0
    ) {
      const calendarEvent = generateCalendarInvite({
        title: meeting.title,
        description: meeting.description,
        startTime: new Date(meeting.date),
        duration: meeting.duration,
        location:
          meeting.meetingType === 'in-person'
            ? meeting.location
            : meeting.meetingLink,
        organizer: {
          name: req.user.name,
          email: req.user.email,
        },
        attendees: meeting.attendees,
      })

      // Send email with updated calendar invite to each attendee
      for (const attendee of meeting.attendees) {
        await sendEmail({
          to: attendee.email,
          subject: `Meeting Update: ${meeting.title}`,
          text: `A meeting has been updated: ${meeting.title}\nDate: ${new Date(
            meeting.date,
          ).toLocaleString()}\nDuration: ${meeting.duration} minutes\n${
            meeting.meetingType === 'in-person'
              ? `Location: ${meeting.location}`
              : `Meeting Link: ${meeting.meetingLink}`
          }`,
          html: `<p>A meeting has been updated: <strong>${
            meeting.title
          }</strong></p>
                 <p>Date: ${new Date(meeting.date).toLocaleString()}</p>
                 <p>Duration: ${meeting.duration} minutes</p>
                 <p>${
                   meeting.meetingType === 'in-person'
                     ? `Location: ${meeting.location}`
                     : `Meeting Link: ${meeting.meetingLink}`
                 }</p>`,
          attachments: [
            {
              filename: 'meeting-update.ics',
              content: calendarEvent,
            },
          ],
        })
      }
    }

    res.status(200).json({
      success: true,
      data: meeting,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

// Delete a meeting
export const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found',
      })
    }

    // Check if user owns the meeting or is admin
    if (meeting.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this meeting',
      })
    }

    // If meeting has attendees, send cancellation emails
    if (meeting.attendees && meeting.attendees.length > 0) {
      for (const attendee of meeting.attendees) {
        await sendEmail({
          to: attendee.email,
          subject: `Meeting Cancelled: ${meeting.title}`,
          text: `The following meeting has been cancelled: ${
            meeting.title
          }\nDate: ${new Date(meeting.date).toLocaleString()}`,
          html: `<p>The following meeting has been cancelled: <strong>${
            meeting.title
          }</strong></p>
                 <p>Date: ${new Date(meeting.date).toLocaleString()}</p>`,
        })
      }
    }

    await meeting.remove()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

// Send meeting reminder
export const sendReminder = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id).populate(
      'user',
      'name email',
    )

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found',
      })
    }

    // Check if user owns the meeting or is admin
    if (
      meeting.user._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send reminders for this meeting',
      })
    }

    // Send reminder emails to attendees
    if (meeting.attendees && meeting.attendees.length > 0) {
      for (const attendee of meeting.attendees) {
        await sendEmail({
          to: attendee.email,
          subject: `Meeting Reminder: ${meeting.title}`,
          text: `Reminder: You have a meeting scheduled: ${
            meeting.title
          }\nDate: ${new Date(meeting.date).toLocaleString()}\nDuration: ${
            meeting.duration
          } minutes\n${
            meeting.meetingType === 'in-person'
              ? `Location: ${meeting.location}`
              : `Meeting Link: ${meeting.meetingLink}`
          }`,
          html: `<p>Reminder: You have a meeting scheduled: <strong>${
            meeting.title
          }</strong></p>
                 <p>Date: ${new Date(meeting.date).toLocaleString()}</p>
                 <p>Duration: ${meeting.duration} minutes</p>
                 <p>${
                   meeting.meetingType === 'in-person'
                     ? `Location: ${meeting.location}`
                     : `Meeting Link: ${meeting.meetingLink}`
                 }</p>`,
        })
      }
    }

    // Update meeting reminder status
    meeting.reminderSent = true
    await meeting.save()

    res.status(200).json({
      success: true,
      message: 'Meeting reminders sent successfully',
      data: meeting,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

// Get upcoming meetings (for dashboard)
export const getUpcomingMeetings = async (req, res) => {
  try {
    let filter = {
      user: req.user.id,
      date: { $gte: new Date() },
      status: { $ne: 'cancelled' },
    }

    // If admin, get all upcoming meetings
    if (req.user.role === 'admin' && req.query.all === 'true') {
      delete filter.user
    }

    const meetings = await Meeting.find(filter)
      .sort({ date: 1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('quote', 'title')

    res.status(200).json({
      success: true,
      count: meetings.length,
      data: meetings,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}
