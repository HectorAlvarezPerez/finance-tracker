"use client"

import { NextIntlClientProvider } from 'next-intl'
import { ReactNode, useEffect, useState } from 'react'
import { useSettings } from '@/lib/contexts/settings-context'
import enMessages from '@/messages/en.json'
import esMessages from '@/messages/es.json'

const messages: Record<string, any> = {
  'en': enMessages,
  'en-US': enMessages,
  'en-GB': enMessages,
  'es': esMessages,
  'es-ES': esMessages,
  'es-MX': esMessages,
  'es-AR': esMessages,
  'fr-FR': enMessages, // TODO: Add French translations
  'de-DE': enMessages, // TODO: Add German translations
  'pt-BR': enMessages, // TODO: Add Portuguese translations
  'it-IT': enMessages, // TODO: Add Italian translations
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const { settings, loading } = useSettings()
  const [currentMessages, setCurrentMessages] = useState(enMessages)
  const [locale, setLocale] = useState('en')

  useEffect(() => {
    if (!loading && settings?.locale) {
      // Get language code from locale (e.g., 'es' from 'es-ES')
      const lang = settings.locale.split('-')[0]
      const msgs = messages[settings.locale] || messages[lang] || enMessages
      setCurrentMessages(msgs)
      setLocale(lang)
    }
  }, [settings?.locale, loading])

  // Always provide the context, even when loading
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={currentMessages}
      timeZone="UTC"
    >
      {children}
    </NextIntlClientProvider>
  )
}

