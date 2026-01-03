# KARM BABA CRM

A comprehensive, production-ready CRM system for managing clients, interactions, tasks, and more.

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (recommended)
- Git

### Using Docker (Recommended)

1. Clone the repository
2. Run the application:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:4173
   - Backend API: http://localhost:5000

### Manual Setup

#### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Default Admin User
After running the database initialization script, you can log in with:
- Email: `admin@example.com`
- Password: `admin123`

## Technologies Used
- **Frontend**: React, Tailwind CSS, React Router
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: JWT