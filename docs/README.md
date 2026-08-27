# CRM Backend — Documentation

Central entry point for the developer documentation of the multi-tenant CRM
backend.

This documentation is derived **directly from the source code** in this
repository. It is a description of what the code actually does — it does not
introduce new features, change behavior, or modify any source files.

> **Note on scope**: this covers the **backend only**. Frontend documentation
> (if desired) is out of scope for this set of documents.

---

## Document index

| Document | Contents |
| --- | --- |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Overview, tech stack, project structure, environment configuration, runtime boot sequence |
| [`AUTHENTICATION.md`](AUTHENTICATION.md) | Auth flows, JWT, roles & authorization, tenant isolation |
| [`DATA_MODEL.md`](DATA_MODEL.md) | All 15 Mongoose models, fields, enums, indexes, relationships |
| [`API_REFERENCE.md`](API_REFERENCE.md) | Every route, HTTP method, required roles, and query/filter parameters |
| [`REALTIME.md`](REALTIME.md) | Socket.IO setup, JWT authentication, user rooms, notification delivery |
| [`ERROR_HANDLING.md`](ERROR_HANDLING.md) | Response envelope, HTTP status semantics, validation, global error handler |
| [`SWAGGER.md`](SWAGGER.md) | Interactive OpenAPI / Swagger UI location and usage |

---

## Quick reference

- **Stack**: Node.js, Express 5, MongoDB (Mongoose 9), JWT, Socket.IO.
- **Entry point**: `server.js` — validates environment, connects to MongoDB,
  starts the HTTP server, initializes Socket.IO.
- **REST base path**: `/api`
- **Swagger UI**: `/api/docs` (raw spec at `/api/docs.json`).
- **Auth**: Bearer JWT (7-day expiry). All routes except `POST /api/auth/*`
  require a token.
- **Tenant isolation**: every request is scoped to `req.user.company`; the
  company is always derived from the authenticated user, never from the client.

## Running locally

See the repository root [`README.md`](../README.md) for quick-start
environment and dev-seed instructions. Required environment variables are
`PORT`, `MONGODB_URI`, and `JWT_SECRET` (validated in [`env.js`](../src/config/env.js)).

## Known caveats (from source inspection)

These are observed behaviors of the current code, not recommendations:

- **CORS is wide open**: `app.use(cors())` in `src/app.js` allows all origins,
  and Socket.IO is configured with `origin: "*"`.
- **Express validators** exist for `auth`, `company`, `companyInvitation`,
  `companyEmployee`, `customer`, `dashboard`, `search`, and `report`. The
  `lead`, `deal`, `pipeline`, `pipelineStage`, `customerContact`, `task`,
  `meeting`, `note`, `attachment`, `activity`, and `notification` routes do not
  run a request-body validation middleware; their services perform manual
  validation.
- **Legacy register** (`POST /api/auth/register`) accepts a raw company
  `ObjectId` in the body. It is unused by the recommended flows
  (`/register/admin` and `/register/employee`), both of which derive the
  company from its **normalized name**.
- **No transactions**: multi-document operations (e.g. admin registration,
  employee registration) compensate manually on failure rather than using
  MongoDB transactions.
