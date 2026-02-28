"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Home, RefreshCw } from "lucide-react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console for developers (only in development)
    if (process.env.NODE_ENV === "development") {
      console.error("Dashboard error:", error)
    }
  }, [error])

  return (
    <div className="container mx-auto p-4 md:p-6 min-h-screen flex items-center justify-center">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Oops! Algo no salió bien</CardTitle>
          <CardDescription>
            Ha ocurrido un error al cargar esta página. No te preocupes, tus datos están seguros.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === "development" && error.message && (
            <details className="p-3 bg-muted rounded-md">
              <summary className="text-sm font-medium cursor-pointer mb-2">
                Detalles técnicos (solo visible en desarrollo)
              </summary>
              <pre className="text-xs font-mono text-muted-foreground overflow-auto max-h-40">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}

          <div className="flex flex-col gap-3">
            <Button onClick={reset} className="w-full" size="lg">
              <RefreshCw className="mr-2 h-5 w-5" />
              Volver a intentar
            </Button>
            <Button
              onClick={() => (window.location.href = "/dashboard")}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Home className="mr-2 h-5 w-5" />
              Volver al Dashboard
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-center text-muted-foreground">
              💡 <strong>Consejos:</strong>
            </p>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
              <li>• Verifica tu conexión a internet</li>
              <li>• Recarga la página</li>
              <li>• Si el problema persiste, contacta con soporte</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
