/* Minimal client JS: mobile nav + contact form handler with honeypot, validation, fetch POST */

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
    return String(s).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
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
          body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
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

  // Debug: report missing images
  window.addEventListener('load', function () {
    const imgs = Array.from(document.images || []);
    const missing = imgs.filter(i => !i.complete || i.naturalWidth === 0);
    if (missing.length) console.warn('Missing/broken images:', missing.map(i => i.currentSrc || i.src));
    // set current year
    const y = new Date().getFullYear();
    const el = document.getElementById('current-year');
    if (el) el.textContent = y;
  });
})();