import mongoose from 'mongoose'
import slugify from 'slugify'

const templateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Template title is required'],
      trim: true,
      maxlength: [
        100,
        'Template title must have less than or equal to 100 characters',
      ],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Template category is required'],
      enum: ['contract', 'proposal', 'agreement', 'letter', 'report', 'other'],
    },
    content: {
      type: String,
      required: [true, 'Template content is required'],
    },
    variables: [
      {
        name: {
          type: String,
          required: [true, 'Variable name is required'],
        },
        description: {
          type: String,
        },
        defaultValue: {
          type: String,
        },
        required: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Template must have a creator'],
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
templateSchema.index({ slug: 1 })
templateSchema.index({ category: 1 })
templateSchema.index({ isPublic: 1 })
templateSchema.index({ createdBy: 1 })
templateSchema.index({ title: 'text', description: 'text' })

// Document middleware: runs before .save() and .create()
templateSchema.pre('save', function (next) {
  // Create slug from title
  this.slug = slugify(this.title, { lower: true })

  // Update timestamps
  this.updatedAt = Date.now()

  next()
})

const Template = mongoose.model('Template', templateSchema)

export default Template
