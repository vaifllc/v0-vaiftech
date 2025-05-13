import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

/**
 * Generate document content using OpenAI
 * @param {string} prompt - The prompt for the AI
 * @param {string} model - The OpenAI model to use
 * @param {object} templateData - Optional template data to include
 * @returns {Promise<string>} - The generated content
 */
export const generateDocumentContent = async (
  prompt,
  model = 'gpt-4',
  templateData = null,
) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured')
  }

  let systemPrompt =
    "You are an expert document creator. Create professional, well-structured documents based on the user's requirements."

  if (templateData) {
    systemPrompt +=
      ' Use the provided template structure and replace variables with appropriate content.'
  }

  let messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: prompt },
  ]

  if (templateData) {
    messages.push({
      role: 'user',
      content: `Here is the template to use: ${
        templateData.content
      }. Variables: ${JSON.stringify(templateData.variables)}`,
    })
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(
        `OpenAI API error: ${error.error?.message || 'Unknown error'}`,
      )
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('Error generating document with AI:', error)
    throw new Error(`Failed to generate document: ${error.message}`)
  }
}

/**
 * Analyze document content using OpenAI
 * @param {string} content - The document content to analyze
 * @param {string} model - The OpenAI model to use
 * @returns {Promise<object>} - Analysis results
 */
export const analyzeDocument = async (content, model = 'gpt-4') => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured')
  }

  const prompt = `Analyze the following document and provide insights on its structure, tone, and potential improvements:\n\n${content}`

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: 'You are an expert document analyst.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(
        `OpenAI API error: ${error.error?.message || 'Unknown error'}`,
      )
    }

    const data = await response.json()
    return {
      analysis: data.choices[0].message.content,
      model: model,
      timestamp: new Date(),
    }
  } catch (error) {
    console.error('Error analyzing document with AI:', error)
    throw new Error(`Failed to analyze document: ${error.message}`)
  }
}

/**
 * Extract variables from template content
 * @param {string} content - The template content
 * @returns {Promise<Array>} - Array of variable objects
 */
export const extractTemplateVariables = async (content) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured')
  }

  const prompt = `Extract all variables from the following template. Variables are typically enclosed in curly braces like {{variable_name}}. Return a JSON array of objects with 'name', 'description', and 'defaultValue' properties:\n\n${content}`

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert at analyzing document templates and extracting variables.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(
        `OpenAI API error: ${error.error?.message || 'Unknown error'}`,
      )
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Extract JSON array from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0])
      } catch (e) {
        console.error('Error parsing variables JSON:', e)
        return []
      }
    }

    return []
  } catch (error) {
    console.error('Error extracting variables with AI:', error)
    throw new Error(`Failed to extract variables: ${error.message}`)
  }
}

export default {
  generateDocumentContent,
  analyzeDocument,
  extractTemplateVariables,
}
