# Rakesh Sahu — Portfolio

Full-stack portfolio built with React (Vite), Express, and PostgreSQL.

## Local Development

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Set DATABASE_URL, FRONTEND_URL, ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET
npm run seed
npm run dev
```

The backend reads startup data from `backend/src/data/portfolio.json`.
Both `npm run seed` and normal backend startup sync that JSON into the database.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL if your backend is not on http://localhost:4000
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/about` | About/profile data, skills, and education |
| PUT | `/api/about` | Update about/profile data |
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create a project |
| PUT | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |
| GET | `/api/experience` | List experience |
| POST | `/api/experience` | Create experience |
| PUT | `/api/experience/:id` | Update experience |
| DELETE | `/api/experience/:id` | Delete experience |

## Notes

- Project records support multiple images through the `images` field.
- Skills and education are seeded into the database and served through the backend instead of being hardcoded in the frontend.
- The schema initializer is non-destructive, so app startup no longer wipes existing data.

