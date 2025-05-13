import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { promisify } from 'util'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Generate a PDF invoice
 * @param {Object} invoice - Invoice object
 * @returns {Promise<Buffer>} - PDF buffer
 */
export const generateInvoicePdf = async (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a new PDF document
      const doc = new PDFDocument({ margin: 50 })

      // Buffer to store PDF
      const buffers = []
      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers)
        resolve(pdfData)
      })

      // Set up the PDF
      generateHeader(doc, invoice.companyDetails, 'INVOICE')

      generateCustomerInformation(doc, invoice)
      generateInvoiceTable(doc, invoice)
      generateFooter(doc, invoice)

      // Finalize the PDF
      doc.end()

      // Also save to file system if needed
      const uploadsDir = path.join(__dirname, '..', 'uploads', 'invoices')
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }

      const filePath = path.join(uploadsDir, `${invoice._id}.pdf`)
      doc.pipe(fs.createWriteStream(filePath))
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Generate a PDF quote
 * @param {Object} quote - Quote object
 * @returns {Promise<Buffer>} - PDF buffer
 */
export const generateQuotePdf = async (quote) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a new PDF document
      const doc = new PDFDocument({ margin: 50 })

      // Buffer to store PDF
      const buffers = []
      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers)
        resolve(pdfData)
      })

      // Company details for the quote
      const companyDetails = {
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
        email: process.env.COMPANY_EMAIL || 'info@vaiftech.com',
        website: process.env.COMPANY_WEBSITE || 'https://vaiftech.com',
        logo: process.env.COMPANY_LOGO,
      }

      // Set up the PDF
      generateHeader(doc, companyDetails, 'QUOTE')
      generateClientInformation(doc, quote)
      generateQuoteTable(doc, quote)
      generateQuoteFooter(doc, quote)

      // Finalize the PDF
      doc.end()

      // Also save to file system if needed
      const uploadsDir = path.join(__dirname, '..', 'uploads', 'quotes')
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }

      const filePath = path.join(uploadsDir, `${quote._id}.pdf`)
      doc.pipe(fs.createWriteStream(filePath))
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Generate a PDF document
 * @param {Object} document - Document object
 * @returns {Promise<Buffer>} - PDF buffer
 */
export const generateDocumentPdf = async (document) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a new PDF document
      const doc = new PDFDocument({ margin: 50 })

      // Buffer to store PDF
      const buffers = []
      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers)
        resolve(pdfData)
      })

      // Company details
      const companyDetails = {
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
        email: process.env.COMPANY_EMAIL || 'info@vaiftech.com',
        website: process.env.COMPANY_WEBSITE || 'https://vaiftech.com',
        logo: process.env.COMPANY_LOGO,
      }

      // Set up the PDF
      generateHeader(doc, companyDetails, document.category.toUpperCase())

      // Add document title
      doc
        .fontSize(16)
        .text(document.title, 50, doc.y + 20, { align: 'center' })
        .moveDown(2)

      // Add document content
      doc
        .fontSize(12)
        .text(document.content, {
          align: 'left',
          paragraphGap: 10,
          indent: 0,
          lineGap: 5,
        })
        .moveDown(2)

      // Add footer
      doc
        .fontSize(10)
        .text(
          `Generated on ${new Date().toLocaleDateString()} by ${
            process.env.COMPANY_NAME || 'VAIF TECH'
          }`,
          50,
          doc.page.height - 50,
          { align: 'center', width: 500 },
        )

      // Finalize the PDF
      doc.end()

      // Also save to file system if needed
      const uploadsDir = path.join(__dirname, '..', 'uploads', 'documents')
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }

      const filePath = path.join(uploadsDir, `${document._id}.pdf`)
      doc.pipe(fs.createWriteStream(filePath))
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Generate the header section of the document
 * @param {PDFDocument} doc - PDF document
 * @param {Object} companyDetails - Company details
 * @param {string} documentType - Document type (INVOICE, QUOTE, etc.)
 */
function generateHeader(doc, companyDetails, documentType) {
  // Add logo if available
  if (companyDetails.logo) {
    doc.image(companyDetails.logo, 50, 45, { width: 150 }).moveDown()
  } else {
    doc.fontSize(20).text(companyDetails.name, 50, 45).moveDown()
  }

  // Add company information
  doc.fontSize(10).text(companyDetails.address.line1, 50, doc.y)

  if (companyDetails.address.line2) {
    doc.text(companyDetails.address.line2, 50, doc.y + 15)
  }

  doc
    .text(
      `${companyDetails.address.city}, ${companyDetails.address.state} ${companyDetails.address.postalCode}`,
      50,
      doc.y + 15,
    )
    .text(`${companyDetails.phone} | ${companyDetails.email}`, 50, doc.y + 15)
    .text(`${companyDetails.website}`, 50, doc.y + 15)
    .moveDown()

  // Add document title
  doc.fontSize(20).text(documentType, 50, 160).moveDown()
}

