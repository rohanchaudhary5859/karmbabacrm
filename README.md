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

## Quick Run (local development)

1. Backend

```powershell
cd backend
npm install
# generate prisma client & run migrations (if using prisma)
npx prisma generate
npx prisma migrate dev --name init
# start backend
node server.js
```

2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

3. AI lead scorer (optional)

```powershell
cd ai_services\ai-lead-scorer
# create and activate a python venv, then install requirements
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

The AI service will run in fallback mode if `model.pkl` is not present — it will still return reasonable scores for demo/testing.

4. WhatsApp / Twilio

Set the following env vars in `backend/.env` (or system env):

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM` (WhatsApp-enabled Twilio number in E.164 format)

Use `/api/whatsapp/send` to send messages: POST body `{ to: "+91XXXXXXXXXX", message: "Hello" }`.

5. Useful endpoints

- Backend health: `/api/health`
- AI lead-score proxy: `/api/ai/lead-score` (POST)
- WhatsApp send: `/api/whatsapp/send` (POST)

If you'd like, I can prepare Docker compose entries and finish UI polish next.