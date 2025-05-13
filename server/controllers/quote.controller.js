import Quote from '../models/quote.model.js'
import Meeting from '../models/meeting.model.js'
import { catchAsync } from '../utils/error.js'
import { AppError } from '../utils/error.js'
import { generateQuotePdf } from '../utils/pdf.js'
import { sendEmail } from '../utils/email.js'
import quoteAiService from '../services/quote-ai.service.js'
import notificationService from '../services/notification.service.js'
import {
  ProjectType,
  ProjectCategory,
  Industry,
  Feature,
  Technology,
  Timeline,
} from '../models/project-metadata.model.js'

// Get all quotes
export const getAllQuotes = catchAsync(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const skip = (page - 1) * limit

  // Build query
  const queryObj = { ...req.query }
  const excludedFields = ['page', 'sort', 'limit', 'fields']
  excludedFields.forEach((el) => delete queryObj[el])

  // Filter by user
  queryObj.user = req.user.id

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj)
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

  let query = Quote.find(JSON.parse(queryStr))

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ')
    query = query.select(fields)
  } else {
    query = query.select('-__v')
  }

  // Execute query with pagination
  const quotes = await query.skip(skip).limit(limit)

  // Get total count for pagination
  const total = await Quote.countDocuments(JSON.parse(queryStr))

  res.status(200).json({
    status: 'success',
    results: quotes.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: {
      quotes,
    },
  })
})

// Get quote by ID
export const getQuoteById = catchAsync(async (req, res, next) => {
  const quote = await Quote.findById(req.params.id).populate('meetings')

  if (!quote) {
    return next(new AppError('No quote found with that ID', 404))
  }

  // Check if user is authorized to view this quote
  if (quote.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to view this quote', 403),
    )
  }

  res.status(200).json({
    status: 'success',
    data: {
      quote,
    },
  })
})

// Create a new quote
export const createQuote = catchAsync(async (req, res, next) => {
  // Add user ID to request body
  req.body.user = req.user.id

  // Validate required fields
  if (!req.body.client || !req.body.client.name || !req.body.client.email) {
    return next(new AppError('Client name and email are required', 400))
  }

  if (
    !req.body.projectDetails ||
    !req.body.projectDetails.title ||
    !req.body.projectDetails.description
  ) {
    return next(new AppError('Project title and description are required', 400))
  }

  // Create quote
  const newQuote = await Quote.create(req.body)

  // Generate PDF
  const pdfBuffer = await generateQuotePdf(newQuote)

  // Save PDF URL
  newQuote.pdfUrl = `/uploads/quotes/${newQuote._id}.pdf`
  await newQuote.save()

  res.status(201).json({
    status: 'success',
    data: {
      quote: newQuote,
    },
  })
})

// Update a quote
export const updateQuote = catchAsync(async (req, res, next) => {
  const quote = await Quote.findById(req.params.id)

  if (!quote) {
    return next(new AppError('No quote found with that ID', 404))
  }

  // Check if user is authorized to update this quote
  if (quote.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to update this quote', 403),
    )
  }

  // Check if quote can be updated
  if (['accepted', 'declined', 'expired'].includes(quote.status)) {
    return next(
      new AppError(
        `Quote cannot be updated because it is ${quote.status}`,
        400,
      ),
    )
  }

  // Update quote
  const updatedQuote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  // Regenerate PDF if needed
  if (req.body.regeneratePdf) {
    const pdfBuffer = await generateQuotePdf(updatedQuote)
    updatedQuote.pdfUrl = `/uploads/quotes/${updatedQuote._id}.pdf`
    await updatedQuote.save()
  }

  res.status(200).json({
    status: 'success',
    data: {
      quote: updatedQuote,
    },
  })
})

// Delete a quote
export const deleteQuote = catchAsync(async (req, res, next) => {
  const quote = await Quote.findById(req.params.id)

  if (!quote) {
    return next(new AppError('No quote found with that ID', 404))
  }

  // Check if user is authorized to delete this quote
  if (quote.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to delete this quote', 403),
    )
  }

  await Quote.findByIdAndDelete(req.params.id)

  res.status(204).json({
    status: 'success',
    data: null,
  })
})

