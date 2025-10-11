"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { getDefaultCategories } from "@/lib/default-categories"

export function InitDefaultData({ userId, locale }: { userId: string; locale?: string }) {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const initializeDefaultData = async () => {
      // Only run once
      if (initialized) return
      
      try {
        const supabase = createBrowserClient()

        // Check if user already has categories
        const { data: existingCategories } = await supabase
          .from('categories')
          .select('id')
          .eq('user_id', userId)
          .limit(1)

        // If user already has categories, don't create defaults
        if (existingCategories && existingCategories.length > 0) {
          setInitialized(true)
          return
        }

        // Get default categories based on locale (default to Spanish)
        const defaultCategories = getDefaultCategories(locale || 'es')

        // Prepare categories for insertion
        const categoriesToInsert = defaultCategories.map(cat => ({
          user_id: userId,
          name: cat.name,
          type: cat.type,
          color: cat.color,
          icon: cat.icon,
        }))

        // Insert categories
        const { error } = await supabase
          .from('categories')
          .insert(categoriesToInsert as any)

        if (error) {
          console.error('Error creating default categories:', error)
        } else {
          console.log('✅ Default categories created successfully')
        }

        setInitialized(true)
      } catch (error) {
        console.error('Error initializing default data:', error)
        setInitialized(true)
      }
    }

    if (userId && !initialized) {
      initializeDefaultData()
    }
  }, [userId, locale, initialized])

  // This component doesn't render anything
  return null
}

