import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import hpp from 'hpp'
import path from 'path'
import { fileURLToPath } from 'url'

// Import routes
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import productRoutes from './routes/product.routes.js'
import quoteRoutes from './routes/quote.routes.js'
import meetingRoutes from './routes/meeting.routes.js'
import documentRoutes from './routes/document.routes.js'
import templateRoutes from './routes/template.routes.js'
import fileRoutes from './routes/file.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import webhookRoutes from './routes/webhook.routes.js'
import portfolioRoutes from './routes/portfolio.routes.js'
import comparisonRoutes from './routes/comparison.routes.js'
import adminRoutes from './routes/admin.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import notificationRoutes from './routes/notification.routes.js'
import postRoutes from './routes/post.routes.js'
import projectMetadataRoutes from './routes/project-metadata.routes.js'

// Import error middleware
import { errorHandler, notFound } from './middleware/error.middleware.js'

// Environment variables
dotenv.config()

// Create Express app
const app = express()

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err))

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Set security HTTP headers
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
})
app.use('/api', limiter)

// Webhook routes need raw body
app.use('/api/webhooks', webhookRoutes)

// Body parser for all other routes
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'price',
      'rating',
      'category',
      'tags',
      'technologies',
      'projectType',
      'status',
    ],
  }),
)

// Enable CORS
app.use(cors())

// Compression
app.use(compression())

// Serve static files
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/quotes', quoteRoutes)
app.use('/api/meetings', meetingRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/templates', templateRoutes)
app.use('/api/files', fileRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/portfolio', portfolioRoutes)
app.use('/api/comparisons', comparisonRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/project-metadata', projectMetadataRoutes)

// API documentation route
app.get('/api-docs', (req, res) => {
  res.json({
    message: 'API documentation will be available here',
  })
})

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date(),
  })
})

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...')
  console.error(err.name, err.message)
  process.exit(1)
})
