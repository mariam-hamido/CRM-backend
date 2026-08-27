# Data Model

All persistence is via Mongoose. Every collection is multi-tenant and, with
the exception of `User`/`Company`/`CompanyInvitation`, embeds a required
`company` reference. Below are the models documented from their source in
`src/models/`.

**Conventions**:
- `timestamps: true` → all models expose `createdAt` / `updatedAt`.
- Most entities use **soft delete** via an `isDeleted: Boolean` flag (default
  `false`); a soft-deleted record is never actually removed. Services filter
  on `isDeleted: false`.
- `toJSON` transforms strip `__v` and, for `User`, `password`.

---

## 1. User (`users`)

| Field | Type | Notes |
| --- | --- | --- |
| `firstName` | String | required, trimmed |
| `lastName` | String | required, trimmed |
| `email` | String | required, **unique**, lowercase, trimmed |
| `password` | String | required, min 8 chars (stored **bcrypt-hashed**) |
| `phone` | String | optional |
| `avatar` | String | optional |
| `company` | ObjectId → Company | **required**, the tenant |
| `role` | String enum | `admin \| manager \| sales`, default `sales` |
| `isActive` | Boolean | default `true` |
| `lastLogin` | Date | default `null` |

Virtuals: `fullName` = `firstName lastName`. The `toJSON` transform always
removes `password`.

Indexes: unique on `email`.

---

## 2. Company (`companies`)

| Field | Type | Notes |
| --- | --- | --- |
| `name` | String | required, trimmed |
| `nameNormalized` | String | required, lowercase, trimmed — **internal**, server-derived |
| `logo` / `industry` / `website` / `phone` | String | optional |
| `email` | String | lowercase, trimmed |
| `country` / `city` / `address` | String | optional |
| `subscriptionPlan` | String enum | `free \| starter \| professional \| enterprise`, default `free` |
| `status` | String enum | `trial \| active \| suspended \| cancelled`, default `trial` |
| `timezone` | String | default `"UTC"` |
| `currency` | String | default `"USD"` |
| `createdBy` | ObjectId → User | the creating user |
| `isDeleted` | Boolean | default `false` |

Indexes:
- Legacy non-unique `{ name: 1, email: 1 }`.
- **Partial unique** `{ nameNormalized: 1 }` with `partialFilterExpression:
  { isDeleted: false }` — at most one active company per normalized name.

Behavior: `nameNormalized` is recomputed on every `validate` from `name` via
`normalizeCompanyName` (trim → collapse whitespace → lowercase). It is hidden
from JSON responses via the `toJSON` transform.

---

## 3. CompanyInvitation (`companyinvitations`)

| Field | Type | Notes |
| --- | --- | --- |
| `company` | ObjectId → Company | required |
| `email` | String | required, lowercase, trimmed (server-normalized) |
| `invitedBy` | ObjectId → User | required |
| `status` | String enum | `pending \| accepted \| removed`, default `pending` |
| `invitedAt` | Date | default `Date.now` |
| `acceptedAt` | Date | default `null` |
| `removedAt` | Date | default `null` |

Lifecycle: `pending → accepted` (on employee registration) or
`pending → removed` (admin). Removed invitations are kept for audit; a removed
email may be re-invited.

Indexes:
- **Partial unique** `{ company: 1, email: 1 }` with
  `partialFilterExpression: { status: "pending" }` — at most one pending
  invitation per company+email.
- `{ company: 1, status: 1 }` for list filtering.

Behavior: email is normalized on `validate`.

---

## 4. Customer (`customers`)

| Field | Type | Notes |
| --- | --- | --- |
| `company` | ObjectId → Company | required, tenant |
| `owner` | ObjectId → User | required — **immutable** at runtime |
| `companyName` | String | required, trimmed |
| `industry` / `website` / `phone` | String | optional |
| `email` | String | lowercase, trimmed |
| `country` / `city` / `address` | String | optional |
| `status` | String enum | `active \| inactive \| prospect`, default `prospect` |
| `source` | String enum | `website \| referral \| social_media \| cold_call \| email \| advertisement \| other`, default `other` |
| `annualRevenue` | Number | default `0` |
| `employeesCount` | Number | default `0` |
| `isDeleted` | Boolean | default `false` |

