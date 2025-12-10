# Christmas Friend Selector

Random Christmas Friend assignment system with Next.js frontend and Express backend.

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### Installation

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Copy environment files:
```bash
cp .env.example backend/.env
cp .env.example frontend/.env.local
```

4. Set up Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your domain to authorized origins
   - Update `GOOGLE_CLIENT_ID` in both `.env` files
   - Update `COLLEGE_DOMAIN` in backend/.env (e.g., `@yourcollege.edu`)

5. Create PostgreSQL database:
```bash
psql -c "CREATE DATABASE christmas_friend;"
```

6. Update PostgreSQL connection in backend/.env if needed

### Database Setup

Seed the database with sample students:
```bash
cd backend
npm run seed
```

## Development

Start both servers:

1. Backend (Terminal 1):
```bash
cd backend
npm run dev
```

2. Frontend (Terminal 2):
```bash
cd frontend
npm run dev
```

Visit http://localhost:3000

## Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## API Endpoints

- `POST /api/reveal` - Reveal Christmas friend for student
- `GET /api/status/:studentId` - Check if student has assignment

## Important Notes

- **Google Workspace OAuth Required**: Users must sign in with college email
- Each student can only reveal their friend once
- No student can be assigned to themselves
- Each friend can only be assigned to one person
- Uses PostgreSQL with Sequelize ORM
- Database tables created automatically on first run
- Email domain validation enforced (must match COLLEGE_DOMAIN)
- JWT tokens used for session management