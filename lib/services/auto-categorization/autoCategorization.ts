import type { Database } from "@/types/database"
import {
  CANONICAL_CATEGORIES,
  type CanonicalCategoryDefinition,
  type CanonicalCategoryKey,
  type CanonicalIntent,
} from "./canonicalCategories"

type UserCategory = Pick<Database["public"]["Tables"]["categories"]["Row"], "id" | "name" | "type">

type ConfidenceLevel = "high" | "medium" | "low"

interface IndexedTerm {
  normalized: string
  tokens: string[]
}

interface IndexedCanonicalCategory {
  definition: CanonicalCategoryDefinition
  keyLabel: string
  keywordTerms: IndexedTerm[]
  merchantTerms: IndexedTerm[]
  negativeTerms: IndexedTerm[]
  mappingTokens: Set<string>
}

interface MappedCanonicalCategory extends IndexedCanonicalCategory {
  categoryId: string
  categoryName: string
  minConfidence: number
}

interface IndexedUserCategory {
  raw: UserCategory
  normalizedName: string
  mappingTokens: Set<string>
  tokenSet: Set<string>
}

export interface CategoryIndexConfig {
  confidenceThreshold: number
  marginThreshold: number
  canonicalMapThreshold: number
  canonicalMapMargin: number
  maxKeywordScore: number
  maxNegativePenalty: number
  fuzzyKeywordLimit: number
}

export interface CategoryIndex {
  config: CategoryIndexConfig
  canonicalToCategoryId: Partial<Record<CanonicalCategoryKey, string>>
  canonicalToCategoryName: Partial<Record<CanonicalCategoryKey, string>>
  activeCanonicals: MappedCanonicalCategory[]
}

export interface CategorizeTransactionInput {
  description?: string | null
  merchant?: string | null
  amount?: number | null
}

export interface CategorizationResult {
  categoryId: string | null
  canonicalKey: CanonicalCategoryKey | null
  score: number
  confidence: ConfidenceLevel
  reason: "matched" | "weak" | "ambiguous" | "no-signals"
}

const DEFAULT_CONFIG: CategoryIndexConfig = {
  confidenceThreshold: 0.85,
  marginThreshold: 0.15,
  canonicalMapThreshold: 0.45,
  canonicalMapMargin: 0.08,
  maxKeywordScore: 1.6,
  maxNegativePenalty: 1.2,
  fuzzyKeywordLimit: 2,
}

const STOP_WORDS = new Set([
  "a",
  "al",
  "de",
  "del",
  "el",
  "la",
  "las",
  "los",
  "en",
  "y",
  "o",
  "con",
  "sin",
  "por",
  "para",
  "da",
  "do",
  "des",
  "du",
  "le",
  "les",
  "the",
  "and",
  "or",
  "to",
  "for",
  "of",
  "my",
  "your",
  "un",
  "una",
  "unas",
  "unos",
  "es",
  "ca",
  "en",
])

const MOBILE_SIGNAL_TERMS = buildTerms(["movil", "mobile", "linea", "forfait", "sim", "roaming"])
const TELCO_TERMS = buildTerms(["orange", "free", "sfr", "bouygues", "movistar", "vodafone", "masmovil", "digi"])
const AMAZON_TERMS = buildTerms(["amazon"])
const FLIGHT_TERMS = buildTerms(["flight", "vuelo", "vuelos", "airline", "boarding", "aeropuerto"])

const INDEXED_CANONICALS: IndexedCanonicalCategory[] = CANONICAL_CATEGORIES.map((definition) => {
  const keywordTerms = buildTerms(definition.keywords)
  const merchantTerms = buildTerms(definition.merchants ?? [])
  const negativeTerms = buildTerms(definition.negativeKeywords ?? [])
  const keyLabel = normalizeText(definition.canonicalKey.replace(/_/g, " "))
  const mappingTokens = new Set<string>([
    ...tokenize(keyLabel, true),
    ...keywordTerms.flatMap((term) => term.tokens),
  ])

  return {
    definition,
    keyLabel,
    keywordTerms,
    merchantTerms,
    negativeTerms,
    mappingTokens,
  }
})