Service-level rule: email and phone must be unique within the company (case
insensitive for email). `owner` is set to the creator and cannot be changed.

---

## 5. CustomerContact (`customercontacts`)

| Field | Type | Notes |
| --- | --- | --- |
| `customer` | ObjectId → Customer | required |
| `company` | ObjectId → Company | required, tenant |
| `firstName` | String | required, max 50 |
| `lastName` | String | required, max 50 |
| `jobTitle` | String | max 100 |
| `email` | String | lowercase, trimmed |
| `phone` | String | trimmed |
| `isPrimary` | Boolean | default `false` |
| `isDeleted` | Boolean | default `false` |

Virtual: `fullName`. Service rule: email/phone unique per customer
(+ `isPrimary` is a singleton per customer — setting one clears the others).

---

## 6. Lead (`leads`)

| Field | Type | Notes |
| --- | --- | --- |
| `company` | ObjectId → Company | required, tenant |
| `owner` | ObjectId → User | required — **immutable** at runtime |
| `firstName` / `lastName` | String | required, max 50 |
| `companyName` | String | max 150 |
| `email` / `phone` | String | normalized/trimmed |
| `status` | String enum | `new \| contacted \| qualified \| proposal_sent \| negotiation \| converted \| lost`, default `new` |
| `source` | String enum | `website \| referral \| social_media \| cold_call \| email \| advertisement \| event \| other`, default `other` |
| `score` | Number | 0–100, default `0` |
| `estimatedValue` | Number | min 0, default `0` |
| `notes` | String | trimmed |
| `convertedCustomer` | ObjectId → Customer | default `null` |
| `convertedAt` | Date | default `null` |
| `isDeleted` | Boolean | default `false` |

Virtual: `fullName`. On conversion (`convertLead` in service) a `Customer` is
created from the lead data, `status → converted`, and `convertedCustomer` /
`convertedAt` are set. Service rules: email/phone unique within company;
`owner` immutable.

---

## 7. Pipeline (`pipelines`)

| Field | Type | Notes |
| --- | --- | --- |
| `company` | ObjectId → Company | required, tenant |
| `name` | String | required, max 100 |
| `description` | String | max 500 |
| `color` | String | default `"#3B82F6"` |
| `isDefault` | Boolean | default `false` |
| `isActive` | Boolean | default `true` |
| `isDeleted` | Boolean | default `false` |

Service rules: pipeline name unique within company; setting `isDefault`
clears all other default pipelines in the company; deleting a pipeline
soft-deletes all its stages.

---

## 8. PipelineStage (`pipelinestages`)

| Field | Type | Notes |
| --- | --- | --- |
| `company` | ObjectId → Company | required, tenant |
| `pipeline` | ObjectId → Pipeline | required |
| `name` | String | required, max 100 |
| `description` | String | max 500 |
| `order` | Number | required, min 1 |
| `color` | String | default `"#3B82F6"` |
| `probability` | Number | 0–100, default `0` |
| `isWonStage` | Boolean | default `false` |
| `isLostStage` | Boolean | default `false` |
| `isActive` | Boolean | default `true` |
| `isDeleted` | Boolean | default `false` |

Service rules (see `pipelineStage.service.js`):
- A stage cannot be both a won and lost stage.
- At most one won stage and one lost stage per pipeline.
- A won stage forces `probability = 100`; a lost stage forces `probability = 0`.
- Creating/updating a stage with an `order` shifts the `order` of the other
  stages in that pipeline (`$inc` re-indexing).

---

## 9. Deal (`deals`)

