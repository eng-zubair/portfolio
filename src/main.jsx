import React from 'react'
import { createRoot } from 'react-dom/client'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, BriefcaseBusiness,
  Check, Code2, Download, Github, Globe2, Linkedin, Mail, MapPin,
  Menu, MessageCircle, MoveUpRight, Phone, Sparkles, X,
} from 'lucide-react'
import { experience, profile, projects, skills, training } from './data'
import './index.css'

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] } },
}

function Reveal({ children, className = '', delay = 0 }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.16 }}
      transition={{ delay }}
    >{children}</motion.div>
  )
}

function Mark({ light = false }) {
  return <a className={`brand-mark ${light ? 'brand-mark-light' : ''}`} href="#home" aria-label="Zubair Chohan, home">ZC<span>.</span></a>
}

function Header() {
  const [open, setOpen] = React.useState(false)
  const nav = [['About', '#about'], ['Work', '#work'], ['Experience', '#experience'], ['Contact', '#contact']]
  React.useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])
  return <header className="topbar">
    <div className="topbar-inner">
      <Mark />
      <nav id="main-nav" className={open ? 'nav-links nav-open' : 'nav-links'} aria-label="Main navigation">
        {nav.map(([label, href], i) => <a key={label} className={i === 3 ? 'nav-contact' : ''} href={href} onClick={() => setOpen(false)}>{label}{i === 3 && <ArrowUpRight size={14} />}</a>)}
      </nav>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="main-nav" aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X size={22} /> : <Menu size={22} />}</button>
    </div>
  </header>
}

function Eyebrow({ children, light = false }) { return <div className={`eyebrow ${light ? 'eyebrow-light' : ''}`}><span className="eyebrow-dot" />{children}</div> }

function Hero() {
  return <section className="hero section-wrap" id="home">
    <div className="hero-grid">
      <div className="hero-copy">
        <Reveal><Eyebrow>AI PRODUCT ENGINEER · LAHORE, PAKISTAN</Eyebrow></Reveal>
        <Reveal delay={0.08}><h1>Voice AI that<br /><span className="serif-accent">picks up.</span></h1></Reveal>
        <Reveal delay={0.14}><p className="hero-description">I’m <strong>Zubair</strong> — I build AI-powered products: voice agents that answer calls and book appointments, and fast web apps with React.js and Next.js. I built <strong>CallSharp.ai</strong>, an AI receptionist for US businesses.</p></Reveal>
        <Reveal delay={0.2}><div className="hero-actions">
          <a className="button button-dark" href="#work">Explore my work <ArrowDownRight size={17} /></a>
          <a className="text-link" href="/Zubair_Ahmad_Chohan_CV.pdf" download>Download CV <Download size={15} /></a>
        </div></Reveal>
        <Reveal delay={0.28}><div className="hero-meta"><span><MapPin size={14} /> Lahore, Pakistan</span><span className="meta-separator" /><span><Code2 size={14} /> Freelance since March 2023</span></div></Reveal>
      </div>
      <Reveal className="hero-visual" delay={0.18}>
        <div className="hero-art" aria-label="Abstract green and ink geometric artwork">
          <div className="art-orbit art-orbit-one" /><div className="art-orbit art-orbit-two" />
          <div className="art-sun" /><div className="art-capsule" /><div className="art-arc" />
          <div className="art-grid" />
          <div className="art-index">LAHORE · PK <span>31.5204° N</span></div>
          <div className="art-caption"><span>GOOD IDEAS<br />DESERVE GOOD<br />EXECUTION.</span><ArrowUpRight size={20} /></div>
          <div className="art-monogram">Z<span>.</span></div>
        </div>
        <div className="visual-foot"><span>DESIGN MINDED. ENGINEERING LED.</span><span>AI · VOICE · WEB</span></div>
      </Reveal>
    </div>
    <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
  </section>
}

