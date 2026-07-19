import { useState, useEffect, useRef, useCallback } from 'react'

/* ═══════════════════════════════════════════════════════════════════
   DATA LAYER — swap real content here; shape stays fixed
   ═══════════════════════════════════════════════════════════════════ */

const PROJECTS = [
  {
    id: 'commerce-platform',
    name: 'Commerce Platform',
    desc: 'Full-featured e-commerce engine with real-time inventory, WebSocket order tracking, and Stripe integration — handling 50 k+ SKUs.',
    stack: ['Node.js', 'React', 'MongoDB', 'Redis', 'Stripe'],
    status: 'live',
    link: '#',
  },
  {
    id: 'realtime-chat',
    name: 'Real-time Chat',
    desc: 'Scalable chat service using Socket.io rooms, JWT auth, and message persistence — sub-100ms round-trip on commodity hardware.',
    stack: ['Socket.io', 'Express', 'React', 'MongoDB'],
    status: 'live',
    link: '#',
  },
]

const SKILLS = [
  { icon: '⚡', name: 'Real-time Systems', desc: 'WebSocket, Socket.io, event queues, Redis pub/sub — built for latency-sensitive workloads.' },
  { icon: '🏗️', name: 'Backend Architecture', desc: 'REST & GraphQL APIs on Express/Node, MongoDB schemas, auth patterns, Docker deployments.' },
  { icon: '✦', name: 'Frontend Craft', desc: 'React component systems, responsive layouts, state management, smooth animation without libraries.' },
]

/* ───────────────────────────────────────────────────────────────────
   VIRTUAL FILESYSTEM  — mirrors real project architecture in a JS object.
   NOTE: In production, ls/cd/cat/stats would call a real Express API
   backed by MongoDB (GET /api/fs?path=..., GET /api/stats).
   The mock functions below are structured so swapping in real fetch()
   calls is a drop-in change — just replace the synchronous return with
   an async fetch, then await the result in runCommand().
   ─────────────────────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════
   PORTFOLIO DATA — ✏ REPLACE WITH YOUR REAL INFO.
   All terminal cards read from this object. Shape stays fixed;
   just edit the values without touching rendering logic.
   ═══════════════════════════════════════════════════════════════════ */
const PORTFOLIO_DATA = {
  // ── Resume ──────────────────────────────────────────────────────────
  resume: {
    name: 'Brijesh',
    role: 'Full-Stack Developer',
    experience: '2+ yrs building production MERN systems',
    stack: 'Node.js · React · MongoDB · Socket.io · Redis',
    // ↓ Replace with your real hosted resume URL
    downloadUrl: '/resume.pdf',
  },

  // ── Skills (rendered as pill groups) ────────────────────────────────
  skills: [
    { group: 'frontend',  tags: ['React', 'Vite', 'CSS', 'TypeScript', 'D3.js'] },
    { group: 'backend',   tags: ['Node.js', 'Express', 'REST', 'GraphQL', 'Socket.io'] },
    { group: 'database',  tags: ['MongoDB', 'Redis', 'PostgreSQL', 'ClickHouse'] },
    { group: 'tools',     tags: ['Docker', 'Nginx', 'Git', 'JWT', 'Stripe', 'Linux'] },
  ],

  // ── Projects ─────────────────────────────────────────────────────────
  projects: [
    {
      id: 'commerce-platform',
      name: 'Commerce Platform',
      status: 'live',
      problem: 'Multi-tenant store needed real-time inventory + checkout without polling.',
      solution: 'MERN engine: WebSocket inventory sync, Redis pub/sub, Stripe webhooks.',
      stack: ['Node.js', 'React', 'MongoDB', 'Redis', 'Stripe'],
      link: '#',
    },
    {
      id: 'realtime-chat',
      name: 'Real-time Chat',
      status: 'live',
      problem: 'Teams needed sub-100ms chat with persistent history and room isolation.',
      solution: 'Socket.io rooms + JWT auth + TTL-indexed MongoDB message store.',
      stack: ['Socket.io', 'Express', 'React', 'MongoDB'],
      link: '#',
    },
    {
      id: 'analytics-dashboard',
      name: 'Analytics Dashboard',
      status: 'in dev',
      problem: 'Live event pipeline needed real-time OLAP queries without page refresh.',
      solution: 'Node.js ingestion → ClickHouse → WebSocket push → D3.js charts.',
      stack: ['Node.js', 'ClickHouse', 'React', 'D3.js'],
      link: '#',
    },
  ],

  // ── Contact ───────────────────────────────────────────────────────────
  contact: {
    email: 'brijesh@example.com',
    github: { label: 'github.com/brijesh',      href: 'https://github.com' },
    linkedin: { label: 'linkedin.com/in/brijesh', href: 'https://linkedin.com' },
    availability: 'Open to full-time roles & senior contracts',
  },
}

const VFS = {
  '~':                          ['projects/', 'skills/', 'resume/', 'contact/'],
  '~/projects':                 ['commerce-platform/', 'realtime-chat/', 'analytics-dashboard/'],
  '~/projects/commerce-platform':  ['README.md', 'src/', 'schema.js', 'docker-compose.yml'],
  '~/projects/realtime-chat':      ['README.md', 'src/', 'socket/', 'auth.js'],
  '~/projects/analytics-dashboard':['README.md', 'src/', 'pipeline/', 'schema.js'],
  '~/skills':                   ['frontend.json', 'backend.json', 'database.json', 'tools.json'],
  '~/resume':                   ['resume.pdf'],
  '~/contact':                  ['contact.json'],
}

// ─── Full resume content — rendered by `resume`, `open resume`, `cat resume.pdf`, `cat resume.md`
const RESUME_LINES = [
  { type: 'hl',  text: '╔══════════════════════════════════════════════════════╗' },
  { type: 'hl',  text: '║              ADITYA  —  Full-Stack Developer         ║' },
  { type: 'hl',  text: '╚══════════════════════════════════════════════════════╝' },
  { type: 'out', text: '' },
  { type: 'out', text: '  brijesh@example.com  |  github.com/brijesh  |  India' },
  { type: 'out', text: '  linkedin.com/in/brijesh  |  Open to full-time & contracts' },
  { type: 'out', text: '' },
  { type: 'hl',  text: '── SUMMARY ─────────────────────────────────────────────' },
  { type: 'out', text: '  Full-Stack Developer with strong expertise in the MERN' },
  { type: 'out', text: '  stack. Built and deployed real-time systems, REST APIs,' },
  { type: 'out', text: '  and scalable backend architectures. Comfortable across' },
  { type: 'out', text: '  the full stack from MongoDB schemas to React UIs.' },
  { type: 'out', text: '' },
  { type: 'hl',  text: '── SKILLS ──────────────────────────────────────────────' },
  { type: 'out', text: '  Languages    JavaScript (ES2022+), TypeScript, SQL' },
  { type: 'out', text: '  Frontend     React, Vite, CSS, HTML5, D3.js' },
  { type: 'out', text: '  Backend      Node.js, Express, REST, GraphQL, Socket.io' },
  { type: 'out', text: '  Database     MongoDB, Redis, PostgreSQL, ClickHouse' },
  { type: 'out', text: '  Auth         JWT, OAuth2, bcrypt, session management' },
  { type: 'out', text: '  DevOps       Docker, Nginx, Git, GitHub Actions, Linux' },
  { type: 'out', text: '  Payments     Stripe API, webhooks, subscription billing' },
  { type: 'out', text: '' },
  { type: 'hl',  text: '── PROJECTS ────────────────────────────────────────────' },
  { type: 'hl',  text: '  Commerce Platform                              [live]' },
  { type: 'out', text: '  Full-featured MERN e-commerce engine' },
  { type: 'out', text: '  • Real-time inventory sync via WebSocket + Redis pub/sub' },
  { type: 'out', text: '  • Stripe payments with webhook order pipeline' },
  { type: 'out', text: '  • 50 k+ SKUs, <200ms API p95, zero-polling order tracking' },
  { type: 'out', text: '  Stack: Node.js · React · MongoDB · Redis · Stripe' },
  { type: 'out', text: '' },
  { type: 'hl',  text: '  Real-time Chat                                 [live]' },
  { type: 'out', text: '  Low-latency chat service with rooms & persistence' },
  { type: 'out', text: '  • Socket.io room namespacing + server-side fan-out' },
  { type: 'out', text: '  • JWT auth middleware, TTL-indexed message history' },
  { type: 'out', text: '  • Sub-100ms round-trip on commodity VPS' },
  { type: 'out', text: '  Stack: Socket.io · Express · MongoDB · React' },
  { type: 'out', text: '' },
  { type: 'hl',  text: '  Analytics Dashboard                         [in dev]' },
  { type: 'out', text: '  Real-time analytics pipeline with live chart updates' },
  { type: 'out', text: '  • Node.js event ingestion + ClickHouse OLAP queries' },
  { type: 'out', text: '  • WebSocket push → React + D3.js charts' },
  { type: 'out', text: '  Stack: Node.js · ClickHouse · React · D3.js' },
  { type: 'out', text: '' },
  { type: 'hl',  text: '── EDUCATION ───────────────────────────────────────────' },
  { type: 'out', text: '  B.Tech Computer Science  |  2022 – 2026' },
  { type: 'out', text: '' },
  { type: 'hl',  text: '── STATS ───────────────────────────────────────────────' },
  { type: 'out', text: '  LeetCode     312 problems solved' },
  { type: 'out', text: '  Streak        37 days active' },
  { type: 'out', text: '  GitHub        28 public repositories' },
  { type: 'out', text: '  Deployments   2h ago (latest)' },
  { type: 'out', text: '' },
  { type: 'hl',  text: '────────────────────────────────────────────────────────' },
  { type: 'out', text: '  type  stats          for live numbers' },
  { type: 'out', text: '  type  open <project>  for case studies' },
  { type: 'out', text: '' },
]

