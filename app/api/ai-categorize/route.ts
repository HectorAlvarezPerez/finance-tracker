import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createServerClient } from '@/lib/supabase/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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
      .select('name, type')
      .eq('user_id', userId)

    const categoryList = existingCategories?.map(c => `${c.name} (${c.type})`) || []

    // Prepare transactions summary for AI
    const transactionsSummary = transactions.slice(0, 50).map((t: any, i: number) => 
      `${i + 1}. "${t.description}" - Amount: ${t.amount}`
    ).join('\n')

    // Ask AI to categorize all transactions
    const prompt = `Analyze these financial transactions and for each one determine:
1. If it's income (positive) or expense (negative) based on description
2. Suggest an appropriate category

Existing categories: ${categoryList.join(', ')}

Transactions:
${transactionsSummary}

Respond with a JSON array (one object per transaction) in this exact format:
[
  {
    "index": 0,
    "type": "income" or "expense",
    "category": "category name",
    "confidence": "high" or "medium" or "low"
  }
]

Rules:
- Use existing categories when possible
- For new categories, suggest short, clear names in Spanish if description is Spanish, English otherwise
- Common categories: Salary (income), Groceries, Transport, Entertainment, Bills, Shopping, Restaurants, Health (expenses)
- Be conservative: if unsure, use "Other"`

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

    // Parse AI response
    const categorizations = JSON.parse(response)

    return NextResponse.json({ categorizations })
  } catch (error: any) {
    console.error('AI categorization error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to categorize transactions' },
      { status: 500 }
    )
  }
}

