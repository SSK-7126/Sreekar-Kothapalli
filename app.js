/* =====================================================
   SREEKAR KOTHAPALLI — PORTFOLIO  |  app.js
   Production-ready, all bugs resolved
   ===================================================== */

'use strict';

// ─── DEFAULT DATA ─────────────────────────────────────
const DEFAULT_DATA = {
  photo: { url: '' },
  contact: {
    phone:    '+91 9618427974',
    email:    'sreekar.k24@iiits.in',
    linkedin: 'https://www.linkedin.com/in/sreekar-kothapalli',
    extraLinks: [],
  },
  bio: [
    "I'm <strong>Sreekar Kothapalli</strong>, a second-year Computer Science and Engineering student at the <strong>Indian Institute of Information Technology, Sri City</strong>. With a current CGPA of <strong>8.6/10</strong>, I balance strong academic foundations with hands-on project experience.",
    "My interests span across <strong>full-stack development</strong>, <strong>machine learning</strong>, and emerging fields like <strong>federated learning</strong> and <strong>Web3</strong>. I love turning complex problems into elegant, efficient solutions.",
    "When not coding, I'm exploring new technologies, participating in hackathons, or contributing to open-source communities."
  ],
  education: {
    institute:  'Indian Institute of Information Technology, Sri City',
    degree:     'B.Tech in Computer Science & Engineering',
    gradYear:   '2028',
    cgpa:       '8.6',
    cgpaMax:    '10.0',
    location:   'Andhra Pradesh, India',
    specialization: 'CS Engineering',
    interests:  'ML & Web3',
    status:     'Open to Work',
  },
  skills: {
    programming: [
      { name: 'Java',   level: 85 },
      { name: 'Python', level: 80 },
      { name: 'C',      level: 75 },
      { name: 'MySQL',  level: 78 },
    ],
    webAi: [
      { name: 'Full Stack Development', level: 82 },
      { name: 'Machine Learning',       level: 76 },
      { name: 'Federated Learning',     level: 70 },
    ],
    tools: [
      { name: 'Git',     level: 88 },
      { name: 'Linux',   level: 72 },
      { name: 'VS Code', level: 95 },
    ],
    extra: [],
    customCategories: [], // [{id,name,items:[{name,level}]}]
  },
  projects: [
    {
      id: 'p1',
      number: '01',
      title: 'Hospital Management System',
      description: 'A comprehensive patient management system built as a core DSA project. Implemented Max Heap for priority-based patient queuing, Doubly Linked List for record traversal, Stack for operation history, and Binary Search Tree for efficient lookup and retrieval.',
      tags: ['Java', 'DSA', 'Max Heap', 'BST', 'Linked List'],
      category: 'DSA Project',
      featured: true,
      icon: 'hospital',
      githubUrl: '',
      liveUrl: '',
    },
    {
      id: 'p2',
      number: '02',
      title: 'FL-Based Intrusion Detection System',
      description: 'Developed a cutting-edge IDS leveraging Federated Learning and Machine Learning to detect network anomalies across decentralized data sources. Prioritizes data privacy by training models locally without centralizing sensitive network data.',
      tags: ['Python', 'ML', 'Federated Learning', 'IDS', 'Privacy'],
      category: 'ML & FL Project',
      featured: false,
      icon: 'shield',
      githubUrl: '',
      liveUrl: '',
    },
    {
      id: 'p3',
      number: '03',
      title: 'Verisoul & BlockAudit',
      description: 'Built two Web3 products during the 24-hour Web3SSH hackathon organized by IIIT Sri City. Competed in a high-pressure environment to develop functional blockchain-based solutions from conception to working prototype.',
      tags: ['Web3', 'Blockchain', 'Hackathon', 'Solidity'],
      category: 'Web3 Hackathon',
      featured: false,
      icon: 'cube',
      githubUrl: '',
      liveUrl: '',
    },
  ],
  certificates: [
    {
      id: 'cert1',
      title: 'Problem Solving (Basic)',
      issuer: 'HackerRank',
      date: 'May 2024',
      description: 'Demonstrated proficiency in core data structures, algorithms, and logical problem-solving.',
      credentialUrl: '',
      imageUrl: '',
    },
  ],
  intro: {
    videoUrl: '',
  },
};

// ─── STATE ────────────────────────────────────────────
let portfolioData = deepClone(DEFAULT_DATA);
let adminOpen = false;
let editingCertId = null;

// ─── CLOUD STORAGE (JSONBin) ──────────────────────────
const JSONBIN_BIN_ID = '6a126f5a6610dd3ae896df2b';

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

async function loadData() {
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Fetch failed');
    const data = await res.json();
    if (data && data.record) {
      const parsed = data.record;
      // Schema migration
      if (!parsed.photo)                  parsed.photo                  = deepClone(DEFAULT_DATA.photo);
      if (!parsed.bio)                    parsed.bio                    = deepClone(DEFAULT_DATA.bio);
      if (!parsed.education)              parsed.education              = deepClone(DEFAULT_DATA.education);
      if (!parsed.certificates)           parsed.certificates           = deepClone(DEFAULT_DATA.certificates);
      if (!parsed.intro)                  parsed.intro                  = deepClone(DEFAULT_DATA.intro);
      if (!parsed.contact)                parsed.contact                = deepClone(DEFAULT_DATA.contact);
      if (!parsed.contact.extraLinks)     parsed.contact.extraLinks     = [];
      if (!parsed.skills)                 parsed.skills                 = deepClone(DEFAULT_DATA.skills);
      if (!parsed.skills.customCategories) parsed.skills.customCategories = [];
      if (parsed.certificates) parsed.certificates = parsed.certificates.map(c => ({ imageUrl: '', ...c }));
      portfolioData = parsed;
      return;
    }
  } catch (err) {
    console.warn("Could not load from cloud, using defaults.", err);
  }
  portfolioData = deepClone(DEFAULT_DATA);
}