export function buildCategoryIndex(
  categories: UserCategory[],
  configOverrides?: Partial<CategoryIndexConfig>
): CategoryIndex {
  const config: CategoryIndexConfig = { ...DEFAULT_CONFIG, ...configOverrides }
  const normalizedCategories = categories.map(indexUserCategory)

  const canonicalToCategoryId: Partial<Record<CanonicalCategoryKey, string>> = {}
  const canonicalToCategoryName: Partial<Record<CanonicalCategoryKey, string>> = {}
  const activeCanonicals: MappedCanonicalCategory[] = []

  for (const canonical of INDEXED_CANONICALS) {
    const eligible = normalizedCategories.filter((category) =>
      matchesIntent(canonical.definition.intent, category.raw.type)
    )

    if (eligible.length === 0) {
      continue
    }

    const ranked = eligible
      .map((category) => ({
        category,
        score: scoreCategoryAffinity(category, canonical),
      }))
      .sort((left, right) => right.score - left.score)

    const best = ranked[0]
    const second = ranked[1]
    const secondScore = second?.score ?? 0

    if (!best) {
      continue
    }

    if (best.score < config.canonicalMapThreshold) {
      continue
    }

    if (best.score - secondScore < config.canonicalMapMargin) {
      continue
    }

    const key = canonical.definition.canonicalKey
    canonicalToCategoryId[key] = best.category.raw.id
    canonicalToCategoryName[key] = best.category.raw.name
    activeCanonicals.push({
      ...canonical,
      categoryId: best.category.raw.id,
      categoryName: best.category.raw.name,
      minConfidence: canonical.definition.minConfidence ?? config.confidenceThreshold,
    })
  }

  return {
    config,
    canonicalToCategoryId,
    canonicalToCategoryName,
    activeCanonicals,
  }
}

export function categorizeTransaction(
  index: CategoryIndex,
  transaction: CategorizeTransactionInput
): CategorizationResult {
  const normalizedDescription = normalizeText(transaction.description)
  const normalizedMerchant = normalizeText(transaction.merchant)
  const searchableText = [normalizedDescription, normalizedMerchant].filter(Boolean).join(" ").trim()
  const amount = Number(transaction.amount ?? 0)

  if (!searchableText) {
    return {
      categoryId: null,
      canonicalKey: null,
      score: 0,
      confidence: "low",
      reason: "no-signals",
    }
  }

  if (index.activeCanonicals.length === 0) {
    return {
      categoryId: null,
      canonicalKey: null,
      score: 0,
      confidence: "low",
      reason: "weak",
    }
  }

  const searchableTokens = tokenize(searchableText)
  const searchableTokenSet = new Set(searchableTokens)
  const merchantTokens = tokenize(normalizedMerchant)
  const merchantTokenSet = new Set(merchantTokens)

  const ranked = index.activeCanonicals
    .map((canonical) => {
      const score = scoreCanonicalForTransaction({
        config: index.config,
        canonical,
        amount,
        searchableTokens,
        searchableTokenSet,
        merchantTokenSet,
      })

      return {
        canonical,
        score,
      }
    })
    .sort((left, right) => right.score - left.score)

  const best = ranked[0]
  const second = ranked[1]
  const secondScore = second?.score ?? 0

  if (!best || best.score <= 0) {
    return {
      categoryId: null,
      canonicalKey: null,
      score: 0,
      confidence: "low",
      reason: "weak",
    }
  }

  let requiredConfidence = Math.max(index.config.confidenceThreshold, best.canonical.minConfidence)
  let requiredMargin = index.config.marginThreshold

  if (
    best.canonical.definition.canonicalKey === "SHOPPING" &&
    countTermMatches(best.canonical.merchantTerms, searchableTokenSet) > 0 &&
    countTermMatches(AMAZON_TERMS, searchableTokenSet) > 0
  ) {
    requiredConfidence = Math.max(requiredConfidence, 1)
    requiredMargin = Math.max(requiredMargin, 0.25)
  }

  if (best.score < requiredConfidence) {
    return {
      categoryId: null,
      canonicalKey: null,
      score: best.score,
      confidence: toConfidence(best.score),
      reason: "weak",
    }
  }

  if (best.score - secondScore < requiredMargin) {
    return {
      categoryId: null,
      canonicalKey: null,
      score: best.score,
      confidence: toConfidence(best.score),
      reason: "ambiguous",
    }
  }

  return {
    categoryId: best.canonical.categoryId,
    canonicalKey: best.canonical.definition.canonicalKey,
    score: best.score,
    confidence: toConfidence(best.score),
    reason: "matched",
  }
}

