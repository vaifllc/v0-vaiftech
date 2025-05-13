import mongoose from 'mongoose'
import slugify from 'slugify'

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A project title is required'],
      trim: true,
      maxlength: [
        100,
        'A project title must have less than or equal to 100 characters',
      ],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'A project description is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [
        200,
        'A short description must have less than or equal to 200 characters',
      ],
    },
    client: {
      name: {
        type: String,
        required: [true, 'Client name is required'],
      },
      industry: String,
      website: String,
      logo: String,
    },
    projectType: {
      type: String,
      required: [true, 'Project type is required'],
      enum: [
        'web-development',
        'mobile-app',
        'ui-ux-design',
        'branding',
        'e-commerce',
        'consulting',
        'other',
      ],
    },
    technologies: [
      {
        type: String,
        required: [true, 'At least one technology is required'],
      },
    ],
    features: [
      {
        title: {
          type: String,
          required: [true, 'Feature title is required'],
        },
        description: {
          type: String,
          required: [true, 'Feature description is required'],
        },
        icon: String,
      },
    ],
    images: [
      {
        url: {
          type: String,
          required: [true, 'Image URL is required'],
        },
        alt: String,
        caption: String,
        isFeatured: {
          type: Boolean,
          default: false,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    thumbnail: {
      type: String,
      required: [true, 'A thumbnail image is required'],
    },
    links: [
      {
        type: {
          type: String,
          required: [true, 'Link type is required'],
          enum: ['live', 'github', 'dribbble', 'behance', 'figma', 'other'],
        },
        url: {
          type: String,
          required: [true, 'Link URL is required'],
        },
        title: String,
      },
    ],
    testimonial: {
      quote: String,
      author: String,
      position: String,
      company: String,
      avatar: String,
    },
    challenges: {
      type: String,
      trim: true,
    },
    solutions: {
      type: String,
      trim: true,
    },
    results: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Project start date is required'],
    },
    endDate: Date,
    duration: {
      value: Number,
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months', 'years'],
      },
    },
    status: {
      type: String,
      required: [true, 'Project status is required'],
      enum: ['planning', 'in-progress', 'completed', 'on-hold', 'cancelled'],
      default: 'completed',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    tags: [String],
    metaTitle: String,
    metaDescription: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A project must belong to a user'],
    },
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
portfolioSchema.index({ slug: 1 })
portfolioSchema.index({ user: 1, createdAt: -1 })
portfolioSchema.index({ projectType: 1 })
portfolioSchema.index({ technologies: 1 })
portfolioSchema.index({ tags: 1 })
portfolioSchema.index({ isFeatured: 1, order: 1 })

// Virtual properties
portfolioSchema.virtual('durationInDays').get(function () {
  if (this.endDate && this.startDate) {
    const diffTime = Math.abs(this.endDate - this.startDate)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
  return null
})

// Document middleware: runs before .save() and .create()
portfolioSchema.pre('save', function (next) {
  // Create slug from title
  this.slug = slugify(this.title, { lower: true })

  // Update timestamps
  this.updatedAt = Date.now()

  // Calculate duration if start and end dates are provided
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 30) {
      this.duration = {
        value: diffDays,
        unit: 'days',
      }
    } else if (diffDays <= 90) {
      this.duration = {
        value: Math.ceil(diffDays / 7),
        unit: 'weeks',
      }
    } else if (diffDays <= 730) {
      this.duration = {
        value: Math.ceil(diffDays / 30),
        unit: 'months',
      }
    } else {
      this.duration = {
        value: Math.ceil(diffDays / 365),
        unit: 'years',
      }
    }
  }

  next()
})

// Create short description from description if not provided
portfolioSchema.pre('save', function (next) {
  if (!this.shortDescription && this.description) {
    this.shortDescription = this.description.substring(0, 197) + '...'
  }
  next()
})

// Set featured image as thumbnail if not provided
portfolioSchema.pre('save', function (next) {
  if (!this.thumbnail && this.images && this.images.length > 0) {
    const featuredImage = this.images.find((img) => img.isFeatured)
    if (featuredImage) {
      this.thumbnail = featuredImage.url
    } else {
      this.thumbnail = this.images[0].url
    }
  }
  next()
})

const Portfolio = mongoose.model('Portfolio', portfolioSchema)

export default Portfolio
