# Authentication, Authorization & Tenant Isolation

## Authentication (JWT)

All endpoints except the registration/login endpoints under `/api/auth` require
a **Bearer JWT** in the `Authorization` header:

```
Authorization: Bearer <token>
```

A token is obtained from `POST /api/auth/login` (returns `data.token`).

### Token contents

Signed with `JWT_SECRET`, payload:

```json
{
  "userId": "<ObjectId>",
  "companyId": "<ObjectId>",
  "role": "admin | manager | sales"
}
```

Expiry: `7d` (7 days). See `auth.service.js` (`loginUser`).

### Middleware behavior (`src/middleware/auth.middleware.js`)

`authMiddleware` runs on every protected route and:

1. Reads the `Authorization` header; requires it to start with `Bearer `.
   Otherwise → `401 "No token provided"`.
2. Verifies the JWT. On failure → `401 "Invalid token"`.
3. Refetches the **User document from the database** using `decoded.userId`
   (it does **not** trust the stale token payload). If the user no longer
   exists → `401 "User not found"`.
4. Checks `user.isActive`. If inactive → `401 "User account is inactive"`.
5. Attaches `req.user` (the fresh User document, `-password`) to the request.

Because the user is re-fetched on every request, deactivated accounts are
denied immediately even with a valid, unexpired token.

## Registration flows

There are three registration endpoints:

### 1. Legacy — `POST /api/auth/register`
- Requires `company` as a **MongoDB ObjectId** (raw company reference).
- Role is forced server-side to `sales`.
- Returns `201` with the created user (password stripped).
- **This flow is unused by the current recommended flows and accepts
  client-supplied company ids** — see [`README.md`](README.md) caveats.

### 2. Company admin — `POST /api/auth/register/admin`
- Creates a **brand-new Company** and its **admin** user in one logical operation.
- Client supplies `companyName` (not an id). The company identity and admin
  role are derived server-side; `company.createdBy` is linked to the new admin.
- Not tied to an invitation.
- Compensates on failure (deletes partial documents) since no transactions are used.

### 3. Employee — `POST /api/auth/register/employee`
- Registers an employee into an **existing company** by **normalized company
  name** plus a **pending invitation** for that (company, email).
- The invitation is the authorization to join. It is atomically claimed
  (`findOneAndUpdate` on `status: "pending"`), preventing double-registration.
- Role forced to `sales`. If user creation fails, the claim is rolled back to
  `pending`.
- Failure message is deliberately generic
  (`"Invalid company name or unapproved email"`) so it never reveals whether a
  company or invited email exists.

### Login — `POST /api/auth/login`
- Normalizes email, finds user, compares bcrypt hash, checks `isActive`.
- Returns `{ user, token }`.

### Current user — `GET /api/auth/me`
- Returns `req.user` (fresh from DB, password stripped).

## Authorization & Roles

`roleMiddleware(...roles)` (in `src/middleware/role.middleware.js`) runs after
`authMiddleware` and:

- If `req.user` is missing → `401 "Unauthorized"`.
- If `req.user.role` is not in the allowed list → `403 "You do not have
  permission to access this resource"`.

Role enum (from `User.role`): `admin`, `manager`, `sales` (default `sales`).

### Access matrix (from route definitions)

| Area | Routes | Allowed roles |
| --- | --- | --- |
| Company — read (`GET /api/companies/me`) | 1 | admin, manager, sales |
| Company — create/update (`POST`/`PATCH /api/companies/*`) | 2 | **admin** only |
| Company invitations (all) | create, list, delete | **admin** only |
| Company employees (list, remove) | all | **admin** only |
| Customers | all | any authenticated user |
| Customer contacts | all | any authenticated user |
| Leads | all | any authenticated user |
| Pipelines / stages | all | any authenticated user |
| Deals | all | any authenticated user |
| Tasks | all | any authenticated user (row-level rules apply) |
| Meetings | all | any authenticated user (row-level rules apply) |
| Notes | all | any authenticated user (row-level rules apply) |
| Attachments | all | any authenticated user (row-level rules apply) |
| Notifications | all | any authenticated user |
| Activities | all | any authenticated user |
| Dashboard | all | any authenticated user |
| Reports | all | any authenticated user |
| Search | all | any authenticated user |

### Row-level (record-level) restrictions

Beyond role gating, several services restrict *sales* users from operating on
records they do not own:

| Resource | Rule for `sales` role |
| --- | --- |
| Notes | can only **modify or delete** their **own** notes (`createdBy === user`) → else `403` |
| Attachments | can only **delete** files **they uploaded** (`uploadedBy === user`) → else `403` |
| Tasks | can **update/complete/cancel** only tasks **assigned to them**; can **delete** only tasks **they created** → else `403` |
| Meetings | can **update/cancel** only meetings **they organize** → else `403` |

`admin` and `manager` roles are not subject to these record-level restrictions.

### Immutable ownership (server-enforced)

Some fields cannot be reassigned, even by admins/owners, to protect audit
integrity:

- **Customers**: `company` can never change; `owner` can never change
  (create-time owner = authenticated user).
- **Leads**: `company` and `owner` can never change (owner = creator).
- **Deals**: `company` and `customer` can never change (owner = creator).
- **Pipeline stages**: `pipeline` and `company` never change.
- **Tasks**: `company`, `createdBy`, and `completedAt` cannot be set by the client.
- **Meetings**: `company` and `organizer` never change.

## Tenant isolation

Every service receives `user` (the authenticated user) and filters/creates
records using `user.company`. Key rules observed in the code:

- **Company is always derived from `req.user.company`** — never from the
  request body. When a service does validate a client-supplied `company`, it
  only *allows* the value to match the authenticated user's own company (e.g.
  customer create/update).
- **Cross-tenant reads return 404** (not 403): when a service looks up a
  record by id with `{ company: user.company }` and finds nothing, it raises a
  plain "not found". This avoids leaking whether another tenant's record
  exists.
- **Lookup filters** always include `company: user.company` (and usually
  `isDeleted: false`).
- **Company uniqueness**: two *active* companies cannot share a normalized
  name (partial unique index on `nameNormalized` excluding soft-deleted
  documents). Soft-deleted companies do not reserve their names.

Exceptions / observations (see [`README.md`](README.md)):
- Legacy `POST /api/auth/register` accepts a raw company ObjectId.
- CORS and Socket.IO origins are wide open (`*`).
