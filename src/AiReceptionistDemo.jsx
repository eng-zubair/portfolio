import React from 'react'
import { useReducedMotion } from 'framer-motion'
import { CalendarCheck, Check, Phone, PhoneCall, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { demoScenarios } from './demoScripts'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const pad = (n) => String(n).padStart(2, '0')

// Browser text-to-speech (free). Resolves when the line finishes, with a safety timeout.
function speak(text, who) {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null
  if (!synth) return Promise.resolve()
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text)
    const voices = synth.getVoices().filter((v) => v.lang?.startsWith('en'))
    if (voices.length) u.voice = who === 'ai' ? voices[0] : voices[Math.min(1, voices.length - 1)]
    u.rate = who === 'ai' ? 1.04 : 1
    u.pitch = who === 'ai' ? 1.1 : 0.8
    const done = () => { clearTimeout(t); resolve() }
    const t = setTimeout(done, text.length * 90 + 2500)
    u.onend = done
    u.onerror = done
    synth.speak(u)
  })
}

function finalState(scenario) {
  const lines = [], tools = [], fields = {}
  for (const s of scenario.steps) {
    if (s.type === 'ai' || s.type === 'caller') lines.push({ who: s.type, text: s.text })
    if (s.type === 'tool') tools.push({ ...s, done: true })
    if (s.type === 'field') fields[s.key] = s.value
  }
  return { lines, tools, fields }
}

