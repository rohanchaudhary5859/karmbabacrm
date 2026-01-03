# KARM BABA CRM

A comprehensive, production-ready CRM system for managing clients, interactions, tasks, and more.

## Features

- **User Authentication & Authorization**: JWT-based auth with role-based access control
- **Client Management**: Full CRUD operations for client data
- **Task Management**: Create, assign, and track tasks with due dates
- **Interaction Tracking**: Log all client interactions
- **AI Lead Scoring**: Machine learning-powered lead prioritization
- **Email Integration**: Send templated emails
- **Document Management**: Upload and manage client documents
- **Reporting**: Generate insights and analytics
- **WhatsApp Integration**: Send messages via Twilio
- **Social Media Integration**: LinkedIn and Facebook OAuth
- **Multi-tenant Support**: Role-based access for teams

## Security Features

- Helmet.js for security headers
- Rate limiting (100 requests/15min per IP)
- Input validation with Joi
- CORS protection
- JWT authentication
- Password hashing with bcrypt
- SQL injection protection via Prisma ORM

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: Node.js 18, Express.js, Prisma ORM
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **AI Services**: Python 3.10, FastAPI, scikit-learn
- **Deployment**: Docker, Docker Compose
- **Testing**: Jest, Supertest

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (recommended)
- Git

### Local Development

1. Clone the repository
2. Copy environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
3. Start with Docker Compose:
   ```bash
   docker-compose up --build
   ```
4. Access the application:
   - Frontend: http://localhost:4173
   - Backend API: http://localhost:5000
   - AI Services: http://localhost:8001

### Manual Setup

See individual service READMEs for manual installation.

## Environment Variables

### Backend (.env)

```env
PORT=5000
JWT_SECRET=your_secure_jwt_secret
DATABASE_URL="file:./dev.db"
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_FROM=+1234567890
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Karm Baba CRM
```

## API Documentation

### Authentication

All API endpoints except `/api/health` and `/api/auth/*` require authentication.

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Key Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create client
- `GET /api/tasks` - Get tasks
- `POST /api/ai/lead-score` - Score lead with AI

## Testing

```bash
cd backend
npm test
```

## Deployment

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up --build
```

### Environment Setup

1. Set `NODE_ENV=production`
2. Use PostgreSQL for database
3. Configure proper JWT secret
4. Set up email service
5. Configure Twilio for WhatsApp

## Contributing

1. Fork the repository
2. Create a feature branch
3. Run tests before committing
4. Submit a pull request

## License

MIT License

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