function Marquee() {
  return <div className="marquee" aria-hidden="true"><div className="marquee-track">{Array.from({ length: 2 }).map((_, i) => <div className="marquee-run" key={i}><span>VOICE AI AGENTS</span><i>✳</i><span>VAPI</span><i>✳</i><span>GPT-4O-MINI</span><i>✳</i><span>TWILIO</span><i>✳</i><span>REACT.JS</span><i>✳</i><span>NEXT.JS</span><i>✳</i></div>)}</div></div>
}

function SectionHeading({ index, eyebrow, title, detail }) {
  return <div className="section-heading"><div><span className="section-index">{index}</span><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2></div>{detail && <p className="section-detail">{detail}</p>}</div>
}

function About() {
  return <section className="section-wrap about-section" id="about">
    <Reveal><SectionHeading index="01" eyebrow="A LITTLE ABOUT ME" title={<>More than just<br /><span className="serif-accent">the code.</span></>} /></Reveal>
    <div className="about-content">
      <Reveal className="about-intro"><p className="large-copy">With a background in computer science, network operations and financial advisory, I bring a wider lens to every product I help build.</p><p className="body-copy">For 3+ years, I’ve worked with clients to shape web and AI-powered solutions that solve practical problems. I enjoy the full journey: understanding what people need, finding a clear way forward, and building it with care.</p><a className="underlined-link" href="#experience">A little more about my journey <ArrowRight size={16} /></a></Reveal>
      <Reveal className="about-aside" delay={0.1}><div className="aside-card"><span className="aside-icon"><Code2 size={20} /></span><div><span className="aside-label">MY APPROACH</span><strong>Useful first.<br />Beautiful by design.</strong></div><Sparkles className="aside-spark" size={19} /></div><div className="aside-footnote">A good interface respects your time.<br />A good product earns your trust.</div></Reveal>
    </div>
  </section>
}

function Projects() {
  return <section className="work-section" id="work"><div className="section-wrap work-inner">
    <Reveal><SectionHeading index="02" eyebrow="SELECTED CLIENT WORK" title={<>Good work,<br /><span className="serif-accent">real-world purpose.</span></>} detail="A look at two active client projects exploring very different sides of the web." /></Reveal>
    <div className="project-grid">{projects.map((project, i) => <Reveal key={project.name} delay={i * 0.1}><article className="project-card">
      <a className={`project-art project-art-${project.color}`} href={project.url} target="_blank" rel="noreferrer" aria-label={`Visit ${project.name}`}>
        <div className="project-art-top"><span>{project.number} / SELECTED PROJECT</span><span className="project-open"><ArrowUpRight size={18} /></span></div>
        <div className={`project-glyph glyph-${project.color}`}><span>{project.mark}</span><i /><i /><i /></div>
        <div className="project-art-bottom"><span>PRODUCT<br />IN PROGRESS</span><Globe2 size={17} /></div>
      </a>
      <div className="project-info"><div><span className="project-type">{project.type}</span><h3><a href={project.url} target="_blank" rel="noreferrer">{project.name}<ArrowUpRight size={18} /></a></h3></div><span className="project-scope">{project.scope}</span></div>
      <p className="project-description">{project.description}</p>
      {project.stack && <ul className="project-stack" aria-label="Tech stack">{project.stack.map((s) => <li key={s}>{s}</li>)}</ul>}
      <div className="project-divider"><span>CLIENT COLLABORATION</span><span>↗</span></div>
    </article></Reveal>)}</div>
    <Reveal><div className="work-note"><span className="note-star">✳</span><p>Thoughtful products begin with a simple question:<br /><em>what would make this easier for someone?</em></p></div></Reveal>
  </div></section>
}

