# API Reference

Base path: `/api`. Unless noted, every endpoint requires a Bearer JWT
(`Authorization: Bearer <token>`). All responses use the envelope
`{ success, message, data }` (see [`ERROR_HANDLING.md`](ERROR_HANDLING.md)).

Common query parameters (used by list endpoints):

| Param | Meaning |
| --- | --- |
| `page` | Page number, default `1`, min `1` |
| `limit` | Results per page, default `10`, max `100` |
| `search` | Case-insensitive term matched against defined fields |
| `sortBy` | Sortable field (per service whitelist), default `createdAt` |
| `sortOrder` | `asc` or `desc`, default `desc` |

---

## 1. Authentication — `/api/auth`

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/register` | none | Legacy register. Body: `firstName, lastName, email, password, company` (company is an **ObjectId**), `phone?, avatar?`. Role forced to `sales`. |
| POST | `/register/admin` | none | Create a new **Company + admin user**. Body: `firstName, lastName, email, password, companyName`. |
| POST | `/register/employee` | none | Register an employee into an existing company. Body: `firstName, lastName, email, password, companyName`. Requires a pending invitation for (companyName, email). |
| POST | `/login` | none | Body: `email, password`. Returns `{ user, token }`. |
| GET | `/me` | yes | Returns the currently authenticated user (fresh from DB, no password). |

Validation (from `auth.validator.js`): `firstName`/`lastName` 2–50 chars,
`password` ≥ 8 chars with uppercase, lowercase, number, and special char,
email must be a valid email.

---

## 2. Companies — `/api/companies`

| Method | Path | Role | Description |
| --- | --- | --- | --- |
| GET | `/me` | admin, manager, sales | Returns the authenticated user's company. Scoped to `req.user.company`. |
| PATCH | `/me` | admin | Update the company (name, logo, industry, website, phone, email, country, city, address, subscriptionPlan, status, timezone, currency). |
| POST | `/` | admin | Create a company. Body: `name` (required, 2–100 chars), plus optional fields. |

---

## 3. Company Invitations — `/api/company-invitations`

All **admin only**. The target company is always `req.user.company`.

| Method | Path | Description |
| --- | --- | --- |
| POST | `/` | Create an invitation. Body: `email`. 409 if a pending/accepted invitation exists, or if a user with that email already exists anywhere. |
| GET | `/` | List invitations. Query: `status?`, `page`, `limit`, `sortBy`, `sortOrder`. |
| DELETE | `/:id` | Remove (soft delete) a **pending** invitation only (`status → removed`). |

---

## 4. Company Employees — `/api/company-employees`

All **admin only**. Operates on `req.user.company`.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | List company employees (excludes the calling admin themself). Query: `status=active|inactive`, sort, paging. Safe projection (no password/auth internals). |
| PATCH | `/:id/remove` | Deactivate an employee (`isActive=false`, soft removal). Only `manager`/`sales` targets; cannot remove self or an admin. |

---

## 5. Customers — `/api/customers`

Any authenticated user. All scoped to `req.user.company`.

| Method | Path | Description |
| --- | --- | --- |
| POST | `/` | Create. Body: `companyName` (required), `industry?, website?, email?, phone?, country?, city?, address?, status?, source?, annualRevenue?, employeesCount?`. `owner`/`company` forced server-side. 409 on duplicate email/phone in company. |
| GET | `/` | List. Query: `search` (companyName/email/phone), `status`, `source`, paging. Sorted by `createdAt desc`. |
| GET | `/:id` | Get one (404 if not in company or deleted). |
| PUT | `/:id` | Update. `company` cannot change; `owner` cannot change. |
| DELETE | `/:id` | Soft delete (`isDeleted=true`). |

---

## 6. Customer Contacts — `/api/customer-contacts`

Any authenticated user.

| Method | Path | Description |
| --- | --- | --- |
| POST | `/` | Create. Body: `customer` (required), `firstName, lastName` (required), `jobTitle?, email?, phone?, isPrimary?`. 409 on duplicate email/phone within the customer. |
| GET | `/` | List. Query: `customer?`, `isPrimary?`, `search`, paging. |
| GET | `/customer/:customerId` | List contacts for a customer. |
| GET | `/:id` | Get one. |
| PUT | `/:id` | Update. `customer`/`company` cannot change. |
| DELETE | `/:id` | Soft delete. |

---

## 7. Leads — `/api/leads`

Any authenticated user.

| Method | Path | Description |
| --- | --- | --- |
| POST | `/` | Create. Body: `firstName, lastName` (required), `companyName?, email?, phone?, status?, source?, score?, estimatedValue?, notes?`. `owner`/`company` forced to creator/tenant. 409 on duplicate email/phone in company. |
| GET | `/` | List. Query: `search`, `status`, `source`, `owner`, and score range (`score`, `minScore`, `maxScore`), `sortBy`/`sortOrder`, paging. |
| GET | `/:id` | Get one. |
| PUT | `/:id` | Update. `company`/`owner` cannot change. |
| DELETE | `/:id` | Soft delete. |
| PATCH | `/:id/convert` | Convert lead to a Customer (creates it, sets `status=converted`, `convertedCustomer`, `convertedAt`). 409 if already converted. |

---

## 8. Pipelines — `/api/pipelines`

Any authenticated user.

| Method | Path | Description |
| --- | --- | --- |
| POST | `/` | Create. Body: `name` (required, unique in company), `description?, color?, isDefault?`. |
| GET | `/` | List. Query: `search` (name/description), `isDefault`, paging. |
| GET | `/:id` | Get one. |
| PUT | `/:id` | Update. `company` cannot change; name must remain unique in company. |
| DELETE | `/:id` | Soft delete (also soft-deletes its stages). |

---

## 9. Pipeline Stages — `/api/pipeline-stages`

Any authenticated user.

| Method | Path | Description |
| --- | --- | --- |
| POST | `/` | Create. Body: `pipeline` (required), `name` (required), `order?`, `color?, probability?, isWonStage?, isLostStage?, isActive?, description?`. Uniqueness: one won + one lost stage per pipeline; won→prob 100, lost→prob 0. |
| GET | `/` | List. Query: `pipeline?`, paging. |
| GET | `/pipeline/:pipelineId` | List stages of a pipeline (sorted by `order`). |
| GET | `/:id` | Get one. |
| PUT | `/:id` | Update. `pipeline`/`company` cannot change; re-indexes ordering. |
| DELETE | `/:id` | Soft delete (re-indexes remaining stage orders). |

---

## 10. Deals — `/api/deals`

Any authenticated user.

| Method | Path | Description |
| --- | --- | --- |
| POST | `/` | Create. Body: `customer` (required), `pipeline` (required), `stage` (required, must belong to pipeline), `title` (required), `value?, probability?, expectedCloseDate?, description?`. Probability derived from stage; `owner` = creator. |
| GET | `/` | List. Query: `search` (title, or customer id), `stage`, `pipeline`, `owner`, `status`, paging. |
| GET | `/:id` | Get one. |
| PUT | `/:id` | Update. `company`/`customer` cannot change. Changing `pipeline`/`stage` re-derives probability. |
| DELETE | `/:id` | Soft delete. |
| PATCH | `/:id/stage` | Move to a stage within the same pipeline (`{ stageId }`). Logs `move_stage` activity. |
| PATCH | `/:id/won` | Mark won (`status=won`, close date, prob 100, move to won stage). Logs activity. |
| PATCH | `/:id/lost` | Mark lost (`{ lostReason? }`; status=lost, close date, prob 0, move to lost stage). Logs activity. |

---

## 11. Tasks — `/api/tasks`

Roles: admin, manager, sales (any). Record-level rules apply (see
[`AUTHENTICATION.md`](AUTHENTICATION.md)).

| Method | Path | Description |
| --- | --- | --- |
| POST | `/` | Create. Body: `title` (required), `dueDate` (required, must be future), `description?, priority?, reminderDate?, assignedTo` (required), `customer?, deal?, lead?`. Status forced to `pending`. Sends a realtime assignment notification if assigned to someone else. |
| GET | `/` | List. Query: `search`, `status`, `priority`, `assignedTo`, `createdBy`, `customer`, `deal`, and date range (`dueDate`, `dueFrom`, `dueTo`), paging. |
| GET | `/:id` | Get one. |
| PUT | `/:id` | Update. `company`/`createdBy`/`completedAt` cannot change. Setting `status=completed` stamps `completedAt`. Reassignment sends a notification. |
| DELETE | `/:id` | Soft delete (sales: only own created). |
| PATCH | `/:id/complete` | Mark completed (stamps `completedAt`). |
| PATCH | `/:id/cancel` | Mark cancelled. |

---

## 12. Meetings — `/api/meetings`

Roles: admin, manager, sales (any). Record-level rules apply.

| Method | Path | Description |
| --- | --- | --- |
| POST | `/` | Create. Body: `title` (required), `customer` (required), `meetingDate` (required, future), `description?, deal?, lead?, duration? (default 60), meetingType? (default in_person), location?, meetingLink?, notes?`. Status forced to `scheduled`; `organizer` = creator. |
| GET | `/` | List. Query: `search`, `status`, `meetingType`, `organizer`, `customer`, `deal`, date range (`meetingDate`, `meetingFrom`, `meetingTo`), paging. |
| GET | `/:id` | Get one. |
| PUT | `/:id` | Update. `company`/`organizer` cannot change. |
| DELETE | `/:id` | Soft delete. |
| PATCH | `/:id/complete` | Mark completed. |
| PATCH | `/:id/cancel` | Mark cancelled (sales: only own organized). |

---

## 13. Notes — `/api/notes`

Roles: admin, manager, sales (any). Record-level rules apply.

| Method | Path | Description |
| --- | --- | --- |
| POST | `/` | Create. Body: `content` (required), `isPinned?`, plus **exactly one** of `customer|lead|deal|task|meeting`. |
| GET | `/` | List. Query: `search` (content), `customer`, `lead`, `deal`, `task`, `meeting`, `createdBy`, `isPinned`, paging. |
| GET | `/customer/:customerId` | Notes for a customer. |
| GET | `/lead/:leadId` | Notes for a lead. |
| GET | `/deal/:dealId` | Notes for a deal. |
| GET | `/task/:taskId` | Notes for a task. |
| GET | `/meeting/:meetingId` | Notes for a meeting. |
| GET | `/:id` | Get one. |
| PUT | `/:id` | Update. Only `content` and `isPinned` are editable; entity links are immutable. |
| DELETE | `/:id` | Soft delete. |

---

## 14. Attachments — `/api/attachments`

Roles: admin, manager, sales (any). Upload uses `multipart/form-data` with a
file field named `file`.

| Method | Path | Description |
| --- | --- | --- |
| POST | `/` | Upload (multipart). Body form fields: exactly one of `customer|lead|deal|task|meeting|note`. Max file size **20 MB**. `storageProvider=local`, `fileUrl=/uploads/<folder>/<file>`. |
| GET | `/` | List attachments (optional filters: any entity id, `uploadedBy`, `search`). |
| GET | `/customer/:customerId` | Attachments for a customer. |
| GET | `/lead/:leadId` | Attachments for a lead. |
| GET | `/deal/:dealId` | Attachments for a deal. |
| GET | `/task/:taskId` | Attachments for a task. |
| GET | `/meeting/:meetingId` | Attachments for a meeting. |
| GET | `/note/:noteId` | Attachments for a note. |
| GET | `/:id` | Get one. |
| GET | `/:id/download` | Download the file (`res.download`, original filename). |
| DELETE | `/:id` | Soft delete + delete file from disk (`isDeleted=true`). |

### File rules (`src/utils/file.util.js`)

Allowed extensions + required matching MIME type: `.jpg/.jpeg` (`image/jpeg`),
`.png`, `.webp`, `.svg`, `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.ppt`,
`.pptx`, `.txt`, `.csv`, `.zip`. Stored on disk with a random 16-byte hex
filename preserving the original extension; originals kept in
`originalFileName`.

Folder mapping: `customer→customers`, `lead→leads`, `deal→deals`,
`task→tasks`, `meeting→meetings`, `note→notes`.

---

## 15. Notifications — `/api/notifications`

Roles: admin, manager, sales (any). All scoped to the authenticated user's
own notifications (`user: req.user._id`) plus company.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | List the user's notifications. Query: `search` (title/message), `type`, `isRead`, `entityType`, `entityId`, paging. |
| GET | `/unread-count` | Count of unread notifications. |
| GET | `/:id` | Get one. |
| PATCH | `/:id/read` | Mark one as read. |
| PATCH | `/read-all` | Mark all as read (returns number modified). |
| DELETE | `/:id` | Permanently delete the notification. |

> Note: `GET /unread-count` is declared **before** `GET /:id`, and
> `PATCH /read-all` (single path segment) does not conflict with
> `PATCH /:id/read` (two segments), so routing is unambiguous.

---

## 16. Activities — `/api/activities` (read-only audit log)

Roles: admin, manager, sales (any). Scoped to company.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | List. Query: `search` (description), `entityType`, `entityId`, `action`, `user`, `isSystem`, paging. |
| GET | `/entity/:entityType/:entityId` | Activities for a specific entity. |
| GET | `/:id` | Get one. |

---

## 17. Dashboard — `/api/dashboard`

Roles: admin, manager, sales (any).

| Method | Path | Description |
| --- | --- | --- |
| GET | `/overview` | Counts: customers, leads, deals, open pipeline value, won/lost deals, active/overdue tasks, upcoming meetings. |
| GET | `/pipeline` | Open deals grouped by stage (`?pipeline=<id>` to filter) → `{ stage, order, count, value }[]`. |
| GET | `/sales` | Won/lost stats (`?from`, `?to`; defaults to current month) → `monthlyRevenue, wonDeals, lostDeals, conversionRate, period`. |
| GET | `/tasks` | `?assignedTo` filter → `completed, pending, overdue, dueToday`. |
| GET | `/meetings` | `?organizer` filter → scheduled meetings `today, week, month`. |
| GET | `/recent-activities` | Last 10 activities. |

---

## 18. Reports — `/api/reports`

Roles: admin, manager, sales (any). All accept `startDate`, `endDate`,
`status`, `owner`, and (for deals) `pipelineStage`.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/customers` | `total, active, inactive, createdThisMonth, topSources (top 5), growth (per month)`. |
| GET | `/leads` | `total, qualified, contacted, converted, lost, conversionPercentage`. |
| GET | `/deals` | `total, won, lost, open, totalPipelineValue, wonRevenue, averageDealSize`. |
| GET | `/tasks` | `total, completed, pending, overdue, completionPercentage`. |
| GET | `/meetings` | `today, week, month, completed, cancelled`. |
| GET | `/export/customers` | CSV download (`customers.csv`). |
| GET | `/export/leads` | CSV download (`leads.csv`). |
| GET | `/export/deals` | CSV download (`deals.csv`). |
| GET | `/export/tasks` | CSV download (`tasks.csv`). |
| GET | `/export/meetings` | CSV download (`meetings.csv`). |

---

## 19. Search — `/api/search`

Roles: admin, manager, sales (any).

| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | Global search. Query: `q` (required). Returns grouped results: `{ customers, leads, deals, tasks, meetings, notes }`, up to 10 each, scoped to the company. |

---

## 20. Docs & health (not under auth)

| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | Health check: `{ success: true, message: "CRM Backend API is running" }`. |
| GET | `/api/docs` | Swagger UI (OpenAPI 3.0). |
| GET | `/api/docs.json` | Raw OpenAPI JSON spec. |
