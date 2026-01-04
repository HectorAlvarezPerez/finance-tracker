// Default categories to be created for new users

export const defaultCategories = {
  en: [
    // Income categories
    { name: "Salary", type: "income" as const, color: "#22c55e", icon: "💰" },
    { name: "Freelance", type: "income" as const, color: "#10b981", icon: "💼" },
    { name: "Investments", type: "income" as const, color: "#14b8a6", icon: "📈" },
    { name: "Gifts Received", type: "income" as const, color: "#06b6d4", icon: "🎁" },
    { name: "Other Income", type: "income" as const, color: "#0ea5e9", icon: "💵" },

    // Expense categories
    { name: "Food & Groceries", type: "expense" as const, color: "#ef4444", icon: "🛒" },
    { name: "Restaurants & Cafes", type: "expense" as const, color: "#f97316", icon: "☕" },
    { name: "Transportation", type: "expense" as const, color: "#f59e0b", icon: "🚗" },
    { name: "Health", type: "expense" as const, color: "#84cc16", icon: "🏥" },
    { name: "Entertainment", type: "expense" as const, color: "#06b6d4", icon: "🎬" },
    { name: "Subscriptions", type: "expense" as const, color: "#3b82f6", icon: "📱" },
    { name: "Shopping", type: "expense" as const, color: "#6366f1", icon: "🛍️" },
    { name: "Gifts", type: "expense" as const, color: "#8b5cf6", icon: "🎁" },
    { name: "Bills & Utilities", type: "expense" as const, color: "#a855f7", icon: "📄" },
    { name: "Rent", type: "expense" as const, color: "#ec4899", icon: "🏠" },
    { name: "Education", type: "expense" as const, color: "#f43f5e", icon: "📚" },
    { name: "Sports & Fitness", type: "expense" as const, color: "#14b8a6", icon: "💪" },
    { name: "Travel", type: "expense" as const, color: "#06b6d4", icon: "✈️" },
    { name: "Personal Care", type: "expense" as const, color: "#a855f7", icon: "💅" },
    { name: "Other Expenses", type: "expense" as const, color: "#64748b", icon: "📦" },
  ],
  es: [
    // Categorías de Ingreso
    { name: "Nómina", type: "income" as const, color: "#22c55e", icon: "💰" },
    { name: "Freelance", type: "income" as const, color: "#10b981", icon: "💼" },
    { name: "Inversiones", type: "income" as const, color: "#14b8a6", icon: "📈" },
    { name: "Regalos Recibidos", type: "income" as const, color: "#06b6d4", icon: "🎁" },
    { name: "Otros Ingresos", type: "income" as const, color: "#0ea5e9", icon: "💵" },

    // Categorías de Gasto
    { name: "Comida y Supermercado", type: "expense" as const, color: "#ef4444", icon: "🛒" },
    { name: "Restaurantes y Cafés", type: "expense" as const, color: "#f97316", icon: "☕" },
    { name: "Transporte", type: "expense" as const, color: "#f59e0b", icon: "🚗" },
    { name: "Salud", type: "expense" as const, color: "#84cc16", icon: "🏥" },
    { name: "Ocio", type: "expense" as const, color: "#06b6d4", icon: "🎬" },
    { name: "Suscripciones", type: "expense" as const, color: "#3b82f6", icon: "📱" },
    { name: "Compras", type: "expense" as const, color: "#6366f1", icon: "🛍️" },
    { name: "Regalos", type: "expense" as const, color: "#8b5cf6", icon: "🎁" },
    { name: "Facturas y Servicios", type: "expense" as const, color: "#a855f7", icon: "📄" },
    { name: "Alquiler", type: "expense" as const, color: "#ec4899", icon: "🏠" },
    { name: "Educación", type: "expense" as const, color: "#f43f5e", icon: "📚" },
    { name: "Deporte y Fitness", type: "expense" as const, color: "#14b8a6", icon: "💪" },
    { name: "Viajes", type: "expense" as const, color: "#06b6d4", icon: "✈️" },
    { name: "Cuidado Personal", type: "expense" as const, color: "#a855f7", icon: "💅" },
    { name: "Caprichos", type: "expense" as const, color: "#ec4899", icon: "🎀" },
    { name: "Otros Gastos", type: "expense" as const, color: "#64748b", icon: "📦" },
  ],
}

export function getDefaultCategories(locale: string = "en") {
  // Default to English
  const lang = locale.startsWith("es") ? "es" : "en"
  return defaultCategories[lang]
}

