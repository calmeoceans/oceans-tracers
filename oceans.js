/* Minimal client JS: mobile nav, contact form, and lightbox */

(function () {
  'use strict';

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
