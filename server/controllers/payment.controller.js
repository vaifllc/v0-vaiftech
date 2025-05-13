import Payment from '../models/payment.model.js'
import Invoice from '../models/invoice.model.js'
import User from '../models/user.model.js'
import Product from '../models/product.model.js'
import stripeUtils from '../utils/stripe.js'
import squareUtils from '../utils/square.js'
import { sendEmail } from '../utils/email.js'
import { generateInvoicePdf } from '../utils/pdf.js'
import { catchAsync } from '../utils/error.js'

// Create a Stripe payment intent
export const createStripePaymentIntent = catchAsync(async (req, res) => {
  const { amount, currency, description, metadata, items } = req.body

  // Validate required fields
  if (!amount || !description || !items || !items.length) {
    return res.status(400).json({
      status: 'error',
      message: 'Amount, description, and items are required',
    })
  }

  // Get user from request
  const user = req.user

  // Create payment intent
  const paymentIntent = await stripeUtils.createPaymentIntent({
    amount: Math.round(amount * 100), // Convert to cents
    currency: currency || 'usd',
    description,
    metadata: {
      userId: user._id.toString(),
      ...metadata,
    },
    customer: {
      email: user.email,
    },
  })

  // Create payment record
  const payment = await Payment.create({
    user: user._id,
    amount,
    currency: currency || 'USD',
    status: 'pending',
    paymentMethod: 'stripe',
    paymentIntentId: paymentIntent.id,
    description,
    metadata,
    items: items.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
    })),
    billingDetails: {
      name: user.name,
      email: user.email,
      address: user.address || {
        line1: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
      },
      phone: user.phone || '',
    },
  })

  res.status(200).json({
    status: 'success',
    data: {
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
    },
  })
})

// Create a Square payment
export const createSquarePayment = catchAsync(async (req, res) => {
  const { sourceId, amount, currency, note, metadata, items } = req.body

  // Validate required fields
  if (!sourceId || !amount || !items || !items.length) {
    return res.status(400).json({
      status: 'error',
      message: 'Source ID, amount, and items are required',
    })
  }

  // Get user from request
  const user = req.user

  // Create Square payment
  const paymentResult = await squareUtils.createPayment({
    sourceId,
    amount: Math.round(amount * 100), // Convert to cents
    currency: currency || 'USD',
    note,
    metadata: {
      userId: user._id.toString(),
      ...metadata,
    },
  })

  // Create payment record
  const payment = await Payment.create({
    user: user._id,
    amount,
    currency: currency || 'USD',
    status:
      paymentResult.payment.status === 'COMPLETED' ? 'completed' : 'pending',
    paymentMethod: 'square',
    squarePaymentId: paymentResult.payment.id,
    description: note || 'Square payment',
    metadata,
    items: items.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
    })),
    billingDetails: {
      name: user.name,
      email: user.email,
      address: user.address || {
        line1: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
      },
      phone: user.phone || '',
    },
    receiptUrl: paymentResult.payment.receiptUrl,
  })

  res.status(200).json({
    status: 'success',
    data: {
      payment: payment,
      squareResult: paymentResult,
    },
  })
})

// Get all payments (admin only)
export const getAllPayments = catchAsync(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Filtering
  const filter = {}

  if (req.query.status) {
    filter.status = req.query.status
  }

  if (req.query.paymentMethod) {
    filter.paymentMethod = req.query.paymentMethod
  }

  if (req.query.minAmount) {
    filter.amount = { $gte: parseFloat(req.query.minAmount) }
  }

  if (req.query.maxAmount) {
    filter.amount = { ...filter.amount, $lte: parseFloat(req.query.maxAmount) }
  }

  if (req.query.startDate) {
    filter.createdAt = { $gte: new Date(req.query.startDate) }
  }

  if (req.query.endDate) {
    filter.createdAt = {
      ...filter.createdAt,
      $lte: new Date(req.query.endDate),
    }
  }

  // Sorting
  const sort = {}

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  } else {
    sort.createdAt = -1 // Default sort by creation date (newest first)
  }

  // Execute query
  const payments = await Payment.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email')
    .populate('items.product', 'name price')

  // Get total count
  const total = await Payment.countDocuments(filter)

  res.status(200).json({
    status: 'success',
    results: payments.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: {
      payments,
    },
  })
})

