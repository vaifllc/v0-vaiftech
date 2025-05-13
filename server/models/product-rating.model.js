import mongoose from 'mongoose';

const productRatingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A rating must belong to a user']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'A rating must belong to a product']
  },
  comparison: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comparison'
  },
  criteria: [{
    name: {
      type: String,
      required: [true, 'Criterion name is required']
    },
    score: {
      type: Number,
      required: [true, 'Score is required'],
      min: [0, 'Score cannot be less than 0'],
      max: [10, 'Score cannot exceed 10']
    },
    notes: String
  }],
  overallScore: {
    type: Number,
    min: [0, 'Overall score cannot be less than 0'],
    max: [10, 'Overall score cannot exceed 10']
  },
  notes: {
    type: String,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
productRatingSchema.index({ user: 1, product: 1 }, { unique: true });
productRatingSchema.index({ product: 1 });
productRatingSchema.index({ comparison: 1 });

// Pre-save middleware
productRatingSchema.pre('save', function(next) {
  // Update timestamps
  this.updatedAt = Date.now();

  // Calculate overall score if not provided
  if (!this.overallScore && this.criteria.length > 0) {
    const totalScore = this.criteria.reduce((sum, criterion) => sum + criterion.score, 0);
    this.overallScore = totalScore / this.criteria.length;
  }

  next();
});

const ProductRating = mongoose.model('ProductRating', productRatingSchema);

export default ProductRating;