interface ScoreParams {
  config: CategoryIndexConfig
  canonical: MappedCanonicalCategory
  amount: number
  searchableTokens: string[]
  searchableTokenSet: Set<string>
  merchantTokenSet: Set<string>
}

function scoreCanonicalForTransaction(params: ScoreParams): number {
  const { config, canonical, amount, searchableTokens, searchableTokenSet, merchantTokenSet } = params
  const { definition } = canonical

  let score = 0

  const merchantHits = countTermMatches(canonical.merchantTerms, merchantTokenSet)
  const merchantFallbackHits = merchantHits > 0 ? 0 : countTermMatches(canonical.merchantTerms, searchableTokenSet)
  if (merchantHits > 0) {
    score += 0.9
  } else if (merchantFallbackHits > 0) {
    score += 0.55
  }

  const exactKeywordHits = countTermMatches(canonical.keywordTerms, searchableTokenSet)
  score += Math.min(exactKeywordHits * 0.4, config.maxKeywordScore)

  const fuzzyHits = countFuzzyKeywordMatches(
    searchableTokens,
    searchableTokenSet,
    canonical.keywordTerms,
    config.fuzzyKeywordLimit
  )
  score += fuzzyHits * 0.2

  const negativeHits = countTermMatches(canonical.negativeTerms, searchableTokenSet)
  score -= Math.min(negativeHits * 0.6, config.maxNegativePenalty)

  if (amount > 0) {
    score += definition.amountHints?.positive ?? 0
  } else if (amount < 0) {
    score += definition.amountHints?.negative ?? 0
  }

  if (definition.intent === "income") {
    score += amount > 0 ? 0.15 : -0.45
  } else {
    score += amount < 0 ? 0.15 : -0.2
  }

  const hasMobileKeyword = countTermMatches(MOBILE_SIGNAL_TERMS, searchableTokenSet) > 0
  const hasTelcoMerchant = countTermMatches(TELCO_TERMS, merchantTokenSet) > 0

  if (definition.canonicalKey === "PHONE_MOBILE" && hasMobileKeyword && hasTelcoMerchant) {
    score += 0.35
  }

  if (definition.canonicalKey === "UTILITIES" && hasMobileKeyword && hasTelcoMerchant) {
    score -= 0.2
  }

  if (definition.canonicalKey === "SUBSCRIPTIONS" && merchantHits > 0) {
    score += 0.3
  }

  if (definition.canonicalKey === "TRAVEL_FLIGHTS" && countTermMatches(FLIGHT_TERMS, searchableTokenSet) > 0) {
    score += 0.2
  }

  if (
    (definition.canonicalKey === "INCOME_BIZUM" ||
      definition.canonicalKey === "INCOME_INVESTMENTS" ||
      definition.canonicalKey === "INCOME_GIFTS_RECEIVED") &&
    amount <= 0
  ) {
    score -= 0.9
  }

  return score
}

function matchesIntent(intent: CanonicalIntent, categoryType: UserCategory["type"]): boolean {
  if (intent === "expense") {
    return categoryType === "expense"
  }

  return categoryType === "income"
}

function scoreCategoryAffinity(category: IndexedUserCategory, canonical: IndexedCanonicalCategory): number {
  const overlapCount = intersectionSize(category.mappingTokens, canonical.mappingTokens)
  const overlapRatio = overlapCount / Math.max(1, category.mappingTokens.size)

  let phraseHits = 0
  for (const term of canonical.keywordTerms) {
    if (term.tokens.length > 1 && hasTermMatch(term, category.tokenSet)) {
      phraseHits += 1
    }
  }

  const phraseScore = Math.min(phraseHits * 0.2, 0.4)
  const lexicalScore = maxLexicalScore(category.normalizedName, canonical)

  return overlapRatio * 0.9 + phraseScore + lexicalScore * 0.35
}