const FILE_CONTENT = {
  'skills.json': `{\n  "core": ["Node.js", "React", "MongoDB", "Express"],\n  "realtime": ["Socket.io", "Redis", "WebSockets"],\n  "tools": ["Docker", "Git", "Nginx", "JWT"],\n  "currently_learning": ["Go", "tRPC", "Kafka"]\n}`,
  'contact.json': `{\n  "email": "brijesh@example.com",\n  "github": "github.com/brijesh",\n  "linkedin": "linkedin.com/in/brijesh",\n  "available_for": "full-time roles, senior contracts"\n}`,
  // resume.pdf and resume.md both render RESUME_LINES — handled specially in cat/open
  'resume.pdf': '__RESUME__',
  'resume.md':  '__RESUME__',
  '~/projects/commerce-platform/README.md': `# Commerce Platform\n\nFull-featured e-commerce engine built on the MERN stack.\n\n## Stack\n- Node.js + Express (REST API)\n- MongoDB (product catalog, orders)\n- Redis (inventory cache, sessions)\n- React (storefront + admin dashboard)\n- Stripe (payments)\n\n## Key numbers\n- 50 k+ SKUs with real-time inventory sync\n- Sub-200ms API p95 latency\n- WebSocket order tracking, zero-polling`,
  '~/projects/realtime-chat/README.md': `# Real-time Chat\n\nScalable chat service with rooms, presence, and persistence.\n\n## Stack\n- Socket.io (transport)\n- Express + JWT (auth)\n- MongoDB (message history)\n- React (client UI)\n\n## Architecture\n- Room-based namespacing\n- Server-side event fan-out\n- Persisted message windows (TTL indexed)\n- Sub-100ms round-trip on commodity VPS`,
  '~/projects/analytics-dashboard/README.md': `# Analytics Dashboard (WIP)\n\nReal-time analytics pipeline with live chart updates.\n\n## Stack\n- Node.js event pipeline\n- ClickHouse (OLAP queries)\n- React + D3.js (charts)\n- WebSocket push\n\n## Status\n  In active development — ETA Q3 2026`,
  '~/projects/commerce-platform/schema.js': `// MongoDB schemas for Commerce Platform\nconst productSchema = new Schema({\n  name: String, sku: { type: String, unique: true },\n  price: Number, inventory: Number,\n  updatedAt: { type: Date, default: Date.now }\n});\n\nconst orderSchema = new Schema({\n  userId: ObjectId, items: [{ sku: String, qty: Number }],\n  status: { type: String, enum: ['pending','paid','shipped','done'] },\n  stripeId: String, createdAt: { type: Date, default: Date.now }\n});`,
  '~/projects/realtime-chat/auth.js': `// JWT auth middleware\nexport const protect = async (req, res, next) => {\n  const token = req.headers.authorization?.split(' ')[1];\n  if (!token) return res.status(401).json({ msg: 'No token' });\n  try {\n    req.user = jwt.verify(token, process.env.JWT_SECRET);\n    next();\n  } catch { res.status(401).json({ msg: 'Invalid token' }); }\n};`,
}

// ─── Markdown content for .md files ─────────────────────────────────────────
const RESUME_MD = `# Brijesh — Full-Stack Developer

> brijesh@example.com &nbsp;·&nbsp; github.com/brijesh &nbsp;·&nbsp; linkedin.com/in/brijesh &nbsp;·&nbsp; India

Open to **full-time roles** and senior contracts.

---

## Summary

Full-Stack Developer with strong expertise in the MERN stack. Built and deployed
real-time systems, REST APIs, and scalable backend architectures from MongoDB schemas
through to React UIs.

## Skills

| Category | Technologies |
|---|---|
| Languages | JavaScript (ES2022+), TypeScript, SQL |
| Frontend | React, Vite, CSS, HTML5, D3.js |
| Backend | Node.js, Express, REST, GraphQL, Socket.io |
| Database | MongoDB, Redis, PostgreSQL, ClickHouse |
| Auth | JWT, OAuth2, bcrypt, session management |
| DevOps | Docker, Nginx, Git, GitHub Actions, Linux |
| Payments | Stripe API, webhooks, subscription billing |

## Projects

### Commerce Platform \`[live]\`

Full-featured MERN e-commerce engine handling 50 k+ SKUs.

- Real-time inventory sync via WebSocket + Redis pub/sub
- Stripe payments with full webhook order pipeline
- Sub-200ms API p95 latency, zero-polling order tracking

**Stack:** Node.js · React · MongoDB · Redis · Stripe

### Real-time Chat \`[live]\`

Low-latency chat service with rooms & persistence.

- Socket.io room namespacing + server-side fan-out
- JWT auth middleware, TTL-indexed message history
- Sub-100ms round-trip on commodity VPS

**Stack:** Socket.io · Express · MongoDB · React

### Analytics Dashboard \`[in dev]\`

Real-time analytics pipeline with live chart updates.

- Node.js event ingestion + ClickHouse OLAP queries
- WebSocket push → React + D3.js charts
- ETA: Q3 2026

**Stack:** Node.js · ClickHouse · React · D3.js

## Education

**B.Tech Computer Science** — 2022–2026

## Stats

- **LeetCode:** 312 problems solved
- **Streak:** 37 days active
- **GitHub:** 28 public repositories
- **Latest deploy:** 2h ago

---

*Available for full-time roles and senior contracts.*
`

const COMMERCE_MD = `# Commerce Platform

Full-featured e-commerce engine built on the MERN stack.

## Stack

- **Node.js + Express** — REST API, middleware, auth
- **MongoDB** — product catalog, orders, users
- **Redis** — inventory cache, session store, pub/sub
- **React** — storefront + admin dashboard
- **Stripe** — payments, webhooks, subscription billing

## Key Numbers

| Metric | Value |
|---|---|
| SKUs supported | 50 000+ |
| API p95 latency | < 200ms |
| Order tracking | WebSocket, zero-polling |
| Uptime | 99.8% |

## Architecture

\`\`\`
client → React → REST API (Express)
                      ↓
              MongoDB (catalog, orders)
              Redis   (cache, pub/sub)
              Stripe  (payments)
                      ↓
             WebSocket → client (order updates)
\`\`\`

## Getting Started

\`\`\`bash
git clone https://github.com/brijesh/commerce-platform
npm install
npm run dev
\`\`\`

> See \`schema.js\` for MongoDB data models.
`

const CHAT_MD = `# Real-time Chat

Scalable chat service with rooms, presence, and persistence.

## Stack

- **Socket.io** — transport layer, room namespacing
- **Express + JWT** — REST API + authentication
- **MongoDB** — message history with TTL indexes
- **React** — client UI

## Architecture

\`\`\`
client  ←→  Socket.io (rooms)
                 ↓
          Express (auth, REST)
                 ↓
          MongoDB (messages, TTL)
\`\`\`

## Performance

- Sub-100ms round-trip on commodity VPS
- Room-based fan-out, server-side only
- TTL-indexed message windows (configurable retention)

## Getting Started

\`\`\`bash
git clone https://github.com/brijesh/realtime-chat
npm install
npm run dev
\`\`\`

> See \`auth.js\` for JWT middleware implementation.
`

const ANALYTICS_MD = `# Analytics Dashboard

> Status: **In active development** — ETA Q3 2026

Real-time analytics pipeline with live chart updates.

## Stack

- **Node.js** — event ingestion pipeline
- **ClickHouse** — OLAP queries at scale
- **React + D3.js** — live charts
- **WebSocket** — push-based updates (no polling)

## Pipeline

\`\`\`
events → Node.js ingestion → ClickHouse
                                  ↓
                          WebSocket push
                                  ↓
                       React + D3.js charts
\`\`\`

## Roadmap

- [x] Event ingestion service
- [x] ClickHouse schema
- [ ] WebSocket broadcast layer
- [ ] D3.js chart components
- [ ] Auth + multi-tenant isolation
`

// Map every .md file path → its markdown string
const MD_FILES = {
  'resume.md':                                  RESUME_MD,
  '~/resume.md':                                RESUME_MD,
  '~/projects/commerce-platform/README.md':     COMMERCE_MD,
  '~/projects/realtime-chat/README.md':         CHAT_MD,
  '~/projects/analytics-dashboard/README.md':   ANALYTICS_MD,
}

