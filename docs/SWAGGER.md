# Swagger / OpenAPI Documentation

The backend ships a self-hosted, interactive OpenAPI (3.0.0) specification
built with `swagger-jsdoc` and served with `swagger-ui-express`.

## Locations

| Path | What it is |
| --- | --- |
| `/api/docs` | Interactive Swagger UI |
| `/api/docs.json` | The raw OpenAPI JSON specification |

## Source files

- `src/docs/swagger.config.js` — the `openapi` definition: info, servers,
  tags, security scheme, reusable parameters, response templates, and request
  body/resource schemas. The `apis` option points at `./src/docs/paths/*.js`.
- `src/docs/paths/*.js` — one file per resource tag (auth, company,
  companyInvitation, companyEmployee, customer, customerContact, lead,
  pipeline, pipelineStage, deal, task, meeting, note, attachment, activity,
  notification, dashboard, search, report).
- `src/docs/index.js` — wiring: serves `swaggerSpec` via `swagger-ui-express`
  with the explorer enabled, authorization persistence enabled, and the
  Swagger top bar hidden.

## Using it

1. Start the server (`npm start` / `npm run dev`).
2. Open `/api/docs` in a browser.
3. Every protected endpoint requires a Bearer token. Obtain one via
   `POST /api/auth/login` (returns `data.token`).
4. Click **Authorize**, paste the token; it is then sent on every request
   automatically (`persistAuthorization: true`).

## Authorization scheme

The spec registers a single HTTP bearer security scheme:

```json
{
  "bearerAuth": { "type": "http", "scheme": "bearer", "bearerFormat": "JWT" }
}
```

and applies it globally via `"security": [{ "bearerAuth": [] }]`.

## Note

The Swagger spec is the canonical machine-readable source for request/response
shapes. The handwritten docs in this folder (`API_REFERENCE.md`) were produced
by inspecting the route/controller/service source and are consistent with the
OpenAPI spec; for any discrepancy, the code is authoritative.
