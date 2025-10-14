import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { locale } = await request.json()

    // Validate locale
    const validLocales = ['en', 'es']
    if (!locale || !validLocales.includes(locale)) {
      return NextResponse.json(
        { error: 'Invalid locale' },
        { status: 400 }
      )
    }

    // Get user
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Update user settings in database
    const { error: updateError } = await supabase
      .from('settings')
      .upsert({
        user_id: user.id,
        locale,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })

    if (updateError) {
      console.error('Error updating locale:', updateError)
      return NextResponse.json(
        { error: 'Failed to update locale' },
        { status: 500 }
      )
    }

    // Set cookie for immediate effect
    const cookieStore = cookies()
    cookieStore.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    return NextResponse.json({ success: true, locale })
  } catch (error: any) {
    console.error('Locale update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update locale' },
      { status: 500 }
    )
  }
}

