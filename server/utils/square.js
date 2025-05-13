import { Client, Environment } from 'square'
import dotenv from 'dotenv'
import crypto from 'crypto'

dotenv.config()

// Initialize Square client
const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment:
    process.env.NODE_ENV === 'production'
      ? Environment.Production
      : Environment.Sandbox,
})

/**
 * Create a payment
 * @param {Object} options - Payment options
 * @param {string} options.sourceId - Payment source ID
 * @param {number} options.amount - Amount in cents
 * @param {string} options.currency - Currency code
 * @param {string} options.locationId - Square location ID
 * @param {string} options.customerId - Square customer ID
 * @param {string} options.note - Payment note
 * @param {Object} options.metadata - Additional metadata
 * @returns {Promise<Object>} - Square payment result
 */
export const createPayment = async (options) => {
  try {
    const {
      sourceId,
      amount,
      currency = 'USD',
      locationId = process.env.SQUARE_LOCATION_ID,
      customerId,
      note,
      metadata = {},
    } = options

    // Convert amount to the smallest currency unit (cents)
    const amountMoney = {
      amount: amount.toString(),
      currency,
    }

    const idempotencyKey = crypto.randomUUID()

    const payment = {
      sourceId,
      amountMoney,
      locationId,
      idempotencyKey,
    }

    if (customerId) {
      payment.customerId = customerId
    }

    if (note) {
      payment.note = note
    }

    // Add metadata as reference ID
    if (Object.keys(metadata).length > 0) {
      payment.referenceId = JSON.stringify(metadata)
    }

    const response = await squareClient.paymentsApi.createPayment(payment)

    return response.result
  } catch (error) {
    console.error('Square payment error:', error)
    throw new Error(`Failed to create payment: ${error.message}`)
  }
}

/**
 * Get payment details
 * @param {string} paymentId - Square payment ID
 * @returns {Promise<Object>} - Square payment details
 */
export const getPayment = async (paymentId) => {
  try {
    const response = await squareClient.paymentsApi.getPayment(paymentId)
    return response.result
  } catch (error) {
    console.error('Square get payment error:', error)
    throw new Error(`Failed to get payment: ${error.message}`)
  }
}

/**
 * Create a customer
 * @param {Object} customerData - Customer data
 * @returns {Promise<Object>} - Square customer
 */
export const createCustomer = async (customerData) => {
  try {
    const {
      givenName,
      familyName,
      emailAddress,
      phoneNumber,
      address = {},
      note,
      referenceId,
    } = customerData

    const idempotencyKey = crypto.randomUUID()

    const response = await squareClient.customersApi.createCustomer({
      givenName,
      familyName,
      emailAddress,
      phoneNumber,
      address,
      note,
      referenceId,
      idempotencyKey,
    })

    return response.result
  } catch (error) {
    console.error('Square create customer error:', error)
    throw new Error(`Failed to create customer: ${error.message}`)
  }
}

/**
 * Create a refund
 * @param {Object} refundData - Refund data
 * @returns {Promise<Object>} - Square refund
 */
export const createRefund = async (refundData) => {
  try {
    const {
      paymentId,
      amount,
      currency = 'USD',
      reason,
      locationId = process.env.SQUARE_LOCATION_ID,
    } = refundData

    const idempotencyKey = crypto.randomUUID()

    // Convert amount to the smallest currency unit (cents)
    const amountMoney = {
      amount: amount.toString(),
      currency,
    }

    const response = await squareClient.refundsApi.refundPayment({
      paymentId,
      amountMoney,
      idempotencyKey,
      reason,
    })

    return response.result
  } catch (error) {
    console.error('Square refund error:', error)
    throw new Error(`Failed to create refund: ${error.message}`)
  }
}

/**
 * Create a subscription
 * @param {Object} subscriptionData - Subscription data
 * @returns {Promise<Object>} - Square subscription
 */
export const createSubscription = async (subscriptionData) => {
  try {
    const {
      locationId = process.env.SQUARE_LOCATION_ID,
      planId,
      customerId,
      startDate,
      cardId,
      timezone = 'America/New_York',
      source,
    } = subscriptionData

    const idempotencyKey = crypto.randomUUID()

    const response = await squareClient.subscriptionsApi.createSubscription({
      locationId,
      planId,
      customerId,
      startDate,
      cardId,
      timezone,
      source,
      idempotencyKey,
    })

    return response.result
  } catch (error) {
    console.error('Square subscription error:', error)
    throw new Error(`Failed to create subscription: ${error.message}`)
  }
}

/**
 * Cancel a subscription
 * @param {string} subscriptionId - Square subscription ID
 * @returns {Promise<Object>} - Canceled Square subscription
 */
export const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await squareClient.subscriptionsApi.cancelSubscription(
      subscriptionId,
    )
    return response.result
  } catch (error) {
    console.error('Square cancel subscription error:', error)
    throw new Error(`Failed to cancel subscription: ${error.message}`)
  }
}

/**
 * Create a catalog item (product)
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} - Square catalog item
 */
export const createCatalogItem = async (productData) => {
  try {
    const {
      name,
      description,
      variations = [],
      categoryId,
      taxIds = [],
      imageIds = [],
    } = productData

    const idempotencyKey = crypto.randomUUID()

    const item = {
      type: 'ITEM',
      id: `#${crypto.randomUUID()}`,
      itemData: {
        name,
        description,
        categoryId,
        taxIds,
        imageIds,
      },
    }

    // Add variations if provided
    if (variations.length > 0) {
      item.itemData.variations = variations.map((variation) => ({
        type: 'ITEM_VARIATION',
        id: `#${crypto.randomUUID()}`,
        itemVariationData: {
          name: variation.name,
          pricingType: 'FIXED_PRICING',
          priceMoney: {
            amount: variation.price.toString(),
            currency: variation.currency || 'USD',
          },
          sku: variation.sku,
        },
      }))
    }

    const response = await squareClient.catalogApi.upsertCatalogObject({
      idempotencyKey,
      object: item,
    })

    return response.result
  } catch (error) {
    console.error('Square create catalog item error:', error)
    throw new Error(`Failed to create catalog item: ${error.message}`)
  }
}

/**
 * Verify webhook signature
 * @param {string} body - Request body
 * @param {string} signature - Square signature header
 * @returns {boolean} - Whether the signature is valid
 */
export const verifyWebhookSignature = (body, signature) => {
  try {
    if (!signature || !process.env.SQUARE_WEBHOOK_SIGNATURE_KEY) {
      return false
    }

    const hmac = crypto.createHmac(
      'sha256',
      process.env.SQUARE_WEBHOOK_SIGNATURE_KEY,
    )
    const generatedSignature = hmac.update(body).digest('base64')

    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(signature),
    )
  } catch (error) {
    console.error('Square webhook verification error:', error)
    return false
  }
}

export default {
  squareClient,
  createPayment,
  getPayment,
  createCustomer,
  createRefund,
  createSubscription,
  cancelSubscription,
  createCatalogItem,
  verifyWebhookSignature,
}