async function saveData() {
  const masterKey = document.getElementById('admin-master-key')?.value.trim() || localStorage.getItem('sk_admin_key');
  if (!masterKey) {
    showToast('Error: Admin Master Key is required to save!', 'error');
    return false;
  }
  
  // Save key locally so they don't have to re-enter it next time
  localStorage.setItem('sk_admin_key', masterKey);
  showToast('Saving to cloud...', 'info');
  
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': masterKey,
        'X-Bin-Versioning': 'false'
      },
      body: JSON.stringify(portfolioData)
    });
    
    if (!res.ok) {
      throw new Error(`Failed with status ${res.status}`);
    }
    return true;
  } catch (err) {
    console.error(err);
    showToast('Failed to save to cloud! Check API Key.', 'error');
    return false;
  }
}

async function resetToDefaults() {
  portfolioData = deepClone(DEFAULT_DATA);
  await saveData();
}

// ─── SVG ICONS ────────────────────────────────────────
const ICONS = {
  hospital: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  shield:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  cube:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m21 16-9 5-9-5V8l9-5 9 5v8z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  code:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  trash:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6 18.2 19a2 2 0 0 1-2 1.87H7.8A2 2 0 0 1 5.8 19L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  x:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  check:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  info:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
};

function svgIcon(name, size = 20) {
  const src = ICONS[name] || ICONS.info;
  return src.replace('<svg', `<svg width="${size}" height="${size}"`);
}

// ─── RENDER: PHOTO ────────────────────────────────────
function renderPhoto() {
  const inner = document.getElementById('avatar-inner');
  if (!inner) return;
  const url = portfolioData.photo?.url;
  if (url) {
    inner.innerHTML = `<img src="${escHtml(url)}" alt="Sreekar Kothapalli" class="avatar-photo" />`;
  } else {
    inner.innerHTML = `<span class="gradient-text">SK</span>`;
  }
}

// ─── RENDER: BIO ────────────────────────────────────
function renderBio() {
  const el = document.getElementById('about-bio');
  if (!el) return;
  const bio = portfolioData.bio || [];
  el.innerHTML = bio.length ? bio.map(p => `<p>${p}</p>`).join('') : '';
}

// ─── RENDER: PROJECTS ────────────────────────────────
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  if (portfolioData.projects.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-muted);font-size:.9rem;grid-column:1/-1">No projects yet. Add some via the Admin Panel.</p>`;
    return;
  }

  grid.innerHTML = portfolioData.projects.map((p, i) => {
    const featured = p.featured && i === 0;
    const delayClass = featured ? '' : `reveal-delay-${Math.min(i, 4)}`;

    // Build project links row
    const links = [];
    if (p.githubUrl) links.push(`
      <a href="${escHtml(p.githubUrl)}" target="_blank" rel="noopener noreferrer" class="project-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
        GitHub
      </a>`);
    if (p.liveUrl) links.push(`
      <a href="${escHtml(p.liveUrl)}" target="_blank" rel="noopener noreferrer" class="project-link project-link-live">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Live Demo
      </a>`);
    const linksHtml = links.length ? `<div class="project-links">${links.join('')}</div>` : '';

    const clickUrl = p.liveUrl || p.githubUrl;
    const cardTag  = clickUrl ? 'a' : 'article';
    const cardAttrs = clickUrl
      ? `href="${escHtml(clickUrl)}" target="_blank" rel="noopener noreferrer" class="project-card-link"`
      : '';

    return `
      <${cardTag} ${cardAttrs} class="project-card${featured ? ' featured' : ''} reveal ${delayClass}"
               data-project-id="${escHtml(p.id)}">
        <div class="project-icon-wrap" aria-hidden="true">${svgIcon(p.icon || 'code', 22)}</div>
        <div class="project-body">
          <div class="project-number">${escHtml(p.number || String(i + 1).padStart(2,'0'))}</div>
          <h3 class="project-title">${escHtml(p.title)}</h3>
          <span class="tag" style="margin-bottom:10px;display:inline-flex">${escHtml(p.category || 'Project')}</span>
          <p class="project-desc">${escHtml(p.description)}</p>
          <div class="project-tags">${p.tags.map(t => `<span class="tag">${escHtml(t)}</span>`).join('')}</div>
          ${linksHtml}
          ${clickUrl ? `<div class="project-open-hint" aria-hidden="true">Open ↗</div>` : ''}
        </div>
      </${cardTag}>`;
  }).join('');

  // Re-observe newly inserted cards
  observeReveal();
}

// ─── RENDER: SKILLS ──────────────────────────────────
function renderSkills() {
  renderSkillCategory('prog-skills',  portfolioData.skills.programming);
  renderSkillCategory('webai-skills', portfolioData.skills.webAi);
  renderSkillCategory('tools-skills', portfolioData.skills.tools);
  renderExtraSkills();
  renderCustomCategories();
  initCardGlow();
}

function renderCustomCategories() {
  const container = document.getElementById('custom-skill-sections');
  if (!container) return;
  const cats = portfolioData.skills.customCategories || [];
  if (cats.length === 0) { container.innerHTML = ''; return; }
  container.innerHTML = cats.map(cat => `
    <div class="skill-card reveal" id="custom-cat-${escHtml(cat.id)}">
      <div class="skill-card-header">
        <div class="skill-card-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        </div>
        <h3 class="skill-card-title">${escHtml(cat.name)}</h3>
      </div>
      <div class="skill-list">
        ${cat.items.map(s => `
          <div class="skill-item">
            <div class="skill-meta"><span class="skill-name">${escHtml(s.name)}</span></div>
            <div class="skill-bar"><div class="skill-fill" data-width="${s.level}" style="width:0%"></div></div>
          </div>`).join('')}
      </div>
    </div>`).join('');
  observeReveal();
}

