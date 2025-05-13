import mongoose from 'mongoose'

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    invoiceNumber: {
      type: String,
      required: [true, 'Invoice number is required'],
      unique: true,
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
      enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
      default: 'draft',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    items: [
      {
        description: {
          type: String,
          required: [true, 'Item description is required'],
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
          min: [1, 'Quantity must be at least 1'],
        },
        unitPrice: {
          type: Number,
          required: [true, 'Unit price is required'],
          min: [0, 'Unit price cannot be negative'],
        },
        amount: {
          type: Number,
          required: [true, 'Amount is required'],
          min: [0, 'Amount cannot be negative'],
        },
        taxRate: {
          type: Number,
          default: 0,
        },
        taxAmount: {
          type: Number,
          default: 0,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative'],
    },
    taxTotal: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
    },
    terms: {
      type: String,
    },
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
    companyDetails: {
      name: {
        type: String,
        required: [true, 'Company name is required'],
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
      email: {
        type: String,
        required: [true, 'Company email is required'],
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
      },
      website: {
        type: String,
      },
      taxId: {
        type: String,
      },
      logo: {
        type: String,
      },
    },
    paymentMethods: [
      {
        type: {
          type: String,
          enum: ['bank_transfer', 'credit_card', 'paypal', 'other'],
          required: [true, 'Payment method type is required'],
        },
        details: {
          type: mongoose.Schema.Types.Mixed,
          required: [true, 'Payment method details are required'],
        },
      },
    ],
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
      },
    ],
    pdfUrl: {
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
invoiceSchema.index({ user: 1, createdAt: -1 })
invoiceSchema.index({ invoiceNumber: 1 }, { unique: true })
invoiceSchema.index({ status: 1 })
invoiceSchema.index({ dueDate: 1 })

// Virtual for total amount
invoiceSchema.virtual('total').get(function () {
  return this.subtotal + this.taxTotal - this.discount
})

// Virtual for amount due
invoiceSchema.virtual('amountDue').get(function () {
  const totalPaid = this.payments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  )
  return this.total - totalPaid
})

// Virtual for payment status
invoiceSchema.virtual('isPaid').get(function () {
  return this.status === 'paid'
})

// Virtual for overdue status
invoiceSchema.virtual('isOverdue').get(function () {
  return this.dueDate < new Date() && this.status !== 'paid'
})

// Pre-save hook to update timestamps
invoiceSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

// Pre-save hook to generate invoice number
invoiceSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastInvoice = await this.constructor.findOne(
      {},
      {},
      { sort: { createdAt: -1 } },
    )
    let nextNumber = 1

    if (lastInvoice && lastInvoice.invoiceNumber) {
      const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[1])
      nextNumber = lastNumber + 1
    }

    this.invoiceNumber = `INV-${nextNumber.toString().padStart(6, '0')}`
  }
  next()
})

const Invoice = mongoose.model('Invoice', invoiceSchema)

export default Invoice
