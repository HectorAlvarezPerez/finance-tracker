import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { createServerClient } from "@/lib/supabase/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Get user context (accounts, categories, etc.)
    const supabase = createServerClient()
    
    const [accountsRes, categoriesRes] = await Promise.all([
      supabase.from("accounts").select("id, name, type").eq("user_id", userId),
      supabase.from("categories").select("id, name, type").eq("user_id", userId),
    ])

    const accounts = accountsRes.data || []
    const categories = categoriesRes.data || []

    // Create OpenAI completion with function calling
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a helpful financial assistant. You can help users manage their finances by:
- Creating categories (income, expense, transfer, investment)
- Creating transactions
- Creating accounts
- Creating budgets
- Answering questions about their finances

User's current accounts: ${JSON.stringify(accounts)}
User's current categories: ${JSON.stringify(categories)}

Always respond in a friendly, concise way. When you perform an action, confirm what you did.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      functions: [
        {
          name: "create_category",
          description: "Create a new category for transactions",
          parameters: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Category name (e.g., 'Salary', 'Groceries')",
              },
              type: {
                type: "string",
                enum: ["income", "expense", "transfer", "investment"],
                description: "Category type",
              },
              color: {
                type: "string",
                description: "Hex color code (e.g., '#3b82f6')",
              },
              icon: {
                type: "string",
                description: "Icon name (optional)",
              },
            },
            required: ["name", "type"],
          },
        },
        {
          name: "create_transaction",
          description: "Create a new transaction",
          parameters: {
            type: "object",
            properties: {
              amount: {
                type: "number",
                description: "Transaction amount",
              },
              description: {
                type: "string",
                description: "Transaction description",
              },
              account_id: {
                type: "string",
                description: "Account ID",
              },
              category_id: {
                type: "string",
                description: "Category ID",
              },
              date: {
                type: "string",
                description: "Transaction date (YYYY-MM-DD)",
              },
            },
            required: ["amount", "description", "account_id"],
          },
        },
        {
          name: "create_account",
          description: "Create a new account",
          parameters: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Account name",
              },
              type: {
                type: "string",
                enum: ["checking", "savings", "brokerage", "crypto", "other"],
                description: "Account type",
              },
              currency: {
                type: "string",
                description: "Currency code (e.g., 'USD', 'EUR')",
              },
            },
            required: ["name", "type"],
          },
        },
        {
          name: "create_budget",
          description: "Create a new monthly budget",
          parameters: {
            type: "object",
            properties: {
              category_id: {
                type: "string",
                description: "Category ID",
              },
              amount: {
                type: "number",
                description: "Budget amount",
              },
              month: {
                type: "string",
                description: "Month (YYYY-MM)",
              },
            },
            required: ["category_id", "amount", "month"],
          },
        },
      ],
      function_call: "auto",
    })

    const responseMessage = completion.choices[0].message

    // Check if AI wants to call a function
    if (responseMessage.function_call) {
      const functionName = responseMessage.function_call.name
      const functionArgs = JSON.parse(responseMessage.function_call.arguments)

      // Execute the function
      let result
      switch (functionName) {
        case "create_category":
          result = await createCategory(supabase, userId, functionArgs)
          break
        case "create_transaction":
          result = await createTransaction(supabase, userId, functionArgs)
          break
        case "create_account":
          result = await createAccount(supabase, userId, functionArgs)
          break
        case "create_budget":
          result = await createBudget(supabase, userId, functionArgs)
          break
        default:
          result = { error: "Unknown function" }
      }

      // Get AI's final response with the function result
      const secondCompletion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a helpful financial assistant. Confirm the action in a friendly way.",
          },
          {
            role: "user",
            content: message,
          },
          responseMessage,
          {
            role: "function",
            name: functionName,
            content: JSON.stringify(result),
          },
        ],
      })

      return NextResponse.json({
        message: secondCompletion.choices[0].message.content,
        action: functionName,
        result,
      })
    }

    // No function call, just return the message
    return NextResponse.json({
      message: responseMessage.content,
    })
  } catch (error: any) {
    console.error("AI Assistant error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

// Helper functions to execute actions
async function createCategory(supabase: any, userId: string, args: any) {
  const { error, data } = await supabase
    .from("categories")
    .insert({
      user_id: userId,
      name: args.name,
      type: args.type,
      color: args.color || getDefaultColor(args.type),
      icon: args.icon || "tag",
    } as any)
    .select()
    .single()

  if (error) throw error
  return { success: true, category: data }
}

async function createTransaction(supabase: any, userId: string, args: any) {
  const { error, data } = await supabase
    .from("transactions")
    .insert({
      user_id: userId,
      account_id: args.account_id,
      category_id: args.category_id || null,
      amount: args.amount,
      description: args.description,
      date: args.date || new Date().toISOString().split("T")[0],
      type: args.amount > 0 ? "income" : "expense",
    } as any)
    .select()
    .single()

  if (error) throw error
  return { success: true, transaction: data }
}

async function createAccount(supabase: any, userId: string, args: any) {
  const { error, data } = await supabase
    .from("accounts")
    .insert({
      user_id: userId,
      name: args.name,
      type: args.type,
      currency: args.currency || "USD",
      is_active: true,
    } as any)
    .select()
    .single()

  if (error) throw error
  return { success: true, account: data }
}

async function createBudget(supabase: any, userId: string, args: any) {
  const { error, data } = await supabase
    .from("budgets")
    .insert({
      user_id: userId,
      category_id: args.category_id,
      amount: args.amount,
      month: args.month,
    } as any)
    .select()
    .single()

  if (error) throw error
  return { success: true, budget: data }
}

function getDefaultColor(type: string): string {
  const colors: Record<string, string> = {
    income: "#10b981",
    expense: "#ef4444",
    transfer: "#3b82f6",
    investment: "#8b5cf6",
  }
  return colors[type] || "#6b7280"
}

