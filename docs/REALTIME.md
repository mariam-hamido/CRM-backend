# Realtime (Socket.IO)

The backend exposes realtime capabilities via **Socket.IO** for delivering
notifications to connected users instantly.

## Server setup (`src/realtime/socket.server.js`)

Attached to the same HTTP server created in `server.js`. Configuration:

```js
new Server(httpServer, {
  cors: {
    origin: "*",            // wide open (see README caveats)
    methods: ["GET", "POST"],
  },
});
```

### Socket authentication (middleware)

On every connection, an async middleware authenticates the handshake before
accepting it:

1. Reads the token from either:
   - `socket.handshake.headers.authorization` (`Bearer <token>`), or
   - `socket.handshake.auth.token`.
2. Verifies the JWT with `JWT_SECRET`.
3. Reloads the `User` from the DB (does not trust stale claims).
4. Fails with the same messages as the HTTP middleware: `No token provided`,
   `Invalid token`, `User not found`, `User account is inactive`.

On success, `socket.data.userId` and `socket.data.companyId` are set.

### User rooms

On `connection`, the socket joins room `user:<userId>`. This makes it
trivial to target a specific user for realtime events.

## Events

### Client → Server

- `connection` / `disconnect` — lifecycle only; no business or custom events
  are consumed by the server in the current code.

### Server → Client

The one server-emitted event in the current codebase is `notification:new`:

```js
emitToUser(notification.user, "notification:new", notification.toJSON());
```

The payload is the full JSON representation of the created `Notification`
document (see [`DATA_MODEL.md`](DATA_MODEL.md) section 14).

## Emitting to a user

```js
const { emitToUser } = require("../realtime/socket.server");
emitToUser(userId, "notification:new", payload);
```

`emitToUser(userId, event, payload)` emits `event` to room `user:<userId>` and
returns `false` (silently) if the server (`io`) is not initialized or no
userId is provided.

## Notification producer

`notification.service.js` (`createNotification`) persists a `Notification`
document and then attempts to deliver it in realtime via
`emitToUser(notification.user, "notification:new", ...)`. Delivery failures
are caught and logged (they never fail the persistence operation).

The current business producer is **task assignment**: `task.service.js`
(`sendAssignmentNotification`) creates a `type: "task"`, `entityType: "task"`
notification for the assignee whenever a task is assigned to a different user
(see `createTask` and `updateTask` in [`API_REFERENCE.md`](API_REFERENCE.md)).
It is guarded so a task assigned to yourself does not notify you.

## Graceful shutdown

`closeSocketServer()` closes the Socket.IO server and nulls the module-level
`io` reference; called from `server.js` during `SIGINT`/`SIGTERM` before
disconnecting MongoDB.