// Get user payments
export const getUserPayments = catchAsync(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Filtering
  const filter = { user: req.user._id }

  if (req.query.status) {
    filter.status = req.query.status
  }

  // Sorting
  const sort = {}

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  } else {
    sort.createdAt = -1 // Default sort by creation date (newest first)
  }

  // Execute query
  const payments = await Payment.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('items.product', 'name price')

  // Get total count
  const total = await Payment.countDocuments(filter)

  res.status(200).json({
    status: 'success',
    results: payments.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: {
      payments,
    },
  })
})

// Get payment by ID
export const getPaymentById = catchAsync(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('user', 'name email')
    .populate('items.product', 'name price description')

  if (!payment) {
    return res.status(404).json({
      status: 'error',
      message: 'Payment not found',
    })
  }

  // Check if user is authorized to view this payment
  if (
    !req.user.isAdmin &&
    payment.user.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      status: 'error',
      message: 'You are not authorized to view this payment',
    })
  }

  res.status(200).json({
    status: 'success',
    data: {
      payment,
    },
  })
})

// Update payment status (admin only)
export const updatePaymentStatus = catchAsync(async (req, res) => {
  const { status } = req.body

  if (!status) {
    return res.status(400).json({
      status: 'error',
      message: 'Status is required',
    })
  }

  const payment = await Payment.findById(req.params.id)

  if (!payment) {
    return res.status(404).json({
      status: 'error',
      message: 'Payment not found',
    })
  }

  payment.status = status
  await payment.save()

  res.status(200).json({
    status: 'success',
    data: {
      payment,
    },
  })
})

// Process Stripe webhook
export const stripeWebhook = catchAsync(async (req, res) => {
  const signature = req.headers['stripe-signature']

  if (!signature) {
    return res.status(400).json({
      status: 'error',
      message: 'Stripe signature is missing',
    })
  }

  let event

  try {
    event = stripeUtils.constructWebhookEvent(req.rawBody, signature)
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: `Webhook Error: ${error.message}`,
    })
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object)
      break
    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object)
      break
    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(event.data.object)
      break
    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object)
      break
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object)
      break
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object)
      break
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object)
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.status(200).json({ received: true })
})

// Process Square webhook
export const squareWebhook = catchAsync(async (req, res) => {
  const signature = req.headers['x-square-signature']

  // Verify webhook signature
  const isValid = squareUtils.verifyWebhookSignature(req.rawBody, signature)

  if (!isValid) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid Square signature',
    })
  }

  const event = req.body

  // Handle the event
  switch (event.type) {
    case 'payment.created':
      await handleSquarePaymentCreated(event.data.object.payment)
      break
    case 'payment.updated':
      await handleSquarePaymentUpdated(event.data.object.payment)
      break
    case 'refund.created':
      await handleSquareRefundCreated(event.data.object.refund)
      break
    case 'subscription.created':
      await handleSquareSubscriptionCreated(event.data.object.subscription)
      break
    case 'subscription.updated':
      await handleSquareSubscriptionUpdated(event.data.object.subscription)
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.status(200).json({ received: true })
})

// Create an invoice
export const createInvoice = catchAsync(async (req, res) => {
  const { items, dueDate, notes, terms, billingDetails, paymentMethods } =
    req.body

  // Validate required fields
  if (!items || !items.length || !dueDate || !billingDetails) {
    return res.status(400).json({
      status: 'error',
      message: 'Items, due date, and billing details are required',
    })
  }

  // Calculate subtotal and tax
  let subtotal = 0
  let taxTotal = 0

  const processedItems = items.map((item) => {
    const itemAmount = item.unitPrice * item.quantity
    const taxAmount = item.taxRate ? itemAmount * (item.taxRate / 100) : 0

    subtotal += itemAmount
    taxTotal += taxAmount

    return {
      ...item,
      amount: itemAmount,
      taxAmount,
    }
  })

  // Create invoice
  const invoice = await Invoice.create({
    user: req.user._id,
    items: processedItems,
    subtotal,
    taxTotal,
    discount: req.body.discount || 0,
    dueDate: new Date(dueDate),
    notes,
    terms,
    billingDetails,
    companyDetails: {
      name: process.env.COMPANY_NAME || 'VAIF TECH',
      address: {
        line1: process.env.COMPANY_ADDRESS_LINE1 || '123 Tech Street',
        line2: process.env.COMPANY_ADDRESS_LINE2 || '',
        city: process.env.COMPANY_CITY || 'San Francisco',
        state: process.env.COMPANY_STATE || 'CA',
        postalCode: process.env.COMPANY_POSTAL_CODE || '94103',
        country: process.env.COMPANY_COUNTRY || 'US',
      },
      phone: process.env.COMPANY_PHONE || '(555) 123-4567',
      email: process.env.COMPANY_EMAIL || 'billing@vaiftech.com',
      website: process.env.COMPANY_WEBSITE || 'https://vaiftech.com',
      taxId: process.env.COMPANY_TAX_ID || '',
    },
    paymentMethods: paymentMethods || [
      {
        type: 'bank_transfer',
        details: {
          bankName: process.env.BANK_NAME || 'Example Bank',
          accountName: process.env.BANK_ACCOUNT_NAME || 'VAIF TECH Inc.',
          accountNumber:
            process.env.BANK_ACCOUNT_NUMBER || 'XXXX-XXXX-XXXX-1234',
          routingNumber: process.env.BANK_ROUTING_NUMBER || '123456789',
          swift: process.env.BANK_SWIFT || 'EXAMPLEXXX',
        },
      },
    ],
    status: 'draft',
  })

  // Generate PDF
  const pdfBuffer = await generateInvoicePdf(invoice)

  // Save PDF to file storage and update invoice with URL
  // This would typically involve uploading to S3 or similar
  // For now, we'll just update the invoice with a placeholder URL
  invoice.pdfUrl = `/invoices/${invoice._id}.pdf`
  await invoice.save()

  res.status(201).json({
    status: 'success',
    data: {
      invoice,
    },
  })
})

