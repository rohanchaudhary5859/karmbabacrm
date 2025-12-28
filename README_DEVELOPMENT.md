# Karmbaba CRM — Development README

Quick guide to run the project locally or with Docker.

Prerequisites (local):
- Node.js 18+ and npm
- Git
- (Optional) Docker + Docker Compose to avoid local installs

Run locally (Windows PowerShell):

# Backend
cd c:\Users\rohan\Desktop\karmbabacrm\backend
copy .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run db:init
npm run dev

# Frontend (new terminal)
cd c:\Users\rohan\Desktop\karmbabacrm\frontend
copy .env.example .env
npm install
npm run dev

Default seeded admin user (from init script):
- Email: admin@example.com
- Password: admin123

Run with Docker Compose (no Node/npm required locally):

# from repo root
docker compose up --build

This will build backend and frontend images and start services on ports:
- Backend: http://localhost:5000
- Frontend: http://localhost:4173

If you need LinkedIn/Facebook integration:
- Create apps in respective developer portals
- Add redirect URIs to point to `http://localhost:5000/api/social/callback` (or your deployed URL)
- Add credentials to `backend/.env` as `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`

Notes:
- Prisma migrations require `npx`/`node` available. If using Docker Compose, migrations are attempted during image build/entry command.
- If you encounter permission or path issues on Windows, run PowerShell as Administrator or adjust paths accordingly.

Next recommended steps:
- Provide OAuth credentials to finish LinkedIn/Facebook flows.
- Run `docker compose up --build` to verify services in an environment without Node installed locally.
