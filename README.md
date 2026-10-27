# Librairie Hurlevent

Website for Hurlevent, an independent bookshop at 238 rue de Belleville, Paris 20e.

Customers can see the shop's events and picks, browse books by category, and reserve a book online to collect and pay for in the shop (click & collect, no online payment).

## Stack

- **Frontend:** Next.js (pages router), React, TypeScript, CSS Modules
- **Backend:** Express, TypeScript, MongoDB (Mongoose)
- **External API:** Google Books (book search, proxied by the backend so the API key stays private)

## Structure

```
hurlevent/
├── frontend/          Next.js site
│   ├── pages/         routes (/ and /livres)
│   ├── components/    React components
│   ├── styles/        one CSS module per component
│   ├── data/          static content (events, picks, catalogue)
│   ├── types/         TypeScript types
│   └── utils/         helpers (opening status, API URL)
└── backend/           Express API
    ├── routes/        /books, /reservations
    ├── models/        Mongoose connection and schemas
    └── types/         TypeScript types
```

## Getting started

Node version is set in `.nvmrc` (run `nvm use`).

**Backend**

```bash
cd backend
npm install
cp .env.example .env   # then fill in the values
npm run dev            # http://localhost:4000
```

**Frontend**

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000
```

## API

| Method | Route                  | Description                              |
| ------ | ---------------------- | ---------------------------------------- |
| GET    | `/books/search?q=...`  | Search French-language books by text     |
| POST   | `/reservations`        | Create a reservation (status `pending`)  |