// Get all invoices (admin only)
export const getAllInvoices = catchAsync(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Filtering
  const filter = {}

  if (req.query.status) {
    filter.status = req.query.status
  }

  if (req.query.minAmount) {
    filter.amount = { $gte: parseFloat(req.query.minAmount) }
  }

  if (req.query.maxAmount) {
    filter.amount = { ...filter.amount, $lte: parseFloat(req.query.maxAmount) }
  }

  if (req.query.startDate) {
    filter.issueDate = { $gte: new Date(req.query.startDate) }
  }

  if (req.query.endDate) {
    filter.issueDate = {
      ...filter.issueDate,
      $lte: new Date(req.query.endDate),
    }
  }

  // Sorting
  const sort = {}

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  } else {
    sort.issueDate = -1 // Default sort by issue date (newest first)
  }

  // Execute query
  const invoices = await Invoice.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email')
    .populate('payments')

  // Get total count
  const total = await Invoice.countDocuments(filter)

  res.status(200).json({
    status: 'success',
    results: invoices.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: {
      invoices,
    },
  })
})

// Get user invoices
export const getUserInvoices = catchAsync(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Filtering
  const filter = { user: req.user._id }

  if (req.query.status) {
    filter.status = req.query.status
  }

  // Sorting
  const sort = {}

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  } else {
    sort.issueDate = -1 // Default sort by issue date (newest first)
  }

  // Execute query
  const invoices = await Invoice.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('payments')

  // Get total count
  const total = await Invoice.countDocuments(filter)

  res.status(200).json({
    status: 'success',
    results: invoices.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: {
      invoices,
    },
  })
})

// Get invoice by ID
export const getInvoiceById = catchAsync(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('user', 'name email')
    .populate('payments')

  if (!invoice) {
    return res.status(404).json({
      status: 'error',
      message: 'Invoice not found',
    })
  }

  // Check if user is authorized to view this invoice
  if (
    !req.user.isAdmin &&
    invoice.user.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      status: 'error',
      message: 'You are not authorized to view this invoice',
    })
  }

  res.status(200).json({
    status: 'success',
    data: {
      invoice,
    },
  })
})

// Update invoice status (admin only)
export const updateInvoiceStatus = catchAsync(async (req, res) => {
  const { status } = req.body

  if (!status) {
    return res.status(400).json({
      status: 'error',
      message: 'Status is required',
    })
  }

  const invoice = await Invoice.findById(req.params.id)

  if (!invoice) {
    return res.status(404).json({
      status: 'error',
      message: 'Invoice not found',
    })
  }

  invoice.status = status
  await invoice.save()

  // If status is 'sent', send email to user
  if (status === 'sent') {
    const user = await User.findById(invoice.user)

    if (user) {
      await sendEmail({
        to: user.email,
        subject: `Invoice ${invoice.invoiceNumber} from VAIF TECH`,
        template: 'invoice',
        data: {
          name: user.name,
          invoiceNumber: invoice.invoiceNumber,
          amount: invoice.amount,
          dueDate: new Date(invoice.dueDate).toLocaleDateString(),
          invoiceUrl: `${process.env.FRONTEND_URL}/invoices/${invoice._id}`,
          companyName: process.env.COMPANY_NAME || 'VAIF TECH',
        },
      })
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      invoice,
    },
  })
})

