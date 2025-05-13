import mongoose from 'mongoose'

// Project Type Schema
const projectTypeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    complexity: {
      type: String,
      enum: ['low', 'medium', 'high', 'very-high'],
      default: 'medium',
    },
    estimatedHours: {
      type: {
        min: Number,
        max: Number,
      },
      required: true,
    },
    features: [
      {
        name: String,
        description: String,
        included: Boolean,
        additionalPrice: Number,
      },
    ],
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Project Category Schema
const projectCategorySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    priceMultiplier: {
      type: Number,
      default: 1.0,
    },
    compatibleTypes: [
      {
        type: String,
        ref: 'ProjectType',
        validate: {
          validator: async function (typeCode) {
            const count = await mongoose
              .model('ProjectType')
              .countDocuments({ code: typeCode })
            return count > 0
          },
          message: (props) => `${props.value} is not a valid project type code`,
        },
      },
    ],
    industrySpecific: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Industry Schema
const industrySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    priceMultiplier: {
      type: Number,
      default: 1.0,
    },
    complexityLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'very-high'],
      default: 'medium',
    },
    regulatoryRequirements: [
      {
        name: String,
        description: String,
        additionalPrice: Number,
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Feature Schema
const featureSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    estimatedHours: {
      type: {
        min: Number,
        max: Number,
      },
      required: true,
    },
    complexity: {
      type: String,
      enum: ['low', 'medium', 'high', 'very-high'],
      default: 'medium',
    },
    compatibleTypes: [
      {
        type: String,
        ref: 'ProjectType',
      },
    ],
    dependencies: [
      {
        type: String,
        ref: 'Feature',
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Technology Schema
const technologySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      enum: [
        'frontend',
        'backend',
        'database',
        'mobile',
        'devops',
        'cms',
        'ecommerce',
        'other',
      ],
      required: true,
    },
    priceImpact: {
      type: Number, // Can be positive or negative
      default: 0,
    },
    expertise: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Timeline Schema
const timelineSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    durationInWeeks: {
      type: Number,
      required: true,
    },
    priceMultiplier: {
      type: Number,
      default: 1.0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Create models
const ProjectType = mongoose.model('ProjectType', projectTypeSchema)
const ProjectCategory = mongoose.model('ProjectCategory', projectCategorySchema)
const Industry = mongoose.model('Industry', industrySchema)
const Feature = mongoose.model('Feature', featureSchema)
const Technology = mongoose.model('Technology', technologySchema)
const Timeline = mongoose.model('Timeline', timelineSchema)

export { ProjectType, ProjectCategory, Industry, Feature, Technology, Timeline }
