# Ocean Tracers Net

Static website for Ocean Tracers Net with a small Node.js backend for contact submissions.

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open `http://localhost:3000` in your browser.

## API

-- `POST /api/contact` accepts JSON body with `name`, `email`, `pobox` (optional), and `message`.
- Submissions are saved to `server/contacts.json`.

## Notes

- This project does not include a production email or authenticated admin API.
- `admin.html` remains a placeholder page for future secured admin functionality.
