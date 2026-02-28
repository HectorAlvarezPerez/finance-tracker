"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console for developers
    if (process.env.NODE_ENV === "development") {
      console.error("Global error:", error)
    }
  }, [error])

  return (
    <html>
      <body
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          margin: 0,
          padding: "1rem",
          fontFamily: "system-ui, -apple-system, sans-serif",
          backgroundColor: "#f9fafb",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            width: "100%",
            textAlign: "center",
            padding: "2rem",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 1.5rem",
              borderRadius: "50%",
              backgroundColor: "#fee2e2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dc2626"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>

          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "0.5rem",
              color: "#1f2937",
            }}
          >
            Error crítico
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginBottom: "2rem",
              fontSize: "0.95rem",
            }}
          >
            Lo sentimos, algo salió muy mal. Por favor, intenta recargar la página.
          </p>

          {process.env.NODE_ENV === "development" && error.message && (
            <div
              style={{
                backgroundColor: "#f3f4f6",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                textAlign: "left",
              }}
            >
              <details>
                <summary
                  style={{
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    marginBottom: "0.5rem",
                  }}
                >
                  Detalles del error (desarrollo)
                </summary>
                <pre
                  style={{
                    fontSize: "0.75rem",
                    color: "#4b5563",
                    overflow: "auto",
                    maxHeight: "200px",
                    margin: "0.5rem 0 0 0",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {error.message}
                </pre>
              </details>
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexDirection: "column",
            }}
          >
            <button
              onClick={reset}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
            >
              🔄 Intentar de nuevo
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "white",
                color: "#3b82f6",
                border: "2px solid #3b82f6",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#f0f9ff"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "white"
              }}
            >
              🏠 Ir al inicio
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
