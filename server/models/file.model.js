import mongoose from 'mongoose'

const fileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: [true, 'Filename is required'],
      trim: true,
    },
    originalName: {
      type: String,
      required: [true, 'Original filename is required'],
      trim: true,
    },
    path: {
      type: String,
      required: [true, 'File path is required'],
      trim: true,
    },
    mimetype: {
      type: String,
      required: [true, 'File mimetype is required'],
    },
    size: {
      type: Number,
      required: [true, 'File size is required'],
    },
    category: {
      type: String,
      enum: [
        'profile',
        'product',
        'document',
        'template',
        'portfolio',
        'other',
      ],
      default: 'other',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    relatedTo: {
      model: {
        type: String,
        enum: [
          'User',
          'Product',
          'Document',
          'Template',
          'Project',
          'Quote',
          'None',
        ],
        default: 'None',
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
    },
    isPublic: {
      type: Boolean,
      default: false,
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
  },
)

// Create index for faster queries
fileSchema.index({ uploadedBy: 1 })
fileSchema.index({ 'relatedTo.model': 1, 'relatedTo.id': 1 })
fileSchema.index({ category: 1 })

const File = mongoose.model('File', fileSchema)

export default File
