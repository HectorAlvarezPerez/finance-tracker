# 🤖 AI Assistant Setup Guide

Your Finance Tracker now includes an **AI Assistant** powered by OpenAI GPT-4!

## ✨ Features

The AI Assistant can help you:

- ✅ **Create categories** - "Add a category called Salary for income"
- ✅ **Create transactions** - "Add a transaction for $50 on groceries"
- ✅ **Create accounts** - "Create a savings account in USD"
- ✅ **Create budgets** - "Set a budget of $500 for groceries this month"
- ✅ **Answer questions** - "How much did I spend last month?"
- ✅ **Financial advice** - "How can I save more money?"
- ✅ **Financial concepts** - "What's a good emergency fund?"

## 🛡️ Guardrails (Safety Features)

The AI Assistant has **strict guardrails** to ensure it stays focused on finances:

### What It Will Do:
✅ Answer finance-related questions
✅ Create financial data (categories, transactions, etc.)
✅ Provide financial advice and tips
✅ Explain financial concepts

### What It Will NOT Do:
❌ Answer general knowledge questions (weather, sports, etc.)
❌ Discuss politics, entertainment, or unrelated topics
❌ Help with cooking, travel, or other non-finance topics

### Example Responses to Off-Topic Questions:

```
User: "What's the weather like today?"
AI: "I'm sorry, but I can only help with personal finance questions. 
     Is there anything about your finances I can help you with?"

User: "Who won the Super Bowl?"
AI: "That's outside my area of expertise. I'm here specifically 
     to help you manage your money and finances."
```

**Why?** This ensures:
- 🎯 Focused assistance on what matters
- 💰 Lower OpenAI API costs (no wasted tokens)
- 🔒 Better user experience

## 🔑 Setup OpenAI API Key

### 1. Get Your API Key

1. Go to https://platform.openai.com/api-keys
2. Log in or create an account
3. Click **"Create new secret key"**
4. Copy the key (starts with `sk-...`)

### 2. Add to Your Environment Variables

#### For Local Development:

Create or edit `.env.local`:

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your-key-here
```

#### For Vercel Production:

1. Go to your Vercel project dashboard
2. **Settings** → **Environment Variables**
3. Add new variable:
   ```
   Name: OPENAI_API_KEY
   Value: sk-your-key-here
   Environment: ✅ Production, ✅ Preview, ✅ Development
   ```
4. **Redeploy** your app

### 3. Restart Your Development Server

```bash
npm run dev
```

## 💰 Cost Considerations

### OpenAI Pricing (as of 2024):

- **GPT-4 Turbo**: $0.01 / 1K input tokens, $0.03 / 1K output tokens
- **GPT-3.5 Turbo**: $0.0005 / 1K input tokens, $0.0015 / 1K output tokens

### Estimated Costs:

A typical conversation:
- **10 messages** ≈ 5,000 tokens ≈ **$0.10 - $0.20** (GPT-4)
- **10 messages** ≈ 5,000 tokens ≈ **$0.005 - $0.01** (GPT-3.5)

**For 100 users using 10 messages/day:**
- GPT-4: ~$200-400/month
- GPT-3.5: ~$15-30/month

### 💡 Cost Optimization Tips:

1. **Switch to GPT-3.5** for lower costs (edit `/app/api/ai-assistant/route.ts`):
   ```typescript
   model: "gpt-3.5-turbo"  // instead of "gpt-4-turbo-preview"
   ```

2. **Add rate limiting** (coming soon in future update)

3. **Monitor usage**: https://platform.openai.com/usage

## 🎯 Usage Examples

### Creating Categories:

```
User: "Add a category called Salary for income with a green color"
AI: "✓ Created income category 'Salary' with green color"

User: "Create an expense category for Groceries"
AI: "✓ Created expense category 'Groceries'"
```

### Creating Transactions:

```
User: "Add a transaction for $1500 on January 15th for my salary"
AI: "✓ Created transaction: $1500 for Salary on 2024-01-15"

User: "I spent $45.50 on groceries yesterday"
AI: "✓ Created expense: $45.50 for Groceries"
```

### Creating Accounts:

```
User: "Create a checking account called Main Bank"
AI: "✓ Created checking account 'Main Bank'"

User: "Add a crypto account in USD"
AI: "✓ Created crypto account in USD"
```

### Creating Budgets:

```
User: "Set a budget of $800 for groceries this month"
AI: "✓ Created budget: $800 for Groceries in February 2024"
```

### Asking Questions:

```
User: "What categories do I have?"
AI: "You have the following categories:
- Salary (income)
- Groceries (expense)
- Transportation (expense)
..."

User: "Which accounts do I have?"
AI: "You have:
- Main Checking (checking)
- Savings Account (savings)
..."
```

## 🔧 Advanced Configuration

### Change AI Model

Edit `/app/api/ai-assistant/route.ts`:

```typescript
// For GPT-3.5 (cheaper, faster)
model: "gpt-3.5-turbo"

// For GPT-4 (smarter, more expensive)
model: "gpt-4-turbo-preview"

// For GPT-4o (latest, balanced)
model: "gpt-4o"
```

### Customize AI Personality

Edit the system prompt in `/app/api/ai-assistant/route.ts`:

```typescript
{
  role: "system",
  content: `You are a friendly financial assistant named FinBot...`
}
```

## 🐛 Troubleshooting

### Error: "OpenAI API key not found"
- Make sure you added `OPENAI_API_KEY` to your environment variables
- Restart your dev server or redeploy on Vercel

### Error: "Rate limit exceeded"
- You've hit OpenAI's rate limit
- Wait a few minutes or upgrade your OpenAI plan

### Error: "Insufficient quota"
- Your OpenAI account needs credits
- Add credits at https://platform.openai.com/account/billing

### AI not understanding commands
- Be more specific: "Create an income category called Salary"
- Include all details: dates, amounts, account names

## 🚀 What's Next?

Possible future improvements:
- 📊 Generate financial reports
- 📈 Analyze spending patterns
- 🎯 Smart budget recommendations
- 🔔 Proactive alerts and reminders
- 🗣️ Voice commands
- 📱 WhatsApp/Telegram integration

---

**Need Help?** Open an issue on GitHub or check the documentation.

**Cost Monitoring:** Always monitor your OpenAI usage at https://platform.openai.com/usage

