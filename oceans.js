/* Dynamic client JS: mobile nav, content rendering, contact form, and lightbox */

(function () {
  'use strict';

  const fallbackSiteData = {
    hero: {
      title: 'Where Waves Whisper Wisdom',
      lead: 'AI-powered marine monitoring, resilient telemetry and expert project delivery for conservation and science.',
      features: ['Low-power field hardware', 'Edge AI for audio & vision', 'Secure cloud ingestion & analytics'],
      image: { src: 'img/OTN.jpeg', alt: 'Ocean monitoring team on a coastal site' }
    },
    services: [
      { title: 'Network Solutions', description: 'Marine-grade connectivity combining LoRaWAN, NB-IoT/LTE-M and satellite fallbacks for resilient telemetry.', image: { src: 'img/tech2.jpg', alt: 'Coastal gateway and marine monitoring hardware' }, link: '#network-solutions' },
      { title: 'AI Monitoring', description: 'On-device inference for acoustic and visual models with selective upload and event-driven telemetry.', image: { src: 'img/tech3.jpg', alt: 'Marine technology and edge AI hardware' }, link: '#ai-monitoring' },
      { title: 'Project Outsourcing', description: 'End-to-end project delivery: planning, permitting, deployment, analytics and operations support.', image: { src: 'img/tech4.jpg', alt: 'Field deployment team at a marine site' }, link: '#project-outsourcing' },
      { title: 'Tours & Safaris', description: 'Guided marine eco-tours and conservation safaris that connect stakeholders with site insights, wildlife, and deployment operations.', image: { src: 'img/salim.jpg', alt: 'Marine eco-tour on the coast' }, link: '#tours-safaris' },
      { title: 'Events', description: 'Targeted workshops, site open days and stakeholder events that bring marine monitoring, conservation science, and technology together.', image: { src: 'img/tours.jpeg', alt: 'Marine event and workshop at coastal site' }, link: '#events' }
    ],
    technology: {
      intro: 'Rugged hardware, optimised runtimes and secure cloud pipelines designed for long deployments and low bandwidth.',
      items: [
        { title: 'Architecture', description: 'Devices → Edge compute → Gateway → Secure ingestion → Dashboards & analytics.', image: { src: 'img/tech2.jpg', alt: 'Coastal architecture for marine telemetry' } },
        { title: 'Hardware & Field', description: 'IP67/IP68 enclosures, corrosion-resistant materials, solar power and smart charge controllers.', image: { src: 'img/tech3.jpg', alt: 'Marine sensors and hardware in the field' } },
        { title: 'Software & Edge AI', description: 'TensorFlow Lite / ONNX runtimes, model lifecycle, on-device filters and selective clip uploads.', image: { src: 'img/tech4.jpg', alt: 'Edge AI monitoring setup at sea' } },
        { title: 'Field Deployment', description: 'Integrated field hardware, gateway infrastructure and remote monitoring for coastal conservation sites.', image: { src: 'img/salim.jpg', alt: 'Marine monitoring deployment site' } }
      ]
    },
    capabilities: [
      { title: 'Low-power Field Hardware', description: 'Rugged, energy-efficient instrument stacks with solar charging, smart sleep cycles and long-life telemetry suitable for remote deployments.', image: { src: 'img/tech2.jpg', alt: 'Low-power hardware' }, subject: 'Low-power Field Hardware' },
      { title: 'Edge AI for Audio & Vision', description: 'On-device machine learning for acoustic event detection and visual classification, reducing bandwidth by uploading only salient clips.', image: { src: 'img/tech3.jpg', alt: 'Edge AI' }, subject: 'Edge AI for Audio & Vision' },
      { title: 'Secure Cloud Ingestion & Analytics', description: 'TLS-authenticated pipelines, device identity, and scalable analytics for near-real-time dashboards and alerting.', image: { src: 'img/tech4.jpg', alt: 'Secure cloud ingestion' }, subject: 'Secure Cloud Ingestion & Analytics' }
    ],
    metrics: [
      { value: '120+', label: 'Sites Monitored', image: { src: 'img/tech4.jpg', alt: 'Sites monitored illustration' } },
      { value: '35', label: 'Species Detected', image: { src: 'img/salim.jpg', alt: 'Species monitoring illustration' } }
    ],
    gallery: [
      { src: 'img/tech2.jpg', alt: 'Coastal site and gateway', caption: 'Coastal gateway and monitoring hardware' },
      { src: 'img/tech3.jpg', alt: 'Field deployment team', caption: 'Field deployment and commissioning' },
      { src: 'img/salim.jpg', alt: 'Species monitoring example', caption: 'Species monitoring in action' }
    ]
  };

  function renderHero(data) {
    const titleEl = document.getElementById('hero-title');
    const leadEl = document.getElementById('hero-lead');
    const featuresEl = document.getElementById('hero-features');
    const imageEl = document.getElementById('hero-image');

    if (titleEl) titleEl.textContent = data.title || 'Where Waves Whisper Wisdom';
    if (leadEl) leadEl.textContent = data.lead || '';
    if (featuresEl && data.features) {
      featuresEl.innerHTML = data.features.map((item) => `<li>${item}</li>`).join('');
    }
    if (imageEl && data.image) {
      imageEl.src = data.image.src;
      imageEl.alt = data.image.alt || '';
    }
  }

  function renderCards(containerId, items, cardClass, includeButton) {
    const container = document.getElementById(containerId);
    if (!container || !Array.isArray(items)) return;

    container.innerHTML = items.map((item) => {
      const img = item.image || {};
      const button = includeButton && item.link
        ? `<a class="btn btn-outline" href="${item.link}">Details</a>`
        : '';
      return `
        <article class="${cardClass}">
          <img src="${img.src || ''}" alt="${img.alt || ''}" loading="lazy" />
          <h3>${item.title || ''}</h3>
          <p>${item.description || ''}</p>
          ${button}
        </article>
      `;
    }).join('');
  }

  function renderTechnology(data) {
    const introEl = document.getElementById('technology-intro');
    const gridEl = document.getElementById('tech-grid');
    if (introEl) introEl.textContent = data.intro || '';
    if (gridEl && Array.isArray(data.items)) {
      gridEl.innerHTML = data.items.map((item) => {
        const img = item.image || {};
        return `
          <div class="tech-card">
            <img src="${img.src || ''}" alt="${img.alt || ''}" loading="lazy" />
            <h3>${item.title || ''}</h3>
            <p>${item.description || ''}</p>
          </div>
        `;
      }).join('');
    }
  }

  function renderCapabilities(items) {
    const container = document.getElementById('capabilities-grid');
    if (!container || !Array.isArray(items)) return;

    container.innerHTML = items.map((item) => {
      const img = item.image || {};
      return `
        <div class="cap-card card">
          <img src="${img.src || ''}" alt="${img.alt || ''}" loading="lazy" />
          <h3>${item.title || ''}</h3>
          <p>${item.description || ''}</p>
          <div class="cap-actions">
            <button class="btn btn-primary cap-request" data-subject="${item.subject || item.title || ''}">Request Brief</button>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderImpact(data) {
    const metricsEl = document.getElementById('metrics');
    const galleryEl = document.getElementById('impact-gallery');

    if (metricsEl && Array.isArray(data.metrics)) {
      metricsEl.innerHTML = data.metrics.map((metric) => {
        const img = metric.image || {};
        return `
          <div class="metric">
            <div class="metric-media">
              <img src="${img.src || ''}" alt="${img.alt || ''}" loading="lazy" />
            </div>
            <div class="metric-number">${metric.value || ''}</div>
            <div class="metric-label">${metric.label || ''}</div>
          </div>
        `;
      }).join('');
    }

    if (galleryEl && Array.isArray(data.gallery)) {
      galleryEl.innerHTML = data.gallery.map((item) => `
        <figure class="impact-photo">
          <img src="${item.src || ''}" alt="${item.alt || ''}" loading="lazy" />
          <figcaption>${item.caption || ''}</figcaption>
        </figure>
      `).join('');
    }
  }

  async function loadSiteData() {
    try {
      const response = await fetch('/api/site-data');
      if (!response.ok) throw new Error('Unable to load content');
      const data = await response.json();
      renderHero(data.hero || fallbackSiteData.hero);
      renderCards('services-grid', data.services || fallbackSiteData.services, 'card', true);
      renderTechnology(data.technology || fallbackSiteData.technology);
      renderCapabilities(data.capabilities || fallbackSiteData.capabilities);
      renderImpact({ metrics: data.metrics || fallbackSiteData.metrics, gallery: data.gallery || fallbackSiteData.gallery });
    } catch (error) {
      console.error('Failed to load dynamic content:', error);
      renderHero(fallbackSiteData.hero);
      renderCards('services-grid', fallbackSiteData.services, 'card', true);
      renderTechnology(fallbackSiteData.technology);
      renderCapabilities(fallbackSiteData.capabilities);
      renderImpact(fallbackSiteData);
    }
  }

  // Mobile nav toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const primaryLinks = document.getElementById('primary-links');
  if (mobileToggle && primaryLinks) {
    mobileToggle.addEventListener('click', () => {
      const open = primaryLinks.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // HTML-encode helper
  function encodeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[m];
    });
  }

  // Contact form
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (!statusEl) return;

      // Honeypot check
      const hp = form.querySelector('.hp-hidden') || form.querySelector('[name="website"]');
      if (hp && hp.value.trim() !== '') {
        statusEl.className = 'form-status error';
        statusEl.textContent = 'Submission blocked.';
        return;
      }

      // Gather & validate
      const name = (form.elements['name'] || {}).value || '';
      const email = (form.elements['email'] || {}).value || '';
      const pobox = (form.elements['pobox'] || {}).value || '';
      const message = (form.elements['message'] || {}).value || '';
      const consent = !!(form.elements['consent'] && form.elements['consent'].checked);

      if (!name || !email || !message || !consent) {
        statusEl.className = 'form-status error';
        statusEl.textContent = 'Please complete all required fields and accept the policy.';
        return;
      }

      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email)) {
        statusEl.className = 'form-status error';
        statusEl.textContent = 'Please enter a valid email address.';
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn && (submitBtn.disabled = true);
      statusEl.className = 'form-status';
      statusEl.textContent = 'Sending…';

      try {
        const res = await fetch(form.action || '/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), pobox: pobox.trim(), message: message.trim() }),
          credentials: 'same-origin'
        });

        if (!res.ok) {
          const text = await res.text().catch(() => res.statusText);
          throw new Error(text || 'Server error');
        }

        const json = await res.json().catch(() => ({ ok: true }));
        statusEl.className = 'form-status success';
        statusEl.textContent = json.message ? encodeHtml(json.message) : 'Message sent — thank you.';
        form.reset();
      } catch (err) {
        statusEl.className = 'form-status error';
        statusEl.textContent = 'Failed to send message. Please try again later.';
        console.error('Contact submit error:', err);
      } finally {
        submitBtn && (submitBtn.disabled = false);
      }
    });
  }

  // Load dynamic content once the page is ready
  window.addEventListener('DOMContentLoaded', loadSiteData);

  // Debug: report missing images and set current year
  window.addEventListener('load', function () {
    const imgs = Array.from(document.images || []);
    const missing = imgs.filter(i => !i.complete || i.naturalWidth === 0);
    if (missing.length) console.warn('Missing/broken images:', missing.map(i => i.currentSrc || i.src));
    const y = new Date().getFullYear();
    const el = document.getElementById('current-year');
    if (el) el.textContent = y;
  });

  // Lightbox: clickable images open a fullscreen preview (delegated)
  (function () {
    const overlay = document.getElementById('lightbox-overlay');
    if (!overlay) return;
    const overlayImg = overlay.querySelector('.lightbox-content img');
    const captionEl = overlay.querySelector('.lightbox-caption');
    const closeBtn = overlay.querySelector('.lightbox-close');

    function open(src, alt, caption) {
      overlayImg.src = src;
      overlayImg.alt = alt || '';
      captionEl.textContent = caption || '';
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      overlayImg.src = '';
      captionEl.textContent = '';
      document.body.style.overflow = '';
    }

    closeBtn && closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    document.addEventListener('click', (e) => {
      const img = e.target.closest('.image-card img, .impact-photo img');
      if (!img) return;
      e.preventDefault();
      const card = img.closest('.image-card') || img.closest('figure');
      let caption = img.alt || '';
      if (card) {
        const meta = card.querySelector('.meta strong');
        const span = card.querySelector('.meta span');
        const fig = card.querySelector('figcaption');
        if (meta) caption = meta.textContent + (span ? (' — ' + span.textContent.trim()) : '');
        if (fig) caption = fig.textContent.trim();
      }
      open(img.src, img.alt, caption);
    });
  })();

  // Capability CTA: prefill contact form and scroll into view
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.cap-request');
    if (!btn) return;
    e.preventDefault();
    const subject = btn.dataset.subject || '';
    const form = document.getElementById('contact-form');
    if (!form) {
      // fallback: navigate to contact anchor
      location.hash = '#contact';
      return;
    }
    // prefill message
    const msgEl = form.elements['message'];
    if (msgEl) {
      msgEl.value = `Please send a technical brief about: ${subject}.`;
    }
    // smooth scroll to form and focus name
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const nameEl = form.elements['name'];
    if (nameEl) nameEl.focus();
  });

})();
