export const chartTokens = {
  neutrals: {
    bg: "hsl(var(--background))",
    surface: "hsl(var(--card))",
    border: "hsl(var(--border))",
    grid: "hsl(var(--border) / 0.7)",
    axis: "hsl(var(--muted-foreground))",
    textMuted: "hsl(var(--muted-foreground))",
  },
  brand: {
    accent: "hsl(var(--primary))",
  },
  semantic: {
    success: "#2E8B57",
    danger: "#C85D5D",
    warning: "#B88746",
  },
  categorical: {
    palette: [
      "#6B8FB8",
      "#D08F4C",
      "#73A96B",
      "#D16F73",
      "#6FAFA8",
      "#C9AA4B",
      "#A37FAF",
      "#A58674",
      "#7E98AD",
      "#8DAA7A",
    ],
    other: "#94A3B8",
  },
  lines: {
    netWorth: "#4B6E99",
    netWorthAreaOpacity: 0.24,
  },
  accessibility: {
    usePatternFills: false,
  },
} as const

export type ChartVariant = "stacked" | "lines"