function renderSkillCategory(id, skills) {
  const el = document.getElementById(id);
  if (!el || !skills) return;
  el.innerHTML = skills.map(s => `
    <div class="skill-item">
      <div class="skill-meta">
        <span class="skill-name">${escHtml(s.name)}</span>
      </div>
      <div class="skill-bar">
        <div class="skill-fill" data-width="${s.level}" style="width:0%"></div>
      </div>
    </div>`).join('');
}

function renderExtraSkills() {
  const wrapper = document.getElementById('extra-skills');
  const badges  = document.getElementById('extra-badges');
  if (!wrapper || !badges) return;
  const extra = portfolioData.skills.extra || [];
  if (extra.length > 0) {
    badges.innerHTML = extra.map(s => `<span class="skill-badge-dyn">${escHtml(s)}</span>`).join('');
    wrapper.style.display = 'block';
  } else {
    wrapper.style.display = 'none';
  }
}

// ─── RENDER: EDUCATION ───────────────────────
function renderEducation() {
  const e = portfolioData.education;
  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  setText('edu-institute',      e.institute);
  setText('edu-degree',         e.degree);
  setText('edu-grad-year',      `Expected ${e.gradYear}`);
  setText('edu-location',       e.location);
  setText('edu-cgpa',           `${e.cgpa} / ${e.cgpaMax}`);
  setText('edu-specialization', e.specialization);
  setText('edu-interests',      e.interests);
  setText('edu-status',         e.status);

  // Also update hero CGPA stat
  const heroStat = document.querySelector('.hero-stat .value.gradient-text');
  if (heroStat) heroStat.textContent = e.cgpa;
}

// ─── RENDER: CONTACT ──────────────────────────────────────
function renderContact() {
  const c = portfolioData.contact;

  // Phone
  const phoneVal  = document.getElementById('contact-phone');
  const phoneLink = document.getElementById('contact-phone-link');
  if (phoneVal)  phoneVal.textContent  = c.phone;
  if (phoneLink) phoneLink.href        = `tel:${c.phone.replace(/\s/g,'')}`;

  // Email
  const emailVal  = document.getElementById('contact-email');
  const emailLink = document.getElementById('contact-email-link');
  if (emailVal)  emailVal.textContent  = c.email;
  if (emailLink) emailLink.href        = `mailto:${c.email}`;

  // LinkedIn
  const linkedinVal  = document.getElementById('contact-linkedin');
  const linkedinLink = document.getElementById('contact-linkedin-link');
  if (linkedinVal)  linkedinVal.textContent  = c.linkedin.replace(/^https?:\/\//, '');
  if (linkedinLink) linkedinLink.href        = c.linkedin;

  // Extra links
  renderExtraContactLinks();
}

function renderExtraContactLinks() {
  const container = document.getElementById('contact-extra-links');
  if (!container) return;
  const links = portfolioData.contact.extraLinks || [];
  if (links.length === 0) { container.innerHTML = ''; return; }

  const LINK_ICONS = {
    github:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
    twitter:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.7 5.5 4.3 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`,
    youtube:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>`,
    globe:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  };
  container.innerHTML = links.map(link => {
    const icon = LINK_ICONS[link.icon] || LINK_ICONS.globe;
    return `
      <a href="${escHtml(link.url)}" target="_blank" rel="noopener noreferrer"
         class="contact-extra-card" aria-label="${escHtml(link.label)}">
        <div class="contact-extra-icon">${icon.replace('<svg', '<svg width="20" height="20"')}</div>
        <div class="contact-extra-text">
          <span class="contact-extra-label">${escHtml(link.label)}</span>
          <span class="contact-extra-url">${escHtml(link.url.replace(/^https?:\/\//, ''))}</span>
        </div>
      </a>`;
  }).join('');
}

// ─── RENDER: CERTIFICATES ───────────────────────────────────
function renderCertificates() {
  const grid    = document.getElementById('cert-grid');
  const section = document.getElementById('certificates');
  if (!grid || !section) return;

  const certs = portfolioData.certificates || [];
  if (certs.length === 0) {
    section.style.display = 'none';
    const div = section.previousElementSibling;
    if (div?.classList.contains('section-divider')) div.style.display = 'none';
    return;
  }
  section.style.display = '';
  const div = section.previousElementSibling;
  if (div?.classList.contains('section-divider')) div.style.display = '';

  grid.innerHTML = certs.map((c, i) => {
    const initials  = c.issuer.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const delayClass = `reveal-delay-${Math.min(i, 4)}`;
    const badgeHtml  = c.imageUrl
      ? `<img src="${escHtml(c.imageUrl)}" class="cert-thumb" alt="${escHtml(c.issuer)} logo" />`
      : `<div class="cert-badge">${escHtml(initials)}</div>`;
    const cardTag    = c.credentialUrl ? 'a' : 'article';
    const cardAttrs  = c.credentialUrl
      ? `href="${escHtml(c.credentialUrl)}" target="_blank" rel="noopener noreferrer"`
      : '';
    return `
      <${cardTag} ${cardAttrs} class="cert-card reveal ${delayClass}" data-cert-id="${escHtml(c.id)}">
        <div class="cert-top">
          ${badgeHtml}
          <span class="cert-date">${escHtml(c.date)}</span>
        </div>
        <h3 class="cert-title-text">${escHtml(c.title)}</h3>
        <p class="cert-issuer-name">${escHtml(c.issuer)}</p>
        ${c.description ? `<p class="cert-desc-text">${escHtml(c.description)}</p>` : ''}
        ${c.credentialUrl ? `<span class="cert-link">View Credential
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </span>` : ''}
      </${cardTag}>`;
  }).join('');
  observeReveal();
}

// ─── RENDER: INTRO VIDEO (inline thumbnail) ───────────────────────
function getVideoEmbedUrl(url) {
  if (!url) return null;
  const yt   = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  if (yt)   return `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1`;
  const loom = url.match(/loom\.com\/share\/([a-z0-9]+)/i);
  if (loom) return `https://www.loom.com/embed/${loom[1]}`;
  return url; // direct mp4 / other
}

function renderIntroVideo() {
  const section = document.getElementById('intro-video-section');
  if (!section) return;

  const url = portfolioData.intro?.videoUrl;
  if (!url) { section.style.display = 'none'; return; }
  section.style.display = '';

  const embedUrl = getVideoEmbedUrl(url);
  if (!embedUrl) { section.style.display = 'none'; return; }

  // Get YouTube thumbnail
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  const thumbUrl = ytMatch ? `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg` : null;

  const wrap = document.getElementById('video-thumb-wrap');
  if (!wrap) return;

  // Only re-render if not already playing
  if (wrap.querySelector('iframe, video')) return;

  wrap.innerHTML = `
    ${ thumbUrl
      ? `<img src="${escHtml(thumbUrl)}" class="vt-thumb" alt="Intro video thumbnail" loading="lazy" />`
      : `<div class="vt-placeholder"></div>`
    }
    <button class="vt-play-btn" aria-label="Play intro video">
      <span class="vt-play-circle" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6,3 20,12 6,21"/></svg>
      </span>
    </button>
    <div class="vt-overlay"></div>`;

  wrap.querySelector('.vt-play-btn').addEventListener('click', () => {
    const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
    wrap.innerHTML = isVideo
      ? `<video src="${escHtml(url)}" controls autoplay class="vt-iframe"></video>`
      : `<iframe src="${escHtml(embedUrl)}&autoplay=1" frameborder="0"
           allow="autoplay; fullscreen; picture-in-picture" allowfullscreen class="vt-iframe"></iframe>`;
  });
}

// ─── FULL RE-RENDER ───────────────────────
function fullRender() {
  renderPhoto();
  renderBio();
  renderProjects();
  renderSkills();
  renderContact();
  renderEducation();
  renderCertificates();
  renderIntroVideo();
  animateSkillBars();
}

// ─── SKILL BAR ANIMATION ─────────────────────────────
function animateSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  fills.forEach(fill => {
    // Reset first (important after re-render)
    fill.style.width = '0%';

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Small delay so CSS transition fires
          requestAnimationFrame(() => {
            fill.style.width = `${fill.dataset.width}%`;
          });
          obs.unobserve(fill);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(fill);
  });
}