/**
 * Generate the customer information section of the invoice
 * @param {PDFDocument} doc - PDF document
 * @param {Object} invoice - Invoice object
 */
function generateCustomerInformation(doc, invoice) {
  const { billingDetails, invoiceNumber, issueDate, dueDate } = invoice

  doc
    .fontSize(10)
    .text('Bill To:', 50, doc.y)
    .text(billingDetails.name, 50, doc.y + 15)
    .text(billingDetails.address.line1, 50, doc.y + 15)

  if (billingDetails.address.line2) {
    doc.text(billingDetails.address.line2, 50, doc.y + 15)
  }

  doc
    .text(
      `${billingDetails.address.city}, ${billingDetails.address.state} ${billingDetails.address.postalCode}`,
      50,
      doc.y + 15,
    )
    .text(billingDetails.email, 50, doc.y + 15)

  if (billingDetails.phone) {
    doc.text(billingDetails.phone, 50, doc.y + 15)
  }

  doc.moveDown()

  // Invoice details on the right
  const invoiceDetailsX = 400

  doc
    .fontSize(10)
    .text('Invoice Number:', invoiceDetailsX, 200)
    .text(invoiceNumber, invoiceDetailsX + 100, 200)
    .text('Issue Date:', invoiceDetailsX, 215)
    .text(formatDate(issueDate), invoiceDetailsX + 100, 215)
    .text('Due Date:', invoiceDetailsX, 230)
    .text(formatDate(dueDate), invoiceDetailsX + 100, 230)
    .moveDown()

  // Add a separator line
  doc
    .strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(50, doc.y + 10)
    .lineTo(550, doc.y + 10)
    .stroke()
    .moveDown()
}

/**
 * Generate the client information section of the quote
 * @param {PDFDocument} doc - PDF document
 * @param {Object} quote - Quote object
 */
function generateClientInformation(doc, quote) {
  const { client, quoteNumber, issueDate, validUntil } = quote

  doc
    .fontSize(10)
    .text('Quote For:', 50, doc.y)
    .text(client.name, 50, doc.y + 15)

  if (client.company) {
    doc.text(client.company, 50, doc.y + 15)
  }

  if (client.address && client.address.line1) {
    doc.text(client.address.line1, 50, doc.y + 15)

    if (client.address.line2) {
      doc.text(client.address.line2, 50, doc.y + 15)
    }

    doc.text(
      `${client.address.city}, ${client.address.state} ${client.address.postalCode}`,
      50,
      doc.y + 15,
    )
  }

  doc.text(client.email, 50, doc.y + 15)

  if (client.phone) {
    doc.text(client.phone, 50, doc.y + 15)
  }

  doc.moveDown()

  // Quote details on the right
  const quoteDetailsX = 400

  doc
    .fontSize(10)
    .text('Quote Number:', quoteDetailsX, 200)
    .text(quoteNumber, quoteDetailsX + 100, 200)
    .text('Issue Date:', quoteDetailsX, 215)
    .text(formatDate(issueDate), quoteDetailsX + 100, 215)
    .text('Valid Until:', quoteDetailsX, 230)
    .text(formatDate(validUntil), quoteDetailsX + 100, 230)
    .moveDown()

  // Add a separator line
  doc
    .strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(50, doc.y + 10)
    .lineTo(550, doc.y + 10)
    .stroke()
    .moveDown()
}

/**
 * Generate the invoice table with line items
 * @param {PDFDocument} doc - PDF document
 * @param {Object} invoice - Invoice object
 */
function generateInvoiceTable(doc, invoice) {
  const { items, subtotal, taxTotal, discount, currency } = invoice
  const total = subtotal + taxTotal - discount

  // Table headers
  let y = doc.y + 20
  doc
    .fontSize(10)
    .text('Item', 50, y)
    .text('Quantity', 280, y)
    .text('Unit Price', 350, y)
    .text('Amount', 450, y)
    .moveDown()

  // Add a separator line
  doc
    .strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke()
    .moveDown()

  // Table rows
  items.forEach((item) => {
    y = doc.y

    doc.fontSize(10).text(item.description, 50, y, { width: 220 })

    const descriptionHeight = doc.heightOfString(item.description, {
      width: 220,
    })
    const rowHeight = Math.max(20, descriptionHeight)

    doc
      .text(item.quantity.toString(), 280, y)
      .text(formatCurrency(item.unitPrice, currency), 350, y)
      .text(formatCurrency(item.amount, currency), 450, y)

    // Add tax information if applicable
    if (item.taxRate > 0) {
      doc
        .fontSize(8)
        .text(
          `Tax (${item.taxRate}%): ${formatCurrency(item.taxAmount, currency)}`,
          350,
          y + 15,
        )
    }

    doc.moveDown()
  })

  // Add a separator line
  doc
    .strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke()
    .moveDown()

  // Totals
  const totalsX = 450
  y = doc.y + 10

  doc
    .fontSize(10)
    .text('Subtotal:', 350, y)
    .text(formatCurrency(subtotal, currency), totalsX, y)
    .moveDown()

  if (taxTotal > 0) {
    y = doc.y
    doc
      .text('Tax:', 350, y)
      .text(formatCurrency(taxTotal, currency), totalsX, y)
      .moveDown()
  }

  if (discount > 0) {
    y = doc.y
    doc
      .text('Discount:', 350, y)
      .text(`-${formatCurrency(discount, currency)}`, totalsX, y)
      .moveDown()
  }

  // Total
  y = doc.y
  doc
    .fontSize(12)
    .text('Total:', 350, y, { bold: true })
    .text(formatCurrency(total, currency), totalsX, y, { bold: true })
    .moveDown()
}

