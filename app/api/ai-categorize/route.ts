import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

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

    const categoryList = existingCategories?.map(c => `${c.name} (${c.type})`) || []

    // Prepare transactions summary for AI
    const transactionsSummary = transactions.map((t: any, i: number) => 
      `${i + 1}. "${t.description}" - Amount: ${t.amount}`
    ).join('\n')

    // Ask AI to categorize all transactions
    const prompt = `Analyze these financial transactions and assign each one to an existing category.

IMPORTANT RULES:
- You can ONLY use categories from the existing list below
- DO NOT create new categories
- If you're not confident about a category match, return null for that transaction
- Match categories based on the transaction description

Existing categories: ${categoryList.join(', ')}

Transactions:
${transactionsSummary}

Respond with a JSON array (one object per transaction) in this exact format:
[
  {
    "index": 0,
    "categoryName": "exact category name from list" or null,
    "confidence": "high" or "medium" or "low"
  }
]

Return null for categoryName if:
- No existing category fits well
- You're uncertain about the match
- The confidence would be "low"`

    const apiKey = process.env.OPENAI_API_KEY?.trim()
    if (!apiKey) {
      console.error('AI categorize error: OPENAI_API_KEY is not configured')
      return NextResponse.json(
        { error: 'AI categorization is currently unavailable. Please contact support.' },
        { status: 503 }
      )
    }

    const openai = await createOpenAIClient(apiKey)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a financial categorization assistant. Respond only with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from AI')
    }

    // Clean response: remove markdown code blocks if present
    let cleanedResponse = response.trim()
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\n?/, '').replace(/\n?```$/, '')
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\n?/, '').replace(/\n?```$/, '')
    }

    // Parse AI response
    const categorizations = JSON.parse(cleanedResponse)

    // Map category names to IDs
    const categorizationsWithIds = categorizations.map((cat: any) => {
      let categoryId = null
      if (cat.categoryName) {
        const foundCategory = existingCategories?.find(
          c => c.name.toLowerCase() === cat.categoryName.toLowerCase()
        )
        categoryId = foundCategory?.id || null
      }
      return {
        index: cat.index,
        categoryId,
        categoryName: cat.categoryName,
        confidence: cat.confidence,
      }
    })

    return NextResponse.json({ categorizations: categorizationsWithIds })
  } catch (error: any) {
    console.error('AI categorization error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to categorize transactions' },
      { status: 500 }
    )
  }
}