// Send invoice by email
export const sendInvoiceByEmail = catchAsync(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate(
    'user',
    'name email',
  )

  if (!invoice) {
    return res.status(404).json({
      status: 'error',
      message: 'Invoice not found',
    })
  }

  // Check if user is authorized
  if (
    !req.user.isAdmin &&
    invoice.user._id.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      status: 'error',
      message: 'You are not authorized to send this invoice',
    })
  }

  // Send email
  await sendEmail({
    to: req.body.email || invoice.user.email,
    subject: `Invoice ${invoice.invoiceNumber} from VAIF TECH`,
    template: 'invoice',
    data: {
      name: invoice.user.name,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.total,
      dueDate: new Date(invoice.dueDate).toLocaleDateString(),
      invoiceUrl: `${process.env.FRONTEND_URL}/invoices/${invoice._id}`,
      companyName: process.env.COMPANY_NAME || 'VAIF TECH',
    },
    attachments: [
      {
        filename: `Invoice-${invoice.invoiceNumber}.pdf`,
        path: invoice.pdfUrl,
      },
    ],
  })

  // Update invoice status if it's still in draft
  if (invoice.status === 'draft') {
    invoice.status = 'sent'
    await invoice.save()
  }

  res.status(200).json({
    status: 'success',
    message: 'Invoice sent successfully',
  })
})

// Helper functions for webhook handlers
async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    // Find the payment by payment intent ID
    const payment = await Payment.findOne({ paymentIntentId: paymentIntent.id })

    if (!payment) {
      console.error(`Payment not found for payment intent: ${paymentIntent.id}`)
      return
    }

    // Update payment status
    payment.status = 'completed'
    payment.receiptUrl = `https://dashboard.stripe.com/payments/${paymentIntent.id}`
    await payment.save()

    // Send confirmation email
    const user = await User.findById(payment.user)

    if (user) {
      await sendEmail({
        to: user.email,
        subject: 'Payment Confirmation',
        template: 'payment-confirmation',
        data: {
          name: user.name,
          amount: payment.amount,
          currency: payment.currency,
          date: new Date().toLocaleDateString(),
          description: payment.description,
          receiptUrl: payment.receiptUrl,
          companyName: process.env.COMPANY_NAME || 'VAIF TECH',
        },
      })
    }

    console.log(`Payment ${payment._id} marked as completed`)
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error)
  }
}

async function handlePaymentIntentFailed(paymentIntent) {
  try {
    // Find the payment by payment intent ID
    const payment = await Payment.findOne({ paymentIntentId: paymentIntent.id })

    if (!payment) {
      console.error(`Payment not found for payment intent: ${paymentIntent.id}`)
      return
    }

    // Update payment status
    payment.status = 'failed'
    await payment.save()

    console.log(`Payment ${payment._id} marked as failed`)
  } catch (error) {
    console.error('Error handling payment intent failed:', error)
  }
}

async function handleInvoicePaymentSucceeded(invoice) {
  // Implementation for invoice payment succeeded
  console.log('Invoice payment succeeded:', invoice.id)
}

async function handleInvoicePaymentFailed(invoice) {
  // Implementation for invoice payment failed
  console.log('Invoice payment failed:', invoice.id)
}

async function handleSubscriptionCreated(subscription) {
  // Implementation for subscription created
  console.log('Subscription created:', subscription.id)
}

async function handleSubscriptionUpdated(subscription) {
  // Implementation for subscription updated
  console.log('Subscription updated:', subscription.id)
}

async function handleSubscriptionDeleted(subscription) {
  // Implementation for subscription deleted
  console.log('Subscription deleted:', subscription.id)
}