/**
 * Generate the quote table with line items
 * @param {PDFDocument} doc - PDF document
 * @param {Object} quote - Quote object
 */
function generateQuoteTable(doc, quote) {
  const { items, subtotal, tax, discount, currency, total } = quote

  // Table headers
  let y = doc.y + 20
  doc
    .fontSize(10)
    .text('Item', 50, y)
    .text('Description', 180, y)
    .text('Quantity', 300, y)
    .text('Unit Price', 370, y)
    .text('Amount', 450, y)
    .moveDown()

  // Add a separator line
  doc
    .strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke()
    .moveDown()

  // Table rows
  items.forEach((item) => {
    y = doc.y

    doc.fontSize(10).text(item.name, 50, y, { width: 120 })

    if (item.description) {
      doc.text(item.description, 180, y, { width: 110 })
    }

    const itemTotal = item.quantity * item.unitPrice

    doc
      .text(item.quantity.toString(), 300, y)
      .text(formatCurrency(item.unitPrice, currency), 370, y)
      .text(formatCurrency(itemTotal, currency), 450, y)

    doc.moveDown()
  })

  // Add a separator line
  doc
    .strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke()
    .moveDown()

  // Totals
  const totalsX = 450
  y = doc.y + 10

  doc
    .fontSize(10)
    .text('Subtotal:', 350, y)
    .text(formatCurrency(subtotal, currency), totalsX, y)
    .moveDown()

  if (tax > 0) {
    y = doc.y
    doc
      .text('Tax:', 350, y)
      .text(formatCurrency(tax, currency), totalsX, y)
      .moveDown()
  }

  if (discount > 0) {
    y = doc.y
    doc
      .text('Discount:', 350, y)
      .text(`-${formatCurrency(discount, currency)}`, totalsX, y)
      .moveDown()
  }

  // Total
  y = doc.y
  doc
    .fontSize(12)
    .text('Total:', 350, y, { bold: true })
    .text(formatCurrency(total, currency), totalsX, y, { bold: true })
    .moveDown()
}

/**
 * Generate the footer section of the invoice
 * @param {PDFDocument} doc - PDF document
 * @param {Object} invoice - Invoice object
 */
function generateFooter(doc, invoice) {
  doc
    .fontSize(10)
    .text(
      `Thank you for your business. Please make payment by the due date: ${formatDate(
        invoice.dueDate,
      )}.`,
      50,
      doc.page.height - 50,
      { align: 'center', width: 500 },
    )
}

/**
 * Generate the footer section of the quote
 * @param {PDFDocument} doc - PDF document
 * @param {Object} quote - Quote object
 */
function generateQuoteFooter(doc, quote) {
  // Add notes if available
  if (quote.notes) {
    doc
      .moveDown()
      .fontSize(10)
      .text('Notes:', 50, doc.y, { underline: true })
      .text(quote.notes, 50, doc.y + 15, { width: 500 })
      .moveDown()
  }

  // Add terms if available
  if (quote.terms) {
    doc
      .moveDown()
      .fontSize(10)
      .text('Terms and Conditions:', 50, doc.y, { underline: true })
      .text(quote.terms, 50, doc.y + 15, { width: 500 })
      .moveDown()
  }

  doc
    .fontSize(10)
    .text(
      `This quote is valid until: ${formatDate(
        quote.validUntil,
      )}. To accept this quote, please contact us.`,
      50,
      doc.page.height - 50,
      { align: 'center', width: 500 },
    )
}

/**
 * Format a date as MM/DD/YYYY
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date
 */
function formatDate(date) {
  const d = new Date(date)
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
}

/**
 * Format currency with symbol
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} - Formatted currency
 */
function formatCurrency(amount, currency = 'USD') {
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    AUD: 'A$',
  }

  const symbol = currencySymbols[currency] || '$'
  return `${symbol}${amount.toFixed(2)}`
}

export default {
  generateInvoicePdf,
  generateQuotePdf,
  generateDocumentPdf,
}
