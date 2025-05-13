import ical from 'ical-generator'

/**
 * Generate an iCalendar invite
 * @param {Object} options - Calendar event options
 * @param {string} options.title - Event title
 * @param {string} options.description - Event description
 * @param {Date} options.startTime - Event start time
 * @param {number} options.duration - Event duration in minutes
 * @param {string} options.location - Event location or meeting link
 * @param {Object} options.organizer - Event organizer
 * @param {string} options.organizer.name - Organizer name
 * @param {string} options.organizer.email - Organizer email
 * @param {Array} options.attendees - Event attendees
 * @returns {string} - iCalendar event as string
 */
export const generateCalendarInvite = (options) => {
  const {
    title,
    description,
    startTime,
    duration,
    location,
    organizer,
    attendees,
  } = options

  // Calculate end time
  const endTime = new Date(startTime)
  endTime.setMinutes(endTime.getMinutes() + duration)

  // Create calendar
  const calendar = ical({
    domain: 'vaif.tech',
    name: 'VAIF TECH Meeting',
  })

  // Create event
  const event = calendar.createEvent({
    start: startTime,
    end: endTime,
    summary: title,
    description: description,
    location: location,
    organizer: {
      name: organizer.name,
      email: organizer.email,
    },
  })

  // Add attendees
  if (attendees && attendees.length > 0) {
    attendees.forEach((attendee) => {
      event.createAttendee({
        name: attendee.name,
        email: attendee.email,
        role:
          attendee.role === 'optional' ? 'OPT-PARTICIPANT' : 'REQ-PARTICIPANT',
      })
    })
  }

  // Generate iCalendar string
  return calendar.toString()
}
