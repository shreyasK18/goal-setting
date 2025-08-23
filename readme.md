# Goal Setter

A modern MERN stack application for goal management and tracking. Set, track, and achieve your goals with a beautiful, intuitive interface.

## Features

- Create and manage personal goals
- Track progress with visual statistics
- Categorize goals by type (Health, Career, Finance, etc.)
- Priority levels and status tracking
- User authentication and authorization
- Responsive design with modern UI
- Beautiful glass-morphism design

## Tech Stack

- **Frontend:** React, Redux Toolkit, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Styling:** CSS3 with modern effects

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation

### Setup

1. Clone the repository
2. Rename `.env.example` to `.env` and add your MONGO_URI
3. Install dependencies for both frontend and backend:

```bash
npm run install-deps
```

### Running the Application

```bash
# Run both backend & frontend
npm run dev

# Run backend only
npm run server

# Run frontend only  
npm run client

# Stop all processes
npm run stop

# Restart application
npm run restart
```

## Project Structure

```
goal-setter/
├── backend/           # Express server
├── frontend/          # React application  
├── package.json       # Root orchestration
└── .env              # Environment variables
```

## Available Scripts

- `npm run dev` - Start both backend and frontend
- `npm run stop` - Kill all running processes
- `npm run restart` - Stop and restart the application
- `npm run install-deps` - Install all dependencies

## Access

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:2000

https://mernappbrad.herokuapp.com/
