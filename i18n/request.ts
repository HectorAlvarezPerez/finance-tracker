import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

export default getRequestConfig(async () => {
  // Get locale from cookie, default to English
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('NEXT_LOCALE')
  const locale = localeCookie?.value || 'en'
  
  // Validate locale
  const validLocales = ['en', 'es']
  const finalLocale = validLocales.includes(locale) ? locale : 'en'

  return {
    locale: finalLocale,
    messages: (await import(`../messages/${finalLocale}.json`)).default
  }
})

