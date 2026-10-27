# Librairie Hurlevent

Website for Hurlevent, an independent bookshop at 238 rue de Belleville, Paris 20e.

Customers can see the shop's events and picks, browse books by category, and reserve a book online to collect and pay for in the shop (click & collect, no online payment). The booksellers manage everything from a private admin area.

## Features

**For customers**

- Home page: live "open / closed" status, upcoming events, the booksellers' picks, opening hours
- Book catalogue by category, plus a search across French-language books
- Online reservation (name, phone, optional email), paid on collection

**For the booksellers** (`/admin`, sign-in required)

- Reservations: mark as ready, collected or cancelled; call or email the customer in one tap
- Events: add, edit, delete
- Picks ("coups de cœur"): add a book from the search, write a note, remove
- Catalogue: add a book from the search into a category, remove

## Stack

- **Frontend:** Next.js (pages router), React, TypeScript, CSS Modules
- **Backend:** Express, TypeScript, MongoDB (Mongoose), bcrypt + uid2 tokens, express-rate-limit
- **External API:** Google Books (book search, proxied by the backend so the API key stays private), Open Library (covers)

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
    ├── routes/        books, reservations, admins, events, picks, catalog
    ├── models/        Mongoose connection and schemas
    ├── modules/       validation and admin check
    ├── scripts/       createAdmin, seed
    └── types/         TypeScript types
```

## Getting started

Node version is set in `.nvmrc` (run `nvm use`).

**Backend**

```bash
cd backend
npm install
cp .env.example .env                              # then fill in the values
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

Sign-in and reservations are limited to 10 requests per 15 minutes per IP, search to 60 per minute.

## Deployment

**Backend** (e.g. Render): root directory `backend`, build command `npm install --include=dev && npm run build`, start command `npm start`. Environment: `CONNECTION_STRING`, `GOOGLE_BOOKS_API_KEY`, `FRONTEND_URL` (the site's address, so only it can call the API). In MongoDB Atlas, allow the host's IP addresses.

**Frontend** (e.g. Vercel): root directory `frontend`. Environment: `NEXT_PUBLIC_API_URL` (the backend's address).