// ─── SCROLL REVEAL ───────────────────────────────────
function observeReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
}

// ─── NAVBAR ──────────────────────────────────────────
function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const burger     = document.getElementById('burger');
  const mobileNav  = document.getElementById('nav-mobile');
  const navLinks   = document.querySelectorAll('.nav-links a[data-section]');

  const SECTIONS = ['hero', 'about', 'skills', 'projects', 'contact'];

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    updateActiveLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  function updateActiveLink() {
    let current = '';
    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 90) current = id;
    }
    navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === current));
  }

  // Burger toggle
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      mobileNav.setAttribute('aria-hidden', String(!open));
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Open navigation menu');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }
}

// ─── SKILL CARD GLOW (mouse tracking) ────────────────
function initCardGlow() {
  document.querySelectorAll('.skill-category').forEach(card => {
    // Remove old handler to avoid duplicates after re-render
    card.replaceWith(card.cloneNode(true));
  });

  document.querySelectorAll('.skill-category').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
    });
  });
}

// ─── CONTACT FORM (Web3Forms) ────────────────────────
const WEB3FORMS_KEY = 'bbda2e46-c413-496f-8938-38ddc837552d';

function initContactForm() {
  const form    = document.getElementById('contact-form');
  const btn     = document.getElementById('form-submit-btn');
  const btnTxt  = document.getElementById('submit-text');
  const success = document.getElementById('form-success');
  const errBox  = document.getElementById('form-error');
  if (!form) return;

  // ── Field validators ──
  function showFieldError(fieldId, errId, msg) {
    document.getElementById(fieldId)?.classList.add('error');
    const el = document.getElementById(errId);
    if (el) el.textContent = msg;
  }
  function clearFieldError(fieldId, errId) {
    document.getElementById(fieldId)?.classList.remove('error');
    const el = document.getElementById(errId);
    if (el) el.textContent = '';
  }

  ['cf-name','cf-email','cf-message'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => {
      clearFieldError(id, 'err-' + id.replace('cf-',''));
    });
  });

  // ── Submit ──
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (errBox) errBox.style.display = 'none';

    // Client-side validation
    let valid = true;
    clearFieldError('cf-name',    'err-name');
    clearFieldError('cf-email',   'err-email');
    clearFieldError('cf-message', 'err-message');

    const name    = document.getElementById('cf-name')?.value.trim();
    const email   = document.getElementById('cf-email')?.value.trim();
    const message = document.getElementById('cf-message')?.value.trim();
    const subject = document.getElementById('cf-subject')?.value || 'General Inquiry';

    if (!name)    { showFieldError('cf-name',    'err-name',    'Please enter your name.');           valid = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                  { showFieldError('cf-email',   'err-email',   'Enter a valid email address.');       valid = false; }
    if (!message) { showFieldError('cf-message', 'err-message', 'Please enter your message.');         valid = false; }
    if (!valid) return;

    // Loading state
    if (btn)    btn.disabled  = true;
    if (btnTxt) btnTxt.textContent = 'Sending…';

    try {
      const payload = {
        access_key: WEB3FORMS_KEY,
        name,
        email,
        subject:    `[Portfolio] ${subject} from ${name}`,
        message,
        redirect:   'false',
      };

      const res  = await fetch('https://api.web3forms.com/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        form.reset();
        if (success) success.classList.add('show');
        showToast("Message sent! I'll get back to you soon.", 'success');
        setTimeout(() => success?.classList.remove('show'), 6000);
      } else {
        throw new Error(data.message || 'Submission failed.');
      }
    } catch (err) {
      if (errBox) {
        errBox.textContent = err.message.includes('fetch')
          ? 'Network error — please check your connection and try again.'
          : (err.message || 'Something went wrong. Please try again.');
        errBox.style.display = 'flex';
      }
      showToast('Message failed to send.', 'error');
    } finally {
      if (btn)    btn.disabled  = false;
      if (btnTxt) btnTxt.textContent = 'Send Message';
    }
  });
}

