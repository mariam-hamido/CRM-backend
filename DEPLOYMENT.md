# Backend Production Deployment — Render + MongoDB Atlas

This guide covers deploying the **CRM Backend** to **Render** (Node.js web
service) backed by **MongoDB Atlas**. It is written for the current root of the
repo (`D:\CRM\CRM-backend`).

> Live URLs below are **placeholders** — replace `YOUR-API-ON-RENDER` and
> `YOUR-FRONTEND-DOMAIN` with the real values from your own Render dashboard
> and frontend hosting.

---

## 0. Prerequisites

- A **MongoDB Atlas** cluster already created for the CRM data.
- A **Render** account.
- The backend code ready to push to a Git remote (GitHub/GitLab/Bitbucket)
  that Render can access.

---

## 1. MongoDB Atlas setup

1. In Atlas, open your cluster → **Database Access** and create/verify a
   database user (e.g. `crm_user`) with read/write privileges.
2. Open **Network Access** and add the IP allowlist.
   - Recommended for production: add the **Render service's egress IP** (see
     Render service logs / `whoami` endpoint to find it). If you cannot pin it,
     you can temporarily allow `0.0.0.0/0`, but this is not recommended.
3. Open your cluster → **Connect → Drivers** and copy the connection string.
   It looks like:
   ```
   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   ```
   The database name is typically `crm`.

---

## 2. Environment variables

Copy `.env.example` to `.env` **locally** and fill in real values. **Never
commit the real `.env` file** — it is gitignored.

| Variable        | Required | Description                                                                              | Example                                                       |
| --------------- | :------: | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `PORT`          |   Yes    | Port to listen on. Render injects this automatically (e.g. `10000`).                     | `10000`                                                       |
| `MONGODB_URI`   |   Yes    | MongoDB Atlas connection string.                                                         | `mongodb+srv://...`                                           |
| `JWT_SECRET`    |   Yes    | Long, random, high-entropy secret for signing JWTs. Generate with `openssl rand -hex 64`.| a 128-char random hex string                                  |
| `FRONTEND_URL`  |   No*    | Comma-separated browser origins allowed (HTTP + Socket.IO). **Required in production** if you do not want all origins allowed. | `https://app.example.com,http://localhost:5173` |

\* `FRONTEND_URL` is optional. When unset (or empty), **all origins are
allowed** as a development convenience. You **should set it in production** to
restrict cross-origin access to your frontend.

### Generating a strong JWT secret

```
openssl rand -hex 64
```

> :warning: The current `.env` uses `JWT_SECRET=your_super_secret_key` — a
> weak placeholder. **Generate and use a strong value in production.** Any
> change to `JWT_SECRET` invalidates all existing sessions (users must log in
> again).

---

## 3. Deploying the backend to Render

1. Push this backend to a Git remote that Render can access.
2. In Render, **New → Web Service** and connect the repository.
3. Configure the service:
   - **Name:** `crm-backend` (or your preferred name).
   - **Environment:** `Node`
   - **Root Directory:** `.` (the repo root where `server.js` lives)
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` (runs `node server.js`)
4. Under **Environment**, add these variables:
   - `NODE_ENV=production`
   - `PORT` — leave unset; Render sets it. (Or set it if Render requires you to
     pre-define it; if you set it, use the value Render expects.)
   - `MONGODB_URI` → your Atlas connection string.
   - `JWT_SECRET` → your strong random secret.
   - `FRONTEND_URL` → your frontend origin(s).
5. **Deploy.** Watch the build and runtime logs.

### Host binding

`server.js` calls `server.listen(env.port)` **without** a host argument. In
Node.js this binds to **all network interfaces** (`0.0.0.0` / `::`), so the
service is reachable externally — no host change is required and none was made.

---

## 4. Health checks

The server only starts **listening after** `connectDB()` succeeds, so if the
service is reachable, MongoDB connected at startup.

- `GET /health` → `{ "status": "ok" }` — use this as your Render **Health Check
  Path**.
- `GET /` → `{ "success": true, "message": "CRM Backend API is running" }`

**Render:** under your web service **Settings → Health Checks**, set:

- Health Check Path: `/health`
- (Optional) enable and configure the check frequency.

---

## 5. CORS & security notes

- **Express CORS** and **Socket.IO CORS** both read `FRONTEND_URL`.
  - Production: restricted to the configured origins.
  - Development (`FRONTEND_URL` unset): all origins allowed.
- Origins must be **exact** (`scheme://host[:port]`, **no trailing slash**).
  Comma separate multiple origins.
- The app uses `Authorization: Bearer <jwt>` headers (not cookies), so
  credentials-based CORS restrictions are not required, but restricting the
  origin is still good practice.
- `helmet()` sets secure HTTP headers (HSTS, CSP, etc.). On Render, the app is
  already served over HTTPS by the platform's edge.

---

## 6. Socket.IO considerations

- Socket.IO is mounted on the same HTTP server and port as the API, so the
  frontend connects to the **same Render URL** (no extra port/proxy config).
- The browser origin for Socket.IO must be listed in `FRONTEND_URL`, otherwise
  realtime connections will be rejected by CORS in production.
- The realtime layer requires the same `JWT_SECRET` (used to authenticate
  sockets) and `MONGODB_URI` (used to load users) as the REST API.

---

## 7. Swagger / API docs

- Interactive docs: `GET /api/docs` (Swagger UI)
- Raw OpenAPI JSON: `GET /api/docs.json`

These remain available in production (no auth). If you want to restrict them in
production, note it as a follow-up hardening item.

---

## 8. Uploads

File uploads are stored on **local disk** under `uploads/` (gitignored). Render's
filesystem is **ephemeral** — uploaded files are lost on each redeploy and are
not shared across instances.

> ⚠️ **Known limitation for production:** persistent object storage (e.g.
> AWS S3 / Cloudflare R2) is **not** wired up yet. If uploads must survive
> redeploys, this is a required follow-up. See the uploads docs for the current
> behavior.

---

## 9. Legacy `GET /api/auth/register`

`POST /api/auth/register` (the legacy endpoint that accepts a raw company
`ObjectId`) is **unused by the frontend** but is **left in place** so existing
integrators are not broken. It is documented here as a **deferred production
hardening item** — once confirmed unused, it can be removed in a future change
(would reduce attack surface). No change was made in this deployment pass.

---

## 10. Verification checklist

1. `GET /health` on your Render URL returns `{ "status": "ok" }`.
2. `POST /api/auth/login` returns a token.
3. `GET /api/docs` loads the Swagger UI.
4. Frontend requests (and realtime events) from your deployed frontend origin
   are not blocked by CORS.
5. Any request to an unhandled endpoint errors with a generic message (no stack
   trace / path / secret leaks).

---

## 11. Rollback & redeploy

- Render keeps previous deployments; use **Deploy → Clear cache & deploy** or
  revert to a prior commit to roll back.
- Environment variable changes require a redeploy (or immediate restart) to
  take effect.
