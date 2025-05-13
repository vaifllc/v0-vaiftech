import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: ['stripe', 'square', 'bank_transfer', 'other'],
    },
    paymentIntentId: {
      type: String,
      sparse: true,
    },
    squarePaymentId: {
      type: String,
      sparse: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
          min: [1, 'Quantity must be at least 1'],
        },
        price: {
          type: Number,
          required: [true, 'Price is required'],
          min: [0, 'Price cannot be negative'],
        },
        name: {
          type: String,
          required: [true, 'Item name is required'],
        },
      },
    ],
    billingDetails: {
      name: {
        type: String,
        required: [true, 'Billing name is required'],
      },
      email: {
        type: String,
        required: [true, 'Billing email is required'],
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
      },
      address: {
        line1: {
          type: String,
          required: [true, 'Address line 1 is required'],
        },
        line2: {
          type: String,
        },
        city: {
          type: String,
          required: [true, 'City is required'],
        },
        state: {
          type: String,
          required: [true, 'State is required'],
        },
        postalCode: {
          type: String,
          required: [true, 'Postal code is required'],
        },
        country: {
          type: String,
          required: [true, 'Country is required'],
          default: 'US',
        },
      },
      phone: {
        type: String,
      },
    },
    receiptUrl: {
      type: String,
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
    },
    refundedAmount: {
      type: Number,
      default: 0,
    },
    refundReason: {
      type: String,
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
paymentSchema.index({ user: 1, createdAt: -1 })
paymentSchema.index({ status: 1 })
paymentSchema.index({ paymentIntentId: 1 }, { sparse: true })
paymentSchema.index({ squarePaymentId: 1 }, { sparse: true })

// Virtual for total items
paymentSchema.virtual('totalItems').get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0)
})

// Pre-save hook to update timestamps
paymentSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

const Payment = mongoose.model('Payment', paymentSchema)

export default Payment
