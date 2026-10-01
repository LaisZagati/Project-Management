/* =========================================================
   Website Discovery — app logic
   Plain JavaScript, no build step. Data is saved in this
   browser (localStorage) every time you type.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Constants ---------- */
  const LS_PROJECTS = 'dsq.projects.v1';
  const LS_SETTINGS = 'dsq.settings.v1';
  const SECTION_COLORS = ['#FF4F8B', '#6C5CE7', '#12B89A', '#FF7A2F', '#2E9BFF', '#FFC23D'];
  const PALETTE = [
    { name: 'Pink', c: '#FF4F8B' }, { name: 'Violet', c: '#6C5CE7' }, { name: 'Teal', c: '#12B89A' },
    { name: 'Orange', c: '#FF7A2F' }, { name: 'Sky', c: '#2E9BFF' }, { name: 'Sun', c: '#FFC23D' }
  ];
  const YN = ['Yes', 'No', 'Not sure'];
  const YNC = ['Yes', 'No', 'Need to create'];
  const MAX_SITES = 8;
  const MAX_SERVICES = 20;

  const SVC_FIELDS = [
    { k: 'name', l: 'Service/class name', t: 'text', ph: 'e.g. Reformer Beginners' },
    { k: 'who', l: 'Who is it for?', t: 'text' },
    { k: 'desc', l: 'Description', t: 'textarea', full: true },
    { k: 'length', l: 'Session length', t: 'text', ph: 'e.g. 50 minutes' },
    { k: 'times', l: 'Available days/times', t: 'text', ph: 'e.g. Mon & Wed 18:00' },
    { k: 'price', l: 'Price', t: 'text' },
    { k: 'packages', l: 'Packages or memberships?', t: 'text', ph: 'e.g. 10-class pack' },
    { k: 'booking', l: 'Booking required?', t: 'pick', full: true },
    { k: 'know', l: 'Anything clients should know?', t: 'textarea', full: true }
  ];

  /* ---------- Questionnaire ----------
     t: text | email | tel | url | date | textarea | yn | ync | choice | who | checks | status | services | websites
     imp: key question (warned about before PDF)
     opt: optional notes field (not counted in completion)
  */
  const SECTIONS = [
    {
      id: 'basics', title: 'Business basics', intro: 'The essentials that will appear across the website.',
      q: [
        { k: 'bizName', l: 'What is the exact business name?', t: 'text', imp: 1 },
        { k: 'address', l: 'What is the business address?', t: 'textarea', rows: 2 },
        { k: 'phone', l: 'What phone number should appear on the website?', t: 'tel' },
        { k: 'email', l: 'What email should customers use?', t: 'email', imp: 1 },
        { k: 'hours', l: 'What are your opening hours?', t: 'textarea', rows: 3, ph: 'e.g. Mon–Fri 7:00–21:00, Sat 9:00–14:00' },
        { k: 'social', l: 'What social media accounts should we link?', t: 'textarea', rows: 2, ph: 'Instagram, Facebook, TikTok… handles or links' },
        { k: 'goal', l: 'What is the main goal of the website?', t: 'checks', imp: 1, o: ['Get more bookings', 'Get more enquiries', 'Sell memberships/classes', 'Build credibility', 'Provide information', 'Other'] }
      ]
    },
    {
      id: 'about', title: 'About the business', intro: 'The story and personality behind the business.',
      q: [
        { k: 'about', l: 'Tell us about your business in a few sentences.', t: 'textarea', rows: 5, imp: 1 },
        { k: 'howLong', l: 'How long have you been operating?', t: 'text' },
        { k: 'different', l: 'What makes your business different?', t: 'textarea', rows: 4 },
        { k: 'ideal', l: 'Who is your ideal client?', t: 'textarea', rows: 4, imp: 1 },
        { k: 'feeling', l: 'What feeling should people have when they visit the website?', t: 'textarea', rows: 3 }
      ]
    },
    {
      id: 'services', title: 'Services & classes', intro: 'Add each class or service separately. Add as many as you need.',
      q: [{ k: 'services', l: 'Services & classes offered', t: 'services', imp: 1 }]
    },
    {
      id: 'booking', title: 'Booking', intro: 'How clients book today, and what the website should handle.',
      q: [
        { k: 'howBook', l: 'How do customers currently book?', t: 'textarea', rows: 3 },
        { k: 'bookSystem', l: 'What booking system do you use?', t: 'text', ph: 'e.g. Square Appointments, Mindbody, none' },
        { k: 'bookConnect', l: 'Should the website connect to the booking system?', t: 'yn' },
        { k: 'payOnline', l: 'Should customers be able to pay online?', t: 'yn' },
        { k: 'cancellations', l: 'Do you need cancellations/rescheduling?', t: 'yn' },
        { k: 'memberships', l: 'Do you offer memberships?', t: 'yn' },
        { k: 'giftCards', l: 'Do you offer gift cards?', t: 'yn' }
      ]
    },
    {
      id: 'website', title: 'Website', intro: 'Pages to build and websites to take inspiration from.',
      q: [
        { k: 'pages', l: 'Which pages do you need?', t: 'checks', imp: 1, o: ['Home', 'About', 'Classes', 'Pricing', 'Schedule', 'Book Now', 'Contact', 'FAQ', 'Instructors', 'Testimonials', 'Gallery', 'Blog', 'Other'] },
        { k: 'sites', l: 'Please send 3–5 websites you like.', t: 'websites' }
      ]
    },
    {
      id: 'branding', title: 'Branding & design', intro: 'Logo, colours, fonts and the overall look.',
      q: [
        { k: 'hasLogo', l: 'Do you already have a logo?', t: 'yn' },
        { k: 'brandColours', l: 'Do you have brand colours?', t: 'yn', detail: 'Colours or hex codes (optional)' },
        { k: 'fonts', l: 'Do you have preferred fonts?', t: 'yn', detail: 'Font names (optional)' },
        { k: 'guidelines', l: 'Do you have brand guidelines?', t: 'yn' },
        { k: 'style', l: 'What style do you want?', t: 'checks', imp: 1, o: ['Minimal', 'Luxury', 'Modern', 'Warm', 'Elegant', 'Energetic', 'Natural', 'Other'] },
        { k: 'noColours', l: 'Are there colours you do NOT want?', t: 'text' },
        { k: 'styleSites', l: 'Are there websites whose visual style you like?', t: 'textarea', rows: 3 },
        { k: 'designNotes', l: 'Additional design notes', t: 'textarea', rows: 3, opt: 1 }
      ]
    },
    {
      id: 'media', title: 'Photos & videos', intro: 'What visual material exists, and whether we can use it.',
      q: [
        { k: 'proPhotos', l: 'Do you have professional photos?', t: 'yn' },
        { k: 'studioPhotos', l: 'Do you have studio photos?', t: 'yn' },
        { k: 'instructorPhotos', l: 'Do you have instructor photos?', t: 'yn' },
        { k: 'classPhotos', l: 'Do you have class photos?', t: 'yn' },
        { k: 'videos', l: 'Do you have videos?', t: 'yn' },
        { k: 'canUse', l: 'Can we use these on the website?', t: 'yn' },
        { k: 'permission', l: 'Do you have permission from people appearing in the photos/videos?', t: 'yn' },
        { k: 'assets', l: 'Assets status', t: 'status', items: ['Logo', 'Photos', 'Videos', 'Brand files'] }
      ]
    },
    {
      id: 'content', title: 'Content', intro: 'Who writes and supplies each piece of website content.',
      q: [
        { k: 'whoText', l: 'Who will provide the website text?', t: 'who' },
        { k: 'whoClasses', l: 'Who will provide class descriptions?', t: 'who' },
        { k: 'whoPrices', l: 'Who will provide prices?', t: 'who' },
        { k: 'whoTestimonials', l: 'Who will provide testimonials?', t: 'who' },
        { k: 'whoFaqs', l: 'Who will provide FAQs?', t: 'who' },
        { k: 'writeContent', l: 'Would you like us to write or edit the content?', t: 'yn' },
        { k: 'contentNotes', l: 'Content notes', t: 'textarea', rows: 3, opt: 1 }
      ]
    },
    {
      id: 'contact', title: 'Contact & leads', intro: 'How enquiries reach the business.',
      q: [
        { k: 'formFields', l: 'What information should the contact form collect?', t: 'checks', o: ['Name', 'Email', 'Phone', 'Message', 'Preferred class', 'Preferred date', 'Other'] },
        { k: 'sendTo', l: 'Where should enquiries be sent?', t: 'text', ph: 'Email address(es)' },
        { k: 'whatsapp', l: 'Should the website include WhatsApp?', t: 'yn', detail: 'WhatsApp number (optional)' },
        { k: 'autoConfirm', l: 'Should customers receive an automatic confirmation message?', t: 'yn' },
        { k: 'leadGen', l: 'Do you need any other lead-generation features?', t: 'textarea', rows: 3, ph: 'e.g. free trial class sign-up, newsletter pop-up' }
      ]
    },
    {
      id: 'technical', title: 'Technical', intro: 'Domain, hosting and the tools already in place.',
      q: [
        { k: 'ownDomain', l: 'Do you already own the domain?', t: 'yn', detail: 'Domain name (optional)' },
        { k: 'registrar', l: 'Where is the domain registered?', t: 'text', ph: 'e.g. GoDaddy, Namecheap, Wix' },
        { k: 'hosting', l: 'Do you already have hosting?', t: 'yn', detail: 'Hosting provider (optional)' },
        { k: 'existingSite', l: 'Do you have an existing website?', t: 'yn', detail: 'Current URL (optional)' },
        { k: 'analytics', l: 'Do you have Google Analytics?', t: 'yn' },
        { k: 'searchConsole', l: 'Do you have Google Search Console?', t: 'yn' },
        { k: 'gbpTech', l: 'Do you have Google Business Profile?', t: 'yn' },
        { k: 'seoSetup', l: 'Do you need SEO setup?', t: 'yn' },
        { k: 'cookieConsent', l: 'Do you need cookie consent?', t: 'yn' },
        { k: 'techNotes', l: 'Technical notes', t: 'textarea', rows: 3, opt: 1 }
      ]
    },
    {
      id: 'integrations', title: 'Integrations', intro: 'Tools and services the website should connect to.',
      q: [
        { k: 'integrations', l: 'Which integrations do you need?', t: 'checks', o: ['Booking system', 'Online payments', 'Google Maps', 'Instagram', 'WhatsApp', 'Email marketing', 'Newsletter', 'CRM', 'Google Analytics', 'Google Reviews', 'Other'] },
        { k: 'intNotes', l: 'Integration notes', t: 'textarea', rows: 3, opt: 1 }
      ]
    },
    {
      id: 'seo', title: 'SEO', intro: 'Who should find the business on Google, and how.',
      q: [
        { k: 'locations', l: 'Which locations do you want to attract customers from?', t: 'textarea', rows: 2 },
        { k: 'seoServices', l: 'What services do you want people to find you for?', t: 'textarea', rows: 2 },
        { k: 'competitors', l: 'Who are your main competitors?', t: 'textarea', rows: 2 },
        { k: 'keywords', l: 'What keywords do you think customers search for?', t: 'textarea', rows: 2 },
        { k: 'gbpSeo', l: 'Do you have a Google Business Profile?', t: 'yn' },
        { k: 'reviews', l: 'Do you have Google reviews?', t: 'yn' },
        { k: 'seoNotes', l: 'SEO notes', t: 'textarea', rows: 3, opt: 1 }
      ]
    },
    {
      id: 'legal', title: 'Legal & policies', intro: 'Policies the website needs to show.',
      q: [
        { k: 'privacy', l: 'Do you have a Privacy Policy?', t: 'ync' },
        { k: 'cookiePolicy', l: 'Do you have a Cookie Policy?', t: 'ync' },
        { k: 'terms', l: 'Do you have Terms & Conditions?', t: 'ync' },
        { k: 'bookingPolicy', l: 'Do you have a Booking Policy?', t: 'ync' },
        { k: 'cancelPolicy', l: 'Do you have a Cancellation Policy?', t: 'ync' },
        { k: 'refundPolicy', l: 'Do you have a Refund Policy?', t: 'ync' },
        { k: 'legalText', l: 'Who will provide the legal text?', t: 'choice', o: ['Client', 'Client’s lawyer', 'Studio (template)', 'Not sure'] },
        { k: 'legalNotes', l: 'Legal notes', t: 'textarea', rows: 3, opt: 1 }
      ]
    },
    {
      id: 'project', title: 'Project details', intro: 'Timeline, budget, approvals and life after launch.',
      q: [
        { k: 'launch', l: 'What is your desired launch date?', t: 'date', imp: 1 },
        { k: 'deadline', l: 'Is there a specific deadline or event?', t: 'text' },
        { k: 'approver', l: 'Who will approve the website?', t: 'text', imp: 1 },
        { k: 'feedbackWho', l: 'Who will provide feedback?', t: 'text' },
        { k: 'feedbackSpeed', l: 'How quickly can feedback normally be provided?', t: 'choice', o: ['Within 24 hours', '2–3 days', 'Within a week', 'Not sure'] },
        { k: 'budget', l: 'What is the project budget?', t: 'text', imp: 1 },
        { k: 'outOfScope', l: 'Are there any features that are outside the current scope?', t: 'textarea', rows: 3 },
        { k: 'maintenance', l: 'Is maintenance required after launch?', t: 'yn' },
        { k: 'manager', l: 'Who will manage the website after launch?', t: 'who' },
        { k: 'anythingElse', l: 'Is there anything else you expect the website to do that we haven’t discussed?', t: 'textarea', big: 1, final: 1 }
      ]
    }
  ];
  const NOTES_STEP = SECTIONS.length; // step index 14
  const TOTAL_STEPS = SECTIONS.length + 1;

  /* ---------- Utilities ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const uid = () => 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const trim = (v) => (typeof v === 'string' ? v.trim() : '');

  function hexToRgb(hex) {
    const h = String(hex || '#FF4F8B').replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function luminance(hex) {
    const [r, g, b] = hexToRgb(hex).map((v) => {
      v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  const inkOn = (hex) => (luminance(hex) > 0.42 ? '#1F1A3D' : '#FFFFFF');
  const secColor = (i) => SECTION_COLORS[i % SECTION_COLORS.length];

  function fmtDate(d, long = true) {
    if (!d) return '';
    const dt = typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(d + 'T12:00:00') : new Date(d);
    if (isNaN(dt)) return String(d);
    return dt.toLocaleDateString('en-GB', long ? { day: 'numeric', month: 'long', year: 'numeric' } : { day: 'numeric', month: 'short', year: 'numeric' });
  }
  const slug = (s) => String(s || 'project').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'project';

  /* ---------- Storage ---------- */
  let storageOK = true;
  function readLS(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { storageOK = false; return fallback; }
  }
  function writeLS(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) {
      storageOK = false;
      toast('Couldn’t save to this browser. Storage may be full (large logos use space) or blocked.', true);
      return false;
    }
  }

  let settings = Object.assign({ studio: 'Digital Studio Co', manager: 'Lais Zagati' }, readLS(LS_SETTINGS, {}));
  let projects = readLS(LS_PROJECTS, []);
  if (!Array.isArray(projects)) projects = [];
  projects.forEach(normalize);

  function blankService() { return { name: '', who: '', desc: '', length: '', times: '', price: '', packages: '', booking: '', know: '' }; }
  function blankSite() { return { url: '', like: '' }; }

  function normalize(p) {
    p.a = p.a || {};
    p.qn = p.qn || {};
    p.services = Array.isArray(p.services) && p.services.length ? p.services : [blankService()];
    p.websites = Array.isArray(p.websites) && p.websites.length ? p.websites : [blankSite()];
    p.step = Number.isInteger(p.step) ? Math.min(Math.max(p.step, 0), NOTES_STEP) : 0;
    p.color = p.color || PALETTE[0].c;
    return p;
  }

  function newProject({ clientName, businessName, projectName, color, logo, logoW, logoH }) {
    const now = Date.now();
    return normalize({
      id: uid(), clientName, businessName,
      projectName: projectName || `${businessName} Website`,
      color: color || PALETTE[0].c, logo: logo || '', logoW: logoW || 0, logoH: logoH || 0,
      created: now, updated: now, step: 0,
      a: { bizName: businessName }, qn: {}
    });
  }

  function persist() { return writeLS(LS_PROJECTS, projects); }
  const getProject = (id) => projects.find((p) => p.id === id);

  /* ---------- Completion ---------- */
  const counted = (q) => !q.opt && q.t !== 'status';

  function isAnswered(q, p) {
    const v = p.a[q.k];
    switch (q.t) {
      case 'checks': return Array.isArray(v) && v.length > 0;
      case 'services': return p.services.some((s) => trim(s.name));
      case 'websites': return p.websites.some((w) => trim(w.url));
      case 'status': return true;
      default: return trim(v) !== '';
    }
  }

  function sectionStats(i, p) {
    const qs = SECTIONS[i].q.filter(counted);
    const done = qs.filter((q) => isAnswered(q, p)).length;
    return { done, total: qs.length, pct: qs.length ? done / qs.length : 1 };
  }

  function stats(p) {
    let done = 0, total = 0;
    const missing = [];
    SECTIONS.forEach((sec, i) => sec.q.filter(counted).forEach((q) => {
      total++;
      if (isAnswered(q, p)) done++;
      else missing.push({ q, sec: i });
    }));
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0, missing };
  }

  /* ---------- Answer formatting (shared by review, print and PDF) ---------- */
  function whoLabel(v) {
    if (v === 'Studio') return settings.studio || 'Studio';
    return v;
  }

  function fmtAnswer(q, p) {
    const v = p.a[q.k];
    if (q.t === 'checks') {
      if (!Array.isArray(v) || !v.length) return '';
      return v.map((x) => (x === 'Other' && trim(p.a[q.k + '_o']) ? `Other: ${trim(p.a[q.k + '_o'])}` : x)).join(', ');
    }
    let s = trim(v);
    if (!s) return '';
    if (q.t === 'who') s = whoLabel(s);
    if (q.t === 'date') s = fmtDate(s);
    const d = trim(p.a[q.k + '_d']);
    if (q.detail && d) s += ` — ${d}`;
    return s;
  }

  function reportItem(q, p) {
    const note = trim(p.qn[q.k]) || null;
    if (q.t === 'services') {
      const svcs = p.services.filter((s) => SVC_FIELDS.some((f) => trim(s[f.k])));
      return {
        kind: 'groups', q: q.l, note,
        groups: svcs.map((s, i) => ({
          title: `Service ${i + 1}${trim(s.name) ? ': ' + trim(s.name) : ''}`,
          rows: SVC_FIELDS.filter((f) => f.k !== 'name').map((f) => [f.l, trim(s[f.k]) || null])
        }))
      };
    }
    if (q.t === 'websites') {
      const ws = p.websites.filter((w) => trim(w.url) || trim(w.like));
      return {
        kind: 'groups', q: q.l, note,
        groups: ws.map((w, i) => ({ title: `Website ${i + 1}`, rows: [['URL', trim(w.url) || null], ['What they like', trim(w.like) || null]] }))
      };
    }
    if (q.t === 'status') {
      const st = p.a[q.k] || {};
      return { kind: 'groups', q: q.l, note, groups: [{ title: '', rows: q.items.map((it) => [it, st[it] || 'Not received']) }] };
    }
    return { kind: 'qa', q: q.l, a: fmtAnswer(q, p) || null, note };
  }

  function report(p) {
    const secs = SECTIONS.map((sec, i) => ({ n: i + 1, title: sec.title, step: i, items: sec.q.map((q) => reportItem(q, p)) }));
    secs.push({ n: TOTAL_STEPS, title: 'Project notes', step: NOTES_STEP, items: [{ kind: 'text', a: trim(p.a.myNotes) || null }] });
    return secs;
  }

  /* ---------- App state ---------- */
  let view = 'home';
  let currentId = null;
  const app = $('#app');

  function current() { return getProject(currentId); }

  function go(v, opts = {}) {
    view = v;
    if (opts.id) currentId = opts.id;
    render();
    window.scrollTo(0, opts.keepScroll ? window.scrollY : 0);
    if (opts.focus) { const el = $(opts.focus); if (el) el.focus({ preventScroll: true }); }
  }

  function render() {
    $('#brandName').textContent = settings.studio || 'Website Discovery';
    document.documentElement.style.setProperty('--accent', current() && view !== 'home' ? current().color : '#FF4F8B');
    document.documentElement.style.setProperty('--accent-ink', current() && view !== 'home' ? inkOn(current().color) : '#FFFFFF');
    if (view === 'wizard' && current()) renderWizard();
    else if (view === 'review' && current()) renderReview();
    else { view = 'home'; renderHome(); }
    renderTopbar();
  }

  function renderTopbar() {
    const right = $('#topbarRight');
    if (view === 'home') {
      right.innerHTML = `<button type="button" class="btn btn-dark" data-act="new">+ New client project</button>`;
    } else {
      right.innerHTML = `<button type="button" class="btn-ghost" data-act="home">All projects</button>`;
    }
  }

  function logoHTML(p, cls = '') {
    if (p.logo) return `<span class="logo-box ${cls}"><img src="${p.logo}" alt="${esc(p.businessName)} logo"></span>`;
    const ini = (p.businessName || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
    return `<span class="monogram ${cls}" style="--accent:${p.color};--accent-ink:${inkOn(p.color)}" aria-hidden="true">${esc(ini)}</span>`;
  }

  /* ---------- Home ---------- */
  function renderHome() {
    const list = projects.slice().sort((a, b) => b.updated - a.updated);
    const cards = list.map((p) => {
      const s = stats(p);
      return `
      <article class="pcard" style="--accent:${p.color};--accent-ink:${inkOn(p.color)}">
        <div class="pcard-top">
          ${logoHTML(p)}
          <div>
            <h3>${esc(p.projectName)}</h3>
            <p class="pcard-sub">${esc(p.businessName)}${p.clientName ? ` — ${esc(p.clientName)}` : ''}</p>
          </div>
        </div>
        <div>
          <div class="mini-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${s.pct}" aria-label="Completion"><span style="width:${s.pct}%"></span></div>
          <p class="pcard-meta"><span>${s.pct}% complete</span><span>Updated ${fmtDate(p.updated, false)}</span></p>
        </div>
        <div class="pcard-actions">
          <button type="button" class="open" data-act="open" data-id="${p.id}">Open</button>
          <button type="button" data-act="dup" data-id="${p.id}">Duplicate</button>
          <button type="button" class="del" data-act="del" data-id="${p.id}">Delete</button>
          <button type="button" data-act="pdf" data-id="${p.id}">Export PDF</button>
        </div>
      </article>`;
    }).join('');

    app.innerHTML = `
      ${storageOK ? '' : '<p class="banner">This browser is blocking storage, so answers won’t be kept after you close the page. Export a PDF before leaving.</p>'}
      <section class="home-hero">
        <div class="hero-shapes" aria-hidden="true"><span class="s1"></span><span class="s2"></span><span class="s3"></span></div>
        <h1>Website discovery, one section at a time.</h1>
        <p>Sit down with your client, work through 14 short sections together, then review and export a signed-off project document.</p>
        <button type="button" class="btn btn-primary btn-lg" data-act="new">+ New client project</button>
      </section>
      <div class="home-grid">
        <section aria-labelledby="savedTitle">
          <h2 class="block-title" id="savedTitle">Saved projects <span class="count">${projects.length}</span></h2>
          ${list.length ? `<div class="plist">${cards}</div>` : `
            <div class="empty">
              <h3>No client projects yet</h3>
              <p>Start one before your next meeting. Everything saves automatically in this browser.</p>
              <button type="button" class="btn btn-dark" data-act="new">+ New client project</button>
            </div>`}
        </section>
        <aside class="settings-card" aria-labelledby="setTitle">
          <h2 id="setTitle">Your studio details</h2>
          <p class="muted">Shown in the header, the PDF footer and as project manager.</p>
          <label>Studio name<input class="field" data-set="studio" value="${esc(settings.studio)}" autocomplete="organization"></label>
          <label>Your name<input class="field" data-set="manager" value="${esc(settings.manager)}" autocomplete="name"></label>
        </aside>
      </div>`;
  }

  /* ---------- Wizard ---------- */
  function renderWizard() {
    const p = current();
    const step = p.step;
    const isNotes = step === NOTES_STEP;
    const sec = isNotes ? null : SECTIONS[step];
    const color = isNotes ? '#1F1A3D' : secColor(step);
    const s = stats(p);

    const segs = Array.from({ length: TOTAL_STEPS }, (_, i) => {
      const done = i === NOTES_STEP ? (trim(p.a.myNotes) ? 1 : 0) : sectionStats(i, p).pct;
      const title = i === NOTES_STEP ? 'My project notes' : SECTIONS[i].title;
      return `<button type="button" class="seg ${i === step ? 'current' : ''}" data-act="jump" data-step="${i}"
        style="--c:${i === NOTES_STEP ? '#B9B3D9' : secColor(i)}" aria-label="Go to ${i === NOTES_STEP ? 'notes' : 'section ' + (i + 1)}: ${esc(title)}, ${Math.round(done * 100)}% done"
        ${i === step ? 'aria-current="step"' : ''}>
        <span class="fill" style="width:${Math.round(done * 100)}%"></span><span class="n">${i === NOTES_STEP ? '✎' : i + 1}</span></button>`;
    }).join('');

    const body = isNotes ? notesHTML(p) : sec.q.map((q) => questionHTML(q, p)).join('');

    app.innerHTML = `
      <div class="wiz" style="--sec:${color};--sec-ink:${inkOn(color)}">
        <div class="wiz-head">
          <div class="client-chip">
            ${logoHTML(p)}
            <div><strong>${esc(p.businessName)} — Website Discovery</strong><span class="muted">${esc(p.projectName)}${p.clientName ? ' with ' + esc(p.clientName) : ''}</span></div>
          </div>
          <div class="wiz-tools">
            <span class="saved" id="savedState">All changes saved</span>
            <button type="button" class="btn-ghost" data-act="edit-details">Edit details</button>
            <button type="button" class="btn-ghost" data-act="reset">Reset answers</button>
            <button type="button" class="btn-ghost" data-act="review">Review</button>
          </div>
        </div>

        <div class="progress-wrap">
          <div class="progress-meta">
            <span>${isNotes ? 'Your project notes' : `Section ${step + 1} of ${SECTIONS.length}`}</span>
            <span class="pct" id="pctLabel">${s.pct}% complete</span>
          </div>
          <div class="segs">${segs}</div>
          <div class="ascii" id="asciiBar" aria-hidden="true">${asciiBar(s.pct)}</div>
        </div>

        <form class="sec-card" id="secForm" novalidate>
          <div class="sec-head">
            <span class="sec-badge" aria-hidden="true">${isNotes ? '✎' : step + 1}</span>
            <div>
              <h1 id="secTitle" tabindex="-1">${isNotes ? 'My project notes' : esc(sec.title)}</h1>
              <p>${isNotes ? 'Just for you. Preferences, promises made, follow-ups and things to investigate.' : esc(sec.intro)}</p>
            </div>
          </div>
          <div class="qs">${body}</div>
        </form>

        <nav class="wiz-nav" aria-label="Section navigation">
          <button type="button" class="btn btn-outline" data-act="back">${step === 0 ? 'All projects' : 'Back'}</button>
          <button type="button" class="btn btn-primary" data-act="next">${isNotes ? 'Review answers' : 'Save & continue'}</button>
        </nav>
      </div>`;
  }

  function asciiBar(pct) {
    const n = 20, f = Math.round((pct / 100) * n);
    return '█'.repeat(f) + '░'.repeat(n - f) + ' ' + pct + '%';
  }

  function notesHTML(p) {
    return `<div class="q">
      <label class="q-label" for="f_myNotes">My project notes <span class="opt-tag">Private to you, included in the PDF</span></label>
      <p class="q-hint">Client preferences, things to remember, follow-up questions, ideas, technical considerations, promises made during the meeting, things to investigate.</p>
      <textarea class="field big" id="f_myNotes" data-k="myNotes" rows="14">${esc(p.a.myNotes || '')}</textarea>
    </div>`;
  }

  function optionsFor(q) {
    if (q.t === 'yn') return YN;
    if (q.t === 'ync') return YNC;
    if (q.t === 'who') return ['Client', 'Studio', 'Both'];
    return q.o || [];
  }
  function optionLabel(q, o) { return q.t === 'who' && o === 'Studio' ? (settings.studio || 'Studio') : o; }

  function questionHTML(q, p) {
    const id = 'f_' + q.k;
    const v = p.a[q.k];
    const lid = 'l_' + q.k;
    let input = '';
    let labelTag = 'label';

    switch (q.t) {
      case 'text': case 'email': case 'tel': case 'url': case 'date':
        input = `<input class="field" type="${q.t}" id="${id}" data-k="${q.k}" value="${esc(v || '')}" placeholder="${esc(q.ph || '')}"${q.t === 'email' ? ' autocomplete="off"' : ''}>`;
        break;
      case 'textarea':
        input = `<textarea class="field ${q.big ? 'big' : ''}" id="${id}" data-k="${q.k}" rows="${q.rows || 4}" placeholder="${esc(q.ph || '')}">${esc(v || '')}</textarea>`;
        break;
      case 'yn': case 'ync': case 'choice': case 'who': {
        labelTag = 'p';
        input = `<div class="pills" role="radiogroup" aria-labelledby="${lid}">` +
          optionsFor(q).map((o) => `<button type="button" class="pill ${v === o ? 'on' : ''}" role="radio" aria-checked="${v === o}" data-pick="${q.k}" data-v="${esc(o)}">${esc(optionLabel(q, o))}</button>`).join('') +
          `</div>`;
        if (q.detail) {
          input += `<input class="field" type="text" data-k="${q.k}_d" aria-label="${esc(q.detail)}" placeholder="${esc(q.detail)}" value="${esc(p.a[q.k + '_d'] || '')}">`;
        }
        break;
      }
      case 'checks': {
        labelTag = 'p';
        const arr = Array.isArray(v) ? v : [];
        input = `<div class="checks" role="group" aria-labelledby="${lid}">` +
          q.o.map((o) => `<label class="check ${arr.includes(o) ? 'on' : ''}"><input type="checkbox" data-check="${q.k}" value="${esc(o)}" ${arr.includes(o) ? 'checked' : ''}><span class="box" aria-hidden="true">✓</span>${esc(o)}</label>`).join('') +
          `</div>`;
        if (q.o.includes('Other')) {
          input += `<input class="field ${arr.includes('Other') ? '' : 'hidden'}" type="text" data-k="${q.k}_o" data-other="${q.k}" aria-label="Other — please specify" placeholder="Other — please specify" value="${esc(p.a[q.k + '_o'] || '')}">`;
        }
        break;
      }
      case 'status': {
        labelTag = 'p';
        const st = v || {};
        input = `<div class="status-list" role="group" aria-labelledby="${lid}">` + q.items.map((it) => {
          const cur = st[it] || 'Not received';
          return `<div class="status-row"><strong>${esc(it)}</strong><div class="pills" role="radiogroup" aria-label="${esc(it)} status">
            <button type="button" class="pill pending ${cur === 'Not received' ? 'on' : ''}" role="radio" aria-checked="${cur === 'Not received'}" data-status="${q.k}" data-item="${esc(it)}" data-v="Not received">Not received</button>
            <button type="button" class="pill received ${cur === 'Received' ? 'on' : ''}" role="radio" aria-checked="${cur === 'Received'}" data-status="${q.k}" data-item="${esc(it)}" data-v="Received">Received</button>
          </div></div>`;
        }).join('') + `</div>`;
        break;
      }
      case 'services':
        labelTag = 'p';
        input = servicesHTML(p);
        break;
      case 'websites':
        labelTag = 'p';
        input = sitesHTML(p);
        break;
    }

    const forAttr = labelTag === 'label' ? ` for="${id}"` : '';
    const tag = q.final ? '<span class="key">Final question</span>' : (q.imp ? '<span class="key">Key question</span>' : (q.opt ? '<span class="opt-tag">Optional</span>' : ''));
    const hint = q.t === 'websites' ? '<p class="q-hint">Add a link and what they like about it. Aim for 3–5.</p>'
      : (q.t === 'checks' ? '<p class="q-hint">Tick all that apply.</p>' : '');
    const note = p.qn[q.k] || '';
    const noteBlock = q.opt ? '' : `
      <div class="qnote">
        <button type="button" class="note-toggle" data-note="${q.k}" aria-expanded="${!!note}" aria-controls="n_${q.k}">${note ? 'Hide note' : '+ Add note'}</button>
        <textarea class="field note ${note ? '' : 'hidden'}" id="n_${q.k}" data-qn="${q.k}" rows="2" aria-label="Note for: ${esc(q.l)}" placeholder="Your note on this answer">${esc(note)}</textarea>
      </div>`;

    return `<div class="q" data-q="${q.k}">
      <${labelTag} class="q-label" id="${lid}"${forAttr}>${esc(q.l)} ${tag}</${labelTag}>
      ${hint}
      ${input}
      ${noteBlock}
    </div>`;
  }

  function servicesHTML(p) {
    const list = p.services;
    return `<div class="repeat" id="svcList">` + list.map((s, i) => `
      <fieldset class="rep-card">
        <legend data-legend="${i}">Service ${i + 1}${trim(s.name) ? ': ' + esc(s.name) : ''}</legend>
        <div class="grid2">
          ${SVC_FIELDS.map((f) => {
            const fid = `svc_${i}_${f.k}`;
            if (f.t === 'pick') {
              return `<div class="full"><span class="sub-label" id="${fid}_l">${esc(f.l)}</span><div class="pills" role="radiogroup" aria-labelledby="${fid}_l">` +
                YN.map((o) => `<button type="button" class="pill ${s[f.k] === o ? 'on' : ''}" role="radio" aria-checked="${s[f.k] === o}" data-svcpick="${i}" data-f="${f.k}" data-v="${o}">${o}</button>`).join('') +
                `</div></div>`;
            }
            const field = f.t === 'textarea'
              ? `<textarea class="field" id="${fid}" rows="3" data-svc="${i}" data-f="${f.k}">${esc(s[f.k] || '')}</textarea>`
              : `<input class="field" type="text" id="${fid}" data-svc="${i}" data-f="${f.k}" value="${esc(s[f.k] || '')}" placeholder="${esc(f.ph || '')}">`;
            return `<div class="${f.full ? 'full' : ''}"><label class="sub-label" for="${fid}">${esc(f.l)}</label>${field}</div>`;
          }).join('')}
        </div>
        ${list.length > 1 ? `<div class="rep-foot"><button type="button" class="btn-text danger" data-act="del-svc" data-i="${i}">Remove service ${i + 1}</button></div>` : ''}
      </fieldset>`).join('') +
      `<button type="button" class="btn-add" data-act="add-svc" ${list.length >= MAX_SERVICES ? 'disabled' : ''}>+ Add another service</button></div>`;
  }

  function sitesHTML(p) {
    const list = p.websites;
    return `<div class="repeat" id="siteList">` + list.map((w, i) => `
      <fieldset class="rep-card">
        <legend>Website ${i + 1}</legend>
        <div class="grid2">
          <div class="full"><label class="sub-label" for="site_${i}_url">Website URL</label>
            <input class="field" type="url" id="site_${i}_url" data-site="${i}" data-f="url" value="${esc(w.url || '')}" placeholder="https://"></div>
          <div class="full"><label class="sub-label" for="site_${i}_like">What do you like about it?</label>
            <textarea class="field" id="site_${i}_like" rows="2" data-site="${i}" data-f="like">${esc(w.like || '')}</textarea></div>
        </div>
        ${list.length > 1 ? `<div class="rep-foot"><button type="button" class="btn-text danger" data-act="del-site" data-i="${i}">Remove website ${i + 1}</button></div>` : ''}
      </fieldset>`).join('') +
      `<button type="button" class="btn-add" data-act="add-site" ${list.length >= MAX_SITES ? 'disabled' : ''}>+ Add another website</button></div>`;
  }

  /* ---------- Autosave ---------- */
  let saveTimer = null;
  function touch() {
    const p = current();
    if (!p) return;
    p.updated = Date.now();
    const el = $('#savedState');
    if (el) { el.textContent = 'Saving…'; el.classList.add('busy'); }
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flush, 350);
  }
  function flush() {
    clearTimeout(saveTimer);
    saveTimer = null;
    const ok = persist();
    const el = $('#savedState');
    if (el) { el.textContent = ok === false ? 'Not saved' : 'All changes saved'; el.classList.remove('busy'); }
  }
  window.addEventListener('beforeunload', () => { if (saveTimer) flush(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && saveTimer) flush(); });

  function refreshProgress() {
    const p = current();
    if (!p || view !== 'wizard') return;
    const s = stats(p);
    const pl = $('#pctLabel'); if (pl) pl.textContent = `${s.pct}% complete`;
    const ab = $('#asciiBar'); if (ab) ab.textContent = asciiBar(s.pct);
    $$('.seg').forEach((b) => {
      const i = Number(b.dataset.step);
      const done = i === NOTES_STEP ? (trim(p.a.myNotes) ? 1 : 0) : sectionStats(i, p).pct;
      b.querySelector('.fill').style.width = Math.round(done * 100) + '%';
      const title = i === NOTES_STEP ? 'My project notes' : SECTIONS[i].title;
      b.setAttribute('aria-label', `Go to ${i === NOTES_STEP ? 'notes' : 'section ' + (i + 1)}: ${title}, ${Math.round(done * 100)}% done`);
    });
  }

  /* ---------- Events ---------- */
  document.addEventListener('input', (e) => {
    const t = e.target;
    if (t.dataset.set) {
      settings[t.dataset.set] = t.value;
      writeLS(LS_SETTINGS, settings);
      if (t.dataset.set === 'studio') $('#brandName').textContent = t.value || 'Website Discovery';
      return;
    }
    const p = current();
    if (!p || view !== 'wizard') return;
    if (t.dataset.k) p.a[t.dataset.k] = t.value;
    else if (t.dataset.qn) p.qn[t.dataset.qn] = t.value;
    else if (t.dataset.svc != null) {
      const i = Number(t.dataset.svc);
      p.services[i][t.dataset.f] = t.value;
      if (t.dataset.f === 'name') {
        const lg = $(`[data-legend="${i}"]`);
        if (lg) lg.textContent = `Service ${i + 1}${t.value.trim() ? ': ' + t.value.trim() : ''}`;
      }
    } else if (t.dataset.site != null) {
      p.websites[Number(t.dataset.site)][t.dataset.f] = t.value;
    } else return;
    touch();
    refreshProgress();
  });

  document.addEventListener('change', (e) => {
    const t = e.target;
    if (!t.dataset.check) return;
    const p = current();
    if (!p) return;
    const k = t.dataset.check;
    const arr = Array.isArray(p.a[k]) ? p.a[k].slice() : [];
    const i = arr.indexOf(t.value);
    if (t.checked && i < 0) arr.push(t.value);
    if (!t.checked && i >= 0) arr.splice(i, 1);
    // keep original option order
    const q = findQuestion(k);
    p.a[k] = q ? q.o.filter((o) => arr.includes(o)) : arr;
    t.closest('.check').classList.toggle('on', t.checked);
    if (t.value === 'Other') {
      const other = $(`[data-other="${k}"]`);
      if (other) { other.classList.toggle('hidden', !t.checked); if (t.checked) other.focus(); }
    }
    touch();
    refreshProgress();
  });

  function findQuestion(k) {
    for (const s of SECTIONS) for (const q of s.q) if (q.k === k) return q;
    return null;
  }

  document.addEventListener('submit', (e) => e.preventDefault());

  document.addEventListener('click', (e) => {
    const t = e.target.closest('button, [data-act]');
    if (!t) return;
    const p = current();

    // Pills: single choice, click again to clear
    if (t.dataset.pick && p) {
      const k = t.dataset.pick;
      const val = p.a[k] === t.dataset.v ? '' : t.dataset.v;
      p.a[k] = val;
      $$(`[data-pick="${k}"]`).forEach((b) => { const on = b.dataset.v === val; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
      touch(); refreshProgress(); return;
    }
    if (t.dataset.svcpick != null && p) {
      const i = Number(t.dataset.svcpick), f = t.dataset.f;
      const val = p.services[i][f] === t.dataset.v ? '' : t.dataset.v;
      p.services[i][f] = val;
      $$(`[data-svcpick="${i}"][data-f="${f}"]`).forEach((b) => { const on = b.dataset.v === val; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
      touch(); return;
    }
    if (t.dataset.status && p) {
      const k = t.dataset.status, item = t.dataset.item;
      p.a[k] = Object.assign({}, p.a[k] || {}, { [item]: t.dataset.v });
      t.parentElement.querySelectorAll('.pill').forEach((b) => { const on = b === t; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
      touch(); return;
    }
    if (t.dataset.note && p) {
      const ta = $('#n_' + t.dataset.note);
      const show = ta.classList.contains('hidden');
      ta.classList.toggle('hidden', !show);
      t.textContent = show ? 'Hide note' : (trim(ta.value) ? 'Show note' : '+ Add note');
      t.setAttribute('aria-expanded', show);
      if (show) ta.focus();
      return;
    }

    const act = t.dataset.act;
    if (!act) return;
    const id = t.dataset.id;

    switch (act) {
      case 'home': flushIfNeeded(); go('home'); break;
      case 'new': openProjectModal(); break;
      case 'open': {
        const pr = getProject(id); if (!pr) return;
        go('wizard', { id, focus: '#secTitle' }); break;
      }
      case 'dup': duplicateProject(id); break;
      case 'del': confirmDelete(id); break;
      case 'pdf': { const pr = getProject(id); if (pr) requestOutput(pr, 'pdf'); break; }
      case 'jump': setStep(Number(t.dataset.step)); break;
      case 'back':
        if (!p) return;
        if (p.step === 0) { flushIfNeeded(); go('home'); } else setStep(p.step - 1);
        break;
      case 'next':
        if (!p) return;
        flushIfNeeded();
        if (p.step === NOTES_STEP) go('review', { focus: '#revTitle' });
        else { setStep(p.step + 1); toast('Saved'); }
        break;
      case 'review': flushIfNeeded(); go('review', { focus: '#revTitle' }); break;
      case 'edit-sec': setStep(Number(t.dataset.step)); break;
      case 'edit-details': if (p) openProjectModal(p); break;
      case 'reset': if (p) confirmReset(p); break;
      case 'add-svc':
        if (p.services.length >= MAX_SERVICES) return;
        p.services.push(blankService()); touch(); rerenderKeep(() => {
          const n = p.services.length - 1; const el = $(`#svc_${n}_name`); if (el) { el.focus(); el.scrollIntoView({ block: 'center' }); }
        });
        break;
      case 'del-svc': {
        const i = Number(t.dataset.i);
        const s = p.services[i];
        const doDel = () => { p.services.splice(i, 1); touch(); flush(); rerenderKeep(); refreshProgress(); toast('Service removed'); };
        if (SVC_FIELDS.some((f) => trim(s[f.k]))) {
          modal({ title: `Remove service ${i + 1}?`, body: `<p>${trim(s.name) ? `“${esc(s.name)}” and its details` : 'This service and its details'} will be removed.</p>`, actions: [{ label: 'Keep it', cls: 'btn-outline' }, { label: 'Remove service', cls: 'btn-danger', run: doDel }] });
        } else doDel();
        break;
      }
      case 'add-site':
        if (p.websites.length >= MAX_SITES) return;
        p.websites.push(blankSite()); touch(); rerenderKeep(() => {
          const n = p.websites.length - 1; const el = $(`#site_${n}_url`); if (el) { el.focus(); el.scrollIntoView({ block: 'center' }); }
        });
        break;
      case 'del-site': {
        const i = Number(t.dataset.i);
        p.websites.splice(i, 1); touch(); flush(); rerenderKeep(); refreshProgress(); toast('Website removed');
        break;
      }
      case 'gen-pdf': if (p) requestOutput(p, 'pdf'); break;
      case 'print': if (p) requestOutput(p, 'print'); break;
    }
  });

  function flushIfNeeded() { if (saveTimer) flush(); }

  function setStep(n) {
    const p = current(); if (!p) return;
    flushIfNeeded();
    p.step = Math.max(0, Math.min(NOTES_STEP, n));
    persist();
    go('wizard', { focus: '#secTitle' });
  }

  function rerenderKeep(after) {
    const y = window.scrollY;
    render();
    window.scrollTo(0, y);
    if (after) after();
  }

  /* ---------- Projects: create / edit / duplicate / delete / reset ---------- */
  function readLogo(file) {
    return new Promise((resolve, reject) => {
      if (!/^image\//.test(file.type)) { reject(new Error('Please choose an image file (PNG, JPG, SVG or WebP).')); return; }
      const fr = new FileReader();
      fr.onerror = () => reject(new Error('Couldn’t read that file.'));
      fr.onload = () => {
        const img = new Image();
        img.onload = () => {
          const max = 360;
          const r = Math.min(1, max / Math.max(img.width || max, img.height || max));
          const w = Math.max(1, Math.round((img.width || max) * r));
          const h = Math.max(1, Math.round((img.height || max) * r));
          const c = document.createElement('canvas');
          c.width = w; c.height = h;
          c.getContext('2d').drawImage(img, 0, 0, w, h);
          try { resolve({ data: c.toDataURL('image/png'), w, h }); } catch (err) { reject(new Error('That image couldn’t be processed.')); }
        };
        img.onerror = () => reject(new Error('That image couldn’t be opened.'));
        img.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }

  function openProjectModal(existing) {
    const p = existing || {};
    let logo = { data: p.logo || '', w: p.logoW || 0, h: p.logoH || 0 };
    const color = p.color || PALETTE[projects.length % PALETTE.length].c;
    const body = `
      <div class="form">
        <div><label class="lbl" for="m_client">Client name</label><input class="field" id="m_client" value="${esc(p.clientName || '')}" placeholder="e.g. Ana Ruiz" autocomplete="off"><p class="err hidden" id="e_client">Add the client’s name.</p></div>
        <div><label class="lbl" for="m_biz">Business name</label><input class="field" id="m_biz" value="${esc(p.businessName || '')}" placeholder="e.g. Studio Pilates" autocomplete="off"><p class="err hidden" id="e_biz">Add the business name.</p></div>
        <div><label class="lbl" for="m_proj">Project name</label><input class="field" id="m_proj" value="${esc(p.projectName || '')}" placeholder="e.g. Studio Pilates Website" autocomplete="off"></div>
        <fieldset style="border:0;padding:0;margin:0"><legend class="lbl" style="font-weight:700;font-size:.92rem;margin-bottom:8px">Project colour (used in the app and PDF)</legend>
          <div class="swatches">${PALETTE.map((s) => `<label class="swatch"><input type="radio" name="m_color" value="${s.c}" ${s.c === color ? 'checked' : ''}><span style="background:${s.c}"></span><span class="sr-only">${s.name}</span></label>`).join('')}</div>
        </fieldset>
        <div><span class="lbl" id="m_logo_l">Client logo (optional)</span>
          <div class="logo-row">
            <div class="logo-preview" id="m_logo_prev">${logo.data ? `<img src="${logo.data}" alt="Logo preview">` : 'No logo'}</div>
            <span class="btn btn-outline file-btn">Choose image<input type="file" id="m_logo" accept="image/*" aria-labelledby="m_logo_l"></span>
            <button type="button" class="btn-text danger ${logo.data ? '' : 'hidden'}" id="m_logo_rm">Remove logo</button>
          </div>
          <p class="err hidden" id="e_logo"></p>
        </div>
      </div>`;

    const close = modal({
      title: existing ? 'Edit project details' : 'New client project',
      intro: existing ? '' : 'Answers start blank for every new client. You can change these details later.',
      body,
      actions: [
        { label: 'Cancel', cls: 'btn-outline' },
        {
          label: existing ? 'Save details' : 'Create project', cls: 'btn-primary', keepOpen: true,
          run: () => {
            const clientName = $('#m_client').value.trim();
            const businessName = $('#m_biz').value.trim();
            const projectName = $('#m_proj').value.trim() || `${businessName} Website`;
            const colorV = ($('input[name="m_color"]:checked') || {}).value || PALETTE[0].c;
            $('#e_client').classList.toggle('hidden', !!clientName);
            $('#e_biz').classList.toggle('hidden', !!businessName);
            if (!clientName) { $('#m_client').focus(); return false; }
            if (!businessName) { $('#m_biz').focus(); return false; }
            if (existing) {
              Object.assign(existing, { clientName, businessName, projectName, color: colorV, logo: logo.data, logoW: logo.w, logoH: logo.h, updated: Date.now() });
              if (!trim(existing.a.bizName)) existing.a.bizName = businessName;
              persist();
              render();
              toast('Details saved');
            } else {
              const np = newProject({ clientName, businessName, projectName, color: colorV, logo: logo.data, logoW: logo.w, logoH: logo.h });
              projects.push(np);
              persist();
              go('wizard', { id: np.id, focus: '#secTitle' });
              toast(`Project created for ${businessName}`);
            }
            return true;
          }
        }
      ],
      onOpen: () => {
        const accentPreview = () => { const c = ($('input[name="m_color"]:checked') || {}).value; if (c) $('.modal').style.setProperty('--accent', c); };
        $$('input[name="m_color"]').forEach((r) => r.addEventListener('change', accentPreview));
        accentPreview();
        const biz = $('#m_biz'), proj = $('#m_proj');
        biz.addEventListener('input', () => { proj.placeholder = biz.value.trim() ? `${biz.value.trim()} Website` : 'e.g. Studio Pilates Website'; });
        $('#m_logo').addEventListener('change', async (ev) => {
          const f = ev.target.files && ev.target.files[0];
          const err = $('#e_logo');
          err.classList.add('hidden');
          if (!f) return;
          try {
            logo = await readLogo(f);
            $('#m_logo_prev').innerHTML = `<img src="${logo.data}" alt="Logo preview">`;
            $('#m_logo_rm').classList.remove('hidden');
          } catch (er) { err.textContent = er.message; err.classList.remove('hidden'); }
          ev.target.value = '';
        });
        $('#m_logo_rm').addEventListener('click', () => {
          logo = { data: '', w: 0, h: 0 };
          $('#m_logo_prev').textContent = 'No logo';
          $('#m_logo_rm').classList.add('hidden');
        });
        $('#m_client').focus();
      }
    });
    return close;
  }

  function duplicateProject(id) {
    const src = getProject(id); if (!src) return;
    const c = normalize(clone(src));
    c.id = uid();
    c.projectName = `${src.projectName} (copy)`;
    c.created = c.updated = Date.now();
    projects.push(c);
    persist();
    render();
    toast(`Duplicated “${src.projectName}”`);
  }

  function confirmDelete(id) {
    const p = getProject(id); if (!p) return;
    modal({
      title: 'Delete this project?',
      body: `<p>“${esc(p.projectName)}” and all its answers will be removed from this browser. This can’t be undone. Export a PDF first if you need a copy.</p>`,
      actions: [
        { label: 'Keep project', cls: 'btn-outline' },
        {
          label: 'Delete project', cls: 'btn-danger', run: () => {
            projects = projects.filter((x) => x.id !== id);
            if (currentId === id) currentId = null;
            persist();
            go('home');
            toast('Project deleted');
          }
        }
      ]
    });
  }

  function confirmReset(p) {
    modal({
      title: 'Reset all answers?',
      body: `<p>This clears every answer, service, website and note for “${esc(p.projectName)}”. Client name, business name, colour and logo stay.</p>`,
      actions: [
        { label: 'Cancel', cls: 'btn-outline' },
        {
          label: 'Reset answers', cls: 'btn-danger', run: () => {
            p.a = { bizName: p.businessName };
            p.qn = {};
            p.services = [blankService()];
            p.websites = [blankSite()];
            p.step = 0;
            p.updated = Date.now();
            persist();
            go('wizard', { focus: '#secTitle' });
            toast('Answers cleared — ready for a fresh start');
          }
        }
      ]
    });
  }

  /* ---------- Review ---------- */
  function itemHTML(it) {
    const noteHTML = it.note ? `<p class="rev-note"><b>Note:</b> ${esc(it.note)}</p>` : '';
    if (it.kind === 'qa') {
      return `<div class="rev-row ${it.a ? '' : 'missing'}"><dt>${esc(it.q)}</dt><dd>${it.a ? esc(it.a) : '<span class="np">Not provided</span>'}${noteHTML}</dd></div>`;
    }
    if (it.kind === 'groups') {
      const inner = it.groups.length ? it.groups.map((g) => `
        <div class="rev-group">${g.title ? `<h4>${esc(g.title)}</h4>` : ''}
          <table>${g.rows.map(([l, v]) => `<tr><td>${esc(l)}</td><td>${v ? esc(v) : '<span class="np">Not provided</span>'}</td></tr>`).join('')}</table>
        </div>`).join('') : '<span class="np">Not provided</span>';
      return `<div class="rev-row ${it.groups.length ? '' : 'missing'}"><dt>${esc(it.q)}</dt><dd>${inner}${noteHTML}</dd></div>`;
    }
    return `<div class="rev-row"><dt>Notes</dt><dd>${it.a ? esc(it.a) : '<span class="np">Not provided</span>'}</dd></div>`;
  }

  function renderReview() {
    const p = current();
    const s = stats(p);
    const r = report(p);
    const left = s.total - s.done;
    const done = left === 0;
    const confetti = done ? `<div class="confetti" aria-hidden="true">${Array.from({ length: 28 }, (_, i) => `<i style="left:${(i * 37) % 100}%;background:${secColor(i)};animation-delay:${(i % 7) * 0.08}s"></i>`).join('')}</div>` : '';

    const actions = `
      <button type="button" class="btn btn-outline" data-act="jump" data-step="${p.step}">Back to questions</button>
      <button type="button" class="btn btn-outline" data-act="print">Print / Save as PDF</button>
      <button type="button" class="btn btn-primary" data-act="gen-pdf">Generate PDF</button>`;

    app.innerHTML = `
      <div class="review">
        <div class="review-head">
          ${confetti}
          <div>
            <h1 id="revTitle" tabindex="-1">${esc(p.businessName)} — Discovery summary</h1>
            <p>${esc(p.projectName)}${p.clientName ? ' with ' + esc(p.clientName) : ''}</p>
          </div>
          <div class="completion ${done ? 'done' : ''}">
            <strong>Completion: ${s.pct}%</strong>
            <span>${done ? 'Every question answered' : `${left} question${left === 1 ? '' : 's'} still need${left === 1 ? 's' : ''} answers`}</span>
          </div>
        </div>
        <div class="review-actions">${actions}</div>
        ${r.map((sec) => {
          const c = sec.step === NOTES_STEP ? '#B9B3D9' : secColor(sec.step);
          return `<section class="rev-sec" style="--c:${c};--c-ink:${inkOn(c)}">
            <header><h2><span class="num">${sec.n}</span>${esc(sec.title)}</h2>
              <button type="button" class="edit" data-act="edit-sec" data-step="${sec.step}" aria-label="Edit ${esc(sec.title)}">Edit</button></header>
            <dl>${sec.items.map(itemHTML).join('')}</dl>
          </section>`;
        }).join('')}
        <div class="review-actions">${actions}</div>
      </div>`;
  }

  /* ---------- Output guard (warn before PDF / print) ---------- */
  function requestOutput(p, mode) {
    flushIfNeeded();
    const s = stats(p);
    const run = () => (mode === 'print' ? printProject(p) : downloadPDF(p));
    if (!s.missing.length) { run(); return; }
    const keyMissing = s.missing.filter((m) => m.q.imp);
    const shown = (keyMissing.length ? keyMissing : s.missing).slice(0, 8);
    const firstSec = (keyMissing[0] || s.missing[0]).sec;
    modal({
      title: keyMissing.length ? 'Some key questions are unanswered' : 'A few questions are unanswered',
      body: `<p>${s.missing.length} question${s.missing.length === 1 ? '' : 's'} still need${s.missing.length === 1 ? 's' : ''} answers${keyMissing.length ? `, including ${keyMissing.length} key question${keyMissing.length === 1 ? '' : 's'}` : ''}. They’ll show as “Not provided” in the document.</p>
        <ul>${shown.map((m) => `<li><b>${esc(SECTIONS[m.sec].title)}:</b> ${esc(m.q.l)}</li>`).join('')}${(keyMissing.length ? keyMissing : s.missing).length > shown.length ? '<li>…and more</li>' : ''}</ul>`,
      actions: [
        { label: mode === 'print' ? 'Print anyway' : 'Generate anyway', cls: 'btn-outline', run },
        { label: 'Finish answering', cls: 'btn-primary', run: () => { currentId = p.id; p.step = firstSec; persist(); go('wizard', { focus: '#secTitle' }); } }
      ]
    });
  }

  /* ---------- Print ---------- */
  function printHTML(p) {
    const r = report(p);
    const today = fmtDate(Date.now());
    const s = stats(p);
    const qa = (it) => {
      const note = it.note ? `<div class="lbl">Notes</div><div class="note">${esc(it.note)}</div>` : '';
      if (it.kind === 'qa') {
        return `<div class="doc-q"><div class="lbl">Question</div><div class="qtext">${esc(it.q)}</div>
          <div class="lbl">Answer</div><div class="ans ${it.a ? '' : 'np'}">${it.a ? esc(it.a) : 'Not provided'}</div>${note}</div>`;
      }
      if (it.kind === 'groups') {
        const inner = it.groups.length ? it.groups.map((g) => `<div class="doc-group">${g.title ? `<h4>${esc(g.title)}</h4>` : ''}<table>${g.rows.map(([l, v]) => `<tr><td>${esc(l)}</td><td class="${v ? '' : 'np'}">${v ? esc(v) : 'Not provided'}</td></tr>`).join('')}</table></div>`).join('') : '<span class="np">Not provided</span>';
        return `<div class="doc-q"><div class="lbl">Question</div><div class="qtext">${esc(it.q)}</div><div class="lbl">Answer</div><div class="ans">${inner}</div>${note}</div>`;
      }
      return `<div class="doc-notes ${it.a ? '' : 'np'}">${it.a ? esc(it.a) : 'Not provided'}</div>`;
    };
    return `<div class="doc" style="--accent:${p.color}">
      <section class="doc-cover">
        <div class="studio"><span>${esc(settings.studio || '')}</span>${p.logo ? `<img src="${p.logo}" alt="">` : ''}</div>
        <h1>${esc(p.businessName)}</h1>
        <p class="subtitle">Website Discovery &amp; Project Requirements</p>
        <table class="doc-info">
          <tr><td>Client</td><td>${esc(p.clientName || '')}</td></tr>
          <tr><td>Business</td><td>${esc(p.businessName)}</td></tr>
          <tr><td>Project</td><td>${esc(p.projectName)}</td></tr>
          <tr><td>Date</td><td>${today}</td></tr>
          <tr><td>Prepared by</td><td>${esc([settings.manager, settings.studio].filter(Boolean).join(', '))}</td></tr>
          <tr><td>Completion</td><td>${s.pct}%</td></tr>
        </table>
        <ol class="doc-toc">${r.map((sec) => `<li>${esc(sec.title)}</li>`).join('')}<li>Project confirmation</li></ol>
      </section>
      ${r.map((sec) => `<section class="doc-sec"><h2>${sec.n}. ${esc(sec.title)}</h2>${sec.items.map(qa).join('')}</section>`).join('')}
      <section class="doc-confirm">
        <h2>Project confirmation</h2>
        <p>By signing, the client confirms the information in this document is accurate and forms the basis of the project scope.</p>
        <div class="sig"><span>Client name</span><span></span></div>
        <div class="sig"><span>Client signature</span><span></span></div>
        <div class="sig"><span>Date</span><span></span></div>
        <div class="sig"><span>Project manager</span><span></span></div>
      </section>
      <div class="doc-foot"><span>${esc(settings.studio || '')} | ${esc(p.businessName)} website discovery</span><span>${today}</span></div>
    </div>`;
  }

  function printProject(p) {
    const root = $('#print-root');
    root.innerHTML = printHTML(p);
    const oldTitle = document.title;
    document.title = `${slug(p.businessName)}-website-discovery`;
    const cleanup = () => { document.title = oldTitle; root.innerHTML = ''; window.removeEventListener('afterprint', cleanup); };
    window.addEventListener('afterprint', cleanup);
    setTimeout(() => {
      try { window.print(); } catch (e) { toast('Printing isn’t available here. Use your browser’s Print menu.', true); }
    }, 60);
  }

  /* ---------- PDF (jsPDF) ---------- */
  function cleanText(s) {
    return String(s == null ? '' : s)
      .replace(/[\u2018\u2019\u201A\u2032]/g, "'")
      .replace(/[\u201C\u201D\u201E\u2033]/g, '"')
      .replace(/[\u2013\u2014\u2212]/g, '-')
      .replace(/\u2026/g, '...')
      .replace(/[\u2022\u25CF\u25AA]/g, '-')
      .replace(/\u00A0/g, ' ')
      .replace(/\r\n?/g, '\n')
      .replace(/[^\x09\x0A\x20-\x7E\xA1-\xFF]/g, '');
  }

  function buildPDF(p) {
    const J = window.jspdf && window.jspdf.jsPDF;
    if (!J) return null;
    const doc = new J({ unit: 'mm', format: 'a4', compress: true });
    const W = 210, H = 297, M = 20, CW = W - 2 * M, TOP = 28, BOTTOM = H - 22;
    const acc = hexToRgb(p.color);
    const accText = luminance(p.color) > 0.42 ? acc.map((v) => Math.round(v * 0.55)) : acc;
    const accSoft = acc.map((v) => Math.round(v + (255 - v) * 0.9));
    const INK = [31, 26, 61], MUT = [110, 106, 138], LINE = [226, 223, 238];
    const PT = 0.3528;
    const LH = (size, f = 1.42) => size * PT * f;
    let y = M;

    const font = (size, style = 'normal', color = INK) => { doc.setFont('helvetica', style); doc.setFontSize(size); doc.setTextColor(color[0], color[1], color[2]); };
    const split = (text, size, width, style = 'normal') => { doc.setFont('helvetica', style); doc.setFontSize(size); return doc.splitTextToSize(cleanText(text), width); };
    const txt = (s, x, yy) => doc.text(s, x, yy, { baseline: 'top' });
    const addPage = () => { doc.addPage(); y = TOP; };
    const ensure = (h) => { if (y + h > BOTTOM) addPage(); };

    // Label/value row; long values flow onto the next page safely
    function row(label, value, o = {}) {
      const x = o.x != null ? o.x : M;
      const lw = o.labelW != null ? o.labelW : 24;
      const size = o.size || 10;
      const style = o.style || 'normal';
      const color = o.color || INK;
      const vx = x + lw;
      const vw = W - M - vx;
      const ll = split(label, 8, lw - 3, 'bold');
      const vl = split(value, size, vw, style);
      const hL = ll.length * LH(8) + 0.6;
      const hV = vl.length * LH(size);
      ensure(Math.min(Math.max(hL, hV), 60));
      const startPage = doc.getNumberOfPages();
      const y0 = y;
      font(8, 'bold', MUT);
      ll.forEach((l, i) => txt(l, x, y0 + 0.6 + i * LH(8)));
      if (o.bar) { doc.setDrawColor(acc[0], acc[1], acc[2]); doc.setLineWidth(0.7); }
      vl.forEach((l, i) => {
        if (i > 0) ensure(LH(size));
        font(size, style, color);
        txt(l, vx + (o.bar ? 2.5 : 0), y);
        if (o.bar) doc.line(vx, y, vx, y + LH(size));
        y += LH(size);
      });
      if (doc.getNumberOfPages() === startPage) y = Math.max(y, y0 + hL);
    }

    function divider() {
      doc.setDrawColor(LINE[0], LINE[1], LINE[2]); doc.setLineWidth(0.2);
      doc.line(M, y, W - M, y);
    }

    // ---- Cover page ----
    doc.setFillColor(acc[0], acc[1], acc[2]);
    doc.rect(0, 0, W, 6, 'F');
    font(9, 'bold', MUT);
    txt(cleanText(settings.studio || ''), M, 16);
    if (p.logo && p.logoW && p.logoH) {
      try {
        const ratio = p.logoW / p.logoH;
        let w = 40, h = w / ratio;
        if (h > 20) { h = 20; w = h * ratio; }
        doc.addImage(p.logo, 'PNG', W - M - w, 14, w, h);
      } catch (e) { /* skip logo if it can't be embedded */ }
    }
    y = 52;
    const titleLines = split(p.businessName, 30, CW, 'bold');
    font(30, 'bold', INK);
    titleLines.forEach((l) => { txt(l, M, y); y += LH(30, 1.15); });
    y += 2;
    font(13, 'normal', MUT);
    txt('Website Discovery & Project Requirements', M, y);
    y += 12;
    doc.setFillColor(accText[0], accText[1], accText[2]);
    doc.rect(M, y, 26, 1.4, 'F');
    y += 10;

    const s = stats(p);
    const info = [
      ['Client', p.clientName || ''],
      ['Business', p.businessName],
      ['Project', p.projectName],
      ['Date', fmtDate(Date.now())],
      ['Prepared by', [settings.manager, settings.studio].filter(Boolean).join(', ')],
      ['Completion', `${s.pct}% of questions answered`]
    ];
    const infoTop = y;
    const rowsH = info.map(([, v]) => Math.max(1, split(v, 10.5, CW - 48).length) * LH(10.5) + 4);
    doc.setFillColor(accSoft[0], accSoft[1], accSoft[2]);
    doc.roundedRect(M, infoTop, CW, rowsH.reduce((a, b) => a + b, 0) + 6, 3, 3, 'F');
    y = infoTop + 5;
    info.forEach(([l, v], i) => {
      font(8.5, 'bold', MUT); txt(cleanText(l), M + 6, y + 0.8);
      font(10.5, 'normal', INK);
      split(v, 10.5, CW - 48).forEach((ln, j) => txt(ln, M + 42, y + j * LH(10.5)));
      y += rowsH[i];
    });
    y += 14;

    const rep = report(p);
    font(11, 'bold', INK); txt('Contents', M, y); y += 8;
    const tocItems = rep.map((sec) => `${sec.n}.  ${sec.title}`).concat([`${rep.length + 1}.  Project confirmation`]);
    const half = Math.ceil(tocItems.length / 2);
    tocItems.forEach((t, i) => {
      font(10, 'normal', INK);
      const col = i < half ? 0 : 1;
      txt(cleanText(t), M + col * (CW / 2), y + (i % half) * LH(10, 1.7));
    });

    // ---- Sections ----
    addPage();
    rep.forEach((sec, si) => {
      ensure(34);
      if (y > TOP + 1) y += 6;
      doc.setFillColor(acc[0], acc[1], acc[2]);
      doc.roundedRect(M, y, 9, 9, 2, 2, 'F');
      const numInk = luminance(p.color) > 0.42 ? INK : [255, 255, 255];
      font(10.5, 'bold', numInk);
      doc.text(String(sec.n), M + 4.5, y + 4.6, { align: 'center', baseline: 'middle' });
      font(15, 'bold', INK);
      txt(cleanText(sec.title), M + 13, y + 0.8);
      y += 13;
      doc.setDrawColor(acc[0], acc[1], acc[2]); doc.setLineWidth(0.6);
      doc.line(M, y - 2, W - M, y - 2);
      y += 3;

      sec.items.forEach((it) => {
        if (it.kind === 'text') {
          if (!it.a) { row('Notes', 'Not provided', { style: 'italic', color: MUT }); }
          else {
            split(it.a, 10.5, CW).forEach((l) => { ensure(LH(10.5)); font(10.5, 'normal', INK); txt(l, M, y); y += LH(10.5); });
          }
          y += 3;
          return;
        }
        const qLines = split(it.q, 10.5, CW - 24, 'bold');
        ensure(Math.min(qLines.length * LH(10.5) + LH(10) * 2 + 6, 40));
        row('Question', it.q, { style: 'bold', size: 10.5 });
        y += 1.4;
        if (it.kind === 'qa') {
          row('Answer', it.a || 'Not provided', it.a ? {} : { style: 'italic', color: MUT });
        } else if (it.kind === 'groups') {
          if (!it.groups.length) row('Answer', 'Not provided', { style: 'italic', color: MUT });
          it.groups.forEach((g, gi) => {
            if (g.title) {
              ensure(LH(10) + LH(9.5) * 2);
              if (gi > 0) y += 1.5;
              font(8, 'bold', MUT); if (gi === 0) txt('Answer', M, y + 0.6);
              font(10, 'bold', accText); txt(cleanText(g.title), M + 24, y);
              y += LH(10) + 0.6;
            } else if (gi === 0) {
              font(8, 'bold', MUT); txt('Answer', M, y + 0.6);
            }
            g.rows.forEach(([l, v]) => {
              row(l, v || 'Not provided', Object.assign({ x: M + 24, labelW: 44, size: 9.5 }, v ? {} : { style: 'italic', color: MUT }));
              y += 0.6;
            });
          });
        }
        if (it.note) { y += 1.4; row('Notes', it.note, { style: 'italic', size: 9.5, bar: true }); }
        y += 3;
        ensure(4);
        divider();
        y += 4;
      });
      if (si === rep.length - 1) y += 2;
    });

    // ---- Confirmation ----
    ensure(96);
    y += 8;
    doc.setFillColor(acc[0], acc[1], acc[2]);
    doc.roundedRect(M, y, 9, 9, 2, 2, 'F');
    font(10.5, 'bold', luminance(p.color) > 0.42 ? INK : [255, 255, 255]);
    doc.text(String(rep.length + 1), M + 4.5, y + 4.6, { align: 'center', baseline: 'middle' });
    font(15, 'bold', INK); txt('Project confirmation', M + 13, y + 0.8);
    y += 13;
    doc.setDrawColor(acc[0], acc[1], acc[2]); doc.setLineWidth(0.6); doc.line(M, y - 2, W - M, y - 2);
    y += 4;
    split('By signing, the client confirms the information in this document is accurate and forms the basis of the project scope.', 10, CW)
      .forEach((l) => { font(10, 'normal', INK); txt(l, M, y); y += LH(10); });
    y += 8;
    ['Client name', 'Client signature', 'Date', 'Project manager'].forEach((l) => {
      font(10, 'bold', INK); txt(l, M, y + 3);
      doc.setDrawColor(INK[0], INK[1], INK[2]); doc.setLineWidth(0.3);
      doc.line(M + 42, y + 8, W - M, y + 8);
      y += 16;
    });

    // ---- Header & footer on every page ----
    const total = doc.getNumberOfPages();
    const footLeft = cleanText(`${settings.studio || ''}${settings.studio ? '  |  ' : ''}${p.businessName} - Website Discovery`);
    const dateStr = cleanText(fmtDate(Date.now()));
    for (let i = 1; i <= total; i++) {
      doc.setPage(i);
      if (i > 1) {
        doc.setFillColor(acc[0], acc[1], acc[2]); doc.rect(0, 0, W, 2.5, 'F');
        font(8.5, 'bold', INK); txt(cleanText(p.businessName), M, 11);
        font(8.5, 'normal', MUT); doc.text(dateStr, W - M, 11, { align: 'right', baseline: 'top' });
        doc.setDrawColor(LINE[0], LINE[1], LINE[2]); doc.setLineWidth(0.2); doc.line(M, 17, W - M, 17);
      }
      doc.setDrawColor(LINE[0], LINE[1], LINE[2]); doc.setLineWidth(0.2); doc.line(M, H - 15, W - M, H - 15);
      font(8, 'normal', MUT);
      txt(footLeft, M, H - 12);
      doc.text(`Page ${i} of ${total}`, W - M, H - 12, { align: 'right', baseline: 'top' });
    }

    doc.setProperties({ title: cleanText(`${p.businessName} - Website Discovery`), author: cleanText(settings.studio || ''), subject: 'Website Discovery & Project Requirements' });
    return doc;
  }

  function downloadPDF(p) {
    let doc;
    try { doc = buildPDF(p); } catch (e) {
      console.error(e);
      toast('The PDF couldn’t be built. Opening Print instead — choose “Save as PDF”.', true);
      printProject(p); return;
    }
    if (!doc) {
      toast('PDF engine didn’t load (are you offline?). Opening Print — choose “Save as PDF”.', true);
      printProject(p); return;
    }
    const name = `${slug(p.businessName)}-website-discovery-${new Date().toISOString().slice(0, 10)}.pdf`;
    try { doc.save(name); toast('PDF downloaded'); } catch (e) {
      toast('Download was blocked. Opening Print instead.', true); printProject(p);
    }
  }

  /* ---------- Modal & toast ---------- */
  let lastFocus = null;
  function modal({ title, intro, body, actions = [], onOpen }) {
    lastFocus = document.activeElement;
    const root = $('#modal-root');
    root.innerHTML = `
      <div class="modal-backdrop" data-backdrop>
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <h2 id="modalTitle">${esc(title)}</h2>
          ${intro ? `<p>${esc(intro)}</p>` : ''}
          ${body || ''}
          <div class="modal-actions">${actions.map((a, i) => `<button type="button" class="btn ${a.cls || 'btn-outline'}" data-mi="${i}">${esc(a.label)}</button>`).join('')}</div>
        </div>
      </div>`;
    const close = () => {
      root.innerHTML = '';
      document.removeEventListener('keydown', onKey, true);
      if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'file') {
        const primary = actions.findIndex((a) => /btn-primary/.test(a.cls || ''));
        if (primary >= 0) { e.preventDefault(); root.querySelector(`[data-mi="${primary}"]`).click(); }
      }
      if (e.key === 'Tab') {
        const f = $$('button, input, textarea, select, [tabindex]:not([tabindex="-1"])', root).filter((el) => !el.disabled && el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey, true);
    root.querySelector('[data-backdrop]').addEventListener('mousedown', (e) => { if (e.target.dataset.backdrop != null) close(); });
    $$('[data-mi]', root).forEach((b) => b.addEventListener('click', (e) => {
      e.stopPropagation();
      const a = actions[Number(b.dataset.mi)];
      if (a.keepOpen) { if (a.run && a.run() !== false) close(); }
      else { close(); if (a.run) a.run(); }
    }));
    if (onOpen) onOpen(); else { const btns = $$('[data-mi]', root); (btns[btns.length - 1] || root).focus(); }
    return close;
  }

  let toastTimer = null;
  function toast(msg, isError) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.toggle('error', !!isError);
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), isError ? 4200 : 1800);
  }

  /* ---------- Start ---------- */
  render();
})();