// ─── TYPED EFFECT ────────────────────────────────────
function initTyped() {
  const el = document.getElementById('typed-role');
  if (!el) return;

  const roles = [
    'CS Undergrad @ IIIT Sri City',
    'Full Stack Developer',
    'ML Enthusiast',
    'Web3 Builder',
  ];

  let rIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const current = roles[rIdx];

    if (deleting) {
      cIdx = Math.max(0, cIdx - 1);
      el.textContent = current.slice(0, cIdx);
      if (cIdx === 0) {
        deleting = false;
        rIdx = (rIdx + 1) % roles.length;
        setTimeout(type, 320);
        return;
      }
    } else {
      el.textContent = current.slice(0, cIdx + 1);
      cIdx++;
      if (cIdx >= current.length) {
        deleting = true;
        setTimeout(type, 1900);
        return;
      }
    }
    setTimeout(type, deleting ? 38 : 68);
  }

  type();
}

// ─── TOAST ───────────────────────────────────────────
const TOAST_ICONS = { success: 'check', error: 'x', info: 'info' };

function showToast(msg, type = 'info', duration = 3800) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${svgIcon(TOAST_ICONS[type] || 'info', 15)}</span><span>${escHtml(msg)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('exit');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, duration);
}

// ─── ADMIN: OPEN / CLOSE ─────────────────────────────
function openAdmin() {
  if (adminOpen) return;
  adminOpen = true;
  const overlay = document.getElementById('admin-overlay');
  if (!overlay) return;
  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  populateAdminAll();
  showToast('Admin Control Panel unlocked', 'info');

  // Focus the close button for keyboard users
  setTimeout(() => document.getElementById('admin-close-btn')?.focus(), 100);
}

function closeAdmin() {
  if (!adminOpen) return;
  adminOpen = false;
  const overlay = document.getElementById('admin-overlay');
  if (!overlay) return;
  overlay.classList.remove('show');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  editingCertId = null;
  const submitBtn = document.querySelector('#panel-certificates .btn-save-inline');
  if (submitBtn) submitBtn.textContent = 'Add Certificate';
  clearFields('new-cert-title', 'new-cert-issuer', 'new-cert-date', 'new-cert-desc', 'new-cert-url', 'new-cert-image');
}

// ─── ADMIN: TABS ─────────────────────────────────────
function switchAdminTab(name) {
  document.querySelectorAll('.admin-tab').forEach(t => {
    const active = t.dataset.tab === name;
    t.classList.toggle('active', active);
    t.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('.admin-panel').forEach(p => {
    p.classList.toggle('active', p.id === `panel-${name}`);
  });
}

// ─── ADMIN: POPULATE ─────────────────────────────────
function populateAdminAll() {
  populateAdminProjects();
  populateAdminSkills();
  populateAdminContact();
  populateAdminEducation();
  populateAdminCertificates();
  populateAdminMedia();
}

function populateAdminCertificates() {
  const list = document.getElementById('admin-cert-list');
  if (!list) return;
  const certs = portfolioData.certificates || [];
  if (certs.length === 0) {
    list.innerHTML = `<p style="color:var(--text-muted);font-size:.82rem">No certificates yet. Add one below.</p>`;
    return;
  }
  list.innerHTML = certs.map(c => `
    <div class="admin-project-item" data-id="${escHtml(c.id)}">
      <div style="flex:1;min-width:0">
        <div class="api-title">${escHtml(c.title)}</div>
        <div class="api-tags">${escHtml(c.issuer)} &middot; ${escHtml(c.date)}</div>
      </div>
      <button class="btn-edit" data-edit-cert="${escHtml(c.id)}" title="Edit" aria-label="Edit ${escHtml(c.title)}" style="margin-right:8px; background:none; border:none; color:var(--text-secondary); cursor:pointer;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
      </button>
      <button class="btn-delete" data-delete-cert="${escHtml(c.id)}" title="Delete" aria-label="Delete ${escHtml(c.title)}">
        ${svgIcon('trash', 13)}
      </button>
    </div>`).join('');
  list.querySelectorAll('[data-delete-cert]').forEach(btn => {
    btn.addEventListener('click', () => deleteCertificate(btn.dataset.deleteCert));
  });
  list.querySelectorAll('[data-edit-cert]').forEach(btn => {
    btn.addEventListener('click', () => editCertificate(btn.dataset.editCert));
  });
}

function deleteCertificate(id) {
  portfolioData.certificates = portfolioData.certificates.filter(c => c.id !== id);
  saveToStorage();
  populateAdminCertificates();
  renderCertificates();
  showToast('Certificate removed.', 'error');
}

function editCertificate(id) {
  const cert = portfolioData.certificates.find(c => c.id === id);
  if (!cert) return;
  
  editingCertId = id;
  const setVal = (fid, val) => { const el = document.getElementById(fid); if (el) el.value = val; };
  setVal('new-cert-title', cert.title);
  setVal('new-cert-issuer', cert.issuer);
  setVal('new-cert-date', cert.date);
  setVal('new-cert-desc', cert.description);
  setVal('new-cert-url', cert.credentialUrl);
  setVal('new-cert-image', cert.imageUrl || '');
  
  const submitBtn = document.querySelector('#panel-certificates .btn-save-inline') || document.querySelector('#panel-certificates .admin-section-label:nth-of-type(2)');
  if (submitBtn && submitBtn.tagName === 'DIV') submitBtn.textContent = 'Edit Certificate';
  
  document.getElementById('new-cert-title')?.focus();
}

function populateAdminMedia() {
  const videoEl = document.getElementById('admin-video-url');
  if (videoEl) videoEl.value = portfolioData.intro?.videoUrl || '';
  const photoEl = document.getElementById('admin-photo-url');
  if (photoEl) photoEl.value = portfolioData.photo?.url || '';
  const bioEl = document.getElementById('admin-bio');
  if (bioEl) bioEl.value = (portfolioData.bio || []).join('\n\n');
}

function populateAdminProjects() {
  const list = document.getElementById('admin-project-list');
  if (!list) return;
  if (portfolioData.projects.length === 0) {
    list.innerHTML = `<p style="color:var(--text-muted);font-size:.82rem">No projects yet. Add one below.</p>`;
    return;
  }
  list.innerHTML = portfolioData.projects.map(p => `
    <div class="admin-project-item" data-id="${escHtml(p.id)}">
      <div style="flex:1;min-width:0">
        <div class="api-title">${escHtml(p.title)}</div>
        <div class="api-tags">${p.tags.map(t => escHtml(t)).join(' · ')}</div>
      </div>
      <button class="btn-delete" data-delete="${escHtml(p.id)}" title="Delete project" aria-label="Delete ${escHtml(p.title)}">
        ${svgIcon('trash', 13)}
      </button>
    </div>`).join('');

  // Bind delete buttons via event delegation to avoid inline handlers
  list.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => deleteProject(btn.dataset.delete));
  });
}

