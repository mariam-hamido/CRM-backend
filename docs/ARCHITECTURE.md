# Architecture

## Overview

This is a production-oriented, **multi-tenant** CRM backend. Every piece of
data (customers, leads, deals, tasks, meetings, notes, attachments, etc.)
belongs to exactly one tenant **company**, and every authenticated request is
scoped to the tenant of the authenticated user.

The application is a single Node.js process exposing:

- a **REST API** under `/api` (Express),
- **realtime notifications** over WebSocket (Socket.IO),
- an **interactive OpenAPI doc** at `/api/docs`.

```
Client (frontend)
   │  HTTPS
   ▼
Express (REST /api) ──────► MongoDB (Mongoose models)
   │
   └──► Socket.IO (realtime, user rooms, notification:new)
```

## Tech stack

Confirmed from `package.json`:

| Concern | Library | Version |
| --- | --- | --- |
| Runtime | Node.js | CommonJS (no ES modules) |
| Web framework | express | 5.2.1 |
| ODM / database | mongoose | 9.9.0 (MongoDB) |
| Auth (JWT) | jsonwebtoken | 9 |
| Password hashing | bcrypt | 6 |
| Validation | express-validator | 7 |
| Realtime | socket.io | 4.8.3 |
| Security headers | helmet | — |
| CORS | cors | — |
| HTTP logging | morgan | — |
| File upload | multer | 2 |
| Email | nodemailer | 9 (declared in deps) |
| Config | dotenv | — |
| API docs | swagger-jsdoc, swagger-ui-express | — |
| Dev runner | nodemon | — |

`package.json` scripts:

- `start` — run the server in production mode.
- `dev` — run with `nodemon` for development.
- `seed:dev` — run the idempotent development seed (`scripts/seed-dev.js`).

## Project structure

```
CRM-backend/
├── server.js                  # Bootstrap: env -> DB -> HTTP + Socket.IO
├── src/
│   ├── app.js                 # Express app: middleware, routes, docs, error handler
│   ├── config/
│   │   ├── env.js             # Env validation & loading (PORT, MONGODB_URI, JWT_SECRET)
│   │   └── db.js              # connectDB / disconnectDB
│   ├── routes/                # Route definitions (19 files + auth)
│   ├── controllers/           # Request/response wiring (thin)
│   ├── services/              # Business logic (main logic lives here)
│   ├── models/                # Mongoose schemas (15 models)
│   ├── validators/            # express-validator rules
│   ├── middleware/
│   │   ├── auth.middleware.js # JWT verification -> req.user
│   │   ├── role.middleware.js # Role-based access control
│   │   └── upload.middleware.js # Multer config + upload error handler
│   ├── realtime/
│   │   └── socket.server.js   # Socket.IO init, auth, user rooms
│   ├── utils/
│   │   ├── query.helpers.js   # paginate / buildSearchFilter / buildSort
│   │   ├── email.util.js      # normalizeEmail
│   │   ├── companyName.util.js# normalizeCompanyName
│   │   └── file.util.js       # upload dirs, allowed types, secure file names
│   └── docs/
│       ├── index.js           # Swagger UI setup
│       ├── swagger.config.js  # OpenAPI spec definition
│       └── paths/*.js         # Per-resource path definitions
├── scripts/
│   └── seed-dev.js            # Idempotent dev seed
├── uploads/                   # Multer temp + per-entity folders (runtime)
├── tests/                     # (directory present; no test files)
├── .env                       # Local secrets (gitignored)
└── package.json
```

## Runtime boot sequence (`server.js`)

1. `require("dotenv").config()` — loads `.env`.
2. `validateEnvironment()` — requires `PORT`, `MONGODB_URI`, `JWT_SECRET`;
   fails fast if any is missing or `PORT` is not a number.
3. `connectDB(mongodbUri)` — connects Mongoose to MongoDB.
4. `require("./src/app")` — builds the Express app.
5. `http.createServer(app)` — creates the HTTP server.
6. `initSocketServer(server)` — attaches Socket.IO with JWT auth and user rooms.
7. `server.listen(port)` — starts listening.
8. On `SIGINT` / `SIGTERM` — graceful shutdown: close idle connections,
   close the Socket.IO server, then disconnect MongoDB.

## Express middleware chain (`src/app.js`)

Order matters and is as follows:

1. `express.json()` and `express.urlencoded({ extended: true })`
2. `cors()` — **open to all origins**
3. `helmet()`
4. `morgan("dev")`
5. `cookieParser()`
6. Route mounting under `/api` (see [`API_REFERENCE.md`](API_REFERENCE.md))
7. `/api/docs` Swagger UI
8. `/` health check `{ success: true, message: "CRM Backend API is running" }`
9. Global error handler (see [`ERROR_HANDLING.md`](ERROR_HANDLING.md))

## Environment configuration

Required variables (validated in `src/config/env.js`):

| Variable | Type | Required | Notes |
| --- | --- | --- | --- |
| `PORT` | number | yes | Must parse as a number |
| `MONGODB_URI` | string | yes | MongoDB connection string |
| `JWT_SECRET` | string | yes | Secret used to sign/verify JWTs |

Seed script overrides (optional):

| Variable | Default | Purpose |
| --- | --- | --- |
| `SEED_DEV_COMPANY_NAME` | `Mariam CRM` | Company to reuse/create |
| `SEED_ADMIN_EMAIL` | `admin@example.com` | Admin user to ensure |
| `SEED_ADMIN_PASSWORD` | `Admin1234!` | Password on create only |

Use real values only in local/non-committed `.env` files — never commit secrets.

## Development seed script (`scripts/seed-dev.js`)

Runs via `npm run seed:dev`. Purpose is to ensure a valid
`Company → User.company → authenticated user` chain so
`GET /api/companies/me` returns the authenticated user's company. It is
**idempotent** and safe to run repeatedly:

1. Reuses an existing non-deleted Company by name, falls back to any
   non-deleted Company, or creates one if none exists.
2. Repairs every User whose `company` reference is missing or dangling,
   repointing it at the dev Company.
3. Creates the documented admin user (`admin@example.com`, role `admin`) only
   when it does not already exist.

It never deletes data and only uses env overrides for company name, admin
email, and admin password.