// Send a quote to client
export const sendQuote = catchAsync(async (req, res, next) => {
  const quote = await Quote.findById(req.params.id)

  if (!quote) {
    return next(new AppError('No quote found with that ID', 404))
  }

  // Check if user is authorized to send this quote
  if (quote.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to send this quote', 403),
    )
  }

  // Check if quote can be sent
  if (['sent', 'accepted', 'declined', 'expired'].includes(quote.status)) {
    return next(
      new AppError(`Quote cannot be sent because it is ${quote.status}`, 400),
    )
  }

  // Update quote status
  quote.status = 'sent'
  await quote.save()

  // Send email to client
  await sendEmail({
    to: quote.client.email,
    subject: `Quote ${quote.quoteNumber} from ${process.env.COMPANY_NAME}`,
    template: 'quote-new',
    data: {
      clientName: quote.client.name,
      quoteNumber: quote.quoteNumber,
      projectTitle: quote.projectDetails.title,
      quoteTotal: quote.total,
      currency: quote.currency,
      validUntil: new Date(quote.validUntil).toLocaleDateString(),
      quoteLink: `${process.env.FRONTEND_URL}/quotes/view/${quote._id}`,
      companyName: process.env.COMPANY_NAME || 'VAIF TECH',
      year: new Date().getFullYear(),
    },
    attachments: [
      {
        filename: `Quote_${quote.quoteNumber}.pdf`,
        path: `./uploads/quotes/${quote._id}.pdf`,
      },
    ],
  })

  res.status(200).json({
    status: 'success',
    message: `Quote sent to ${quote.client.email}`,
    data: {
      quote,
    },
  })
})

// Accept a quote
export const acceptQuote = catchAsync(async (req, res, next) => {
  const quote = await Quote.findById(req.params.id)

  if (!quote) {
    return next(new AppError('No quote found with that ID', 404))
  }

  // Check if quote can be accepted
  if (quote.status !== 'sent' && quote.status !== 'viewed') {
    return next(
      new AppError(
        `Quote cannot be accepted because it is ${quote.status}`,
        400,
      ),
    )
  }

  // Check if quote is expired
  if (new Date(quote.validUntil) < new Date()) {
    return next(new AppError('Quote has expired', 400))
  }

  // Update quote status
  quote.status = 'accepted'
  quote.acceptedAt = Date.now()
  await quote.save()

  // Send notification to quote owner
  await notificationService.createNotification({
    userId: quote.user,
    title: 'Quote Accepted',
    message: `Your quote ${quote.quoteNumber} has been accepted by ${quote.client.name}`,
    type: 'success',
    category: 'quote',
    relatedTo: {
      model: 'Quote',
      id: quote._id,
    },
    link: `/quotes/${quote._id}`,
    sendEmail: true,
  })

  res.status(200).json({
    status: 'success',
    message: 'Quote accepted successfully',
    data: {
      quote,
    },
  })
})

// Decline a quote
export const declineQuote = catchAsync(async (req, res, next) => {
  const quote = await Quote.findById(req.params.id)

  if (!quote) {
    return next(new AppError('No quote found with that ID', 404))
  }

  // Check if quote can be declined
  if (quote.status !== 'sent' && quote.status !== 'viewed') {
    return next(
      new AppError(
        `Quote cannot be declined because it is ${quote.status}`,
        400,
      ),
    )
  }

  // Update quote status
  quote.status = 'declined'
  quote.declinedAt = Date.now()
  quote.declineReason = req.body.reason || 'No reason provided'
  await quote.save()

  // Send notification to quote owner
  await notificationService.createNotification({
    userId: quote.user,
    title: 'Quote Declined',
    message: `Your quote ${quote.quoteNumber} has been declined by ${quote.client.name}`,
    type: 'error',
    category: 'quote',
    relatedTo: {
      model: 'Quote',
      id: quote._id,
    },
    link: `/quotes/${quote._id}`,
    sendEmail: true,
  })

  res.status(200).json({
    status: 'success',
    message: 'Quote declined successfully',
    data: {
      quote,
    },
  })
})

