# Ocean Tracers Net Server

## Overview
The Ocean Tracers Net server application is built using Node.js and Express. It provides a backend for handling contact form submissions, sending emails, and managing rate limits for incoming requests.

## Project Structure
```
server
├── src
│   ├── index.js                # Entry point of the server application
│   ├── routes
│   │   └── contact.js          # Routes for contact functionality
│   ├── controllers
│   │   └── contactController.js # Logic for handling contact form submissions
│   ├── services
│   │   └── mailer.js           # Service for sending emails
│   ├── middleware
│   │   └── rateLimiter.js       # Middleware for rate limiting requests
│   └── data
│       └── contacts.log         # Log file for contact form submissions
├── .env.example                 # Template for environment variables
├── package.json                 # NPM configuration file
└── README.md                    # Documentation for the server application
```

## Setup Instructions
1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd ocean-tracers-net-app
   ```

2. **Install dependencies:**
   ```
   cd server
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values for SMTP configuration and other sensitive information.

4. **Run the server:**
   ```
   node src/index.js
   ```
   The server will start on the specified port (default is 3000).

## Usage
- The server exposes an API endpoint at `/api/contact` for handling contact form submissions.
- Rate limiting is enforced to prevent abuse of the contact form.

## Logging
Contact form submissions and their statuses are logged in `src/data/contacts.log` in JSON format.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.