// ─── Markdown parser helpers ──────────────────────────────────────────────────
function parseInline(text) {
  // Handles: **bold**, *italic*, `code`
  const parts = []
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g
  let lastIdx = 0
  let match
  let k = 0
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) parts.push(text.slice(lastIdx, match.index))
    const m = match[0]
    if (m.startsWith('**'))       parts.push(<strong key={k++}>{m.slice(2,-2)}</strong>)
    else if (m.startsWith('*'))   parts.push(<em key={k++}>{m.slice(1,-1)}</em>)
    else if (m.startsWith('`'))   parts.push(<code key={k++} className="md-icode">{m.slice(1,-1)}</code>)
    lastIdx = match.index + m.length
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx))
  return parts.length === 0 ? text : parts.length === 1 && typeof parts[0]==='string' ? parts[0] : parts
}

function parseMarkdown(src) {
  const lines = src.split('\n')
  const out = []
  let i = 0, k = 0
  while (i < lines.length) {
    const line = lines[i]
    // fenced code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const code = []; i++
      while (i < lines.length && !lines[i].startsWith('```')) { code.push(lines[i]); i++ }
      out.push(<pre key={k++} className="md-pre"><code className={`md-codeblock${lang?' lang-'+lang:''}`}>{code.join('\n')}</code></pre>)
      i++; continue
    }
    // headings
    const hm = line.match(/^(#{1,3})\s+(.+)/)
    if (hm) {
      const lvl = hm[1].length
      const Tag = `h${lvl}`
      out.push(<Tag key={k++} className={`md-h${lvl}`}>{parseInline(hm[2])}</Tag>)
      i++; continue
    }
    // blockquote
    if (line.startsWith('> ')) {
      out.push(<blockquote key={k++} className="md-bq">{parseInline(line.slice(2))}</blockquote>)
      i++; continue
    }
    // horizontal rule
    if (/^---+$/.test(line.trim())) {
      out.push(<hr key={k++} className="md-hr" />)
      i++; continue
    }
    // table (line contains | and next line has ---)
    if (line.includes('|') && lines[i+1]?.includes('---')) {
      const headers = line.split('|').map(c=>c.trim()).filter(Boolean)
      i += 2
      const rows = []
      while (i < lines.length && lines[i].includes('|')) {
        rows.push(lines[i].split('|').map(c=>c.trim()).filter(Boolean))
        i++
      }
      out.push(
        <table key={k++} className="md-table">
          <thead><tr>{headers.map((h,j)=><th key={j}>{parseInline(h)}</th>)}</tr></thead>
          <tbody>{rows.map((r,j)=><tr key={j}>{r.map((c,l)=><td key={l}>{parseInline(c)}</td>)}</tr>)}</tbody>
        </table>
      )
      continue
    }
    // unordered list
    if (/^[-*]\s/.test(line)) {
      const items = []
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(<li key={i}>{parseInline(lines[i].replace(/^[-*]\s/,''))}</li>)
        i++
      }
      out.push(<ul key={k++} className="md-ul">{items}</ul>)
      continue
    }
    // empty line
    if (line.trim() === '') { i++; continue }
    // paragraph — consume until blank/heading/list/etc.
    const para = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].match(/^#{1,3}\s/) &&
      !/^[-*]\s/.test(lines[i]) &&
      !lines[i].startsWith('```') &&
      !lines[i].startsWith('> ') &&
      !/^---+$/.test(lines[i].trim()) &&
      !lines[i].includes('|')
    ) { para.push(lines[i]); i++ }
    if (para.length) out.push(<p key={k++} className="md-p">{parseInline(para.join(' '))}</p>)
  }
  return out
}

// ─── Markdown Viewer component — GitHub dark style ────────────────────────────
function MarkdownViewer({ filename, filePath, content, onClose }) {
  const bodyRef = useRef(null)
  // Close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="mdv-wrap">
      {/* Title bar — mimics macOS style like the terminal */}
      <div className="mdv-titlebar">
        <div className="mdv-dots">
          <div className="tt-dot tt-red" style={{cursor:'pointer'}} onClick={onClose} title="Close" />
          <div className="tt-dot tt-yellow" />
          <div className="tt-dot tt-green" />
        </div>
        <span className="mdv-breadcrumb">{filePath}</span>
        <button className="mdv-esc" onClick={onClose}>esc</button>
      </div>
      {/* File tabs bar — like GitHub */}
      <div className="mdv-tabbar">
        <span className="mdv-tab active">
          <span className="mdv-tab-icon">📄</span> {filename}
        </span>
      </div>
      {/* Rendered markdown */}
      <div className="mdv-body" ref={bodyRef}>
        <div className="mdv-content">
          {parseMarkdown(content)}
        </div>
      </div>
    </div>
  )
}

function mockStats() {
  return {
    streak: '37d',
    leetcode: '312 solved',
    visitors: `${84 + Math.floor(Math.random() * 6)} today`,
    deployed: '2h ago',
    uptime: '99.8%',
    repos: 28,
  }
}

/* ═══════════════════════════════════════════════════════════════════
   COMMAND REGISTRY — shared between terminal AND command palette.
   ═══════════════════════════════════════════════════════════════════ */
function buildCommandRegistry({ setMode, scrollToSection, copyEmail }) {
  return {
    'go to projects':         { label: 'Go to Projects',         icon: '⬇', action: () => scrollToSection('projects') },
    'go to skills':           { label: 'Go to Skills',           icon: '⬇', action: () => scrollToSection('skills') },
    'go to about':            { label: 'Go to About',            icon: '⬇', action: () => scrollToSection('about') },
    'go to contact':          { label: 'Go to Contact',          icon: '⬇', action: () => scrollToSection('contact') },
    'switch to engineer mode':{ label: 'Switch to Engineer Mode',icon: '⌨', action: () => setMode('engineer') },
    'back to landing page':   { label: 'Back to Landing',        icon: '←', action: () => setMode('landing') },
    'copy email':             { label: 'Copy Email',             icon: '✉', action: copyEmail },
    'download resume':        { label: 'Download Resume',        icon: '↓', action: () => alert('Resume download — attach a real /resume.pdf to enable this.') },
    'open commerce-platform': { label: 'Open: Commerce Platform',icon: '📂', action: () => setMode('engineer') },
    'open realtime-chat':     { label: 'Open: Realtime Chat',    icon: '📂', action: () => setMode('engineer') },
  }
}

/* ═══════════════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════════════ */
function useTypewriter(phrases, { typingSpeed = 50, eraseSpeed = 30, pauseMs = 1200 }) {
  const [displayed, setDisplayed] = useState('')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [phase, setPhase] = useState('typing')

  useEffect(() => {
    const phrase = phrases[phraseIdx]
    let timer
    if (phase === 'typing') {
      if (displayed.length < phrase.length) {
        timer = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), typingSpeed)
      } else {
        timer = setTimeout(() => setPhase('pausing'), pauseMs)
      }
    } else if (phase === 'pausing') {
      timer = setTimeout(() => setPhase('erasing'), 0)
    } else if (phase === 'erasing') {
      if (displayed.length > 0) {
        timer = setTimeout(() => setDisplayed(d => d.slice(0, -1)), eraseSpeed)
      } else {
        setPhraseIdx(i => (i + 1) % phrases.length)
        setPhase('typing')
      }
    }
    return () => clearTimeout(timer)
  }, [displayed, phase, phraseIdx, phrases, typingSpeed, eraseSpeed, pauseMs])

  return displayed
}

function useFadeUp() {
  useEffect(() => {
    const els = document.querySelectorAll('.fade-up')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  })
}

function useActiveSection(ids) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }) },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [ids])
  return active
}

/* ═══════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */

/*
 * DEV ILLUSTRATION — pure inline SVG, zero external assets.
 * To use your own photo instead:
 *   Replace the <svg> block with <img src="/your-photo.jpg" className="dev-illus-img" />
 */
