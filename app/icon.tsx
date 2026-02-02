import { ImageResponse } from "next/og"
import fs from "node:fs"
import path from "node:path"

export const runtime = "nodejs"
export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  const logoPath = path.join(process.cwd(), "finance-logo.png")
  const logoBuffer = fs.readFileSync(logoPath)
  const logoBase64 = logoBuffer.toString("base64")

  return new ImageResponse(
    (
      <img
        src={`data:image/png;base64,${logoBase64}`}
        width={32}
        height={32}
        style={{ objectFit: "contain" }}
        alt="Finance Tracker"
      />
    ),
    { width: 32, height: 32 }
  )
}
