import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { promisify } from 'util'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Email templates
const TEMPLATES = {
  welcome: {
    subject: 'Welcome to VAIF TECH',
    template: 'welcome.html',
  },
  passwordReset: {
    subject: 'Password Reset',
    template: 'password-reset.html',
  },
  invoice: {
    subject: 'Invoice from VAIF TECH',
    template: 'invoice.html',
  },
  'payment-confirmation': {
    subject: 'Payment Confirmation',
    template: 'payment-confirmation.html',
  },
  'payment-refund': {
    subject: 'Payment Refund',
    template: 'payment-refund.html',
  },
  'meeting-confirmation': {
    subject: 'Meeting Confirmation',
    template: 'meeting-confirmation.html',
  },
  'quote-ready': {
    subject: 'Your Quote is Ready',
    template: 'quote-ready.html',
  },
  'document-ready': {
    subject: 'Your Document is Ready',
    template: 'document-ready.html',
  },
}

/**
 * Create a nodemailer transport
 * @returns {Object} - Nodemailer transport
 */
const createTransport = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

/**
 * Read an email template
 * @param {string} templateName - Template name
 * @returns {Promise<string>} - Template HTML
 */
const readTemplate = async (templateName) => {
  try {
    const templatePath = path.join(
      __dirname,
      '..',
      'templates',
      'emails',
      templateName,
    )
    const readFile = promisify(fs.readFile)
    return await readFile(templatePath, 'utf8')
  } catch (error) {
    console.error(`Error reading email template ${templateName}:`, error)
    // Return a basic template if the file doesn't exist
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>{{title}}</h1>
          </div>
          <div class="content">
            {{content}}
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${
      process.env.COMPANY_NAME || 'VAIF TECH'
    }. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

/**
 * Replace template variables with actual values
 * @param {string} template - Email template
 * @param {Object} data - Template data
 * @returns {string} - Processed template
 */
const processTemplate = (template, data) => {
  let processedTemplate = template

  // Replace all variables in the template
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    processedTemplate = processedTemplate.replace(regex, value)
  })

  // Replace any remaining variables with empty string
  processedTemplate = processedTemplate.replace(/{{[^{}]+}}/g, '')

  return processedTemplate
}

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.template - Template name
 * @param {Object} options.data - Template data
 * @param {Array} options.attachments - Email attachments
 * @returns {Promise<Object>} - Email send result
 */
export const sendEmail = async (options) => {
  try {
    const { to, subject, template, data = {}, attachments = [] } = options

    // Get template info
    const templateInfo = TEMPLATES[template] || {
      subject: subject || 'Message from VAIF TECH',
      template: 'generic.html',
    }

    // Read template
    let html = await readTemplate(templateInfo.template)

    // Process template
    html = processTemplate(html, {
      title: subject || templateInfo.subject,
      ...data,
    })

    // Create transport
    const transport = createTransport()

    // Send email
    const result = await transport.sendMail({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
      to,
      subject: subject || templateInfo.subject,
      html,
      attachments,
    })

    return result
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error(`Failed to send email: ${error.message}`)
  }
}

export default {
  sendEmail,
}
