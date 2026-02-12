import { chartTokens } from "@/lib/theme/chartTokens"

type CategoryColorInput = {
  categoryId?: string | null
  categoryName?: string | null
  fallbackColor?: string | null
}

const OTHER_CATEGORY_NAMES = new Set([
  "other",
  "other expense",
  "other expenses",
  "other income",
  "other category",
  "other categories",
  "otros",
  "otros gastos",
  "otros ingresos",
  "otra categoria",
  "otras categorias",
  "uncategorized",
  "sin categoria",
  "sin categorias",
  "misc",
  "miscellaneous",
])

function normalizeValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
}

function hashString(value: string) {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash)
}

export function isOtherCategory(categoryName?: string | null, categoryKey?: string | null) {
  if (categoryKey === "other") {
    return true
  }

  if (!categoryName) {
    return false
  }

  return OTHER_CATEGORY_NAMES.has(normalizeValue(categoryName))
}

export function getCategoryColor({
  categoryId,
  categoryName,
  fallbackColor,
}: CategoryColorInput): string {
  if (isOtherCategory(categoryName, categoryId)) {
    return chartTokens.categorical.other
  }

  const normalizedName = categoryName ? normalizeValue(categoryName) : ""
  const stableSource = normalizedName || categoryId || fallbackColor || "uncategorized"
  const palette = chartTokens.categorical.palette
  const colorIndex = hashString(stableSource) % palette.length

  return palette[colorIndex]
}