| Field | Type | Notes |
| --- | --- | --- |
| `company` | ObjectId → Company | required, tenant |
| `customer` | ObjectId → Customer | required — **immutable** at runtime |
| `owner` | ObjectId → User | required — owner = creator |
| `pipeline` | ObjectId → Pipeline | required |
| `stage` | ObjectId → PipelineStage | required |
| `title` | String | required, max 200 |
| `value` | Number | required, min 0, default `0` |
| `probability` | Number | 0–100, default `0` |
| `expectedCloseDate` | Date | optional |
| `actualCloseDate` | Date | default `null` |
| `status` | String enum | `open \| won \| lost`, default `open` |
| `lostReason` | String | max 500, default `null` |
| `description` | String | trimmed |
| `isDeleted` | Boolean | default `false` |

Behavior (from `deal.service.js`):
- On create, `probability` is taken from the selected stage.
- `owner` is always the creating user; `customer` cannot change.
- Moving to another pipeline auto-selects that pipeline's first stage; stage
  changes re-derive `probability` from the stage.
- `markWon`: sets `status=won`, `actualCloseDate=now`, `probability=100`,
  clears `lostReason`, and moves to the pipeline's won stage if present.
- `markLost`: sets `status=lost`, `actualCloseDate=now`, `probability=0`, and
  moves to the lost stage if present.
- `moveStage`, `markWon`, `markLost` log an `Activity` (entityType `deal`).

---

## 10. Task (`tasks`)

| Field | Type | Notes |
| --- | --- | --- |
| `company` | ObjectId → Company | required, tenant |
| `assignedTo` | ObjectId → User | required |
| `createdBy` | ObjectId → User | required — **immutable** at runtime |
| `customer` | ObjectId → Customer | default `null` |
| `deal` | ObjectId → Deal | default `null` |
| `title` | String | required, max 200 |
| `description` | String | max 2000 |
| `priority` | String enum | `low \| medium \| high \| urgent`, default `medium` |
| `status` | String enum | `pending \| in_progress \| completed \| cancelled \| overdue`, default `pending` |
| `dueDate` | Date | **required**; service enforces it cannot be in the past |
| `reminderDate` | Date | default `null` |
| `completedAt` | Date | default `null` — **immutable at runtime** |
| `isDeleted` | Boolean | default `false` |

Virtual: `isOverdue` = status not completed AND `dueDate < now`.

Behavior: on assignment to a different user, a realtime `Notification` of
type `task` is created (see [`REALTIME.md`](REALTIME.md)). Note: the schema has
no `lead` field, but the service accepts and validates an optional `lead`
reference.

---

## 11. Meeting (`meetings`)

| Field | Type | Notes |
| --- | --- | --- |
| `company` | ObjectId → Company | required, tenant |
| `customer` | ObjectId → Customer | required |
| `organizer` | ObjectId → User | required — **immutable** at runtime |
| `deal` | ObjectId → Deal | default `null` |
| `title` | String | required, max 200 |
| `description` | String | max 2000 |
| `meetingDate` | Date | **required**; service enforces it must be in the future |
| `duration` | Number | min 1, default `60` (minutes) |
| `meetingType` | String enum | `in_person \| phone \| video`, default `in_person` |
| `location` | String | trimmed |
| `meetingLink` | String | trimmed |
| `status` | String enum | `scheduled \| completed \| cancelled \| no_show`, default `scheduled` |
| `notes` | String | trimmed |
| `isDeleted` | Boolean | default `false` |

Virtual: `isUpcoming`. Service accepts an optional `lead` reference (not in
schema).

---

## 12. Note (`notes`)

| Field | Type | Notes |
| --- | --- | --- |
| `company` | ObjectId → Company | required, tenant |
| `createdBy` | ObjectId → User | required |
| `customer` / `lead` / `deal` / `task` / `meeting` | ObjectId (each) | default `null` |
| `content` | String | required, max 5000 |
| `isPinned` | Boolean | default `false` |
| `isDeleted` | Boolean | default `false` |

Validator: a note must be linked to **exactly one** entity
(customer/lead/deal/task/meeting). The service `resolveEntityReference`
enforces that at most one is provided. A `sales` user can only modify/delete
notes they created.

---

## 13. Attachment (`attachments`)

