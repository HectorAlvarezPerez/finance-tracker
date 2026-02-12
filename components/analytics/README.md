# Analytics Charts Theme Guide

This folder uses centralized chart design tokens and category color mapping to keep a premium, consistent look.

## Files to customize

- `/Users/hector.alvarez/Desktop/Other/Finance/lib/theme/chartTokens.ts`
  - Neutrals (`grid`, `axis`, `border`, etc.)
  - Semantic colors (`success`, `danger`, `warning`)
  - Categorical palette (`categorical.palette`) and fixed `categorical.other`
  - Optional accessibility fallback (`accessibility.usePatternFills`)

- `/Users/hector.alvarez/Desktop/Other/Finance/lib/utils/colorMap.ts`
  - Stable mapping `categoryId/categoryName -> color`
  - "Other" detection rules and forced gray color

## Top N behavior

- Monthly stacked chart uses **Top 8 + Other**
  - Constant: `INSIGHTS_TOP_CATEGORY_LIMIT` in `/Users/hector.alvarez/Desktop/Other/Finance/lib/insights/helpers.ts`
- Donut chart uses **Top 5 + Other**
  - Constant: `INSIGHTS_DONUT_TOP_CATEGORY_LIMIT` in `/Users/hector.alvarez/Desktop/Other/Finance/lib/insights/helpers.ts`

## Feature flag

- Monthly category chart variant is controlled by query param:
  - `chartVariant=stacked` (default)
  - `chartVariant=lines` (alternative readability mode)

Example:

`/insights?year=2026&month=2&chartVariant=lines`
