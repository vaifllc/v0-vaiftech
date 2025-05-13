import mongoose from 'mongoose'

const comparisonSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A comparison must belong to a user'],
    },
    title: {
      type: String,
      trim: true,
      default: 'My Comparison',
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'A comparison must include at least one product'],
      },
    ],
    criteria: [
      {
        name: {
          type: String,
          required: [true, 'Criterion name is required'],
        },
        weight: {
          type: Number,
          default: 1,
          min: [0, 'Weight cannot be negative'],
          max: [10, 'Weight cannot exceed 10'],
        },
        isVisible: {
          type: Boolean,
          default: true,
        },
      },
    ],
    notes: {
      type: String,
      trim: true,
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
    lastViewed: {
      type: Date,
      default: Date.now,
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
comparisonSchema.index({ user: 1, createdAt: -1 })
comparisonSchema.index({ shareableLink: 1 }, { sparse: true })
comparisonSchema.index({ isPublic: 1 })

// Virtual for product count
comparisonSchema.virtual('productCount').get(function () {
  return this.products.length
})

// Pre-save middleware
comparisonSchema.pre('save', function (next) {
  // Update timestamps
  this.updatedAt = Date.now()

  // Generate shareable link if comparison is public and doesn't have one
  if (this.isPublic && !this.shareableLink) {
    this.shareableLink = `cmp-${this._id}-${Math.random()
      .toString(36)
      .substring(2, 8)}`
  }

  // Remove shareable link if comparison is not public
  if (!this.isPublic && this.shareableLink) {
    this.shareableLink = undefined
  }

  next()
})

// Limit the number of products in a comparison
comparisonSchema.pre('save', function (next) {
  if (this.products.length > 10) {
    this.products = this.products.slice(0, 10)
  }
  next()
})

const Comparison = mongoose.model('Comparison', comparisonSchema)

export default Comparison
