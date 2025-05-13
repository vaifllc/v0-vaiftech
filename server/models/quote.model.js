import mongoose from 'mongoose'

const quoteSchema = new mongoose.Schema(
  {
    quoteNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    client: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: String,
      company: String,
      address: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
      },
    },
    projectDetails: {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      type: {
        code: String,
        name: String,
      },
      category: {
        code: String,
        name: String,
      },
      industry: {
        code: String,
        name: String,
      },
      timeline: {
        code: String,
        name: String,
        durationInWeeks: Number,
      },
      complexity: {
        type: String,
        enum: ['low', 'medium', 'high', 'very-high'],
        default: 'medium',
      },
      features: [
        {
          code: String,
          name: String,
          description: String,
          price: Number,
        },
      ],
      technologies: [
        {
          code: String,
          name: String,
          category: String,
        },
      ],
      aiAnalysis: {
        recommendationType: {
          code: String,
          reasoning: String,
        },
        recommendationCategory: {
          code: String,
          reasoning: String,
        },
        recommendedFeatures: [
          {
            code: String,
            reasoning: String,
          },
        ],
        confidence: String,
        additionalNotes: String,
      },
    },
    items: [
      {
        name: {
          type: String,
          required: true,
        },
        description: String,
        quantity: {
          type: Number,
          default: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    estimateRange: {
      min: Number,
      max: Number,
    },
    notes: String,
    terms: String,
    status: {
      type: String,
      enum: [
        'draft',
        'sent',
        'viewed',
        'accepted',
        'declined',
        'expired',
        'archived',
      ],
      default: 'draft',
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    acceptedAt: Date,
    declinedAt: Date,
    declineReason: String,
    pdfUrl: String,
    meetings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting',
      },
    ],
    attachments: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
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
quoteSchema.index({ quoteNumber: 1 })
quoteSchema.index({ user: 1 })
quoteSchema.index({ 'client.email': 1 })
quoteSchema.index({ status: 1 })
quoteSchema.index({ issueDate: -1 })
quoteSchema.index({ validUntil: 1 })
quoteSchema.index({ 'projectDetails.type.code': 1 })
quoteSchema.index({ 'projectDetails.category.code': 1 })
quoteSchema.index({ 'projectDetails.industry.code': 1 })

// Document middleware: runs before .save() and .create()
quoteSchema.pre('save', function (next) {
  // Update timestamps
  this.updatedAt = Date.now()

  // Set validUntil date if not provided (default to 30 days from issue date)
  if (!this.validUntil) {
    const validUntil = new Date(this.issueDate)
    validUntil.setDate(validUntil.getDate() + 30)
    this.validUntil = validUntil
  }

  next()
})

// Generate quote number
quoteSchema.pre('save', async function (next) {
  if (!this.quoteNumber) {
    const currentDate = new Date()
    const year = currentDate.getFullYear().toString().substr(-2)
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')

    // Get the count of quotes for the current month
    const count = await mongoose.model('Quote').countDocuments({
      createdAt: {
        $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        $lt: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
      },
    })

    // Generate quote number: Q-YY-MM-XXXX
    this.quoteNumber = `Q-${year}-${month}-${(count + 1)
      .toString()
      .padStart(4, '0')}`
  }

  next()
})

const Quote = mongoose.model('Quote', quoteSchema)

export default Quote
