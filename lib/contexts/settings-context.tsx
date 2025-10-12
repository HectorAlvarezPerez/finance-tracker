"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import type { Database } from "@/types/database"

type Settings = Database["public"]["Tables"]["settings"]["Row"]

interface SettingsContextType {
  settings: Settings | null
  loading: boolean
  refreshSettings: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ 
  children, 
  userId 
}: { 
  children: ReactNode
  userId: string | null
}) {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  const loadSettings = useCallback(async () => {
    if (!userId) {
      setSettings(null)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error("Error loading settings:", error)
      }

      setSettings(data || null)
    } catch (error) {
      console.error("Error loading settings:", error)
    } finally {
      setLoading(false)
    }
  }, [userId, supabase])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      loading, 
      refreshSettings: loadSettings 
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  return context
}