// Mark quote as viewed
export const markAsViewed = catchAsync(async (req, res, next) => {
  const quote = await Quote.findById(req.params.id)

  if (!quote) {
    return next(new AppError('No quote found with that ID', 404))
  }

  // Check if quote can be marked as viewed
  if (quote.status !== 'sent') {
    return next(
      new AppError(
        `Quote cannot be marked as viewed because it is ${quote.status}`,
        400,
      ),
    )
  }

  // Update quote status
  quote.status = 'viewed'
  await quote.save()

  // Send notification to quote owner
  await notificationService.createNotification({
    userId: quote.user,
    title: 'Quote Viewed',
    message: `Your quote ${quote.quoteNumber} has been viewed by ${quote.client.name}`,
    type: 'info',
    category: 'quote',
    relatedTo: {
      model: 'Quote',
      id: quote._id,
    },
    link: `/quotes/${quote._id}`,
  })

  res.status(200).json({
    status: 'success',
    message: 'Quote marked as viewed',
    data: {
      quote,
    },
  })
})

// Schedule a meeting for a quote
export const scheduleMeeting = catchAsync(async (req, res, next) => {
  const quote = await Quote.findById(req.params.id)

  if (!quote) {
    return next(new AppError('No quote found with that ID', 404))
  }

  // Check if user is authorized to schedule a meeting for this quote
  if (quote.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new AppError(
        'You do not have permission to schedule a meeting for this quote',
        403,
      ),
    )
  }

  // Create meeting
  const meeting = await Meeting.create({
    title: req.body.title || `Discussion about Quote ${quote.quoteNumber}`,
    description:
      req.body.description ||
      `Meeting to discuss the quote for ${quote.projectDetails.title}`,
    startTime: new Date(req.body.startTime),
    endTime: new Date(req.body.endTime),
    location: req.body.location,
    meetingLink: req.body.meetingLink,
    user: req.user.id,
    attendees: [
      {
        name: quote.client.name,
        email: quote.client.email,
        role: 'client',
      },
      ...(req.body.additionalAttendees || []),
    ],
    relatedTo: {
      model: 'Quote',
      id: quote._id,
    },
  })

  // Add meeting to quote
  quote.meetings.push(meeting._id)
  await quote.save()

  // Send meeting invitation to client
  await sendEmail({
    to: quote.client.email,
    subject: `Meeting Invitation: ${meeting.title}`,
    template: 'meeting-invitation',
    data: {
      clientName: quote.client.name,
      quoteNumber: quote.quoteNumber,
      meetingTitle: meeting.title,
      meetingDate: new Date(meeting.startTime).toLocaleDateString(),
      meetingTime: `${new Date(
        meeting.startTime,
      ).toLocaleTimeString()} - ${new Date(
        meeting.endTime,
      ).toLocaleTimeString()}`,
      meetingLocation:
        meeting.location || meeting.meetingLink || 'To be determined',
      meetingDescription: meeting.description,
      companyName: process.env.COMPANY_NAME || 'VAIF TECH',
      year: new Date().getFullYear(),
    },
  })

  res.status(201).json({
    status: 'success',
    data: {
      meeting,
    },
  })
})

// Analyze project description with AI
export const analyzeProjectDescription = catchAsync(async (req, res, next) => {
  const { description, clientBudget, timeline, industry } = req.body

  if (!description) {
    return next(new AppError('Project description is required', 400))
  }

  // Analyze project description
  const analysis = await quoteAiService.analyzeProjectDescription({
    description,
    clientBudget,
    timeline,
    industry,
  })

  res.status(200).json({
    status: 'success',
    data: {
      analysis,
    },
  })
})

// Estimate project cost
export const estimateProjectCost = catchAsync(async (req, res, next) => {
  const {
    projectTypeCode,
    projectCategoryCode,
    industryCode,
    featureCodes,
    technologyCodes,
    timelineCode,
    customDescription,
  } = req.body

  // Estimate project cost
  const estimate = await quoteAiService.estimateProjectCost({
    projectTypeCode,
    projectCategoryCode,
    industryCode,
    featureCodes,
    technologyCodes,
    timelineCode,
    customDescription,
  })

  res.status(200).json({
    status: 'success',
    data: {
      estimate,
    },
  })
})

