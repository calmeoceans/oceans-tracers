class ContactController {
  async handleContactFormSubmission(req, res) {
    try {
      const { name, email, message, consent } = req.body;

      // Validate input
      if (!name || !email || !message || !consent) {
        return res.status(400).json({ ok: false, error: 'All fields are required.' });
      }

      // Further validation can be added here (e.g., email format)

      // Log the contact entry (this could be a service call)
      const contactEntry = {
        name,
        email,
        message,
        consent,
        timestamp: new Date().toISOString(),
      };

      // Here you would typically call a service to handle the email sending
      // For example: await Mailer.sendContactEmail(contactEntry);

      // Respond to the client
      return res.status(200).json({ ok: true, message: 'Contact form submitted successfully.' });
    } catch (error) {
      console.error('Error handling contact form submission:', error);
      return res.status(500).json({ ok: false, error: 'Internal server error.' });
    }
  }
}

module.exports = new ContactController();