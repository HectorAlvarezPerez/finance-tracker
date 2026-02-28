"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { getDefaultCategories } from "@/lib/data/default-categories"

export function InitDefaultData({ userId, locale }: { userId: string; locale?: string }) {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const initializeDefaultData = async () => {
      // Check localStorage to see if we've already checked for this user
      const storageKey = `categories_initialized_${userId}`
      const alreadyChecked = localStorage.getItem(storageKey)

      if (alreadyChecked === "true") {
        setInitialized(true)
        return
      }

      // Only run once per session
      if (initialized) return

      try {
        const supabase = createBrowserClient()

        // Check if user already has categories
        const { data: existingCategories, error: fetchError } = await supabase
          .from("categories")
          .select("id")
          .eq("user_id", userId)
          .limit(1)

        if (fetchError) {
          console.error("Error checking categories:", fetchError)
          // Mark as checked even on error to avoid infinite retries
          localStorage.setItem(storageKey, "true")
          setInitialized(true)
          return
        }

        // If user already has categories, don't create defaults
        if (existingCategories && existingCategories.length > 0) {
          localStorage.setItem(storageKey, "true")
          setInitialized(true)
          return
        }

        // Get default categories based on locale (default to Spanish)
        const defaultCategories = getDefaultCategories(locale || "es")

        // Prepare categories for insertion
        const categoriesToInsert = defaultCategories.map((cat) => ({
          user_id: userId,
          name: cat.name,
          type: cat.type,
          color: cat.color,
          icon: cat.icon,
        }))

        // Insert categories in a single batch
        const { error } = await supabase.from("categories").insert(categoriesToInsert as any)

        if (error) {
          console.error("Error creating default categories:", error)
        } else {
          console.log("✅ Default categories created successfully")
        }

        // Mark as initialized regardless of success/failure to avoid retries
        localStorage.setItem(storageKey, "true")
        setInitialized(true)
      } catch (error) {
        console.error("Error initializing default data:", error)
        // Mark as checked even on error to avoid infinite loops
        localStorage.setItem(`categories_initialized_${userId}`, "true")
        setInitialized(true)
      }
    }

    if (userId && !initialized) {
      // Add a small delay to avoid immediate execution on mount
      const timer = setTimeout(() => {
        initializeDefaultData()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [userId, locale, initialized])

  // This component doesn't render anything
  return null
}