// Generate quote from estimate
export const generateQuoteFromEstimate = catchAsync(async (req, res, next) => {
  const { client, projectDetails, estimate, notes, terms } = req.body

  if (!client || !client.name || !client.email) {
    return next(new AppError('Client name and email are required', 400))
  }

  if (!projectDetails || !projectDetails.title || !projectDetails.description) {
    return next(new AppError('Project title and description are required', 400))
  }

  if (!estimate || !estimate.baseEstimate) {
    return next(new AppError('Estimate is required', 400))
  }

  // Fetch project type, category, industry, features, technologies, and timeline
  const [
    projectType,
    projectCategory,
    industry,
    features,
    technologies,
    timeline,
  ] = await Promise.all([
    projectDetails.type && projectDetails.type.code
      ? ProjectType.findOne({ code: projectDetails.type.code, active: true })
      : null,
    projectDetails.category && projectDetails.category.code
      ? ProjectCategory.findOne({
          code: projectDetails.category.code,
          active: true,
        })
      : null,
    projectDetails.industry && projectDetails.industry.code
      ? Industry.findOne({ code: projectDetails.industry.code, active: true })
      : null,
    projectDetails.features && projectDetails.features.length
      ? Feature.find({
          code: { $in: projectDetails.features.map((f) => f.code) },
          active: true,
        })
      : [],
    projectDetails.technologies && projectDetails.technologies.length
      ? Technology.find({
          code: { $in: projectDetails.technologies.map((t) => t.code) },
          active: true,
        })
      : [],
    projectDetails.timeline && projectDetails.timeline.code
      ? Timeline.findOne({ code: projectDetails.timeline.code, active: true })
      : null,
  ])

  // Prepare quote data
  const quoteData = {
    user: req.user.id,
    client,
    projectDetails: {
      title: projectDetails.title,
      description: projectDetails.description,
      type: projectType
        ? {
            code: projectType.code,
            name: projectType.name,
          }
        : undefined,
      category: projectCategory
        ? {
            code: projectCategory.code,
            name: projectCategory.name,
          }
        : undefined,
      industry: industry
        ? {
            code: industry.code,
            name: industry.name,
          }
        : undefined,
      timeline: timeline
        ? {
            code: timeline.code,
            name: timeline.name,
            durationInWeeks: timeline.durationInWeeks,
          }
        : undefined,
      complexity: projectDetails.complexity || 'medium',
      features: features.map((feature) => ({
        code: feature.code,
        name: feature.name,
        description: feature.description,
        price: feature.basePrice,
      })),
      technologies: technologies.map((tech) => ({
        code: tech.code,
        name: tech.name,
        category: tech.category,
      })),
      aiAnalysis: projectDetails.aiAnalysis,
    },
    items: [
      {
        name: `${projectDetails.title} - Base Project`,
        description: `Base cost for ${
          projectType ? projectType.name : 'project'
        } development`,
        quantity: 1,
        unitPrice: estimate.breakdown.baseCost || estimate.baseEstimate * 0.7,
      },
    ],
    subtotal: estimate.baseEstimate,
    tax: 0, // Can be calculated based on client location if needed
    discount: 0, // Can be applied if needed
    total: estimate.baseEstimate,
    currency: 'USD', // Can be customized if needed
    estimateRange: {
      min: estimate.minEstimate,
      max: estimate.maxEstimate,
    },
    notes: notes || '',
    terms: terms || 'This quote is valid for 30 days from the issue date.',
    status: 'draft',
    issueDate: new Date(),
    validUntil: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days from now
  }

  // Add feature items if available
  if (features.length > 0) {
    features.forEach((feature) => {
      quoteData.items.push({
        name: feature.name,
        description: feature.description,
        quantity: 1,
        unitPrice: feature.basePrice,
      })
    })
  }

  // Create quote
  const newQuote = await Quote.create(quoteData)

  // Generate PDF
  const pdfBuffer = await generateQuotePdf(newQuote)

  // Save PDF URL
  newQuote.pdfUrl = `/uploads/quotes/${newQuote._id}.pdf`
  await newQuote.save()

  res.status(201).json({
    status: 'success',
    data: {
      quote: newQuote,
    },
  })
})

export default {
  getAllQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
  sendQuote,
  acceptQuote,
  declineQuote,
  markAsViewed,
  scheduleMeeting,
  analyzeProjectDescription,
  estimateProjectCost,
  generateQuoteFromEstimate,
}