function DevIllustration() {
  const codeLines = [
    { x: 104, y: 130, tokens: [{ t: 'const ', c: '#a78bfa' }, { t: 'app ', c: '#e6edf3' }, { t: '= ', c: '#58e6a8' }, { t: 'express', c: '#60a5fa' }, { t: '()', c: '#e6edf3' }] },
    { x: 104, y: 143, tokens: [{ t: '// WebSocket + REST', c: '#3a5240' }] },
    { x: 104, y: 156, tokens: [{ t: 'app', c: '#a78bfa' }, { t: '.use(', c: '#e6edf3' }, { t: "'/api'", c: '#fbbf24' }, { t: ', router)', c: '#e6edf3' }] },
    { x: 104, y: 169, tokens: [{ t: 'app', c: '#a78bfa' }, { t: '.listen(', c: '#e6edf3' }, { t: '5000', c: '#fbbf24' }, { t: ')', c: '#e6edf3' }] },
    { x: 104, y: 195, tokens: [{ t: 'socket', c: '#60a5fa' }, { t: '.on(', c: '#e6edf3' }, { t: "'connect'", c: '#fbbf24' }, { t: ', cb => {', c: '#e6edf3' }] },
    { x: 112, y: 208, tokens: [{ t: 'io.emit(', c: '#60a5fa' }, { t: "'msg'", c: '#fbbf24' }, { t: ', data)', c: '#e6edf3' }] },
    { x: 104, y: 221, tokens: [{ t: '})', c: '#e6edf3' }] },
  ]
  return (
    <div className="dev-illus-wrap">
      <svg
        viewBox="0 0 380 410"
        xmlns="http://www.w3.org/2000/svg"
        className="dev-illus-svg"
        role="img"
        aria-label="Male developer at dual monitor setup"
      >
        <defs>
          <radialGradient id="bgGlow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#0e2a1f" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#050709" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="scrGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#58e6a8" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <filter id="glow4">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Ambient glow ── */}
        <ellipse cx="190" cy="195" rx="185" ry="165" fill="url(#bgGlow)" />

        {/* ── Floating code cards ── */}
        {/* Terminal card — top right */}
        <g opacity="0.8">
          <rect x="292" y="72" width="74" height="55" rx="5" fill="#0d1117" stroke="#1e3a2f" strokeWidth="1" />
          <circle cx="303" cy="82" r="2.5" fill="#ff6058" />
          <circle cx="311" cy="82" r="2.5" fill="#ffbd2e" />
          <circle cx="319" cy="82" r="2.5" fill="#28ca41" />
          <text x="300" y="95"  fontFamily="monospace" fontSize="6.5" fill="#58e6a8">$ npm run dev</text>
          <text x="300" y="106" fontFamily="monospace" fontSize="6.5" fill="#34d399">✓ ready 778ms</text>
          <text x="300" y="117" fontFamily="monospace" fontSize="6.5" fill="#7d8590">{`> :5173`}</text>
        </g>
        {/* Git card — left side */}
        <g opacity="0.7">
          <rect x="14" y="148" width="60" height="44" rx="4" fill="#0d1117" stroke="#21262d" strokeWidth="1" />
          <text x="20" y="163" fontFamily="monospace" fontSize="6" fill="#7d8590">$ git push</text>
          <text x="20" y="174" fontFamily="monospace" fontSize="6" fill="#58e6a8">↑ 3 commits</text>
          <text x="20" y="185" fontFamily="monospace" fontSize="6" fill="#34d399">✓ deployed</text>
        </g>
        {/* Floating syntax */}
        <text x="16" y="100" fontFamily="monospace" fontSize="19" fill="#58e6a8" opacity="0.65" filter="url(#glow4)">{`{ }`}</text>
        <text x="316" y="58"  fontFamily="monospace" fontSize="14" fill="#a78bfa" opacity="0.6">{`</>`}</text>
        <text x="14"  y="214" fontFamily="monospace" fontSize="13" fill="#60a5fa" opacity="0.4">{`()`}</text>
        <text x="347" y="198" fontFamily="monospace" fontSize="13" fill="#34d399" opacity="0.4">{`[]`}</text>

        {/* Circuit accents */}
        <polyline points="44,230 44,250 60,250" fill="none" stroke="#1e3a2f" strokeWidth="1" opacity="0.7" />
        <circle cx="60" cy="250" r="2.2" fill="#58e6a8" opacity="0.55" />
        <polyline points="344,215 344,234 330,234" fill="none" stroke="#21262d" strokeWidth="1" opacity="0.7" />
        <circle cx="330" cy="234" r="2.2" fill="#a78bfa" opacity="0.55" />

        {/* Sparkle dots */}
        {[{x:56,y:126,c:'#58e6a8',d:'2.6s'},{x:328,y:160,c:'#a78bfa',d:'3.2s'},{x:36,y:268,c:'#60a5fa',d:'2s'},{x:350,y:255,c:'#58e6a8',d:'2.9s'}].map((s,i) => (
          <circle key={i} cx={s.x} cy={s.y} r="2" fill={s.c}>
            <animate attributeName="opacity" values="1;0.15;1" dur={s.d} repeatCount="indefinite" />
          </circle>
        ))}

        {/* ── DESK ── */}
        <rect x="36" y="268" width="308" height="11" rx="4" fill="#1a2332" />
        <rect x="36" y="273" width="308" height="6"  rx="2" fill="#111827" />
        <rect x="52"  y="278" width="10" height="46" rx="3" fill="#1a2332" />
        <rect x="318" y="278" width="10" height="46" rx="3" fill="#1a2332" />

        {/* ── MONITOR ── */}
        <rect x="66" y="105" width="248" height="152" rx="10" fill="#111827" stroke="#1e3a2f" strokeWidth="2" />
        <rect x="74" y="113" width="232" height="136" rx="5" fill="#060d0a" />
        <rect x="74" y="113" width="232" height="136" rx="5" fill="url(#scrGlow)" />
        {/* Line numbers gutter */}
        <rect x="74" y="113" width="24" height="136" rx="0" fill="#0a1208" opacity="0.6" />
        {[0,1,2,3,4,5,6].map(n => (
          <text key={n} x="78" y={126 + n * 13} fontFamily="monospace" fontSize="7" fill="#3d4d3d">{n + 1}</text>
        ))}
        {/* Code tokens */}
        {codeLines.map((line, li) =>
          line.tokens.reduce((acc, tok) => {
            const prev = acc.x
            acc.x += tok.t.length * 5.1
            acc.els.push(
              <text key={`${li}-${prev}`} x={prev} y={line.y} fontFamily="monospace" fontSize="8" fill={tok.c}>{tok.t}</text>
            )
            return acc
          }, { x: line.x, els: [] }).els
        )}
        {/* Blinking cursor */}
        <rect x="116" y="226" width="2" height="10" rx="1" fill="#58e6a8">
          <animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite" />
        </rect>
        {/* Screen glare */}
        <rect x="74" y="113" width="232" height="22" rx="5" fill="white" opacity="0.014" />

        {/* Monitor stand */}
        <rect x="178" y="255" width="24" height="15" rx="2" fill="#1a2332" />
        <rect x="158" y="265" width="64" height="7"  rx="3" fill="#111827" />

        {/* ── COFFEE MUG ── */}
        <rect x="64" y="247" width="27" height="23" rx="4" fill="#0d2419" stroke="#58e6a8" strokeWidth="1.2" />
        <path d="M91 252 Q102 252 102 259 Q102 265 91 265" fill="none" stroke="#0d2419" strokeWidth="2.8" strokeLinecap="round" />
        <text x="67" y="262" fontFamily="monospace" fontSize="8" fill="#58e6a8" opacity="0.8">{`</>`}</text>
        {/* Steam */}
        {[{x1:72,x2:70,d:'2s'},{x1:81,x2:83,d:'2.5s'}].map((s,i) => (
          <path key={i} d={`M${s.x1} 245 Q${s.x2} 240 ${s.x1} 234`} fill="none" stroke="#58e6a8" strokeWidth="1.5" strokeLinecap="round" opacity="0.45">
            <animate attributeName="opacity" values="0.45;0.05;0.45" dur={s.d} repeatCount="indefinite" />
          </path>
        ))}

        {/* ── KEYBOARD ── */}
        <rect x="106" y="270" width="168" height="25" rx="4" fill="#0f172a" stroke="#1e293b" strokeWidth="1.2" />
        {/* Key row 1 */}
        {Array.from({length:12},(_,i)=>(
          <rect key={i} x={112+i*13} y="274" width="10" height="6" rx="1.5" fill="#1e293b" />
        ))}
        {/* Key row 2 */}
        {Array.from({length:10},(_,i)=>(
          <rect key={i} x={116+i*13} y="283" width="10" height="6" rx="1.5" fill="#1e293b" />
        ))}
        {/* Spacebar */}
        <rect x="148" y="283" width="84" height="8" rx="2" fill="#1e293b" />
        <rect x="148" y="283" width="84" height="8" rx="2" fill="#58e6a8" opacity="0.07" />

        {/* ── CHAIR ── */}
        <rect x="144" y="306" width="92" height="82" rx="8" fill="#111827" stroke="#1e293b" strokeWidth="1.5" />
        <rect x="151" y="313" width="78" height="68" rx="5" fill="#161d2e" />
        <rect x="138" y="350" width="104" height="16" rx="7" fill="#1a2332" />

        {/* ── BODY (hoodie) ── */}
        <ellipse cx="190" cy="338" rx="37" ry="35" fill="#0f172a" />
        <path d="M179 316 L190 332 L201 316" stroke="#1e293b" strokeWidth="1.2" fill="none" />

        {/* Arms */}
        <path d="M157 322 Q140 337 130 294 Q128 282 139 281" fill="none" stroke="#0f172a" strokeWidth="18" strokeLinecap="round" />
        <ellipse cx="139" cy="281" rx="12" ry="8" fill="#c8a07a" />
        <path d="M223 322 Q240 337 250 294 Q252 282 241 281" fill="none" stroke="#0f172a" strokeWidth="18" strokeLinecap="round" />
        <ellipse cx="241" cy="281" rx="12" ry="8" fill="#c8a07a" />

        {/* Neck */}
        <rect x="182" y="291" width="16" height="17" rx="5" fill="#c8a07a" />

        {/* ── HEAD ── */}
        <ellipse cx="190" cy="277" rx="28" ry="30" fill="#c8a07a" />

        {/* Hair — short, dark, side fade */}
        <path d="M162 271 Q163 242 190 237 Q217 242 218 271 Q210 254 190 251 Q170 254 162 271Z" fill="#1a0a02" />
        <path d="M162 271 Q157 280 161 291 Q163 272 165 268Z" fill="#1a0a02" />
        <path d="M218 271 Q223 280 219 291 Q217 272 215 268Z" fill="#1a0a02" />

        {/* Eyes */}
        <ellipse cx="180" cy="276" rx="4.2" ry="3.8" fill="#1e120a" />
        <ellipse cx="200" cy="276" rx="4.2" ry="3.8" fill="#1e120a" />
        <circle cx="181.5" cy="274.5" r="1.4" fill="white" opacity="0.75" />
        <circle cx="201.5" cy="274.5" r="1.4" fill="white" opacity="0.75" />

        {/* Eyebrows */}
        <path d="M175 270 Q180 267 186 270" fill="none" stroke="#1a0a02" strokeWidth="2" strokeLinecap="round" />
        <path d="M194 270 Q200 267 205 270" fill="none" stroke="#1a0a02" strokeWidth="2" strokeLinecap="round" />

        {/* Nose */}
        <path d="M187 281 Q190 285.5 193 281" fill="none" stroke="#b08060" strokeWidth="1.2" strokeLinecap="round" />

        {/* Mouth — focused expression */}
        <path d="M183 289 Q190 293 197 289" fill="none" stroke="#a07050" strokeWidth="1.6" strokeLinecap="round" />

        {/* Ears */}
        <ellipse cx="161" cy="278" rx="5.5" ry="7.5" fill="#c8a07a" />
        <ellipse cx="219" cy="278" rx="5.5" ry="7.5" fill="#c8a07a" />

        {/* ── HEADPHONES ── */}
        <path d="M161 265 Q190 243 219 265" fill="none" stroke="#374151" strokeWidth="6.5" strokeLinecap="round" />
        <path d="M161 265 Q190 243 219 265" fill="none" stroke="#1f2937" strokeWidth="3"   strokeLinecap="round" />
        {/* Left cup */}
        <rect x="152" y="263" width="15" height="19" rx="5.5" fill="#374151" />
        <rect x="155" y="266" width="9"  height="13" rx="3.5" fill="#1f2937" />
        {/* Right cup */}
        <rect x="213" y="263" width="15" height="19" rx="5.5" fill="#374151" />
        <rect x="216" y="266" width="9"  height="13" rx="3.5" fill="#1f2937" />

        {/* Screen light cast on face */}
        <ellipse cx="190" cy="274" rx="30" ry="32" fill="#58e6a8" opacity="0.022" />
      </svg>

      {/* Floating badge */}
      <div className="dev-illus-badge">
        <span className="dev-illus-dot" />
        available
      </div>
      {/* Stack tag */}
      <div className="dev-illus-tag">MERN · Node · React</div>
    </div>
  )
}

