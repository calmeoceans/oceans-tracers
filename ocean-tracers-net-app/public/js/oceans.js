// This file contains JavaScript code for client-side functionality, including form handling and interactivity.

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  contactForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    formStatus.textContent = '';

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.ok) {
        formStatus.textContent = 'Message sent successfully!';
        contactForm.reset();
      } else {
        formStatus.textContent = `Error: ${result.error}`;
      }
    } catch (error) {
      formStatus.textContent = 'An error occurred. Please try again later.';
    }
  });
});