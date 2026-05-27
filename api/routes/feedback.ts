/**
 * Feedback submission API route.
 * Saves feedback submissions to a local JSON file.
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

const DATA_FILE = path.resolve(__dirname, '../../data/feedback.json')

interface FeedbackBody {
  type: string
  toolName: string
  toolUrl?: string
  message: string
  email?: string
}

function loadFeedback(): FeedbackBody[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return []
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function saveFeedback(entries: FeedbackBody[]): void {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8')
}

/**
 * POST /api/feedback
 * Submit user feedback
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as FeedbackBody

    // Validate required fields
    if (!body.type || !body.toolName || !body.message) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: type, toolName, message',
      })
      return
    }

    const entries = loadFeedback()
    entries.push({
      type: body.type,
      toolName: body.toolName,
      toolUrl: body.toolUrl || '',
      message: body.message,
      email: body.email || '',
    })
    saveFeedback(entries)

    res.status(201).json({
      success: true,
      message: 'Feedback received. Thank you!',
    })
  } catch (error) {
    console.error('[Feedback] Error saving feedback:', error)
    res.status(500).json({
      success: false,
      error: 'Server internal error',
    })
  }
})

/**
 * GET /api/feedback
 * List all feedback (for admin use)
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const entries = loadFeedback()
    res.status(200).json({
      success: true,
      data: entries,
    })
  } catch (error) {
    console.error('[Feedback] Error loading feedback:', error)
    res.status(500).json({
      success: false,
      error: 'Server internal error',
    })
  }
})

export default router
