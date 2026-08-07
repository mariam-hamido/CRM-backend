# CRM Backend

Production-ready Node.js + Express CRM application.

## Local development

### Environment

Copy the required variables into a `.env` file:

```
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret>
```

### Seed development data

The seed script ensures a valid `Company -> User.company -> Authenticated user`
chain so `GET /api/companies/me` (used by the Company Settings page) returns the
authenticated user's company. It is idempotent: it reuses existing data when
possible, repoints any Users whose `company` reference is dangling (points to a
company that does not exist), and never deletes data.

```
npm run seed:dev
```

Documented local development credentials (used only when the admin user does not
exist yet; existing users keep their own passwords):

- Company name: `Mariam CRM`
- Admin email: `admin@example.com`
- Admin password: `Admin1234!`

The script can be customized via environment variables (`SEED_DEV_COMPANY_NAME`,
`SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`) — see the header of
`scripts/seed-dev.js` for details.