function Skills() {
  return <section className="section-wrap skills-section"><Reveal><SectionHeading index="03" eyebrow="TOOLS OF THE TRADE" title={<>Curious by nature.<br /><span className="serif-accent">Practical by choice.</span></>} detail="A toolkit for building useful things — and the curiosity to keep learning." /></Reveal>
    <div className="skills-layout"><Reveal className="skills-lead"><div className="skill-icon"><BriefcaseBusiness size={20} /></div><span className="aside-label">CORE TOOLKIT</span><h3>From interface<br />to infrastructure.</h3><p>Voice AI and modern web apps are my focus, backed by years of hands-on experience supporting systems, networks and people.</p></Reveal><Reveal className="skill-cloud" delay={0.1}><div className="skill-cloud-head"><span>TECHNICAL SKILLS</span><span>{String(skills.length).padStart(2, '0')} ITEMS</span></div><div className="skill-tags">{skills.map((skill, i) => <span className={i < 6 ? 'skill-tag skill-tag-highlight' : 'skill-tag'} key={skill}>{i < 6 && <Check size={13} />}{skill}</span>)}</div></Reveal></div>
  </section>
}

function Experience() {
  return <section className="experience-section" id="experience"><div className="section-wrap experience-inner">
    <Reveal><SectionHeading index="04" eyebrow="THE ROAD SO FAR" title={<>A career built<br /><span className="serif-accent">on adaptability.</span></>} detail="Different industries. A shared thread: solving problems and supporting people." /></Reveal>
    <div className="experience-list">{experience.map((job, i) => <Reveal key={job.role} delay={i * 0.04}><article className={`experience-item ${job.current ? 'experience-current' : ''}`}>
      <div className="experience-period"><span className="timeline-dot" />{job.period}</div><div className="experience-main"><div className="experience-title"><h3>{job.role}</h3>{job.current && <span className="current-pill"><i /> CURRENT</span>}</div><span className="experience-company">{job.company}</span><p>{job.description}</p></div><span className="experience-number">0{i + 1}</span>
    </article></Reveal>)}</div>
  </div></section>
}

function Education() {
  return <section className="section-wrap education-section"><Reveal><SectionHeading index="05" eyebrow="LEARNING, ALWAYS" title={<>Grounded in the<br /><span className="serif-accent">fundamentals.</span></>} /></Reveal>
    <div className="education-layout"><Reveal className="education-degree"><span className="aside-label">EDUCATION</span><span className="degree-year">2003</span><h3>Bachelor of Science<br />in Computer Science</h3><p>AL-KHAIR University<br />Islamabad, Pakistan</p></Reveal><Reveal className="education-training" delay={0.1}><span className="aside-label">RECENT TRAINING</span>{training.map(([year, title, details]) => <div className="training-row" key={title}><span>{year}</span><div><strong>{title}</strong><p>{details}</p></div><ArrowUpRight size={15} /></div>)}</Reveal></div>
  </section>
}

function Contact() {
  return <footer className="contact-section" id="contact"><div className="contact-top section-wrap"><Reveal><Eyebrow light>HAVE A GOOD ONE IN MIND?</Eyebrow><h2>Let’s make<br /><span className="serif-accent">it happen.</span></h2><a className="contact-cta" href={`mailto:${profile.email}`}>Start a conversation <ArrowUpRight size={19} /></a></Reveal><Reveal className="contact-side" delay={0.1}><span className="contact-label">GET IN TOUCH</span><a href={`mailto:${profile.email}`}><Mail size={16} />{profile.email}</a><a href={`tel:${profile.phone.replaceAll(' ', '')}`}><Phone size={16} />{profile.phone}</a><a href={profile.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={16} />Chat on WhatsApp</a><div className="social-links"><a href={profile.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={17} /></a><a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a><a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a><a href={`mailto:${profile.email}`} aria-label="Email"><Mail size={17} /></a></div></Reveal></div>
    <div className="footer-bottom section-wrap"><Mark light /><span>© {new Date().getFullYear()} {profile.name}</span><span>MADE WITH INTENTION · LAHORE, PK</span><a href="#home">BACK TO TOP <MoveUpRight size={13} /></a></div>
  </footer>
}

function WhatsAppButton() {
  return <a className="whatsapp-float" href={profile.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat with Zubair on WhatsApp"><MessageCircle size={20} /><span>WhatsApp</span></a>
}

function App() {
  return <><Header /><main><Hero /><Marquee /><About /><Projects /><Skills /><Experience /><Education /></main><Contact /><WhatsAppButton /></>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)
