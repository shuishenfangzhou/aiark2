/**
 * Generate PNG PWA icons from SVG source files.
 * Uses sharp (available via Next.js transitive dependency).
 *
 * Run: npx tsx scripts/generate-icons.ts
 */

import sharp from "sharp"
import fs from "fs"
import path from "path"

const ICONS_DIR = path.resolve("public/icons")

const sizes = [192, 512] as const

async function main() {
  // Ensure output directory exists
  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true })
  }

  for (const size of sizes) {
    const svgPath = path.join(ICONS_DIR, `icon-${size}.svg`)
    const pngPath = path.join(ICONS_DIR, `icon-${size}.png`)

    if (!fs.existsSync(svgPath)) {
      console.warn(`⚠️  Skipping ${size}x${size}: SVG not found at ${svgPath}`)
      continue
    }

    const svgContent = fs.readFileSync(svgPath, "utf-8")

    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toFile(pngPath)

    const stats = fs.statSync(pngPath)
    console.log(`✅ ${size}x${size} PNG generated: ${(stats.size / 1024).toFixed(1)} KB`)
  }
}

main().catch((err) => {
  console.error("Failed to generate icons:", err)
  process.exit(1)
})