function maxLexicalScore(categoryName: string, canonical: IndexedCanonicalCategory): number {
  const candidates = [
    canonical.keyLabel,
    ...canonical.keywordTerms.slice(0, 12).map((term) => term.normalized),
  ]

  let max = 0
  for (const candidate of candidates) {
    if (!candidate) {
      continue
    }
    max = Math.max(max, diceCoefficient(categoryName, candidate))
  }

  return max
}

function toConfidence(score: number): ConfidenceLevel {
  if (score >= 1.2) {
    return "high"
  }
  if (score >= 0.95) {
    return "medium"
  }
  return "low"
}

function countTermMatches(terms: IndexedTerm[], tokenSet: Set<string>): number {
  if (tokenSet.size === 0 || terms.length === 0) {
    return 0
  }

  let count = 0
  for (const term of terms) {
    if (hasTermMatch(term, tokenSet)) {
      count += 1
    }
  }

  return count
}

function countFuzzyKeywordMatches(
  searchableTokens: string[],
  searchableTokenSet: Set<string>,
  keywordTerms: IndexedTerm[],
  limit: number
): number {
  if (searchableTokens.length === 0 || keywordTerms.length === 0 || limit <= 0) {
    return 0
  }

  let hits = 0
  for (const term of keywordTerms) {
    if (term.tokens.length !== 1) {
      continue
    }

    const token = term.tokens[0]
    if (token.length < 5 || searchableTokenSet.has(token)) {
      continue
    }

    const fuzzyMatch = searchableTokens.some(
      (searchableToken) => searchableToken.length >= 4 && diceCoefficient(searchableToken, token) >= 0.9
    )

    if (fuzzyMatch) {
      hits += 1
      if (hits >= limit) {
        break
      }
    }
  }

  return hits
}

function buildTerms(values: string[]): IndexedTerm[] {
  return values
    .map((value) => normalizeText(value))
    .filter(Boolean)
    .map((normalized) => {
      return {
        normalized,
        tokens: tokenize(normalized),
      }
    })
    .filter((term) => term.tokens.length > 0)
}

function hasTermMatch(term: IndexedTerm, tokenSet: Set<string>): boolean {
  if (term.tokens.length === 0 || tokenSet.size === 0) {
    return false
  }

  for (const token of term.tokens) {
    if (!tokenSet.has(token)) {
      return false
    }
  }

  return true
}

function indexUserCategory(category: UserCategory): IndexedUserCategory {
  const normalizedName = normalizeText(category.name)
  const allTokens = tokenize(normalizedName)
  const mappingTokens = new Set(tokenize(normalizedName, true))

  return {
    raw: category,
    normalizedName,
    mappingTokens,
    tokenSet: new Set(allTokens),
  }
}

function normalizeText(value: unknown): string {
  const text = typeof value === "string" ? value : value == null ? "" : String(value)

  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
}

function tokenize(value: string, removeStopWords = false): string[] {
  if (!value) {
    return []
  }

  return value
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length >= 2)
    .filter((token) => (removeStopWords ? !STOP_WORDS.has(token) : true))
}

function intersectionSize(left: Set<string>, right: Set<string>): number {
  let count = 0
  for (const token of left) {
    if (right.has(token)) {
      count += 1
    }
  }
  return count
}

function diceCoefficient(left: string, right: string): number {
  if (!left || !right) {
    return 0
  }
  if (left === right) {
    return 1
  }
  if (left.length < 2 || right.length < 2) {
    return 0
  }

  const leftBigrams = bigramMap(left)
  const rightBigrams = bigramMap(right)

  let matches = 0
  for (const [bigram, leftCount] of leftBigrams.entries()) {
    const rightCount = rightBigrams.get(bigram)
    if (!rightCount) {
      continue
    }
    matches += Math.min(leftCount, rightCount)
  }

  const total = (left.length - 1) + (right.length - 1)
  if (total === 0) {
    return 0
  }

  return (2 * matches) / total
}

function bigramMap(value: string): Map<string, number> {
  const map = new Map<string, number>()
  for (let i = 0; i < value.length - 1; i += 1) {
    const bigram = value.slice(i, i + 2)
    map.set(bigram, (map.get(bigram) ?? 0) + 1)
  }
  return map
}
