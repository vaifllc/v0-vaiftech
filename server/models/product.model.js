import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    salePrice: {
      type: Number,
      min: [0, 'Sale price cannot be negative'],
    },
    onSale: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: [
        'UI Components',
        'Templates',
        'Plugins',
        'Courses',
        'Books',
        'Services',
      ],
    },
    frameworks: [
      {
        type: String,
        enum: [
          'React',
          'Vue',
          'Angular',
          'Next.js',
          'Svelte',
          'Node.js',
          'All',
        ],
      },
    ],
    experienceLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
    },
    features: [
      {
        type: String,
      },
    ],
    technicalSpecs: {
      pages: Number,
      components: Number,
      responsive: Boolean,
      customizable: Boolean,
      supportIncluded: Boolean,
      freeUpdates: Boolean,
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    mainImage: {
      url: {
        type: String,
        required: [true, 'Main image URL is required'],
      },
      alt: {
        type: String,
        default: '',
      },
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    downloadable: {
      type: Boolean,
      default: false,
    },
    downloadUrl: String,
    demoUrl: String,
    license: {
      type: String,
      enum: ['Personal', 'Commercial', 'Extended', 'MIT', 'GPL', 'Custom'],
      default: 'Personal',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    bestSeller: {
      type: Boolean,
      default: false,
    },
    newRelease: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      default: -1, // -1 means unlimited
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

// Create slug from name
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
  }
  next()
})

// Virtual for discounted percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.onSale && this.salePrice && this.price > 0) {
    return Math.round(((this.price - this.salePrice) / this.price) * 100)
  }
  return 0
})

const Product = mongoose.model('Product', productSchema)

export default Product
