/**
 * Tool submission API route.
 * Saves tool submissions to a local JSON file.
 *
 * NOTE: For Vercel production (serverless), file writes won't persist
 * across invocations. Replace with Supabase/Postgres for production use.
 */
import { Router, type Request, type Response } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = Router()

const DATA_FILE = path.resolve(__dirname, '../../data/submissions.json')

interface SubmitToolBody {
  toolName: string
  website: string
  description: string
  task?: string
  category: string
  pricing: string
  region?: string
  email?: string
  note?: string
}

function loadSubmissions(): SubmitToolBody[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return []
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function saveSubmissions(entries: SubmitToolBody[]): void {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8')
}

/**
 * POST /api/submit-tool
 * Submit a new tool recommendation
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as SubmitToolBody

    // Validate required fields
    if (!body.toolName || !body.website || !body.description || !body.category || !body.pricing) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: toolName, website, description, category, pricing',
      })
      return
    }

    const entries = loadSubmissions()
    entries.push({
      toolName: body.toolName,
      website: body.website,
      description: body.description,
      task: body.task || '',
      category: body.category,
      pricing: body.pricing,
      region: body.region || '',
      email: body.email || '',
      note: body.note || '',
    })
    saveSubmissions(entries)

    res.status(201).json({
      success: true,
      message: 'Tool submission received. We will review it shortly.',
    })
  } catch (error) {
    console.error('[SubmitTool] Error saving submission:', error)
    res.status(500).json({
      success: false,
      error: 'Server internal error',
    })
  }
})

/**
 * GET /api/submit-tool
 * List all tool submissions (for admin use)
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const entries = loadSubmissions()
    res.status(200).json({
      success: true,
      data: entries,
    })
  } catch (error) {
    console.error('[SubmitTool] Error loading submissions:', error)
    res.status(500).json({
      success: false,
      error: 'Server internal error',
    })
  }
})

export default router
