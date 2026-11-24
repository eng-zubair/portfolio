import React from 'react'
import { ArrowUp, MessageCircle, Sparkles, X } from 'lucide-react'
import { profile } from './data'
import { suggestedQuestions } from './chatAnswers'

const ERROR_MARKER = '[[CHAT_ERROR]]' // must match api/chat.js
const MAX_USER_TURNS = 8
const MAX_CHARS = 500
const waLink = (text) => `https://wa.me/923004413332?text=${encodeURIComponent(text)}`

const GREETING = {
  role: 'assistant',
  content: 'Hi! I’m Zubair’s AI assistant. Ask me about his work, CallSharp, or how AI could help your business.',
}

export default function ChatWidget() {
  const [open, setOpen] = React.useState(false)
  const [messages, setMessages] = React.useState([GREETING])
  const [input, setInput] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [aiEnabled, setAiEnabled] = React.useState(null)
  const listRef = React.useRef(null)
  const inputRef = React.useRef(null)
  const launcherRef = React.useRef(null)

  const userTurns = messages.filter((m) => m.role === 'user' && m.typed).length
  const usedChips = new Set(messages.filter((m) => m.chip).map((m) => m.content))
  const chips = suggestedQuestions.filter((s) => !usedChips.has(s.q))

  // A link ending in #ask-ai opens the chat straight away.
  React.useEffect(() => {
    const check = () => { if (window.location.hash === '#ask-ai') setOpen(true) }
    check()
    window.addEventListener('hashchange', check)
    return () => window.removeEventListener('hashchange', check)
  }, [])

  // Ask the server once whether live AI is switched on.
  React.useEffect(() => {
    if (!open || aiEnabled !== null) return
    fetch('/api/chat', { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .then((d) => setAiEnabled(Boolean(d.enabled)))
      .catch(() => setAiEnabled(false))
  }, [open, aiEnabled])

  React.useEffect(() => {
    if (!open) return
    // Focus the input on mouse/trackpad devices only, so phones don't pop the keyboard up.
    if (window.matchMedia?.('(pointer: fine)').matches) inputRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); launcherRef.current?.focus() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  React.useEffect(() => {
    const box = listRef.current
    if (box) box.scrollTop = box.scrollHeight
  }, [messages, open])

  const append = (msg) => setMessages((ms) => [...ms, msg])
  const updateLast = (fn) => setMessages((ms) => ms.map((m, i) => (i === ms.length - 1 ? fn(m) : m)))

  const askChip = async (s) => {
    if (busy) return
    append({ role: 'user', content: s.q, chip: true })
    setBusy(true)
    await new Promise((r) => setTimeout(r, 450))
    append({ role: 'assistant', content: s.a, actions: s.actions })
    setBusy(false)
  }

  const send = async (e) => {
    e?.preventDefault()
    const text = input.trim().slice(0, MAX_CHARS)
    if (!text || busy) return
    setInput('')

    if (userTurns >= MAX_USER_TURNS) {
      append({ role: 'user', content: text, typed: true })
      append({ role: 'assistant', content: 'We’ve covered a lot! Let’s continue on WhatsApp so Zubair can pick this up personally.', actions: [{ label: 'Continue on WhatsApp', href: waLink(text), external: true }] })
      return
    }

    const history = [...messages, { role: 'user', content: text, typed: true }]
    setMessages(history)

    if (!aiEnabled) {
      append({
        role: 'assistant',
        content: 'Live AI answers are switching on soon. In the meantime I’ve turned your question into a WhatsApp message — tap below to send it to Zubair directly.',
        actions: [{ label: 'Send on WhatsApp', href: waLink(text), external: true }],
      })
      return
    }

    setBusy(true)
    append({ role: 'assistant', content: '', streaming: true })
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.filter((m) => m !== GREETING).map(({ role, content }) => ({ role, content })) }),
      })
      if (!res.ok || !res.body) throw new Error(String(res.status))
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value, { stream: true })
        const shown = full.replace(ERROR_MARKER, '')
        updateLast((m) => ({ ...m, content: shown }))
      }
      if (full.includes(ERROR_MARKER) || !full.trim()) throw new Error('stream')
      updateLast((m) => ({ ...m, streaming: false }))
    } catch {
      updateLast((m) => ({
        ...m,
        streaming: false,
        content: (m.content ? m.content + '\n\n' : '') + 'Sorry — I couldn’t answer just now. You can send your question to Zubair on WhatsApp instead.',
        actions: [{ label: 'Send on WhatsApp', href: waLink(text), external: true }],
      }))
    }
    setBusy(false)
  }

  const handoff = () => {
    const asked = messages.filter((m) => m.role === 'user').map((m) => `- ${m.content}`).join('\n')
    return waLink(`Hi Zubair, I was chatting with your website assistant.${asked ? `\n\nMy questions:\n${asked}`.slice(0, 1200) : ''}`)
  }

  return <>
    {open && <div className="chat-panel" role="dialog" aria-modal="false" aria-label="Chat with Zubair’s AI assistant">
      <div className="chat-head">
        <div><strong>Ask Zubair’s AI</strong><span>{aiEnabled ? 'AI assistant · replies instantly' : 'Quick answers · WhatsApp for the rest'}</span></div>
        <button type="button" onClick={() => { setOpen(false); launcherRef.current?.focus() }} aria-label="Close chat"><X size={18} /></button>
      </div>

      <div className="chat-list" ref={listRef} aria-live="polite" aria-busy={busy}>
        {messages.map((m, i) => <div key={i} className={`chat-msg chat-${m.role}`}>
          <p>{m.content}{m.streaming && !m.content && <span className="chat-dots" aria-label="Typing"><i /><i /><i /></span>}</p>
          {m.actions && <div className="chat-actions">{m.actions.map((a) => <a key={a.label} href={a.href} {...(a.external ? { target: '_blank', rel: 'noreferrer' } : {})}>{a.label}</a>)}</div>}
        </div>)}
        {busy && messages[messages.length - 1]?.role === 'user' && <div className="chat-msg chat-assistant"><p><span className="chat-dots" aria-label="Typing"><i /><i /><i /></span></p></div>}
      </div>

      {chips.length > 0 && <div className={`chat-chips ${messages.length > 1 ? 'is-compact' : ''}`} aria-label="Suggested questions">{chips.map((s) => <button key={s.q} type="button" onClick={() => askChip(s)} disabled={busy}>{s.q}</button>)}</div>}

      <form className="chat-input" onSubmit={send}>
        <label className="sr-only" htmlFor="chat-text">Your question</label>
        <input id="chat-text" ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} maxLength={MAX_CHARS} placeholder={aiEnabled ? 'Ask anything about Zubair’s work…' : 'Type a question — I’ll pass it to Zubair'} autoComplete="off" />
        <button type="submit" disabled={busy || !input.trim()} aria-label="Send"><ArrowUp size={18} /></button>
      </form>
      <a className="chat-handoff" href={handoff()} target="_blank" rel="noreferrer"><MessageCircle size={14} />Send this chat to Zubair on WhatsApp</a>
      {aiEnabled && <p className="chat-disclaimer">AI answers can be imperfect. Zubair confirms details personally.</p>}
    </div>}

    <div className="float-actions">
      <a className="float-whatsapp" href={profile.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat with Zubair on WhatsApp"><MessageCircle size={20} /></a>
      <button ref={launcherRef} type="button" className={`float-chat ${open ? 'is-open' : ''}`} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? 'Close AI chat' : 'Ask Zubair’s AI'}>
        {open ? <X size={20} /> : <Sparkles size={20} />}<span>{open ? 'Close' : 'Ask my AI'}</span>
      </button>
    </div>
  </>
}