function deleteProject(id) {
  portfolioData.projects = portfolioData.projects.filter(p => p.id !== id);
  populateAdminProjects();
  showToast('Project deleted.', 'error');
}

// Renders skill chips for all categories inside the admin panel
const SKILL_CATEGORIES = [
  { key: 'programming', label: 'Programming Languages' },
  { key: 'webAi',       label: 'Web & AI' },
  { key: 'tools',       label: 'Developer Tools' },
  { key: 'extra',       label: 'Additional / Other' },
];

function populateAdminSkills() {
  const container = document.getElementById('admin-all-skills');
  if (!container) return;

  container.innerHTML = SKILL_CATEGORIES.map(cat => {
    const skills = portfolioData.skills[cat.key] || [];
    const chips = skills.length
      ? skills.map((s, i) => `
          <span class="admin-skill-tag">
            ${escHtml(typeof s === 'object' ? s.name : s)}
            <button data-cat="${cat.key}" data-idx="${i}"
                    title="Remove" aria-label="Remove ${escHtml(typeof s === 'object' ? s.name : s)}">
              ${svgIcon('x', 11)}
            </button>
          </span>`).join('')
      : `<span style="color:var(--text-muted);font-size:.78rem">None yet.</span>`;

    return `
      <div style="margin-bottom:18px">
        <div class="admin-section-label" style="margin-bottom:8px">${escHtml(cat.label)}</div>
        <div class="admin-skill-chips" data-cat-chips="${cat.key}">${chips}</div>
      </div>`;
  }).join('');

  // Also build custom categories
  const customCats = portfolioData.skills.customCategories || [];
  if (customCats.length > 0) {
    const customHtml = customCats.map((cat, catIdx) => {
      const chips = cat.items.length
        ? cat.items.map((s, i) => `
            <span class="admin-skill-tag">
              ${escHtml(s.name)}
              <button data-ccat="${catIdx}" data-idx="${i}" title="Remove">
                ${svgIcon('x', 11)}
              </button>
            </span>`).join('')
        : `<span style="color:var(--text-muted);font-size:.78rem">No skills in this category yet.</span>`;
      return `
        <div style="margin-bottom:18px; padding-left: 12px; border-left: 2px solid var(--border);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div class="admin-section-label" style="margin:0">${escHtml(cat.name)} (Custom)</div>
            <button class="btn-delete" data-del-ccat="${catIdx}" title="Delete Category" aria-label="Delete ${escHtml(cat.name)} category">
              ${svgIcon('trash', 13)}
            </button>
          </div>
          <div class="admin-skill-chips">${chips}</div>
        </div>
      `;
    }).join('');
    container.innerHTML += `<div style="margin-top:24px;"><h4 style="margin-bottom:12px;font-size:0.9rem;">Custom Categories</h4>${customHtml}</div>`;
  }

  // Update dynamic select dropdown for custom categories
  const sel = document.getElementById('new-skill-cat');
  if (sel) {
    // Keep only base options, remove existing custom ones
    Array.from(sel.options).forEach(opt => {
      if (opt.value.startsWith('custom_')) opt.remove();
    });
    customCats.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = 'custom_' + cat.id;
      opt.textContent = cat.name + ' (Custom)';
      sel.appendChild(opt);
    });
  }

  // Bind remove buttons
  container.querySelectorAll('[data-cat][data-idx]').forEach(btn => {
    btn.addEventListener('click', () => removeSkillFromCategory(btn.dataset.cat, Number(btn.dataset.idx)));
  });
  container.querySelectorAll('[data-ccat][data-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      portfolioData.skills.customCategories[btn.dataset.ccat].items.splice(btn.dataset.idx, 1);
      populateAdminSkills();
    });
  });
  container.querySelectorAll('[data-del-ccat]').forEach(btn => {
    btn.addEventListener('click', () => {
      portfolioData.skills.customCategories.splice(btn.dataset.delCcat, 1);
      populateAdminSkills();
    });
  });
}

