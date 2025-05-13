import mongoose from 'mongoose'
import slugify from 'slugify'

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
      maxlength: [
        100,
        'Document title must have less than or equal to 100 characters',
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
    content: {
      type: String,
      required: [true, 'Document content is required'],
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
    },
    variables: {
      type: Map,
      of: String,
    },
    tags: [String],
    category: {
      type: String,
      enum: ['contract', 'proposal', 'agreement', 'letter', 'report', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareableLink: {
      type: String,
      unique: true,
      sparse: true,
    },
    pdfUrl: String,
    docxUrl: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Document must have a creator'],
    },
    relatedTo: {
      model: {
        type: String,
        enum: ['Quote', 'Invoice', 'Project', 'Client'],
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
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
documentSchema.index({ slug: 1 })
documentSchema.index({ category: 1 })
documentSchema.index({ status: 1 })
documentSchema.index({ isPublic: 1 })
documentSchema.index({ createdBy: 1 })
documentSchema.index({ shareableLink: 1 }, { sparse: true })
documentSchema.index({ title: 'text', description: 'text', content: 'text' })

// Document middleware: runs before .save() and .create()
documentSchema.pre('save', function (next) {
  // Create slug from title
  this.slug = slugify(this.title, { lower: true })

  // Update timestamps
  this.updatedAt = Date.now()

  // Generate shareable link if not exists and document is public
  if (this.isPublic && !this.shareableLink) {
    this.shareableLink = `doc-${this._id}-${Math.random()
      .toString(36)
      .substring(2, 8)}`
  }

  next()
})

const Document = mongoose.model('Document', documentSchema)

export default Document
