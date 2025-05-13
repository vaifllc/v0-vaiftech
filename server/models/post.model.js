import mongoose from 'mongoose'
import slugify from 'slugify'

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: [
        200,
        'Post title must have less than or equal to 200 characters',
      ],
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [
        500,
        'Excerpt must have less than or equal to 500 characters',
      ],
    },
    featuredImage: {
      type: String,
    },
    category: {
      type: String,
      required: [true, 'Post category is required'],
      trim: true,
    },
    tags: [String],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post must have an author'],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    publishedAt: {
      type: Date,
    },
    isFeature: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
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

// Indexes
postSchema.index({ slug: 1 })
postSchema.index({ category: 1 })
postSchema.index({ tags: 1 })
postSchema.index({ author: 1 })
postSchema.index({ status: 1 })
postSchema.index({ publishedAt: -1 })
postSchema.index({ isFeature: 1 })
postSchema.index({ title: 'text', content: 'text', excerpt: 'text' })

// Virtual for comments
postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
})

// Document middleware: runs before .save() and .create()
postSchema.pre('save', function (next) {
  // Create slug from title
  this.slug = slugify(this.title, { lower: true })

  // Update timestamps
  this.updatedAt = Date.now()

  // Set published date if status is changed to published
  if (
    this.isModified('status') &&
    this.status === 'published' &&
    !this.publishedAt
  ) {
    this.publishedAt = Date.now()
  }

  // Create excerpt if not provided
  if (!this.excerpt && this.content) {
    // Strip HTML tags and get first 200 characters
    const plainText = this.content.replace(/<[^>]*>/g, '')
    this.excerpt = plainText.substring(0, 197) + '...'
  }

  next()
})

const Post = mongoose.model('Post', postSchema)

export default Post