function TiltCard({ children, className = '' }) {
  const ref = useRef(null)
  const handleMove = useCallback(e => {
    const el = ref.current; if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const x = (e.clientX - left) / width - 0.5
    const y = (e.clientY - top) / height - 0.5
    el.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) translateZ(4px)`
  }, [])
  const handleLeave = useCallback(() => { if (ref.current) ref.current.style.transform = '' }, [])
  return <div ref={ref} className={className} onMouseMove={handleMove} onMouseLeave={handleLeave}>{children}</div>
}

function MagBtn({ children, className = '', onClick }) {
  const ref = useRef(null)
  const handleMove = useCallback(e => {
    const el = ref.current; if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const x = (e.clientX - left - width / 2) * 0.28
    const y = (e.clientY - top - height / 2) * 0.28
    el.style.setProperty('--tx', `${x}px`)
    el.style.setProperty('--ty', `${y}px`)
  }, [])
  const handleLeave = useCallback(() => {
    if (ref.current) { ref.current.style.setProperty('--tx', '0px'); ref.current.style.setProperty('--ty', '0px') }
  }, [])
  return (
    <button ref={ref} className={`btn ${className}`} onMouseMove={handleMove} onMouseLeave={handleLeave} onClick={onClick}>
      {children}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   TERMINAL RICH-OUTPUT CARDS
   Each card renders inline in the terminal scroll log.
   Props flow from runCommand via { type: 'card', component: <JSX/> }
   ═══════════════════════════════════════════════════════════════════ */

// Shared card shell — dark bordered box matching terminal theme
function TermCard({ accent = '#58e6a8', children }) {
  return (
    <div style={{
      borderLeft: `2px solid ${accent}`,
      border: `1px solid #21262d`,
      borderLeftWidth: '2px',
      borderLeftColor: accent,
      borderRadius: 6,
      padding: '0.75rem 1rem',
      margin: '4px 0 8px',
      background: 'rgba(13,17,23,0.9)',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      lineHeight: 1.65,
      maxWidth: 520,
    }}>
      {children}
    </div>
  )
}

// ── 1. RESUME CARD ──────────────────────────────────────────────────
function ResumeCard() {
  const r = PORTFOLIO_DATA.resume
  return (
    <TermCard>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ color: '#58e6a8', fontWeight: 600 }}>📄 resume.pdf</span>
        {/* ↓ Replace href with your real hosted resume URL */}
        <a
          href={r.downloadUrl}
          download
          style={{ color: '#58e6a8', textDecoration: 'none', fontSize: 11,
            border: '1px solid #1a4a35', borderRadius: 4, padding: '2px 8px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.target.style.background='rgba(88,230,168,0.1)'}
          onMouseLeave={e => e.target.style.background='transparent'}
        >
          ↓ download
        </a>
      </div>
      {/* Summary rows */}
      <div style={{ color: '#c9d1d9' }}>
        <span style={{ color: '#7d8590' }}>role &nbsp;&nbsp;&nbsp;&nbsp; </span>{r.role}<br/>
        <span style={{ color: '#7d8590' }}>exp &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>{r.experience}<br/>
        <span style={{ color: '#7d8590' }}>stack &nbsp;&nbsp;&nbsp; </span><span style={{ color: '#58e6a8' }}>{r.stack}</span>
      </div>
    </TermCard>
  )
}