async function handleSquarePaymentCreated(payment) {
  try {
    // Check if payment already exists
    const existingPayment = await Payment.findOne({
      squarePaymentId: payment.id,
    })

    if (existingPayment) {
      console.log(`Payment already exists for Square payment: ${payment.id}`)
      return
    }

    // Extract metadata from reference ID
    let metadata = {}
    let userId = null

    if (payment.referenceId) {
      try {
        metadata = JSON.parse(payment.referenceId)
        userId = metadata.userId
      } catch (error) {
        console.error('Error parsing Square payment reference ID:', error)
      }
    }

    if (!userId) {
      console.error('User ID not found in Square payment metadata')
      return
    }

    // Create payment record
    const newPayment = await Payment.create({
      user: userId,
      amount: payment.amountMoney.amount / 100, // Convert from cents
      currency: payment.amountMoney.currency,
      status: payment.status === 'COMPLETED' ? 'completed' : 'pending',
      paymentMethod: 'square',
      squarePaymentId: payment.id,
      description: payment.note || 'Square payment',
      metadata,
      receiptUrl: payment.receiptUrl,
    })

    console.log(`Created payment record for Square payment: ${payment.id}`)

    // Send confirmation email if payment is completed
    if (payment.status === 'COMPLETED') {
      const user = await User.findById(userId)

      if (user) {
        await sendEmail({
          to: user.email,
          subject: 'Payment Confirmation',
          template: 'payment-confirmation',
          data: {
            name: user.name,
            amount: newPayment.amount,
            currency: newPayment.currency,
            date: new Date().toLocaleDateString(),
            description: newPayment.description,
            receiptUrl: newPayment.receiptUrl,
            companyName: process.env.COMPANY_NAME || 'VAIF TECH',
          },
        })
      }
    }
  } catch (error) {
    console.error('Error handling Square payment created:', error)
  }
}

async function handleSquarePaymentUpdated(payment) {
  try {
    // Find the payment by Square payment ID
    const existingPayment = await Payment.findOne({
      squarePaymentId: payment.id,
    })

    if (!existingPayment) {
      console.error(`Payment not found for Square payment: ${payment.id}`)
      return
    }

    // Update payment status
    if (
      payment.status === 'COMPLETED' &&
      existingPayment.status !== 'completed'
    ) {
      existingPayment.status = 'completed'
      existingPayment.receiptUrl = payment.receiptUrl
      await existingPayment.save()

      // Send confirmation email
      const user = await User.findById(existingPayment.user)

      if (user) {
        await sendEmail({
          to: user.email,
          subject: 'Payment Confirmation',
          template: 'payment-confirmation',
          data: {
            name: user.name,
            amount: existingPayment.amount,
            currency: existingPayment.currency,
            date: new Date().toLocaleDateString(),
            description: existingPayment.description,
            receiptUrl: existingPayment.receiptUrl,
            companyName: process.env.COMPANY_NAME || 'VAIF TECH',
          },
        })
      }

      console.log(`Payment ${existingPayment._id} marked as completed`)
    } else if (
      payment.status === 'FAILED' &&
      existingPayment.status !== 'failed'
    ) {
      existingPayment.status = 'failed'
      await existingPayment.save()

      console.log(`Payment ${existingPayment._id} marked as failed`)
    }
  } catch (error) {
    console.error('Error handling Square payment updated:', error)
  }
}

async function handleSquareRefundCreated(refund) {
  try {
    // Find the payment by Square payment ID
    const payment = await Payment.findOne({ squarePaymentId: refund.paymentId })

    if (!payment) {
      console.error(`Payment not found for Square refund: ${refund.id}`)
      return
    }

    // Update payment with refund information
    payment.status = 'refunded'
    payment.refundedAmount = refund.amountMoney.amount / 100 // Convert from cents
    payment.refundReason = refund.reason
    await payment.save()

    console.log(`Payment ${payment._id} marked as refunded`)

    // Send refund notification email
    const user = await User.findById(payment.user)

    if (user) {
      await sendEmail({
        to: user.email,
        subject: 'Payment Refund Notification',
        template: 'payment-refund',
        data: {
          name: user.name,
          amount: payment.refundedAmount,
          currency: payment.currency,
          date: new Date().toLocaleDateString(),
          reason: payment.refundReason,
          companyName: process.env.COMPANY_NAME || 'VAIF TECH',
        },
      })
    }
  } catch (error) {
    console.error('Error handling Square refund created:', error)
  }
}

async function handleSquareSubscriptionCreated(subscription) {
  // Implementation for Square subscription created
  console.log('Square subscription created:', subscription.id)
}

async function handleSquareSubscriptionUpdated(subscription) {
  // Implementation for Square subscription updated
  console.log('Square subscription updated:', subscription.id)
}

export default {
  createStripePaymentIntent,
  createSquarePayment,
  getAllPayments,
  getUserPayments,
  getPaymentById,
  updatePaymentStatus,
  stripeWebhook,
  squareWebhook,
  createInvoice,
  getAllInvoices,
  getUserInvoices,
  getInvoiceById,
  updateInvoiceStatus,
  sendInvoiceByEmail,
}
