import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// Initialize OpenAI client dynamically to avoid issues if env var is missing during build
let OpenAICtor: typeof import('openai').default | null = null

async function createOpenAIClient(apiKey: string) {
  if (!OpenAICtor) {
    const { default: OpenAI } = await import('openai')
    OpenAICtor = OpenAI
  }

  const OpenAIClient = OpenAICtor
  if (!OpenAIClient) {
    throw new Error('Failed to initialize OpenAI client')
  }
  return new OpenAIClient({ apiKey })
}

export async function POST(request: Request) {
  try {
    const { transactions, userId } = await request.json()

    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json(
        { error: 'Invalid transactions data' },
        { status: 400 }
      )
    }

    // Get existing categories for the user
    const supabase = createServerClient()
    const { data: existingCategories } = await supabase
      .from('categories')
      .select('id, name, type')
      .eq('user_id', userId)
      .order('name')

    if (!existingCategories || existingCategories.length === 0) {
      return NextResponse.json({ categorizations: [] })
    }

    // Create a mapping of temporary ID -> Category
    // We use 1-based index (string) for the AI prompt
    const categoryMap = new Map<string, typeof existingCategories[0]>()

    const categoryListForPrompt = existingCategories.map((c, index) => {
      const tempId = (index + 1).toString()
      categoryMap.set(tempId, c)
      return `${tempId}: ${c.name} (${c.type})`
    })

    // Prepare transactions summary for AI
    const transactionsSummary = transactions.map((t: any, i: number) =>
      `Transaction ${i}: "${t.description}" - Amount: ${t.amount}`
    ).join('\n')

    // Improved prompt with explicit ID instruction
    const prompt = `Analyze these financial transactions and assign each one to an existing category from the provided list.

IMPORTANT RULES:
1. You MUST select a category from the "Available Categories" list below.
2. Return the "ID" of the category (the number before the colon), NOT the name.
3. If no category fits well or you are unsure, return null for "categoryId".
4. Respond with a JSON array where "index" matches the "Transaction X" number.

Available Categories:
${categoryListForPrompt.join('\n')}

Transactions to Categorize:
${transactionsSummary}

Response Format (JSON Array):
[
  {
    "index": 0, // Matches "Transaction 0"
    "categoryId": "5", // The ID from Available Categories list, or null
    "confidence": "high" // or "medium" or "low"
  }
]
`

    const apiKey = process.env.OPENAI_API_KEY?.trim()
    if (!apiKey) {
      console.error('AI categorize error: OPENAI_API_KEY is not configured')
      return NextResponse.json(
        { error: 'AI categorization is currently unavailable. Please contact support.' },
        { status: 503 }
      )
    }

    let openai
    try {
      openai = await createOpenAIClient(apiKey)
    } catch (error: any) {
      console.error('AI categorize error: failed to initialize OpenAI client', error)
      return NextResponse.json(
        { error: 'AI categorization is currently unavailable. Please contact support.' },
        { status: 503 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a precise financial categorization assistant. You always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.1, // Lower temperature for more deterministic behaviour
      response_format: { type: "json_object" } // Force JSON mode if model supports it (gpt-4o-mini does)
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      throw new Error('No response from AI')
    }

    let parsedResponse
    try {
      // Handle case where model wraps output in { "categorizations": [...] } or similar keys
      // or just returns the array directly.
      const json = JSON.parse(responseContent)
      if (Array.isArray(json)) {
        parsedResponse = json
      } else if (json.categorizations && Array.isArray(json.categorizations)) {
        parsedResponse = json.categorizations
      } else if (json.results && Array.isArray(json.results)) {
        parsedResponse = json.results
      } else {
        // Fallback: try to find an array in the keys
        const arrayKey = Object.keys(json).find(k => Array.isArray(json[k]))
        parsedResponse = arrayKey ? json[arrayKey] : []
      }
    } catch (e) {
      console.error('Failed to parse AI response json', responseContent)
      throw new Error('Invalid JSON response from AI')
    }

    // Map the temporary prompt IDs back to real Supabase UUIDs
    const results = parsedResponse.map((item: any) => {
      // item.categoryId should be the temporary ID (e.g. "1", "5")
      const tempId = item.categoryId?.toString()
      const matchedCategory = tempId ? categoryMap.get(tempId) : null

      return {
        index: item.index,
        categoryId: matchedCategory?.id || null, // The real UUID
        categoryName: matchedCategory?.name || null, // For debugging/logging
        confidence: item.confidence
      }
    })

    return NextResponse.json({ categorizations: results })
  } catch (error: any) {
    console.error('AI categorization error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to categorize transactions' },
      { status: 500 }
    )
  }
}
