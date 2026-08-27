# Error Handling & Response Conventions

## Response envelope

All endpoints return JSON of the shape:

```json
{
  "success": true,
  "message": "…",
  "data": { … }
}
```

- `success` — boolean.
- `message` — human-readable summary (also used as the error message on
  failures).
- `data` — the payload for the operation; `null` on deletes or where there is
  no body.

## HTTP status semantics

Status codes originate from two places:

1. **Middleware** returns explicit statuses:
   - `401` from `authMiddleware` (`No token provided`, `Invalid token`,
     `User not found`, `User account is inactive`).
   - `401` from `roleMiddleware` when `req.user` is missing (`Unauthorized`).
   - `403` from `roleMiddleware` when the role is not allowed
     (`You do not have permission to access this resource`).
   - `400` from `handleUploadErrors` for upload failures (e.g. file too
     large, unsupported type, extension/MIME mismatch).
2. **Services/controllers** attach a `status` to thrown `Error` objects:
   - `400` — validation/business error (most controllers fall back to `400`
     when no status is set).
   - `404` — resource not found (in this tenant).
   - `409` — conflict (duplicate email/phone/name, already-converted,
     already-inactive, etc.).
   - `403` — record-level permission denial for the `sales` role.
   - `500` — unhandled unexpected errors.

Controllers generally respond with `res.status(error.status || 400)`.

## Validation errors

Where `express-validator` is used (auth, company, companyInvitation,
companyEmployee, customer, dashboard, search, report), a failed validation
returns `400` with:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "A valid email is required" }
  ]
}
```

Endpoints without a validation middleware (`lead`, `deal`, `pipeline`,
`pipelineStage`, `customerContact`, `task`, `meeting`, `note`, `attachment`,
`activity`, `notification`) enforce their rules inside the service layer and
return the standard `{ success, message }` `400` responses instead.

## Global error handler

`src/app.js` registers a final Express error middleware:

```js
app.use((err, req, res, next) => {
  console.error(`✗ ${err.stack || err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});
```

Any error that reaches it (e.g. thrown by an `async` handler or a non-Express
dependency) is logged to the console and returned as JSON — `500` if no
`status` is attached to the error.

## Useful error messages (observed)

| Scenario | Status | Message |
| --- | --- | --- |
| Missing/invalid token | 401 | `No token provided` / `Invalid token` |
| User deleted | 401 | `User not found` |
| Inactive account | 401 | `User account is inactive` |
| Role not allowed | 403 | `You do not have permission to access this resource` |
| Not found (this tenant) | 404 | `<Resource> not found` |
| Duplicate email/phone (customer/lead/contact) | 409 | `A <entity> with this email already exists in this company` |
| Duplicate company name | 409 | `A company with this name already exists` |
| Invitation already pending / email taken | 409 | `An invitation for this email is already pending` / `A user with this email already exists` |
| Lead already converted | 409 | `Lead is already converted` |
| Task due date in past | 400 | `Due date cannot be in the past` |
| Meeting date in past | 400 | `Meeting date must be in the future` |
| Participant permission (sales) | 403 | `You can only update tasks assigned to you`, etc. |