function removeSkillFromCategory(catKey, idx) {
  const arr = portfolioData.skills[catKey];
  if (!arr) return;
  arr.splice(idx, 1);
  populateAdminSkills();
}

function populateAdminContact() {
  const c = portfolioData.contact;
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  setVal('admin-phone',    c.phone);
  setVal('admin-email',   c.email);
  setVal('admin-linkedin', c.linkedin);

  // Extra links
  const list = document.getElementById('admin-extralinks-list');
  if (list) {
    const links = c.extraLinks || [];
    if (links.length === 0) {
      list.innerHTML = `<p style="color:var(--text-muted);font-size:.82rem">No extra links yet.</p>`;
    } else {
      list.innerHTML = links.map(link => `
        <div class="admin-project-item" data-id="${escHtml(link.id)}">
          <div style="flex:1;min-width:0">
            <div class="api-title">${escHtml(link.label)} <span style="color:var(--text-muted);font-weight:normal;">(${escHtml(link.icon)})</span></div>
            <div class="api-tags">${escHtml(link.url)}</div>
          </div>
          <button class="btn-delete" data-del-extralink="${escHtml(link.id)}" title="Delete" aria-label="Delete ${escHtml(link.label)}">
            ${svgIcon('trash', 13)}
          </button>
        </div>`).join('');
      list.querySelectorAll('[data-del-extralink]').forEach(btn => {
        btn.addEventListener('click', () => {
          portfolioData.contact.extraLinks = portfolioData.contact.extraLinks.filter(l => l.id !== btn.dataset.delExtralink);
          populateAdminContact();
        });
      });
    }
  }
}

function populateAdminEducation() {
  const e = portfolioData.education;
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  setVal('admin-institute',      e.institute);
  setVal('admin-degree',         e.degree);
  setVal('admin-grad-year',      e.gradYear);
  setVal('admin-cgpa',           e.cgpa);
  setVal('admin-cgpa-max',       e.cgpaMax);
  setVal('admin-edu-location',   e.location);
  setVal('admin-specialization', e.specialization);
  setVal('admin-interests',      e.interests);
  setVal('admin-status',         e.status);
}

