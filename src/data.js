export const profile = {
  name: 'Zubair Ahmad Chohan',
  role: 'AI Product Engineer',
  location: 'Lahore, Pakistan',
  email: 'zachohan85@gmail.com',
  phone: '+92 300 4413332',
  whatsapp: 'https://wa.me/923004413332?text=' + encodeURIComponent('Hi Zubair, I saw your portfolio and would like to discuss a project.'),
  linkedin: 'https://www.linkedin.com/in/zubair-ahmad-02abbb186',
  github: 'https://github.com/eng-zubair',
}

export const projects = [
  {
    number: '01',
    name: 'CallSharp.ai',
    type: 'VOICE AI RECEPTIONIST · SAAS',
    description: 'An AI voice receptionist that answers business calls around the clock, understands what callers need and helps book the work.',
    stack: ['Vapi', 'GPT-4o-mini', 'Twilio'],
    image: { src: '/work/callsharp-landing.jpg', width: 770, height: 545, alt: 'CallSharp landing page: Every call answered. Every job captured.' },
    scope: 'Client project · United States',
    mark: 'C',
    color: 'violet',
    url: 'https://callsharp.ai',
  },
  {
    number: '02',
    name: 'Sanatzar.cloud',
    type: 'MULTI-VENDOR · E-COMMERCE',
    description: 'A multi-vendor marketplace for Punjab’s GI-certified handicrafts — artisan stores, district-wise catalogue, cart, wishlist and compare, orders and delivery tracking.',
    stack: ['React.js', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    image: { src: '/work/sanatzar-home.jpg', width: 1100, height: 659, alt: 'Sanatzar homepage: Discover Punjab’s Authentic Handicrafts' },
    scope: 'Client project · Pakistan',
    mark: 'S',
    color: 'lime',
    url: 'https://sanatzar.cloud',
  },
]

export const caseStudy = {
  name: 'CallSharp.ai',
  problem: 'Plumbers, electricians and HVAC crews are on the job when the phone rings — and most customers hire whoever picks up first.',
  solution: 'CallSharp answers every call 24/7, understands the job, books it straight into the calendar and alerts the business by SMS and email.',
  built: 'The voice agent (Vapi + GPT-4o-mini), the phone line (Twilio), the booking flow, SMS and email alerts, and the business dashboard with recordings, AI summaries and transcripts.',
  steps: [
    ['Answers instantly', 'Picks up every call within seconds, day or night. No voicemail.'],
    ['Qualifies the job', 'Asks the right questions to understand the problem and urgency.'],
    ['Books the visit', 'Checks the service area and books a time while the caller is on the line.'],
    ['Logs & alerts', 'Saves the recording, transcript and AI summary, then notifies the owner.'],
  ],
  liveDemo: { label: 'Mike’s Plumbing', display: '+1 (855) 910-1334', tel: '+18559101334' },
  shots: [
    { src: '/work/callsharp-dashboard.jpg', width: 1400, height: 1240, alt: 'CallSharp business dashboard showing calls, appointments, minutes and SMS usage', caption: 'Business dashboard — calls, bookings, minutes and SMS at a glance.' },
    { src: '/work/callsharp-call-detail.jpg', width: 1300, height: 1445, alt: 'A CallSharp call record with AI summary, transcript and the booked appointment', caption: 'Every call — AI summary, full transcript and the booked appointment. Personal details hidden.' },
  ],
}

export const skills = [
  'Voice AI agents (Vapi)', 'OpenAI GPT-4o-mini', 'Twilio', 'React.js', 'Next.js', 'JavaScript',
  'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Redux', 'React Router', 'HTML5 & CSS3', 'Responsive design',
]

export const experience = [
  {
    period: 'MAR 2023 — NOW',
    role: 'Freelance Web Developer',
    company: 'Independent · Client projects',
    description: 'Building AI voice agents and web products for clients — including CallSharp.ai, an AI receptionist built with Vapi, GPT-4o-mini and Twilio.',
    current: true,
  },
  {
    period: 'JAN 2014 — NOV 2023',
    role: 'Financial Advisor',
    company: 'Dar Alliance',
    description: 'Supported client-facing financial services and day-to-day advisory responsibilities.',
  },
  {
    period: 'OCT 2010 — DEC 2013',
    role: 'Network Operations Support Engineer',
    company: 'Bank Alfalah · IT Data Center, Lahore',
    description: 'Supported branch WAN and LAN operations, tracked incidents, coordinated with vendors, and maintained infrastructure records.',
  },
  {
    period: 'JAN 2006 — OCT 2010',
    role: 'Operations Support Engineer',
    company: 'Opera Textile Mills · Lahore',
    description: 'Maintained business software and operational records, supported computer systems, and coordinated office operations.',
  },
]

export const training = [
  ['2024', 'Advanced Web Development', 'React.js, Hooks, Redux, React Router & Next.js · Udemy'],
  ['2024', 'JavaScript Web Development', 'Udemy'],
  ['2023', 'Front-End Web Development', 'HTML5, CSS3, Flexbox & CSS Grid · Udemy'],
]
