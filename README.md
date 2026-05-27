# USSD Assignment

A USSD application built with Node.js and Express that integrates with 
Africa's Talking to provide a menu-driven CRM interface.

## Features
- USSD menu with options to view leads, add a new lead, and exit
- Response clamping to stay within the 182 character USSD budget
- File logging of every USSD request to logs/ussd.log
- Redis session management for multi-step flows

## Tech Stack
- Node.js
- Express
- Africa's Talking USSD API
- ngrok (for local development)

## Setup
1. Clone the repo
2. Run `npm install` inside `packages/backend`
3. Create a `.env` file with your AT credentials
4. Run `nodemon index.js` to start the server
5. Run `ngrok http 3001` to expose it to Africa's Talking
