# KARM BABA CRM

A comprehensive CRM system for managing clients, interactions, tasks, and more.

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. Initialize the database with default data:
   ```bash
   npm run db:init
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
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