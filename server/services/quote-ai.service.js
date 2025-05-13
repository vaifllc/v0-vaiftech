import OpenAI from 'openai'
import { AppError } from '../utils/error.js'
import {
  ProjectType,
  ProjectCategory,
  Industry,
  Feature,
  Technology,
  Timeline,
} from '../models/project-metadata.model.js'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Analyze project description and recommend project type, category, and features
 * @param {Object} options - Options for analysis
 * @param {string} options.description - Project description
 * @param {string} options.clientBudget - Client's budget (optional)
 * @param {string} options.timeline - Desired timeline (optional)
 * @param {string} options.industry - Client's industry (optional)
 * @returns {Promise<Object>} - Analysis results with recommendations
 */
export const analyzeProjectDescription = async (options) => {
  const { description, clientBudget, timeline, industry } = options

  if (!description) {
    throw new AppError('Project description is required for analysis', 400)
  }

  try {
    // Fetch all active project types, categories, and features for context
    const [projectTypes, projectCategories, industries, features] =
      await Promise.all([
        ProjectType.find({ active: true }).lean(),
        ProjectCategory.find({ active: true }).lean(),
        Industry.find({ active: true }).lean(),
        Feature.find({ active: true }).lean(),
      ])

    // Prepare context for AI
    const context = {
      projectTypes: projectTypes.map((type) => ({
        code: type.code,
        name: type.name,
        description: type.description,
        basePrice: type.basePrice,
        complexity: type.complexity,
      })),
      projectCategories: projectCategories.map((category) => ({
        code: category.code,
        name: category.name,
        description: category.description,
      })),
      industries: industries.map((ind) => ({
        code: ind.code,
        name: ind.name,
        description: ind.description,
      })),
      features: features.map((feature) => ({
        code: feature.code,
        name: feature.name,
        description: feature.description,
      })),
    }

    // Generate analysis using OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert project analyzer and cost estimator for web and mobile development projects.
          Your task is to analyze the project description and recommend the most suitable project type, category, industry, and features.
          You will be provided with a list of available project types, categories, industries, and features to choose from.
          Return a JSON object with your recommendations and reasoning.`,
        },
        {
          role: 'user',
          content: `Analyze the following project description and provide recommendations:

          Project Description: ${description}
          ${clientBudget ? `Client Budget: ${clientBudget}` : ''}
          ${timeline ? `Desired Timeline: ${timeline}` : ''}
          ${industry ? `Client Industry: ${industry}` : ''}

          Available Project Types:
          ${JSON.stringify(context.projectTypes, null, 2)}

          Available Project Categories:
          ${JSON.stringify(context.projectCategories, null, 2)}

          Available Industries:
          ${JSON.stringify(context.industries, null, 2)}

          Available Features:
          ${JSON.stringify(context.features, null, 2)}

          Return a JSON object with the following structure:
          {
            "recommendedType": { "code": "TYPE_CODE", "reasoning": "Explanation for this recommendation" },
            "recommendedCategory": { "code": "CATEGORY_CODE", "reasoning": "Explanation for this recommendation" },
            "recommendedIndustry": { "code": "INDUSTRY_CODE", "reasoning": "Explanation for this recommendation" },
            "recommendedFeatures": [
              { "code": "FEATURE_CODE", "reasoning": "Explanation for this recommendation" }
            ],
            "estimatedComplexity": "low|medium|high|very-high",
            "estimatedTimelineInWeeks": number,
            "estimatedBudgetRange": { "min": number, "max": number },
            "additionalNotes": "Any additional insights or recommendations"
          }`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    })

    // Parse and return the analysis results
    return JSON.parse(response.choices[0].message.content)
  } catch (error) {
    console.error('Error analyzing project description:', error)

    // Fallback to basic analysis if AI fails
    return fallbackProjectAnalysis(options)
  }
}

/**
 * Estimate project cost based on selected parameters
 * @param {Object} options - Options for estimation
 * @param {string} options.projectTypeCode - Project type code
 * @param {string} options.projectCategoryCode - Project category code
 * @param {string} options.industryCode - Industry code
 * @param {Array} options.featureCodes - Feature codes
 * @param {Array} options.technologyCodes - Technology codes
 * @param {string} options.timelineCode - Timeline code
 * @param {string} options.customDescription - Custom project description
 * @returns {Promise<Object>} - Cost estimation results
 */
export const estimateProjectCost = async (options) => {
  const {
    projectTypeCode,
    projectCategoryCode,
    industryCode,
    featureCodes = [],
    technologyCodes = [],
    timelineCode,
    customDescription,
  } = options

  try {
    // Fetch selected project type, category, industry, features, technologies, and timeline
    const [
      projectType,
      projectCategory,
      industry,
      features,
      technologies,
      timeline,
    ] = await Promise.all([
      projectTypeCode
        ? ProjectType.findOne({ code: projectTypeCode, active: true })
        : null,
      projectCategoryCode
        ? ProjectCategory.findOne({ code: projectCategoryCode, active: true })
        : null,
      industryCode
        ? Industry.findOne({ code: industryCode, active: true })
        : null,
      featureCodes.length
        ? Feature.find({ code: { $in: featureCodes }, active: true })
        : [],
      technologyCodes.length
        ? Technology.find({ code: { $in: technologyCodes }, active: true })
        : [],
      timelineCode
        ? Timeline.findOne({ code: timelineCode, active: true })
        : null,
    ])

    // Calculate base cost
    let baseCost = projectType ? projectType.basePrice : 5000 // Default base price if no project type

    // Apply category multiplier
    if (projectCategory) {
      baseCost *= projectCategory.priceMultiplier
    }

    // Apply industry multiplier
    if (industry) {
      baseCost *= industry.priceMultiplier
    }

    // Add feature costs
    const featureCost = features.reduce(
      (total, feature) => total + feature.basePrice,
      0,
    )

    // Apply technology price impacts
    const technologyImpact = technologies.reduce(
      (total, tech) => total + tech.priceImpact,
      0,
    )

    // Apply timeline multiplier
    const timelineMultiplier = timeline ? timeline.priceMultiplier : 1.0

    // Calculate subtotal
    let subtotal =
      (baseCost + featureCost + technologyImpact) * timelineMultiplier

    // Calculate min and max range (±15%)
    const minCost = Math.round(subtotal * 0.85)
    const maxCost = Math.round(subtotal * 1.15)

    // If custom description is provided, use AI to refine the estimate
    if (customDescription && process.env.OPENAI_API_KEY) {
      try {
        const refinedEstimate = await refineEstimateWithAI({
          customDescription,
          baseEstimate: subtotal,
          projectType: projectType ? projectType.name : null,
          projectCategory: projectCategory ? projectCategory.name : null,
          industry: industry ? industry.name : null,
          features: features.map((f) => f.name),
          technologies: technologies.map((t) => t.name),
          timeline: timeline ? timeline.name : null,
        })

        // Update the estimate with AI refinement
        subtotal = refinedEstimate.adjustedEstimate

        return {
          baseEstimate: Math.round(subtotal),
          minEstimate: Math.round(refinedEstimate.minEstimate),
          maxEstimate: Math.round(refinedEstimate.maxEstimate),
          breakdown: {
            baseCost,
            featureCost,
            technologyImpact,
            timelineMultiplier,
            aiAdjustment: refinedEstimate.aiAdjustmentFactor,
          },
          reasoning: refinedEstimate.reasoning,
          confidence: refinedEstimate.confidence,
        }
      } catch (aiError) {
        console.error('Error refining estimate with AI:', aiError)
        // Fall back to standard calculation if AI fails
      }
    }

    // Return standard calculation if no custom description or AI fails
    return {
      baseEstimate: Math.round(subtotal),
      minEstimate: minCost,
      maxEstimate: maxCost,
      breakdown: {
        baseCost,
        featureCost,
        technologyImpact,
        timelineMultiplier,
      },
    }
  } catch (error) {
    console.error('Error estimating project cost:', error)
    throw new AppError('Failed to estimate project cost', 500)
  }
}

/**
 * Refine cost estimate using AI based on custom description
 * @param {Object} options - Options for refinement
 * @param {string} options.customDescription - Custom project description
 * @param {number} options.baseEstimate - Base cost estimate
 * @param {string} options.projectType - Project type name
 * @param {string} options.projectCategory - Project category name
 * @param {string} options.industry - Industry name
 * @param {Array} options.features - Feature names
 * @param {Array} options.technologies - Technology names
 * @param {string} options.timeline - Timeline name
 * @returns {Promise<Object>} - Refined cost estimation
 */
const refineEstimateWithAI = async (options) => {
  const {
    customDescription,
    baseEstimate,
    projectType,
    projectCategory,
    industry,
    features,
    technologies,
    timeline,
  } = options

  try {
    // Generate refined estimate using OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert project cost estimator for web and mobile development projects.
          Your task is to refine a base cost estimate based on a custom project description and selected parameters.
          You will analyze the description for complexity, scope, and special requirements that might affect the cost.
          Return a JSON object with your refined estimate and reasoning.`,
        },
        {
          role: 'user',
          content: `Refine the following project cost estimate based on the custom description:

          Custom Description: ${customDescription}
          Base Estimate: $${baseEstimate}
          Project Type: ${projectType || 'Not specified'}
          Project Category: ${projectCategory || 'Not specified'}
          Industry: ${industry || 'Not specified'}
          Features: ${features.length ? features.join(', ') : 'None specified'}
          Technologies: ${
            technologies.length ? technologies.join(', ') : 'None specified'
          }
          Timeline: ${timeline || 'Not specified'}

          Return a JSON object with the following structure:
          {
            "adjustedEstimate": number,
            "minEstimate": number,
            "maxEstimate": number,
            "aiAdjustmentFactor": number,
            "reasoning": "Explanation for the adjustment",
            "confidence": "low|medium|high",
            "riskFactors": ["Risk factor 1", "Risk factor 2"],
            "opportunityFactors": ["Opportunity factor 1", "Opportunity factor 2"]
          }`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    })

    // Parse and return the refined estimate
    return JSON.parse(response.choices[0].message.content)
  } catch (error) {
    console.error('Error refining estimate with AI:', error)

    // Return a basic refinement if AI fails
    return {
      adjustedEstimate: baseEstimate,
      minEstimate: Math.round(baseEstimate * 0.85),
      maxEstimate: Math.round(baseEstimate * 1.15),
      aiAdjustmentFactor: 1.0,
      reasoning: 'Using standard estimate due to AI service unavailability',
      confidence: 'medium',
    }
  }
}

