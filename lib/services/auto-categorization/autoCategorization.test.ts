import {
  buildCategoryIndex,
  categorizeTransaction,
} from "@/lib/services/auto-categorization/autoCategorization"

const categories = [
  { id: "exp_rent", name: "Alquiler", type: "expense" as const },
  { id: "exp_bills", name: "Bills / Facturas y Servicios", type: "expense" as const },
  { id: "exp_dining", name: "Cafe / Restaurantes y Cafes", type: "expense" as const },
  { id: "exp_groceries", name: "Comida y Supermercado", type: "expense" as const },
  { id: "exp_shopping", name: "Compras / Shopping", type: "expense" as const },
  { id: "exp_clothing", name: "Ropa", type: "expense" as const },
  { id: "exp_fitness", name: "Deporte y Fitness", type: "expense" as const },
  { id: "exp_phone", name: "Telefonia", type: "expense" as const },
  { id: "exp_subs", name: "Suscripciones", type: "expense" as const },
  { id: "inc_bizum", name: "Bizum", type: "income" as const },
  { id: "inc_salary", name: "Nomina / Salary", type: "income" as const },
  { id: "inc_other", name: "Otros Ingresos", type: "income" as const },
]

describe("auto-categorization", () => {
  it("maps canonical categories to user categories by name tokens", () => {
    const index = buildCategoryIndex(categories)

    expect(index.canonicalToCategoryId.RENT).toBe("exp_rent")
    expect(index.canonicalToCategoryId.UTILITIES).toBe("exp_bills")
    expect(index.canonicalToCategoryId.DINING).toBe("exp_dining")
    expect(index.canonicalToCategoryId.SUBSCRIPTIONS).toBe("exp_subs")
    expect(index.canonicalToCategoryId.INCOME_BIZUM).toBe("inc_bizum")
    expect(index.canonicalToCategoryId.INCOME_SALARY).toBe("inc_salary")
  })

  it("categorizes a clear dining transaction", () => {
    const index = buildCategoryIndex(categories)
    const result = categorizeTransaction(index, {
      description: "Starbucks cafe",
      merchant: "Starbucks",
      amount: -4.5,
    })

    expect(result.categoryId).toBe("exp_dining")
    expect(result.reason).toBe("matched")
  })

  it("prioritizes subscriptions over utilities for known recurring merchants", () => {
    const index = buildCategoryIndex(categories)
    const result = categorizeTransaction(index, {
      description: "Spotify subscription mensual",
      merchant: "Spotify",
      amount: -10.99,
    })

    expect(result.categoryId).toBe("exp_subs")
    expect(result.reason).toBe("matched")
  })

  it("prioritizes mobile over utilities for telco + mobile signals", () => {
    const index = buildCategoryIndex(categories)
    const result = categorizeTransaction(index, {
      description: "Factura movil linea principal",
      merchant: "Orange",
      amount: -32.4,
    })

    expect(result.categoryId).toBe("exp_phone")
    expect(result.reason).toBe("matched")
  })

  it("returns null on ambiguous cases", () => {
    const index = buildCategoryIndex(categories)
    const result = categorizeTransaction(index, {
      description: "Decathlon compra",
      merchant: "Decathlon",
      amount: -55,
    })

    expect(result.categoryId).toBeNull()
    expect(result.reason).toBe("ambiguous")
  })

  it("returns null for weak signals", () => {
    const index = buildCategoryIndex(categories)
    const result = categorizeTransaction(index, {
      description: "Transfer 839201",
      merchant: "",
      amount: -10,
    })

    expect(result.categoryId).toBeNull()
    expect(result.reason).toBe("weak")
  })

  it("categorizes positive bizum as income", () => {
    const index = buildCategoryIndex(categories)
    const result = categorizeTransaction(index, {
      description: "Bizum recibido de Carlos",
      merchant: "Bizum",
      amount: 20,
    })

    expect(result.categoryId).toBe("inc_bizum")
    expect(result.reason).toBe("matched")
  })

  it("does not classify negative bizum as income", () => {
    const index = buildCategoryIndex(categories)
    const result = categorizeTransaction(index, {
      description: "Bizum enviado",
      merchant: "Bizum",
      amount: -20,
    })

    expect(result.categoryId).toBeNull()
  })
})