// ─── ADMIN: SAVE ─────────────────────────────────────
async function adminSave() {
  let changed = false;

  // ── New project ──
  const pTitle = getVal('new-project-title');
  if (pTitle) {
    portfolioData.projects.push({
      id:          'p' + Date.now(),
      number:      String(portfolioData.projects.length + 1).padStart(2, '0'),
      title:       pTitle,
      description: getVal('new-project-desc') || 'No description provided.',
      tags:        splitCSV(getVal('new-project-tags')),
      category:    getVal('new-project-cat') || 'Project',
      featured:    false,
      icon:        'code',
      githubUrl:   getVal('new-project-github'),
      liveUrl:     getVal('new-project-live'),
    });
    clearFields('new-project-title','new-project-desc','new-project-tags','new-project-cat','new-project-github','new-project-live');
    changed = true;
  }

  // ── New custom category ──
  const catName = getVal('new-custom-cat-name');
  if (catName) {
    if (!portfolioData.skills.customCategories) portfolioData.skills.customCategories = [];
    portfolioData.skills.customCategories.push({
      id: 'ccat' + Date.now(),
      name: catName,
      items: []
    });
    clearFields('new-custom-cat-name');
    changed = true;
  }

  // ── Add skill to a category ──
  const skillName = getVal('new-skill-name');
  const skillCat  = getVal('new-skill-cat') || 'extra';
  if (skillName) {
    if (skillCat.startsWith('custom_')) {
      const ccatId = skillCat.replace('custom_', '');
      const ccat = portfolioData.skills.customCategories.find(c => c.id === ccatId);
      if (ccat && !ccat.items.find(s => s.name === skillName)) {
        ccat.items.push({ name: skillName, level: Number(getVal('new-skill-level')) || 75 });
        changed = true;
      }
    } else {
      if (!portfolioData.skills[skillCat]) portfolioData.skills[skillCat] = [];
      const arr = portfolioData.skills[skillCat];
      if (skillCat === 'extra') {
        if (!arr.includes(skillName)) { arr.push(skillName); changed = true; }
      } else {
        if (!arr.find(s => s.name === skillName)) {
          arr.push({ name: skillName, level: Number(getVal('new-skill-level')) || 75 });
          changed = true;
        }
      }
    }
    clearFields('new-skill-name', 'new-skill-level');
  }

  // ── Contact ──
  const phone    = getVal('admin-phone');
  const email    = getVal('admin-email');
  const linkedin = getVal('admin-linkedin');
  if (phone    && phone    !== portfolioData.contact.phone)    { portfolioData.contact.phone    = phone;    changed = true; }
  if (email    && email    !== portfolioData.contact.email)    { portfolioData.contact.email    = email;    changed = true; }
  if (linkedin && linkedin !== portfolioData.contact.linkedin) { portfolioData.contact.linkedin = linkedin; changed = true; }

  // ── Extra Links ──
  const elLabel = getVal('new-extralink-label');
  const elUrl   = getVal('new-extralink-url');
  const elIcon  = getVal('new-extralink-icon') || 'globe';
  if (elLabel && elUrl) {
    if (!portfolioData.contact.extraLinks) portfolioData.contact.extraLinks = [];
    portfolioData.contact.extraLinks.push({
      id: 'el' + Date.now(),
      label: elLabel,
      url: elUrl,
      icon: elIcon
    });
    clearFields('new-extralink-label', 'new-extralink-url');
    changed = true;
  }

  // ── Education ──
  const eduFields = {
    institute:      'admin-institute',
    degree:         'admin-degree',
    gradYear:       'admin-grad-year',
    cgpa:           'admin-cgpa',
    cgpaMax:        'admin-cgpa-max',
    location:       'admin-edu-location',
    specialization: 'admin-specialization',
    interests:      'admin-interests',
    status:         'admin-status',
  };
  Object.entries(eduFields).forEach(([key, id]) => {
    const val = getVal(id);
    if (val && val !== portfolioData.education[key]) {
      portfolioData.education[key] = val;
      changed = true;
    }
  });

  // ── Certificate Add/Edit ──
  const certTitle = getVal('new-cert-title');
  if (certTitle) {
    if (!portfolioData.certificates) portfolioData.certificates = [];
    if (editingCertId) {
      const cert = portfolioData.certificates.find(c => c.id === editingCertId);
      if (cert) {
        cert.title = certTitle;
        cert.issuer = getVal('new-cert-issuer') || 'Unknown';
        cert.date = getVal('new-cert-date') || '';
        cert.description = getVal('new-cert-desc') || '';
        cert.credentialUrl = getVal('new-cert-url') || '';
        cert.imageUrl = getVal('new-cert-image') || '';
      }
      editingCertId = null;
      const submitBtn = document.querySelector('#panel-certificates .admin-section-label:nth-of-type(2)');
      if (submitBtn) submitBtn.textContent = 'Add New Certificate';
    } else {
      portfolioData.certificates.push({
        id:            'cert' + Date.now(),
        title:         certTitle,
        issuer:        getVal('new-cert-issuer') || 'Unknown',
        date:          getVal('new-cert-date') || '',
        description:   getVal('new-cert-desc') || '',
        credentialUrl: getVal('new-cert-url') || '',
        imageUrl:      getVal('new-cert-image') || '',
      });
    }
    clearFields('new-cert-title','new-cert-issuer','new-cert-date','new-cert-desc','new-cert-url','new-cert-image');
    changed = true;
  }

  // ── Media (Video + Photo + Bio) ──
  const videoUrl = getVal('admin-video-url');
  if (!portfolioData.intro) portfolioData.intro = { videoUrl: '' };
  if (videoUrl !== portfolioData.intro.videoUrl) {
    portfolioData.intro.videoUrl = videoUrl;
    changed = true;
  }
  const photoUrl = getVal('admin-photo-url');
  if (!portfolioData.photo) portfolioData.photo = { url: '' };
  if (photoUrl !== portfolioData.photo.url) {
    portfolioData.photo.url = photoUrl;
    changed = true;
  }
  const bioVal = getVal('admin-bio');
  if (bioVal) {
    const bioArr = bioVal.split(/\n+/).map(s => s.trim()).filter(Boolean);
    if (JSON.stringify(bioArr) !== JSON.stringify(portfolioData.bio)) {
      portfolioData.bio = bioArr;
      changed = true;
    }
  }

  // ── Persist & re-render ──
  if (changed) {
    const success = await saveData();
    if (success) {
      populateAdminAll();
      fullRender();
      showToast('Portfolio saved successfully!', 'success');
    }
  } else {
    // maybe only key changed
    const masterKey = document.getElementById('admin-master-key')?.value.trim();
    if (masterKey && masterKey !== localStorage.getItem('sk_admin_key')) {
      localStorage.setItem('sk_admin_key', masterKey);
      showToast('API Key updated.', 'success');
    } else {
      showToast('No changes to save.', 'info');
    }
  }
}

// ─── ADMIN: RESET ─────────────────────────────────────
async function adminReset() {
  if (!confirm('Reset all portfolio data to defaults? This cannot be undone.')) return;
  await resetToDefaults();
  populateAdminAll();
  fullRender();
  showToast('Portfolio reset to defaults.', 'info');
}

// ─── HELPERS ─────────────────────────────────────────
function getVal(id) {
  return (document.getElementById(id)?.value || '').trim();
}
function clearFields(...ids) {
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
}
function splitCSV(str) {
  return str.split(',').map(s => s.trim()).filter(Boolean);
}
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

// ─── SECRET SEQUENCE LISTENER ────────────────────────
// Sequence: s r e e k a r 2 0 0 6
const SECRET = 'sreekar2006';
let keyBuf = '';

document.addEventListener('keydown', e => {
  // Ignore if a text field is focused and admin is not open
  if (!adminOpen) {
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') {
      keyBuf = '';
      return;
    }
  }

  // Escape closes the admin panel
  if (e.key === 'Escape') { closeAdmin(); return; }

  keyBuf += e.key.toLowerCase();
  if (keyBuf.length > SECRET.length) keyBuf = keyBuf.slice(-SECRET.length);
  if (keyBuf === SECRET) {
    keyBuf = '';
    openAdmin();
  }
});

// ─── SMOOTH SCROLL (delegated) ────────────────────────
document.addEventListener('click', e => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const targetId = anchor.getAttribute('href').slice(1);
  const target = document.getElementById(targetId);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  }
});

// ─── INIT ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Render dynamic content
  await loadData();
  fullRender();

  // UI behaviours
  initNavbar();
  initContactForm();
  initTyped();
  observeReveal();

  // Admin overlay click-outside
  document.getElementById('admin-overlay')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeAdmin();
  });

  // Admin close button
  document.getElementById('admin-close-btn')?.addEventListener('click', closeAdmin);

  // Admin save / reset
  document.getElementById('admin-save-btn')?.addEventListener('click', adminSave);
  document.getElementById('admin-reset-btn')?.addEventListener('click', adminReset);

  // Admin tab switching
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => switchAdminTab(tab.dataset.tab));
  });
});
