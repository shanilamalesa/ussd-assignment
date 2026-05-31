# USSD Assignment

A USSD application built with Node.js and Express that integrates with 
Africa's Talking to provide a menu-driven CRM interface.

## Features
- USSD menu with options to view leads, add a new lead, and exit
- Response clamping to stay within the 182 character USSD budget
- File logging of every USSD request to logs/ussd.log
- Redis session management for multi-step flows
- Back option to reverse one state
- Session timeout after 180 seconds
- Automated tests for the USSD handler

## Tech Stack
- Node.js
- Express
- Africa's Talking USSD API
- Redis (Upstash)
- ngrok (for local development)

## Setup
1. Clone the repo
2. Run `npm install` inside `packages/backend`
3. Create a `.env` file with your credentials:
4. 4. Run `nodemon index.js` to start the server
5. Run `ngrok http 3001` to expose it to Africa's Talking
6. Update the callback URL in Africa's Talking dashboard to your ngrok URL

## Setting up Redis (Upstash)
1. Go to upstash.com and sign up
2. Click Create Database and name it ussd-sessions
3. Copy the REDIS_URL from the dashboard
4. Paste it into your .env file
5. Test the connection by running:
   `node -e "require('dotenv').config(); require('./src/db/redis').ping().then(console.log)"`
6. You should see PONG printed in the terminal

## What I Learned
- **State machine** — the sessions the user interacts with in the menu. 
  Each state represents a step in the flow: WELCOME, AWAITING_NAME, 
  AWAITING_PHONE, and CONFIRM.
- **Redis** — used for temporary storage. When the user fills all the 
  necessary options and confirms, the data is saved and then automatically 
  deleted from Redis.
- **TTL (Time To Live)** — how long a Redis key stays alive before it 
  is automatically deleted. Set to 180 seconds to match AT session timeout.
- **Event loop** — how Node.js handles multiple tasks without getting stuck. 
  It can send a request and while waiting for the response, handle other tasks.
- **text.split("*").pop()** — when the user fills in options in the menu, 
  they are concatenated with * like 1*Shaa*0767290335. We split and take 
  the last segment to get only the latest input.