// ── 2. SKILLS CARD ──────────────────────────────────────────────────
function SkillsCard() {
  const groups = PORTFOLIO_DATA.skills
  return (
    <TermCard accent='#a78bfa'>
      <div style={{ color: '#a78bfa', fontWeight: 600, marginBottom: 8 }}>◈ skills</div>
      {groups.map(({ group, tags }) => (
        <div key={group} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 5 }}>
          <span style={{ color: '#7d8590', minWidth: 68, flexShrink: 0 }}>{group}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {tags.map(tag => (
              <span key={tag} style={{
                color: '#c9d1d9', border: '1px solid #30363d',
                borderRadius: 3, padding: '1px 6px', fontSize: 11,
                background: 'rgba(255,255,255,0.03)'
              }}>{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </TermCard>
  )
}

// ── 3. PROJECT CARD ─────────────────────────────────────────────────
function ProjectCard({ project, onOpenCaseStudy }) {
  const p = project
  const isLive = p.status === 'live'
  return (
    <TermCard>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ color: '#e6edf3', fontWeight: 600 }}>📂 {p.name}</span>
        <span style={{
          fontSize: 10, padding: '2px 7px', borderRadius: 99,
          background: isLive ? 'rgba(88,230,168,0.08)' : 'rgba(251,191,36,0.08)',
          color: isLive ? '#58e6a8' : '#fbbf24',
          border: `1px solid ${isLive ? 'rgba(88,230,168,0.25)' : 'rgba(251,191,36,0.25)'}`,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>{p.status}</span>
      </div>
      {/* Problem → Solution */}
      <div style={{ color: '#7d8590', marginBottom: 2 }}>problem</div>
      <div style={{ color: '#b1bac4', marginBottom: 6, paddingLeft: 4 }}>{p.problem}</div>
      <div style={{ color: '#7d8590', marginBottom: 2 }}>solution</div>
      <div style={{ color: '#b1bac4', marginBottom: 8, paddingLeft: 4 }}>{p.solution}</div>
      {/* Stack pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
        {p.stack.map(s => (
          <span key={s} style={{
            color: '#7d8590', border: '1px solid #21262d',
            borderRadius: 3, padding: '1px 6px', fontSize: 10,
          }}>{s}</span>
        ))}
      </div>
      {/* Case study link */}
      <button
        onClick={() => onOpenCaseStudy && onOpenCaseStudy(p.id)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#58e6a8', fontFamily: 'var(--font-mono)', fontSize: 11,
          padding: 0, display: 'flex', alignItems: 'center', gap: 4,
          transition: 'gap 0.2s'
        }}
        onMouseEnter={e => { e.currentTarget.style.gap = '8px' }}
        onMouseLeave={e => { e.currentTarget.style.gap = '4px' }}
      >
        view full case study →
      </button>
    </TermCard>
  )
}

// ── 4. CONTACT CARD ─────────────────────────────────────────────────
function ContactCard({ onCopyEmail }) {
  const c = PORTFOLIO_DATA.contact
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(c.email).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onCopyEmail && onCopyEmail()
  }
  const rowStyle = { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }
  const iconStyle = { color: '#58e6a8', width: 16, textAlign: 'center', flexShrink: 0 }
  const linkStyle = { color: '#b1bac4', textDecoration: 'none', transition: 'color 0.2s' }
  return (
    <TermCard accent='#60a5fa'>
      <div style={{ color: '#60a5fa', fontWeight: 600, marginBottom: 10 }}>✉ contact</div>
      {/* Email row */}
      <div style={rowStyle}>
        <span style={iconStyle}>@</span>
        <span style={{ color: '#c9d1d9' }}>{c.email}</span>
        <button
          onClick={handleCopy}
          style={{
            marginLeft: 'auto', background: 'none', border: '1px solid #21262d',
            borderRadius: 3, cursor: 'pointer', color: copied ? '#58e6a8' : '#7d8590',
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 7px',
            transition: 'all 0.2s'
          }}
        >{copied ? 'copied!' : 'copy'}</button>
      </div>
      {/* GitHub */}
      <div style={rowStyle}>
        <span style={iconStyle}>⎇</span>
        <a href={c.github.href} target="_blank" rel="noreferrer"
          style={linkStyle}
          onMouseEnter={e => e.target.style.color='#58e6a8'}
          onMouseLeave={e => e.target.style.color='#b1bac4'}
        >{c.github.label}</a>
      </div>
      {/* LinkedIn */}
      <div style={rowStyle}>
        <span style={iconStyle}>in</span>
        <a href={c.linkedin.href} target="_blank" rel="noreferrer"
          style={linkStyle}
          onMouseEnter={e => e.target.style.color='#58e6a8'}
          onMouseLeave={e => e.target.style.color='#b1bac4'}
        >{c.linkedin.label}</a>
      </div>
      <div style={{ marginTop: 6, color: '#7d8590', fontSize: 11 }}>● {c.availability}</div>
    </TermCard>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   TERMINAL
   ═══════════════════════════════════════════════════════════════════ */
function Terminal() {
  const [cwd, setCwd] = useState('~')
  const cwdRef = useRef('~')
  const [lines, setLines] = useState([])
  const [input, setInput] = useState('')
  const inputRef2 = useRef('')
  const historyRef = useRef([])
  const [histIdx, setHistIdx] = useState(-1)
  const bootedRef = useRef(false)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)
  // Markdown viewer state — null = closed, object = open
  const [mdViewer, setMdViewer] = useState(null)  // { filename, filePath, content }

  // Keep cwdRef in sync with cwd state
  const updateCwd = useCallback((val) => {
    setCwd(val)
    cwdRef.current = val
  }, [])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [lines])

  useEffect(() => {
    if (bootedRef.current) return   // guard: runs once even in StrictMode
    bootedRef.current = true
    const welcome = [
      { type: 'hl', text: 'welcome to engineer mode.' },
      { type: 'out', text: 'type help to get started.' },
      { type: 'out', text: '' },
    ]
    let i = 0
    const tick = () => {
      if (i < welcome.length) {
        const line = welcome[i++]
        if (line && typeof line === 'object' && line.type) {
          setLines(p => [...p, line])
        }
        setTimeout(tick, 280)
      }
    }
    setTimeout(tick, 300)
  }, [])

  function resolvePath(dir, currentCwd) {
    if (dir.startsWith('~')) return dir
    if (currentCwd === '~') return `~/${dir}`
    return `${currentCwd}/${dir}`
  }

  function runCommand(rawInput) {
    const trimmed = rawInput.trim()
    if (!trimmed) return

    // Always read from ref to avoid stale closure on cwd
    const activeCwd = cwdRef.current
    const promptLabel = `${activeCwd} > `
    const echo = [{ type: 'prompt', text: `${promptLabel}${trimmed}` }]
    const parts = trimmed.split(/\s+/)
    const cmd = parts[0].toLowerCase()
    const arg = parts.slice(1).join(' ')
    let output = []
    let newCwd = null   // if cd changes directory, set here

    // ── Helper: emit a card entry ─────────────────────────────────────
    const card = (component) => ({ type: 'card', component })

    // ── Helper: look up project by id (partial match ok) ─────────────
    function findProject(id) {
      const q = id.toLowerCase().replace(/\s+/g, '-')
      return PORTFOLIO_DATA.projects.find(p => p.id === q || p.id.includes(q))
    }

    if (cmd === 'help') {
      output = [
        { type: 'hl',  text: 'available commands:' },
        { type: 'out', text: '  help                  show this message' },
        { type: 'out', text: '  whoami                who am I?' },
        { type: 'out', text: '  ls                    list directory contents' },
        { type: 'out', text: '  cd <dir>              navigate (auto-renders card)' },
        { type: 'out', text: '  cat <file>            print file contents' },
        { type: 'out', text: '  open resume           → resume card + download' },
        { type: 'out', text: '  open <project-name>   → project case-study card' },
        { type: 'out', text: '  open contact          → contact card' },
        { type: 'out', text: '  open skills           → skills card' },
        { type: 'out', text: '  download resume        trigger resume download' },
        { type: 'out', text: '  email                 copy email to clipboard' },
        { type: 'out', text: '  stats                 live developer stats' },
        { type: 'out', text: '  clear                 clear terminal' },
        { type: 'out', text: '' },
        { type: 'out', text: '  tip: cd resume | cd skills | cd projects/<name>' },
        { type: 'out', text: '' },
      ]
    } else if (cmd === 'whoami') {
      output = [
        { type: 'hl',  text: PORTFOLIO_DATA.resume.name },
        { type: 'out', text: PORTFOLIO_DATA.resume.role + ' · MERN · Real-time systems' },
        { type: 'out', text: 'Building APIs, products, and things that scale.' },
        { type: 'out', text: '' },
      ]
    } else if (cmd === 'pwd') {
      output = [{ type: 'out', text: activeCwd }, { type: 'out', text: '' }]

    } else if (cmd === 'ls') {
      const entries = VFS[activeCwd]
      if (entries) {
        output = [
          ...entries.map(e => ({ type: e.endsWith('/') ? 'hl' : 'out', text: '  ' + e })),
          { type: 'out', text: '' },
        ]
      } else {
        output = [{ type: 'err', text: `ls: no such directory: ${activeCwd}` }, { type: 'out', text: '' }]
      }

    } else if (cmd === 'cd') {
      if (!arg || arg === '~') {
        newCwd = '~'
      } else if (arg === '..') {
        if (activeCwd === '~') { newCwd = '~' }
        else {
          const p = activeCwd.split('/')
          p.pop()
          newCwd = p.join('/') || '~'
        }
      } else {
        const cleaned = arg.replace(/\/$/, '')

        // .md file → markdown viewer
        if (cleaned.endsWith('.md')) {
          const absKey = cleaned.startsWith('~') ? cleaned : `${activeCwd}/${cleaned}`
          const mdContent = MD_FILES[absKey] || MD_FILES[cleaned] || null
          if (mdContent) {
            const safeEcho2 = echo.filter(l => l && l.type)
            setLines(prev => [
              ...prev, ...safeEcho2,
              { type: 'hl', text: `opening ${cleaned} in markdown viewer...` },
              { type: 'out', text: '' },
            ])
            historyRef.current = [...historyRef.current, trimmed]
            setHistIdx(-1); setInput(''); inputRef2.current = ''
            setMdViewer({ filename: cleaned, filePath: absKey, content: mdContent })
            return
          } else {
            output = [
              { type: 'err', text: `cd: ${cleaned}: is a file, not a directory` },
              { type: 'out', text: `  hint: cat ${cleaned}` },
              { type: 'out', text: '' },
            ]
          }
        // resume/ directory → navigate + render ResumeCard
        } else if (cleaned === 'resume' || cleaned === '~/resume') {
          newCwd = '~/resume'
          output = [card(<ResumeCard />)]

        // skills/ directory → navigate + render SkillsCard
        } else if (cleaned === 'skills' || cleaned === '~/skills') {
          newCwd = '~/skills'
          output = [card(<SkillsCard />)]

        // contact/ directory → navigate + render ContactCard
        } else if (cleaned === 'contact' || cleaned === '~/contact') {
          newCwd = '~/contact'
          output = [card(<ContactCard onCopyEmail={() => {}} />)]

        // projects/<name>/ → navigate + render ProjectCard
        } else {
          const target = cleaned.startsWith('~') ? cleaned : resolvePath(cleaned, activeCwd)
          if (VFS[target] !== undefined) {
            newCwd = target
            // Check if this is a specific project leaf
            const projId = target.replace('~/projects/', '')
            const proj = PORTFOLIO_DATA.projects.find(p => p.id === projId)
            if (proj) {
              output = [card(<ProjectCard project={proj} onOpenCaseStudy={(id) => console.log('open case study:', id)} />)]
            }
          } else {
            output = [{ type: 'err', text: `cd: no such directory: ${arg}` }, { type: 'out', text: '' }]
          }
        }
      }

    } else if (cmd === 'cat') {
      if (!arg) {
        output = [{ type: 'err', text: 'cat: missing file operand' }, { type: 'out', text: '' }]
      } else {
        const a = arg.toLowerCase()
        // skills files → SkillsCard
        if (a.endsWith('.json') && (activeCwd === '~/skills' || a.includes('skill'))) {
          output = [card(<SkillsCard />)]
        // contact file → ContactCard
        } else if (a === 'contact.json' || (activeCwd === '~/contact' && a === 'contact.json')) {
          output = [card(<ContactCard onCopyEmail={() => {}} />)]
        // resume file → ResumeCard
        } else if (a === 'resume.pdf' || a === 'resume.md') {
          output = [card(<ResumeCard />)]
        } else {
          const key1 = `${activeCwd}/${arg}`
          const rawContent = FILE_CONTENT[key1] || FILE_CONTENT[arg] || null
          if (rawContent === '__RESUME__') {
            output = [card(<ResumeCard />)]
          } else if (rawContent) {
            output = [...rawContent.split('\n').map(l => ({ type: 'out', text: l })), { type: 'out', text: '' }]
          } else {
            output = [{ type: 'err', text: `cat: ${arg}: no such file` }, { type: 'out', text: '' }]
          }
        }
      }

    } else if (cmd === 'open') {
      const argLower = arg.toLowerCase().replace(/\.pdf$|\.md$/g, '').replace(/\s+/g, '-').trim()
      if (argLower === 'resume') {
        output = [card(<ResumeCard />)]
      } else if (argLower === 'skills') {
        output = [card(<SkillsCard />)]
      } else if (argLower === 'contact') {
        output = [card(<ContactCard onCopyEmail={() => {}} />)]
      } else {
        const found = findProject(argLower)
        if (found) {
          output = [card(<ProjectCard project={found} onOpenCaseStudy={(id) => console.log('open case study:', id)} />)]
        } else {
          output = [
            { type: 'err', text: `open: not found: ${arg}` },
            { type: 'out', text: `  projects: ${PORTFOLIO_DATA.projects.map(p => p.id).join('  |  ')}` },
            { type: 'out', text: `  or try:   open resume · open skills · open contact` },
            { type: 'out', text: '' },
          ]
        }
      }

    // ── Shortcut: `resume` command ───────────────────────────────────
    } else if (cmd === 'resume') {
      output = [card(<ResumeCard />)]

    // ── Shortcut: `email` — copy email to clipboard ──────────────────
    } else if (cmd === 'email') {
      const email = PORTFOLIO_DATA.contact.email
      navigator.clipboard.writeText(email).catch(() => {})
      output = [
        { type: 'hl',  text: `✓ copied: ${email}` },
        { type: 'out', text: '' },
      ]

    // ── `download resume` ────────────────────────────────────────────
    } else if (cmd === 'download' && arg === 'resume') {
      const link = document.createElement('a')
      link.href = PORTFOLIO_DATA.resume.downloadUrl
      link.download = 'resume.pdf'
      link.click()
      output = [
        { type: 'hl',  text: '↓ downloading resume.pdf...' },
        { type: 'out', text: '  (replace /resume.pdf with your real hosted URL)' },
        { type: 'out', text: '' },
      ]

    } else if (cmd === 'stats') {
      const s = mockStats()
      output = [
        { type: 'hl',  text: '── live stats ──────────────────────────────────' },
        { type: 'out', text: `  streak       ${s.streak}` },
        { type: 'out', text: `  leetcode     ${s.leetcode}` },
        { type: 'out', text: `  visitors     ${s.visitors}` },
        { type: 'out', text: `  deployed     ${s.deployed}` },
        { type: 'out', text: `  uptime       ${s.uptime}` },
        { type: 'out', text: `  repos        ${s.repos}` },
        { type: 'out', text: '' },
      ]
    } else if (cmd === 'clear') {
      historyRef.current = [...historyRef.current, trimmed]
      setLines([])
      setHistIdx(-1); setInput(''); inputRef2.current = ''
      return
    } else {
      output = [
        { type: 'err', text: `command not found: ${cmd}` },
        { type: 'out', text: "  type 'help' to see available commands." },
        { type: 'out', text: '' },
      ]
    }

    // Cards pass through as-is; text lines are validated
    const safeLines = [...echo, ...output].filter(l => l && typeof l === 'object' && l.type)

    // Apply cwd change synchronously so next command sees updated path
    if (newCwd !== null) updateCwd(newCwd)

    setLines(prev => [...prev, ...safeLines])
    historyRef.current = [...historyRef.current, trimmed]
    setHistIdx(-1)
    setInput('')
    inputRef2.current = ''
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      runCommand(inputRef2.current)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      // Read history synchronously from ref — no stale closure
      const hist = historyRef.current
      setHistIdx(i => {
        const next = Math.min(i + 1, hist.length - 1)
        if (next >= 0 && hist.length > 0) {
          const val = hist[hist.length - 1 - next] || ''
          setInput(val)
          inputRef2.current = val
        }
        return next
      })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const hist = historyRef.current
      setHistIdx(i => {
        const next = Math.max(i - 1, -1)
        const val = next === -1 ? '' : (hist[hist.length - 1 - next] || '')
        setInput(val)
        inputRef2.current = val
        return next
      })
    }
  }

  return (
    <div className="eng-right" style={{position:'relative'}} onClick={() => !mdViewer && inputRef.current?.focus()}>
      <div className="terminal-titlebar">
        <div className="tt-dot tt-red" />
        <div className="tt-dot tt-yellow" />
        <div className="tt-dot tt-green" />
        <span className="terminal-title">portfolio_os  {cwd}</span>
      </div>
      <div className="terminal-body" ref={bodyRef}>
        {lines.map((ln, i) => {
          if (!ln || typeof ln !== 'object' || !ln.type) return null
          // ── Rich card entry ────────────────────────────────────────
          if (ln.type === 'card') {
            return <div key={i} className="t-line">{ln.component}</div>
          }
          // ── Prompt echo ───────────────────────────────────────────
          if (ln.type === 'prompt') {
            const sep = '> '
            const idx = ln.text.indexOf(sep) + sep.length
            return (
              <div key={i} className="t-line t-prompt-line">
                <span className="t-prompt">{ln.text.slice(0, idx)}</span>
                <span className="t-cmd-text">{ln.text.slice(idx)}</span>
              </div>
            )
          }
          // ── Plain text lines ──────────────────────────────────────
          return (
            <div key={i} className={`t-line ${ln.type==='err'?'t-err':ln.type==='hl'?'t-hl':'t-out'}`}>
              {ln.text ?? ''}
            </div>
          )
        })}
      </div>
      <div className="terminal-input-row">
        <span className="t-input-prompt">{cwd} &gt;&nbsp;</span>
        <input
          ref={inputRef}
          className="t-input"
          value={input}
          onChange={e => { setInput(e.target.value); inputRef2.current = e.target.value }}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          aria-label="terminal input"
        />
      </div>

      {/* GitHub-style markdown viewer — slides in over the terminal when a .md file is opened */}
      {mdViewer && (
        <MarkdownViewer
          filename={mdViewer.filename}
          filePath={mdViewer.filePath}
          content={mdViewer.content}
          onClose={() => { setMdViewer(null); setTimeout(()=>inputRef.current?.focus(),50) }}
        />
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   COMMAND PALETTE
   ═══════════════════════════════════════════════════════════════════ */
function CommandPalette({ open, onClose, commands }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) { setQuery(''); setSelected(0); setTimeout(() => inputRef.current?.focus(), 50) }
  }, [open])

  const filtered = Object.entries(commands).filter(([key, cmd]) =>
    key.includes(query.toLowerCase()) || cmd.label.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => { setSelected(0) }, [query])

  function handleKeyDown(e) {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && filtered[selected]) { filtered[selected][1].action(); onClose() }
  }

  return (
    <div className={`palette-overlay ${open ? 'visible' : ''}`} onClick={onClose}>
      <div className="palette-box" onClick={e => e.stopPropagation()}>
        <div className="palette-input-row">
          <span className="palette-icon">⌘</span>
          <input
            ref={inputRef}
            className="palette-input"
            placeholder="Type a command..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
          />
          <span className="palette-kbd">esc</span>
        </div>
        <div className="palette-results">
          {filtered.length === 0
            ? <div className="palette-empty">No commands match "{query}"</div>
            : filtered.map(([key, cmd], i) => (
              <div
                key={key}
                className={`palette-item ${i === selected ? 'selected' : ''}`}
                onClick={() => { cmd.action(); onClose() }}
                onMouseEnter={() => setSelected(i)}
              >
                <span className="palette-item-icon">{cmd.icon}</span>
                <span className="palette-item-label">{cmd.label}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   BOOT SCREEN
   ═══════════════════════════════════════════════════════════════════ */
function BootScreen({ onDone }) {
  const [fading, setFading] = useState(false)
  function skip() { setFading(true); setTimeout(onDone, 500) }
  useEffect(() => {
    const t = setTimeout(() => { setFading(true); setTimeout(onDone, 500) }, 1800)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className={`boot-overlay ${fading ? 'fade-out' : ''}`} onClick={skip} tabIndex={0} onKeyDown={skip}>
      <div className="boot-lines">
        <div className="boot-line">$ portfolio_os v2.1 -- booting...</div>
        <div className="boot-line">  loading sections............. ok</div>
        <div className="boot-line">  mounting filesystem.......... ok</div>
        <div className="boot-line">  done. <span style={{ color: '#6ee7b7' }}>ready.</span></div>
      </div>
      <div className="boot-bar-wrap"><div className="boot-bar" /></div>
      <div className="boot-skip">click or press any key to skip</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [booted, setBooted]           = useState(false)
  const [mode, setMode]               = useState('landing')
  const [navScrolled, setNavScrolled] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  const NAV_IDS = ['projects', 'skills', 'about', 'contact']
  const activeSection = useActiveSection(NAV_IDS)

  useFadeUp()

  const heroText = useTypewriter(
    ['I build real-time systems.', 'I build clean APIs.', 'I build products that scale.'],
    { typingSpeed: 50, eraseSpeed: 30, pauseMs: 1300 }
  )

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setPaletteOpen(o => !o) }
      if (e.key === 'Escape') setPaletteOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  function scrollToSection(id) {
    if (mode === 'engineer') setMode('landing')
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, mode === 'engineer' ? 420 : 0)
  }

  function copyEmail() {
    navigator.clipboard.writeText('brijesh@example.com').catch(() => {})
    alert('Email copied: brijesh@example.com')
  }

  const commands = buildCommandRegistry({ setMode, scrollToSection, copyEmail })

  return (
    <>
      {!booted && <BootScreen onDone={() => setBooted(true)} />}

      {/* NAV */}
      <nav className={`nav ${navScrolled ? 'scrolled' : ''}`}>
        <a href="#" className="nav-wordmark" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          brijesh.dev
        </a>
        <ul className="nav-links">
          {NAV_IDS.map(id => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={activeSection === id ? 'active' : ''}
                onClick={e => { e.preventDefault(); scrollToSection(id) }}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>
        <span className="nav-cmd-hint" onClick={() => setPaletteOpen(true)} role="button" tabIndex={0}>
          Cmd+K
        </span>
      </nav>

      {/* LANDING */}
      <div className="page">
        {/* HERO */}
        <div className="hero" id="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="hero-eyebrow">full-stack developer</div>
              <h1 className="hero-headline">
                <span className="hero-headline-text">{heroText}</span>
                <span className="hero-cursor" aria-hidden="true" />
              </h1>
              <p className="hero-sub">
                MERN specialist — from MongoDB schemas to React UIs,
                Socket.io to Stripe. I ship systems that stay up, stay fast, and stay clean.
              </p>
              <div className="hero-badges">
                {['Node.js','React','MongoDB','Socket.io','Redis','Docker','Express','TypeScript'].map(t => (
                  <span key={t} className="hero-badge">{t}</span>
                ))}
              </div>
            </div>
            <DevIllustration />
          </div>
        </div>

        {/* CTA */}
        <div className="cta-section fade-up">
          <p className="cta-prompt">// how would you like to continue?</p>
          <div className="cta-buttons">
            <MagBtn className="btn-outline" onClick={() => scrollToSection('projects')}>
              Browse Projects  ↓
            </MagBtn>
            <MagBtn className="btn-accent" onClick={() => setMode('engineer')}>
              Engineer Mode ⌨
            </MagBtn>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="stats-bar fade-up">
          <div className="stat-item">
            <span className="stat-icon">🏆</span>
            <div className="stat-body">
              <span className="stat-val">350+</span>
              <span className="stat-lbl">LeetCode Solved</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🔥</span>
            <div className="stat-body">
              <span className="stat-val">37d</span>
              <span className="stat-lbl">Active Streak</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📦</span>
            <div className="stat-body">
              <span className="stat-val">32</span>
              <span className="stat-lbl">GitHub Repos</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🚀</span>
            <div className="stat-body">
              <span className="stat-val">2h</span>
              <span className="stat-lbl">Last Deploy</span>
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* PROJECTS */}
        <section className="section fade-up" id="projects">
          <div className="section-eyebrow">work</div>
          <h2 className="section-title">Projects</h2>
          <div className="project-cards">
            {PROJECTS.map(p => (
              <TiltCard key={p.id} className="project-card">
                <div className="project-header">
                  <span className="project-name">{p.name}</span>
                  <span className={`project-badge ${p.status === 'live' ? 'badge-live' : 'badge-wip'}`}>
                    {p.status === 'live' ? 'live' : 'in progress'}
                  </span>
                </div>
                <p className="project-desc">{p.desc}</p>
                <div className="project-footer">
                  <div className="stack-tags">
                    {p.stack.map(s => <span key={s} className="stack-tag">{s}</span>)}
                  </div>
                  <a href={p.link} className="project-link">Case study</a>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        <hr className="divider" />

        {/* SKILLS */}
        <section className="section fade-up" id="skills">
          <div className="section-eyebrow">capabilities</div>
          <h2 className="section-title">Skills</h2>
          <div className="skills-grid">
            {SKILLS.map(s => (
              <div key={s.name} className="skill-item">
                <div className="skill-icon">{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <div className="skill-name">{s.name}</div>
                  <div className="skill-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="tech-cloud">
            {['JavaScript','TypeScript','Node.js','React','Express','MongoDB','Redis','Socket.io','Docker','Nginx','JWT','Stripe','PostgreSQL','GraphQL','Git','Linux'].map(t => (
              <span key={t} className="tech-tag">{t}</span>
            ))}
          </div>
        </section>

        <hr className="divider" />

        {/* ABOUT */}
        <section className="section fade-up" id="about">
          <div className="section-eyebrow">background</div>
          <h2 className="section-title">About</h2>
          <p className="about-text">
            I am Brijesh, a <strong>full-stack developer</strong> focused on the MERN stack.
            I have built and deployed real systems: a multi-tenant commerce engine, a low-latency
            chat service, and internal tools that teams actually use.
          </p>
          <p className="about-text" style={{ marginTop: '0.9rem' }}>
            I care about <strong>architecture before aesthetics</strong> — clean APIs, thoughtful data
            models, and code that other engineers can confidently maintain and extend.
          </p>
          <div className="about-highlights">
            <div className="about-hl">B.Tech Computer Science &nbsp;·&nbsp; 2022–2026</div>
            <div className="about-hl">Building in public — 28 repos on GitHub</div>
            <div className="about-hl">Open to full-time roles & senior contracts</div>
          </div>
        </section>

        <hr className="divider" />

        {/* CONTACT */}
        <section className="section fade-up" id="contact">
          <div className="section-eyebrow">reach out</div>
          <h2 className="section-title">Contact</h2>
          <div className="contact-card">
            <div className="contact-available">Available for opportunities</div>
            <p className="contact-tagline">
              Open to <strong style={{ color: 'var(--text)' }}>full-time roles</strong> and senior contracts.
              Let's build something worth shipping.
            </p>
            <div className="contact-links">
              <a href="mailto:brijesh@example.com" className="contact-link">✉ Email</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="contact-link">⎇ GitHub</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="contact-link">in LinkedIn</a>
            </div>
          </div>
          <div className="contact-cta">
            <MagBtn className="btn-accent" onClick={copyEmail}>Copy email address</MagBtn>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <span className="footer-text"><span className="footer-accent">brijesh.dev</span> &nbsp;·&nbsp; built with React + Vite</span>
          <span className="footer-text" style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => setPaletteOpen(true)}
            onMouseEnter={e => e.target.style.color='var(--accent)'}
            onMouseLeave={e => e.target.style.color=''}
          >
            ⌘K command palette
          </span>
        </footer>
      </div>

      {/* ENGINEER MODE */}
      <div className={`engineer-wrap ${mode === 'engineer' ? 'visible' : ''}`}>
        <div className="eng-left">
          <button className="eng-back" onClick={() => setMode('landing')}>back to site</button>

          <div className="eng-status">
            <div className="eng-status-dot" />
            online &nbsp;·&nbsp; open to work
          </div>

          <div>
            <div className="eng-name">Brijesh</div>
            <div className="eng-role">full-stack developer · MERN</div>
            <div className="eng-loc">India</div>
          </div>

          <div className="eng-pills">
            <span className="eng-pill">37d streak</span>
            <span className="eng-pill">312 LC solved</span>
            <span className="eng-pill">86 visitors</span>
            <span className="eng-pill">deployed 2h ago</span>
          </div>

          <p className="eng-bio">
            Ships real-time systems on the MERN stack. Comfortable with distributed state,
            WebSocket architecture, and clean REST APIs at scale.
          </p>

          <div className="eng-divider" />

          <div>
            <div className="eng-section-label">Proficiency</div>
            <div className="eng-skill-bars">
              {[['Node.js / Express','95'],['React / Vite','90'],['MongoDB','88'],['Socket.io / WS','85'],['Redis','80'],['Docker / DevOps','72']].map(([name, pct]) => (
                <div key={name} className="eng-skill-row">
                  <div className="eng-skill-hdr">
                    <span className="eng-skill-name">{name}</span>
                    <span className="eng-skill-pct">{pct}%</span>
                  </div>
                  <div className="eng-skill-track">
                    <div className="eng-skill-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="eng-divider" />

          <div>
            <div className="eng-section-label">Links</div>
            <div className="eng-social">
              <a href="https://github.com" target="_blank" rel="noreferrer">github.com/brijesh</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">linkedin.com/in/brijesh</a>
              <a href="mailto:brijesh@example.com">brijesh@example.com</a>
            </div>
          </div>
        </div>
        {mode === 'engineer' && <Terminal />}
      </div>

      {/* COMMAND PALETTE */}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
    </>
  )
}

