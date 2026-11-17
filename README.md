# Librairie Hurlevent

![CI](https://github.com/saudimatthieu-dotcom/Hurlevent_library/actions/workflows/ci.yml/badge.svg)

Website for Hurlevent, an independent bookshop at 238 rue de Belleville, Paris 20e.

Customers can see the shop's events and picks, browse books by category, and reserve a book online to collect and pay for in the shop (click & collect, no online payment). The booksellers manage everything from a private admin area.

## Features

**For customers**

- Home page: live "open / closed" status, upcoming events, the booksellers' picks, opening hours
- Book catalogue by category, plus a search across French-language books
- Online reservation (name, phone, optional email), paid on collection
- An AI assistant (API) that helps find a book: it searches the shop's own catalogue, picks and events, and never invents a title

**For the booksellers** (`/admin`, sign-in required)

- Reservations: mark as ready, collected or cancelled; call or email the customer in one tap
- Events: add, edit, delete
- Picks ("coups de cœur"): add a book from the search, write a note, remove
- Catalogue: add a book from the search into a category, remove

## Stack

- **Frontend:** Next.js (pages router), React, TypeScript, CSS Modules
- **Backend:** Express, TypeScript, PostgreSQL with Prisma, bcrypt + uid2 tokens, express-rate-limit
- **Tests:** Jest (with `@swc/jest`), the AI model client mocked
- **External API:** Google Books (book search, proxied by the backend so the API key stays private), Open Library (covers), Groq (language model for the assistant)

## Structure

```
hurlevent/
├── frontend/          Next.js site
│   ├── pages/         /, /livres, /admin, 404
│   ├── components/    React components (site and admin)
│   ├── styles/        one CSS module per component
│   ├── data/          opening hours
│   ├── types/         TypeScript types
│   └── utils/         helpers (opening status, API calls)
└── backend/           Express API
    ├── routes/        books, reservations, admins, events, picks, catalog, assistant
    ├── prisma/        schema and migrations
    ├── models/        Prisma client
    ├── modules/       validation, admin check, AI assistant (agent loop, tools) and its tests
    ├── scripts/       createAdmin, seed, askAssistant (try the assistant), copyFromMongo (one-off migration)
    └── types/         TypeScript types
```

## Getting started

Node version is set in `.nvmrc` (run `nvm use`).

**Backend**

```bash
cd backend
npm install
cp .env.example .env                              # then fill in the values (DATABASE_URL = your PostgreSQL)
npx prisma migrate deploy                         # create the tables
npx tsx scripts/createAdmin.ts EMAIL PASSWORD     # a bookseller account (10+ characters)
npx tsx scripts/seed.ts                           # optional: demo events, picks and catalogue
npm run dev                                       # http://localhost:4000
```

**Frontend**

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev                                       # http://localhost:3000
```

**Backend and database with Docker**

```bash
cp backend/.env.example backend/.env             # then fill in the values (DATABASE_URL is set by compose)
docker compose up --build                         # or: podman-compose up --build
```

PostgreSQL 17 starts first, the migrations are applied, then the API answers on http://localhost:4000. The database is also published on port 5433 of your machine, and its data stays in the `pgdata` volume.

## API

Routes marked 🔒 need an admin token (in the URL for `GET`, in the JSON body otherwise).

| Method | Route                          | Description |
| ------ | ------------------------------ | ----------- |
| GET    | `/books/search?q=...`          | Search French-language books |
| POST   | `/reservations`                | Create a reservation (status `pending`) |
| GET    | `/reservations/:token` 🔒      | List reservations, newest first |
| PUT    | `/reservations/:id/status` 🔒  | Set status: `pending`, `ready`, `collected`, `cancelled` |
| POST   | `/admins/signin`               | Bookseller sign-in, returns the token |
| GET    | `/events`                      | List events |
| POST   | `/events` 🔒                   | Add an event |
| PUT    | `/events/:id` 🔒               | Edit an event |
| DELETE | `/events/:id` 🔒               | Delete an event |
| GET    | `/picks`                       | List picks |
| POST   | `/picks` 🔒                    | Add a pick |
| PUT    | `/picks/:id` 🔒                | Edit a pick's note |
| DELETE | `/picks/:id` 🔒                | Remove a pick |
| GET    | `/catalog`                     | List the catalogue |
| POST   | `/catalog` 🔒                  | Add a book to the catalogue |
| DELETE | `/catalog/:id` 🔒              | Remove a book from the catalogue |
| POST   | `/assistant`                   | Ask the assistant a question (`{ "message": "..." }`, 1 to 500 characters) |

Sign-in and reservations are limited to 10 requests per 15 minutes per IP, search to 60 per minute, the assistant to 15 questions per 15 minutes.

## AI assistant

The assistant answers customers' questions about books, picks and events. It uses tool calling with the Groq API (`groq-sdk`), and the agent loop is written by hand, with no framework.

How it works:

1. The customer's message goes to the model with three read-only tools: `search_catalog`, `list_picks` and `list_upcoming_events`.
2. When the model asks for a tool, the backend validates the arguments with zod, runs the Prisma query, and sends the result back.
3. This repeats until the model gives its answer, with a maximum of 5 iterations. If the limit is hit, or the answer is cut off, a polite fallback message is returned.
4. The system prompt tells the model to recommend only books returned by the tools, and to say so when nothing matches.

Setup: put `GROQ_API_KEY` in `backend/.env` (never commit it). `GROQ_MODEL` is optional and defaults to `openai/gpt-oss-120b`.

Try it from the terminal:

```bash
npx tsx scripts/askAssistant.ts "Je cherche un polar"
```

Tests (Jest, with the model client mocked, so no API key or database is needed):

```bash
npm test
```

## Deployment

**Backend** (e.g. Render): root directory `backend`, build command `npm install --include=dev && npm run build`, start command `npx prisma migrate deploy && npm start`. Environment: `DATABASE_URL` (a hosted PostgreSQL), `GOOGLE_BOOKS_API_KEY`, `GROQ_API_KEY` (the assistant), `FRONTEND_URL` (the site's address, so only it can call the API).

**Frontend** (e.g. Vercel): root directory `frontend`. Environment: `NEXT_PUBLIC_API_URL` (the backend's address).
