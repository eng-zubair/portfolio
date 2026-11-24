// Vercel Function: portfolio AI chat.
// - GET  /api/chat -> { enabled } (false until ANTHROPIC_API_KEY is set in Vercel)
// - POST /api/chat -> streams the assistant's reply as plain text
//
// Cost guards: small cheap model, low effort, short replies, short history,
// per-conversation and best-effort per-IP limits, origin check. The real
// backstop is the monthly spend limit set in the Claude Console.
import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from './_prompt.js'

const MODEL = process.env.CHAT_MODEL || 'claude-haiku-5-5'
const LIMITS = {
  maxUserTurns: 16,     // per conversation (5 suggested chips + 8 typed, with margin)
  maxChars: 500,        // per visitor message
  historyMessages: 10,  // messages sent to the model
  maxTokens: 600,       // reply ceiling (includes any thinking)
  perIpPerHour: 20,     // best effort: per server instance
}
export const ERROR_MARKER = '[[CHAT_ERROR]]'

const DEFAULT_HOSTS = ['zubairchohan.vercel.app', 'localhost', '127.0.0.1']
const extraHosts = (process.env.CHAT_ALLOWED_HOSTS || '').split(',').map((h) => h.trim()).filter(Boolean)

function originAllowed(request) {
  const origin = request.headers.get('origin')
  if (!origin) return false
  try {
    const { hostname } = new URL(origin)
    return DEFAULT_HOSTS.includes(hostname) || extraHosts.includes(hostname) || hostname.endsWith('-eng-zubairs-projects.vercel.app')
  } catch {
    return false
  }
}

const hits = new Map()
function rateLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < 3600_000)
  if (recent.length >= LIMITS.perIpPerHour) { hits.set(ip, recent); return true }
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return false
}

const json = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

function cleanMessages(input) {
  if (!Array.isArray(input)) return null
  const msgs = input
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, m.role === 'user' ? LIMITS.maxChars : 2000) }))
  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return null
  if (msgs.filter((m) => m.role === 'user').length > LIMITS.maxUserTurns) return 'too-many'
  let recent = msgs.slice(-LIMITS.historyMessages)
  while (recent.length && recent[0].role !== 'user') recent = recent.slice(1)
  return recent
}

export function GET() {
  return json({ enabled: Boolean(process.env.ANTHROPIC_API_KEY), limits: { maxUserTurns: LIMITS.maxUserTurns, maxChars: LIMITS.maxChars } })
}

export async function POST(request) {
  if (!process.env.ANTHROPIC_API_KEY) return json({ error: 'disabled' }, 503)
  if (!originAllowed(request)) return json({ error: 'forbidden' }, 403)

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  if (rateLimited(ip)) return json({ error: 'rate-limited' }, 429)

  let body
  try { body = await request.json() } catch { return json({ error: 'bad-request' }, 400) }
  const messages = cleanMessages(body?.messages)
  if (messages === 'too-many') return json({ error: 'conversation-limit' }, 429)
  if (!messages) return json({ error: 'bad-request' }, 400)

  const client = new Anthropic()
  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: LIMITS.maxTokens,
    system: SYSTEM_PROMPT,
    output_config: { effort: 'low' },
    messages,
  })

  const encoder = new TextEncoder()
  const body$ = new ReadableStream({
    async start(controller) {
      stream.on('text', (text) => controller.enqueue(encoder.encode(text)))
      try {
        const final = await stream.finalMessage()
        if (final.stop_reason === 'refusal') {
          controller.enqueue(encoder.encode('Sorry, I can’t help with that one. For anything about Zubair’s work, ask away — or message him on WhatsApp.'))
        }
        console.log('chat usage', JSON.stringify({ model: final.model, stop: final.stop_reason, usage: final.usage }))
      } catch (err) {
        console.error('chat error', err?.status, err?.message)
        controller.enqueue(encoder.encode(ERROR_MARKER))
      }
      controller.close()
    },
    cancel() { stream.abort() },
  })

  return new Response(body$, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } })
}
