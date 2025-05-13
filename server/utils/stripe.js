import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

/**
 * Create a payment intent
 * @param {Object} options - Payment options
 * @param {number} options.amount - Amount in cents
 * @param {string} options.currency - Currency code
 * @param {string} options.description - Payment description
 * @param {Object} options.metadata - Additional metadata
 * @param {Object} options.customer - Customer information
 * @returns {Promise<Object>} - Stripe payment intent
 */
export const createPaymentIntent = async (options) => {
  try {
    const {
      amount,
      currency = 'usd',
      description,
      metadata = {},
      customer,
    } = options

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
      metadata,
      receipt_email: customer?.email,
      shipping: customer?.shipping,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return paymentIntent
  } catch (error) {
    console.error('Stripe payment intent error:', error)
    throw new Error(`Failed to create payment intent: ${error.message}`)
  }
}

/**
 * Retrieve a payment intent
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @returns {Promise<Object>} - Stripe payment intent
 */
export const retrievePaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return paymentIntent
  } catch (error) {
    console.error('Stripe retrieve payment intent error:', error)
    throw new Error(`Failed to retrieve payment intent: ${error.message}`)
  }
}

/**
 * Create a customer
 * @param {Object} customerData - Customer data
 * @returns {Promise<Object>} - Stripe customer
 */
export const createCustomer = async (customerData) => {
  try {
    const { email, name, phone, metadata = {} } = customerData

    const customer = await stripe.customers.create({
      email,
      name,
      phone,
      metadata,
    })

    return customer
  } catch (error) {
    console.error('Stripe create customer error:', error)
    throw new Error(`Failed to create customer: ${error.message}`)
  }
}

/**
 * Create a subscription
 * @param {Object} options - Subscription options
 * @param {string} options.customerId - Stripe customer ID
 * @param {string} options.priceId - Stripe price ID
 * @param {Object} options.metadata - Additional metadata
 * @returns {Promise<Object>} - Stripe subscription
 */
export const createSubscription = async (options) => {
  try {
    const { customerId, priceId, metadata = {} } = options

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata,
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    })

    return subscription
  } catch (error) {
    console.error('Stripe create subscription error:', error)
    throw new Error(`Failed to create subscription: ${error.message}`)
  }
}

/**
 * Cancel a subscription
 * @param {string} subscriptionId - Stripe subscription ID
 * @returns {Promise<Object>} - Canceled Stripe subscription
 */
export const cancelSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Stripe cancel subscription error:', error)
    throw new Error(`Failed to cancel subscription: ${error.message}`)
  }
}

/**
 * Create a product
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} - Stripe product
 */
export const createProduct = async (productData) => {
  try {
    const { name, description, images = [], metadata = {} } = productData

    const product = await stripe.products.create({
      name,
      description,
      images,
      metadata,
    })

    return product
  } catch (error) {
    console.error('Stripe create product error:', error)
    throw new Error(`Failed to create product: ${error.message}`)
  }
}

/**
 * Create a price
 * @param {Object} priceData - Price data
 * @returns {Promise<Object>} - Stripe price
 */
export const createPrice = async (priceData) => {
  try {
    const {
      productId,
      unitAmount,
      currency = 'usd',
      recurring = null,
      metadata = {},
    } = priceData

    const price = await stripe.prices.create({
      product: productId,
      unit_amount: unitAmount,
      currency,
      recurring,
      metadata,
    })

    return price
  } catch (error) {
    console.error('Stripe create price error:', error)
    throw new Error(`Failed to create price: ${error.message}`)
  }
}

/**
 * Create an invoice
 * @param {Object} invoiceData - Invoice data
 * @returns {Promise<Object>} - Stripe invoice
 */
export const createInvoice = async (invoiceData) => {
  try {
    const {
      customerId,
      description,
      metadata = {},
      autoAdvance = true,
      collectionMethod = 'charge_automatically',
      daysUntilDue = 30,
    } = invoiceData

    const invoice = await stripe.invoices.create({
      customer: customerId,
      description,
      metadata,
      auto_advance: autoAdvance,
      collection_method: collectionMethod,
      days_until_due: daysUntilDue,
    })

    return invoice
  } catch (error) {
    console.error('Stripe create invoice error:', error)
    throw new Error(`Failed to create invoice: ${error.message}`)
  }
}

/**
 * Create a refund
 * @param {Object} refundData - Refund data
 * @returns {Promise<Object>} - Stripe refund
 */
export const createRefund = async (refundData) => {
  try {
    const {
      paymentIntentId,
      amount,
      reason = 'requested_by_customer',
      metadata = {},
    } = refundData

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount,
      reason,
      metadata,
    })

    return refund
  } catch (error) {
    console.error('Stripe create refund error:', error)
    throw new Error(`Failed to create refund: ${error.message}`)
  }
}

/**
 * Create a webhook event
 * @param {string} payload - Webhook payload
 * @param {string} signature - Webhook signature
 * @returns {Object} - Stripe event
 */
export const constructWebhookEvent = (payload, signature) => {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    )
    return event
  } catch (error) {
    console.error('Stripe webhook error:', error)
    throw new Error(`Webhook Error: ${error.message}`)
  }
}

export default {
  stripe,
  createPaymentIntent,
  retrievePaymentIntent,
  createCustomer,
  createSubscription,
  cancelSubscription,
  createProduct,
  createPrice,
  createInvoice,
  createRefund,
  constructWebhookEvent,
}