/**
 * Fallback analysis when AI is unavailable
 * @param {Object} options - Options for analysis
 * @returns {Object} - Basic analysis results
 */
const fallbackProjectAnalysis = async (options) => {
  const { description, clientBudget, timeline, industry } = options

  // Simple keyword matching for project type
  let recommendedTypeCode = 'WEBSITE' // Default
  if (
    description.toLowerCase().includes('mobile') ||
    description.toLowerCase().includes('app')
  ) {
    recommendedTypeCode = 'MOBILE_APP'
  } else if (
    description.toLowerCase().includes('e-commerce') ||
    description.toLowerCase().includes('ecommerce') ||
    description.toLowerCase().includes('shop')
  ) {
    recommendedTypeCode = 'ECOMMERCE'
  } else if (
    description.toLowerCase().includes('web app') ||
    description.toLowerCase().includes('application')
  ) {
    recommendedTypeCode = 'WEB_APP'
  }

  // Simple keyword matching for category
  let recommendedCategoryCode = 'BROCHURE' // Default
  if (
    description.toLowerCase().includes('e-commerce') ||
    description.toLowerCase().includes('ecommerce') ||
    description.toLowerCase().includes('shop')
  ) {
    recommendedCategoryCode = 'ECOMMERCE'
  } else if (
    description.toLowerCase().includes('blog') ||
    description.toLowerCase().includes('content')
  ) {
    recommendedCategoryCode = 'BLOG'
  } else if (
    description.toLowerCase().includes('portfolio') ||
    description.toLowerCase().includes('showcase')
  ) {
    recommendedCategoryCode = 'PORTFOLIO'
  }

  // Simple keyword matching for industry
  let recommendedIndustryCode = 'GENERAL' // Default
  if (industry) {
    // Try to find a matching industry in the database
    const matchedIndustry = await Industry.findOne({
      $or: [
        { name: { $regex: new RegExp(industry, 'i') } },
        { description: { $regex: new RegExp(industry, 'i') } },
      ],
      active: true,
    })

    if (matchedIndustry) {
      recommendedIndustryCode = matchedIndustry.code
    }
  }

  // Simple keyword matching for features
  const recommendedFeatures = []
  const featureKeywords = [
    { keyword: 'login', code: 'USER_AUTH' },
    { keyword: 'authentication', code: 'USER_AUTH' },
    { keyword: 'payment', code: 'PAYMENT' },
    { keyword: 'search', code: 'SEARCH' },
    { keyword: 'admin', code: 'ADMIN_PANEL' },
    { keyword: 'dashboard', code: 'DASHBOARD' },
    { keyword: 'notification', code: 'NOTIFICATIONS' },
    { keyword: 'messaging', code: 'MESSAGING' },
    { keyword: 'analytics', code: 'ANALYTICS' },
  ]

  featureKeywords.forEach(({ keyword, code }) => {
    if (description.toLowerCase().includes(keyword)) {
      recommendedFeatures.push({
        code,
        reasoning: `The description mentions "${keyword}"`,
      })
    }
  })

  // Estimate complexity based on description length and feature count
  let estimatedComplexity = 'medium'
  if (description.length > 500 && recommendedFeatures.length > 3) {
    estimatedComplexity = 'high'
  } else if (description.length < 200 && recommendedFeatures.length < 2) {
    estimatedComplexity = 'low'
  }

  // Estimate timeline based on complexity
  let estimatedTimelineInWeeks = 4
  if (estimatedComplexity === 'high') {
    estimatedTimelineInWeeks = 8
  } else if (estimatedComplexity === 'low') {
    estimatedTimelineInWeeks = 2
  }

  // Estimate budget range based on project type and complexity
  let minBudget = 3000
  let maxBudget = 6000

  if (recommendedTypeCode === 'MOBILE_APP') {
    minBudget = 8000
    maxBudget = 15000
  } else if (recommendedTypeCode === 'ECOMMERCE') {
    minBudget = 5000
    maxBudget = 10000
  } else if (recommendedTypeCode === 'WEB_APP') {
    minBudget = 6000
    maxBudget = 12000
  }

  if (estimatedComplexity === 'high') {
    minBudget *= 1.5
    maxBudget *= 1.5
  } else if (estimatedComplexity === 'low') {
    minBudget *= 0.7
    maxBudget *= 0.7
  }

  return {
    recommendedType: {
      code: recommendedTypeCode,
      reasoning: 'Based on keyword matching in the description',
    },
    recommendedCategory: {
      code: recommendedCategoryCode,
      reasoning: 'Based on keyword matching in the description',
    },
    recommendedIndustry: {
      code: recommendedIndustryCode,
      reasoning: 'Based on provided industry information',
    },
    recommendedFeatures,
    estimatedComplexity,
    estimatedTimelineInWeeks,
    estimatedBudgetRange: {
      min: Math.round(minBudget),
      max: Math.round(maxBudget),
    },
    additionalNotes:
      'This is a fallback analysis as the AI service is currently unavailable. For more accurate recommendations, please try again later.',
  }
}

export default {
  analyzeProjectDescription,
  estimateProjectCost,
}
