import OpenAI from 'openai'
import { AppError } from '../utils/error.js'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Generate document content using OpenAI
 * @param {Object} options - Options for document generation
 * @param {string} options.prompt - Prompt for document generation
 * @param {string} options.documentType - Type of document to generate
 * @param {Object} options.variables - Variables to include in the document
 * @returns {Promise<string>} - Generated document content
 */
export const generateDocumentContent = async (options) => {
  const { prompt, documentType, variables } = options

  if (!prompt) {
    throw new AppError('Prompt is required for document generation', 400)
  }

  try {
    // Construct the system message
    let systemMessage = `You are an expert legal and business document writer.
    Create a professional ${
      documentType || 'document'
    } that is well-structured, comprehensive, and uses formal language.`

    // Construct the user message with the prompt and variables
    let userMessage = prompt

    if (variables && Object.keys(variables).length > 0) {
      userMessage += '\n\nInclude the following information in the document:'

      for (const [key, value] of Object.entries(variables)) {
        userMessage += `\n- ${key}: ${value}`
      }
    }

    // Generate content using OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    })

    // Extract and return the generated content
    return response.choices[0].message.content
  } catch (error) {
    console.error('Error generating document content:', error)
    throw new AppError('Failed to generate document content', 500)
  }
}

/**
 * Generate document title based on content
 * @param {string} content - Document content
 * @returns {Promise<string>} - Generated document title
 */
export const generateDocumentTitle = async (content) => {
  try {
    // Generate title using OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that generates concise, professional titles for documents. Respond with only the title, no additional text.',
        },
        {
          role: 'user',
          content: `Generate a concise, professional title for the following document:\n\n${content.substring(
            0,
            2000,
          )}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 50,
    })

    // Extract and return the generated title
    return response.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error generating document title:', error)
    return 'Untitled Document'
  }
}

/**
 * Extract variables from template content
 * @param {string} content - Template content
 * @returns {Promise<Array>} - Extracted variables
 */
export const extractTemplateVariables = async (content) => {
  try {
    // Generate variables using OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that extracts variables from document templates.
          Look for placeholders like {{variable_name}}, [variable_name], or <variable_name>.
          Return a JSON array of objects with the following structure:
          [
            {
              "name": "variable_name",
              "description": "Brief description of what this variable represents",
              "defaultValue": "A sensible default value if applicable",
              "required": true/false
            }
          ]
          Only include each variable once, even if it appears multiple times in the template.`,
        },
        {
          role: 'user',
          content: `Extract variables from the following document template:\n\n${content}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    })

    // Parse and return the extracted variables
    const result = JSON.parse(response.choices[0].message.content)
    return result.variables || []
  } catch (error) {
    console.error('Error extracting template variables:', error)
    return []
  }
}

/**
 * Summarize document content
 * @param {string} content - Document content
 * @returns {Promise<string>} - Document summary
 */
export const summarizeDocument = async (content) => {
  try {
    // Generate summary using OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that summarizes documents. Provide a concise summary in 2-3 sentences.',
        },
        {
          role: 'user',
          content: `Summarize the following document:\n\n${content.substring(
            0,
            4000,
          )}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    // Extract and return the generated summary
    return response.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error summarizing document:', error)
    return ''
  }
}

/**
 * Analyze document for legal issues
 * @param {string} content - Document content
 * @returns {Promise<Object>} - Analysis results
 */
export const analyzeDocument = async (content) => {
  try {
    // Analyze document using OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a legal document analyzer. Review the document and identify potential issues or improvements.
          Return a JSON object with the following structure:
          {
            "issues": [
              {
                "type": "legal" | "clarity" | "completeness" | "formatting",
                "severity": "high" | "medium" | "low",
                "description": "Description of the issue",
                "suggestion": "Suggestion to fix the issue"
              }
            ],
            "score": 0-100,
            "summary": "Brief summary of the analysis"
          }`,
        },
        {
          role: 'user',
          content: `Analyze the following document for potential issues:\n\n${content.substring(
            0,
            4000,
          )}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    })

    // Parse and return the analysis results
    return JSON.parse(response.choices[0].message.content)
  } catch (error) {
    console.error('Error analyzing document:', error)
    return {
      issues: [],
      score: 0,
      summary: 'Failed to analyze document',
    }
  }
}

export default {
  generateDocumentContent,
  generateDocumentTitle,
  extractTemplateVariables,
  summarizeDocument,
  analyzeDocument,
}
