# KARM BABA CRM

A simplified CRM system for managing clients, interactions, tasks, and more.

## Quick Start

### Using Docker (Recommended)

1. Run the application:
   ```bash
   docker-compose up --build
   ```

2. Access the application:
   - Frontend: http://localhost:4173
   - Backend API: http://localhost:5000

### Manual Setup

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Technologies Used
- **Frontend**: React, Tailwind CSS, React Router
- **Backend**: Node.js, Express
- **Database**: SQLite (development)
- **Authentication**: JWT