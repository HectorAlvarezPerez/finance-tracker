"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { AIChat } from "./ai-chat"

export function AIChatWrapper() {
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createBrowserClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getUser()
  }, [supabase.auth])

  if (!userId) return null

  return <AIChat userId={userId} />
}

