import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const meetingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A meeting must belong to a user'],
    },
    title: {
      type: String,
      required: [true, 'Meeting title is required'],
      trim: true,
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      default: 'Online',
      trim: true,
    },
    meetingLink: {
      type: String,
      trim: true,
    },
    meetingId: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    attendees: [
      {
        name: {
          type: String,
          required: [true, 'Attendee name is required'],
        },
        email: {
          type: String,
          required: [true, 'Attendee email is required'],
          lowercase: true,
          match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
        },
        role: {
          type: String,
          enum: ['organizer', 'attendee', 'optional'],
          default: 'attendee',
        },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'declined', 'tentative'],
          default: 'pending',
        },
      },
    ],
    status: {
      type: String,
      enum: ['scheduled', 'cancelled', 'completed'],
      default: 'scheduled',
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
    },
    attachments: [
      {
        name: {
          type: String,
          required: [true, 'Attachment name is required'],
        },
        url: {
          type: String,
          required: [true, 'Attachment URL is required'],
        },
        type: {
          type: String,
        },
      },
    ],
    relatedTo: {
      model: {
        type: String,
        enum: ['Quote', 'Invoice', 'Project', 'Client'],
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    calendarEventId: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes
meetingSchema.index({ user: 1, startTime: 1 })
meetingSchema.index({ startTime: 1 })
meetingSchema.index({ 'attendees.email': 1 })
meetingSchema.index({ status: 1 })

// Virtual for duration in minutes
meetingSchema.virtual('durationMinutes').get(function () {
  return Math.round((this.endTime - this.startTime) / (1000 * 60))
})

// Virtual for isPast
meetingSchema.virtual('isPast').get(function () {
  return this.endTime < new Date()
})

// Pre-save middleware
meetingSchema.pre('save', function (next) {
  // Update timestamps
  this.updatedAt = Date.now()

  // Generate meeting ID if not provided
  if (!this.meetingId) {
    this.meetingId = uuidv4().substring(0, 8)
  }

  // Validate start and end times
  if (this.startTime >= this.endTime) {
    const err = new Error('End time must be after start time')
    return next(err)
  }

  next()
})

const Meeting = mongoose.model('Meeting', meetingSchema)

export default Meeting