| Field | Type | Notes |
| --- | --- | --- |
| `company` | ObjectId → Company | required, tenant |
| `uploadedBy` | ObjectId → User | required |
| `customer` / `lead` / `deal` / `task` / `meeting` / `note` | ObjectId (each) | default `null` |
| `fileName` | String | required (server-generated secure name) |
| `originalFileName` | String | required |
| `fileUrl` | String | required (e.g. `/uploads/deals/<file>`) |
| `storageProvider` | String enum | `local \| cloudinary \| s3`, default `local` |
| `mimeType` | String | required |
| `fileSize` | Number | required, min 0 |
| `isDeleted` | Boolean | default `false` |

Validator: an attachment must be linked to **exactly one** entity
(customer/lead/deal/task/meeting/note). A `sales` user can only delete files
they uploaded. Upload details (allowed types, sizes, folders) are in
`src/utils/file.util.js` — see [`API_REFERENCE.md`](API_REFERENCE.md) for the
file rules.

---

## 14. Notification (`notifications`)

| Field | Type | Notes |
| --- | --- | --- |
| `company` | ObjectId → Company | required, tenant |
| `user` | ObjectId → User | required (the recipient) |
| `title` | String | required, max 150 |
| `message` | String | required, max 1000 |
| `type` | String enum | `system \| task \| meeting \| customer \| lead \| deal \| reminder \| success \| warning \| error`, default `system` |
| `entityType` | String enum | `customer \| lead \| deal \| task \| meeting \| note \| attachment \| user \| company`, default `null` |
| `entityId` | ObjectId | default `null` |
| `actionUrl` | String | default `null` |
| `isRead` | Boolean | default `false` |
| `readAt` | Date | default `null` |
| `expiresAt` | Date | default `null` |
| `createdAt` | Date | immutable (schema also has timestamps) |

Virtual: `isExpired`. Notifications are scoped to a single recipient `user`
(not company-wide) in query filters plus company for tenant isolation.

---

## 15. Activity (`activities`) — audit log

| Field | Type | Notes |
| --- | --- | --- |
| `company` | ObjectId → Company | required, tenant |
| `user` | ObjectId → User | required |
| `entityType` | String enum | `company \| user \| customer \| customer_contact \| lead \| pipeline \| pipeline_stage \| deal \| task \| meeting \| note \| attachment` |
| `entityId` | ObjectId | required |
| `action` | String enum | `create \| update \| delete \| restore \| assign \| unassign \| convert \| move_stage \| login \| logout \| upload \| download` |
| `description` | String | required, max 1000 |
| `oldValues` / `newValues` | Mixed | default `null` |
| `metadata` | Mixed | default `{}` |
| `ipAddress` / `userAgent` | String | default `null` |
| `isSystem` | Boolean | default `false` |
| `createdAt` | Date | immutable |

The `activity.service.js` exposes a `logActivity` producer, but in the
current code only the **deal** service actively writes activities
(`move_stage`, `markWon`, `markLost`). Other entities do not yet call
`logActivity`.

---

## Relationships summary

```
Company 1─∞ User
Company 1─∞ CompanyInvitation
Company 1─∞ Customer
Customer 1─∞ CustomerContact
Company 1─∞ Lead           (Lead ─1 convertedCustomer → Customer)
Company 1─∞ Pipeline
Pipeline 1─∞ PipelineStage
Customer 1─∞ Deal          (Deal → pipeline, stage, owner)
User 1─∞ Deal              (owner)
User 1─∞ Task              (assignedTo, createdBy)
User 1─∞ Meeting           (organizer)
Task → customer, deal (optional)
Meeting → customer (required), deal (optional)
Note       → exactly one of customer/lead/deal/task/meeting
Attachment → exactly one of customer/lead/deal/task/meeting/note
User 1─∞ Notification      (recipient)
User 1─∞ Activity          (actor)
```

All `company` references participate in multi-tenancy and are always derived
from `req.user.company` (see [`AUTHENTICATION.md`](AUTHENTICATION.md)).
