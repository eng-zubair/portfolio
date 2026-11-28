// Pre-written answers for the suggested questions: instant and free (no API call).
import { caseStudy, profile } from './data'

const whatsapp = { label: 'Message Zubair on WhatsApp', href: profile.whatsapp, external: true }
const callDemo = { label: `Call the live demo · ${caseStudy.liveDemo.display}`, href: `tel:${caseStudy.liveDemo.tel}` }

export const suggestedQuestions = [
  {
    q: 'What is CallSharp.ai?',
    a: `CallSharp.ai is an AI voice receptionist for US home-service businesses like plumbers and HVAC crews. It answers every call 24/7, understands the job, checks the service area, books the visit into the calendar and alerts the owner by SMS and email.\n\nZubair built the voice agent (Vapi + GPT-4o-mini), the Twilio phone line, the booking flow and the business dashboard. You can hear it yourself — call ${caseStudy.liveDemo.label}.`,
    actions: [callDemo],
  },
  {
    q: 'What could AI do for my business?',
    a: 'A few common wins:\n- An AI receptionist that answers calls and books appointments, day or night\n- A website or WhatsApp assistant that answers FAQs and captures leads\n- Automations that turn calls and messages into summaries, follow-ups and CRM entries\n\nTell me a little about your business and I’ll suggest where to start — or describe it to Zubair directly.',
    actions: [whatsapp],
  },
  {
    q: 'What’s your tech stack?',
    a: 'Voice AI: Vapi, OpenAI GPT-4o-mini and Twilio.\nApplied AI: Google Gemini (structured output and vision) and the Claude API.\nWeb: React, Next.js, TypeScript and Tailwind CSS.\nBackend: Node.js, Express, PostgreSQL, Supabase and Drizzle ORM.\nPayments & email: Stripe and Resend.\n\nCallSharp.ai is a Next.js + TypeScript app on Supabase, with Vapi, GPT-4o-mini and Twilio for calls, Stripe for billing and Resend for email. Sanatzar.cloud, a multi-vendor marketplace, runs on React + Vite with an Express API, PostgreSQL and Drizzle ORM. Dastarkhwan, my AI cooking assistant, is a Next.js 16 + TypeScript app using Google Gemini, tested with Vitest and Playwright.',
  },
  {
    q: 'How much does a project cost?',
    a: 'Every project is scoped individually — it depends on what the AI needs to do, which tools it connects to (phone, calendar, CRM, WhatsApp) and how polished the first version should be.\n\nSend Zubair a short description and he’ll come back with a scope and a quote.',
    actions: [whatsapp],
  },
  {
    q: 'How do I contact Zubair?',
    a: `The quickest way is WhatsApp (${profile.phone}). You can also email ${profile.email} or connect on LinkedIn.`,
    actions: [whatsapp, { label: 'Email Zubair', href: `mailto:${profile.email}` }],
  },
]
