import mongoose from 'mongoose'

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    plan: {
      type: String,
      required: [true, 'Plan is required'],
      enum: ['basic', 'professional', 'enterprise', 'custom'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: [
        'active',
        'canceled',
        'past_due',
        'trialing',
        'incomplete',
        'incomplete_expired',
      ],
      default: 'active',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    renewalDate: {
      type: Date,
    },
    canceledAt: {
      type: Date,
    },
    trialEndDate: {
      type: Date,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    },
    interval: {
      type: String,
      required: [true, 'Interval is required'],
      enum: ['monthly', 'quarterly', 'annual'],
      default: 'monthly',
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: ['stripe', 'square', 'bank_transfer', 'other'],
    },
    stripeSubscriptionId: {
      type: String,
      sparse: true,
    },
    squareSubscriptionId: {
      type: String,
      sparse: true,
    },
    features: [
      {
        name: {
          type: String,
          required: [true, 'Feature name is required'],
        },
        description: {
          type: String,
        },
        limit: {
          type: Number,
        },
        used: {
          type: Number,
          default: 0,
        },
      },
    ],
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    invoices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
      },
    ],
    autoRenew: {
      type: Boolean,
      default: true,
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

// Indexes for faster queries
subscriptionSchema.index({ user: 1 })
subscriptionSchema.index({ status: 1 })
subscriptionSchema.index({ endDate: 1 })
subscriptionSchema.index({ stripeSubscriptionId: 1 }, { sparse: true })
subscriptionSchema.index({ squareSubscriptionId: 1 }, { sparse: true })

// Virtual for isActive
subscriptionSchema.virtual('isActive').get(function () {
  return this.status === 'active' && this.endDate > new Date()
})

// Virtual for isTrialing
subscriptionSchema.virtual('isTrialing').get(function () {
  return this.status === 'trialing' && this.trialEndDate > new Date()
})

// Virtual for daysRemaining
subscriptionSchema.virtual('daysRemaining').get(function () {
  const now = new Date()
  const end = this.endDate
  const diffTime = Math.abs(end - now)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

// Pre-save hook to update timestamps
subscriptionSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

// Method to check if a feature is available
subscriptionSchema.methods.hasFeature = function (featureName) {
  const feature = this.features.find((f) => f.name === featureName)
  return !!feature
}

// Method to check if a feature limit is reached
subscriptionSchema.methods.isFeatureLimitReached = function (featureName) {
  const feature = this.features.find((f) => f.name === featureName)
  if (!feature || feature.limit === undefined || feature.limit === null) {
    return false
  }
  return feature.used >= feature.limit
}

// Method to increment feature usage
subscriptionSchema.methods.incrementFeatureUsage = async function (
  featureName,
  amount = 1,
) {
  const feature = this.features.find((f) => f.name === featureName)
  if (feature) {
    feature.used += amount
    await this.save()
    return feature.used
  }
  return null
}

const Subscription = mongoose.model('Subscription', subscriptionSchema)

export default Subscription
