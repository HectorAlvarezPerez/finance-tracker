import { I18nProvider } from "@/lib/i18n/provider"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <I18nProvider defaultLocale="es">{children}</I18nProvider>
}

