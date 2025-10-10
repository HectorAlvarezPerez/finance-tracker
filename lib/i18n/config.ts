import { getRequestConfig } from 'next-intl/server'

export const locales = ['en', 'es', 'fr', 'de', 'pt'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async () => {
  // This runs on the server for each request
  // We'll get the locale from user settings or default to 'en'
  const locale = 'en' // Default, will be overridden by middleware
  
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  }
})

