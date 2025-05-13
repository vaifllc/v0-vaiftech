import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Comment must belong to a post'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment must belong to a user'],
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    likeCount: {
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
commentSchema.index({ post: 1, createdAt: -1 })
commentSchema.index({ user: 1 })
commentSchema.index({ parentComment: 1 })
commentSchema.index({ status: 1 })

// Virtual for replies
commentSchema.virtual('replies', {
  ref: 'Comment',
  foreignField: 'parentComment',
  localField: '_id',
})

// Document middleware: runs before .save() and .create()
commentSchema.pre('save', function (next) {
  // Update timestamps
  this.updatedAt = Date.now()

  next()
})

// Static method to update comment count on post
commentSchema.statics.calcCommentCount = async function (postId) {
  const stats = await this.aggregate([
    {
      $match: { post: postId, status: 'approved' },
    },
    {
      $group: {
        _id: '$post',
        count: { $sum: 1 },
      },
    },
  ])

  if (stats.length > 0) {
    await mongoose.model('Post').findByIdAndUpdate(postId, {
      commentCount: stats[0].count,
    })
  } else {
    await mongoose.model('Post').findByIdAndUpdate(postId, {
      commentCount: 0,
    })
  }
}

// Call calcCommentCount after save
commentSchema.post('save', function () {
  this.constructor.calcCommentCount(this.post)
})

// Call calcCommentCount after findOneAndUpdate
commentSchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    await doc.constructor.calcCommentCount(doc.post)
  }
})

// Call calcCommentCount after findOneAndDelete
commentSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calcCommentCount(doc.post)
  }
})

const Comment = mongoose.model('Comment', commentSchema)

export default Comment
