import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  // Default to English - the I18nProvider will handle dynamic switching on client
  const locale = 'en'

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  }
})