export default function AiReceptionistDemo({ liveDemo }) {
  const reduce = useReducedMotion()
  const [active, setActive] = React.useState(0)
  const [runId, setRunId] = React.useState(0)
  const [lines, setLines] = React.useState([])
  const [tools, setTools] = React.useState([])
  const [fields, setFields] = React.useState({})
  const [fresh, setFresh] = React.useState(null)
  const [booked, setBooked] = React.useState(false)
  const [status, setStatus] = React.useState('idle')
  const [seconds, setSeconds] = React.useState(0)
  const [sound, setSound] = React.useState(false)
  const [speechOk, setSpeechOk] = React.useState(false)

  const rootRef = React.useRef(null)
  const transcriptRef = React.useRef(null)
  const visibleRef = React.useRef(false)
  const autoRef = React.useRef(true)
  const soundRef = React.useRef(false)

  const scenario = demoScenarios[active]

  React.useEffect(() => { setSpeechOk(typeof window !== 'undefined' && 'speechSynthesis' in window) }, [])
  React.useEffect(() => { soundRef.current = sound; if (!sound) window.speechSynthesis?.cancel() }, [sound])

  // Only play while the demo is on screen and the tab is visible.
  React.useEffect(() => {
    const el = rootRef.current
    if (!el || !('IntersectionObserver' in window)) { visibleRef.current = true; return }
    const io = new IntersectionObserver(([e]) => { visibleRef.current = e.isIntersecting }, { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Keep the newest transcript line in view (scrolls the box only, never the page).
  React.useEffect(() => {
    const box = transcriptRef.current
    if (box) box.scrollTop = box.scrollHeight
  }, [lines])

  React.useEffect(() => {
    if (status !== 'live') return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [status])

  // The scripted conversation.
  React.useEffect(() => {
    let cancelled = false
    const alive = () => !cancelled
    const waitVisible = async () => {
      while (alive() && (!visibleRef.current || document.hidden)) await sleep(250)
    }

    setLines([]); setTools([]); setFields({}); setFresh(null); setBooked(false); setSeconds(0)

    if (reduce) {
      const f = finalState(scenario)
      setLines(f.lines); setTools(f.tools); setFields(f.fields); setBooked(true); setStatus('ended')
      return () => { cancelled = true }
    }

    ;(async () => {
      setStatus('idle')
      await waitVisible(); if (!alive()) return
      setStatus('ringing'); await sleep(1100); if (!alive()) return
      setStatus('live')

      for (const step of scenario.steps) {
        await waitVisible(); if (!alive()) return

        if (step.type === 'ai' || step.type === 'caller') {
          await sleep(step.type === 'ai' ? 450 : 650); if (!alive()) return
          setLines((ls) => [...ls, { who: step.type, text: '', typing: true }])
          const spoken = soundRef.current ? speak(step.text, step.type) : null
          const chunk = step.type === 'ai' ? 2 : 3
          for (let i = chunk; i < step.text.length + chunk; i += chunk) {
            if (!alive()) return
            const partial = step.text.slice(0, i)
            setLines((ls) => ls.map((l, idx) => (idx === ls.length - 1 ? { ...l, text: partial } : l)))
            await sleep(26)
          }
          setLines((ls) => ls.map((l, idx) => (idx === ls.length - 1 ? { ...l, typing: false } : l)))
          if (spoken) await spoken
        } else if (step.type === 'tool') {
          await sleep(300); if (!alive()) return
          setTools((ts) => [...ts, { ...step, done: false }])
          await sleep(900); if (!alive()) return
          setTools((ts) => ts.map((t, idx) => (idx === ts.length - 1 ? { ...t, done: true } : t)))
        } else if (step.type === 'field') {
          await sleep(250); if (!alive()) return
          setFields((f) => ({ ...f, [step.key]: step.value }))
          setFresh(step.key)
        } else if (step.type === 'booked') {
          await sleep(500); if (!alive()) return
          setBooked(true); setFresh(null)
        }
      }

      setStatus('ended')
      if (autoRef.current) {
        await sleep(6500)
        if (alive()) setActive((a) => (a + 1) % demoScenarios.length)
      }
    })()

    return () => { cancelled = true; window.speechSynthesis?.cancel() }
  }, [active, runId, reduce]) // eslint-disable-line react-hooks/exhaustive-deps

  const choose = (i) => { autoRef.current = false; setActive(i); setRunId((r) => r + 1) }
  const replay = () => { autoRef.current = false; setRunId((r) => r + 1) }

  const statusText = {
    idle: 'Waiting for a call',
    ringing: 'Incoming call…',
    live: `On call · ${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`,
    ended: booked ? 'Call ended · booked' : 'Call ended',
  }[status]

  const visibleTools = tools.slice(-3)

  return <div className="demo" ref={rootRef} role="region" aria-label="Scripted demo of an AI receptionist answering a phone call">
    <div className="demo-head">
      <span className="demo-label"><i aria-hidden="true" />AI RECEPTIONIST · IN ACTION</span>
      <div className="demo-controls">
        {speechOk && <button type="button" onClick={() => setSound((s) => !s)} aria-pressed={sound} aria-label={sound ? 'Mute voice' : 'Play with voice'} title={sound ? 'Mute voice' : 'Play with voice'}>{sound ? <Volume2 size={16} /> : <VolumeX size={16} />}</button>}
        <button type="button" onClick={replay} aria-label="Replay this call" title="Replay"><RotateCcw size={15} /></button>
      </div>
    </div>

    <div className="demo-tabs" role="tablist" aria-label="Choose a business">
      {demoScenarios.map((s, i) => <button key={s.id} type="button" role="tab" aria-selected={i === active} className={i === active ? 'is-active' : ''} onClick={() => choose(i)}>{s.tab}</button>)}
    </div>

    <div className={`demo-call demo-call-${status}`}>
      <span className="demo-call-icon"><PhoneCall size={16} /></span>
      <div><strong>{scenario.business}</strong><span>{statusText}</span></div>
      <span className="demo-wave" aria-hidden="true"><i /><i /><i /><i /><i /></span>
    </div>

    <div className="demo-transcript" ref={transcriptRef} aria-live="off">
      {lines.length === 0 && <p className="demo-empty">{status === 'ringing' ? 'Answering…' : 'The AI picks up in under a second.'}</p>}
      {lines.map((l, i) => <div key={i} className={`demo-line demo-line-${l.who}`}>
        <span className="demo-who">{l.who === 'ai' ? 'AI' : 'Caller'}</span>
        <p>{l.text}{l.typing && <span className="demo-caret" aria-hidden="true" />}</p>
      </div>)}
    </div>

    <div className="demo-tools" aria-label="Actions the AI took">
      {visibleTools.length === 0 && <span className="demo-tools-empty">Actions will appear here</span>}
      {visibleTools.map((t, i) => <div key={`${t.name}-${tools.length - visibleTools.length + i}`} className={`demo-tool ${t.done ? 'is-done' : ''}`}>
        <span className="demo-tool-state" aria-hidden="true">{t.done ? <Check size={12} /> : <i />}</span>
        <code>{t.name}(<em>{t.args}</em>)</code>
        {t.done && <span className="demo-tool-result">→ {t.result}</span>}
      </div>)}
    </div>

    <div className={`demo-card ${booked ? 'is-booked' : ''}`}>
      <div className="demo-card-head">
        <span><CalendarCheck size={15} />{scenario.cardTitle}</span>
        <span className="demo-stamp">{booked ? <><Check size={12} /> BOOKED</> : 'FILLING IN…'}</span>
      </div>
      <dl>{scenario.fields.map(([key, label]) => <div key={key} className={fresh === key ? 'is-fresh' : ''}>
        <dt>{label}</dt><dd>{fields[key] || <span className="demo-pending">—</span>}</dd>
      </div>)}</dl>
    </div>

    <div className="demo-note">
      <span>Scripted replay</span>
      <a href={`tel:${liveDemo.tel}`}><Phone size={15} aria-hidden="true" /><span>Hear the real one: <strong>{liveDemo.display}</strong></span></a>
    </div>
  </div>
}
