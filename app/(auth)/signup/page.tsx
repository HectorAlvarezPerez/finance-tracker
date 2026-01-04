"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Wallet, Eye, EyeOff, Check, X, Sparkles } from "lucide-react"
import { loginAsDemoUser } from "@/app/actions/auth"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()
  const t = useTranslations('auth.signup')
  const [isDemoLoading, setIsDemoLoading] = useState(false)

  const handleDemoLogin = async () => {
    setIsDemoLoading(true)
    try {
      await loginAsDemoUser()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create demo session",
        variant: "destructive",
      })
      setIsDemoLoading(false)
    }
  }

  // Password validation
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!allRequirementsMet) {
      toast({
        title: "Error",
        description: "Please meet all password requirements",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      })

      if (error) throw error

      toast({
        title: "Success!",
        description: "Your account has been created. Please check your email to verify your account.",
      })

      router.push("/login")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign up",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Wallet className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">{t('title')}</CardTitle>
          <CardDescription>
            {t('subtitle')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {password && (
                <div className="space-y-1 p-3 rounded-md bg-muted/50 text-xs">
                  <p className="font-medium mb-1.5">Password must contain:</p>
                  <div className="space-y-1">
                    <div className={`flex items-center gap-1.5 ${passwordRequirements.minLength ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {passwordRequirements.minLength ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {passwordRequirements.hasUppercase ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                      <span>One uppercase letter (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordRequirements.hasLowercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {passwordRequirements.hasLowercase ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                      <span>One lowercase letter (a-z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {passwordRequirements.hasNumber ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                      <span>One number (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordRequirements.hasSpecial ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {passwordRequirements.hasSpecial ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                      <span>One special character (!@#$...)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('creatingAccount') : t('signUp')}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              {t('haveAccount')}{" "}
              <Link href="/login" className="text-primary hover:underline">
                {t('signIn')}
              </Link>
            </p>
          </CardFooter>
        </form>

        <div className="px-6 pb-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or try it out
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full mt-4 gap-2"
            onClick={handleDemoLogin}
            disabled={loading || isDemoLoading}
          >
            {isDemoLoading ? (
              <Sparkles className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 text-amber-500" />
            )}
            {isDemoLoading ? "Creating Demo..." : "Try Demo Mode"}
          </Button>
        </div>
      </Card>
    </div>
  )
}

