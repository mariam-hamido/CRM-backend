/**
 * Allowed browser origins for HTTP (Express) and realtime (Socket.IO) CORS.
 *
 * In production set FRONTEND_URL to a comma-separated list of exact origins,
 * e.g. FRONTEND_URL=https://app.example.com or
 * FRONTEND_URL=https://app.example.com,http://localhost:5173
 *
 * When FRONTEND_URL is unset (or empty) all origins are allowed, preserving
 * the historical local-development behaviour with zero extra configuration.
 * Origins must be exact scheme+host(+port); do NOT include a trailing slash.
 */
const getFrontendOrigins = () => {
  const raw = process.env.FRONTEND_URL;

  if (!raw || !raw.trim()) {
    return null;
  }

  const origins = raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return origins.length > 0 ? origins : null;
};

/**
 * cors-compatible "origin" option.
 * - Allowed list (array) when FRONTEND_URL is configured.
 * - `true` (reflect the request origin = allow all) as the dev default, so the
 *   documented `app.use(cors(origin))` semantics are preserved in development.
 */
const getCorsOriginOption = () => true;

/**
 * Socket.IO-compatible "origin" option.
 * - Allowed list (array) when FRONTEND_URL is configured.
 * - "*" as the dev default (same as the original implementation).
 */
const getSocketOriginOption = () => {
  const origins = getFrontendOrigins();
  return origins || "*";
};

module.exports = {
  getFrontendOrigins,
  getCorsOriginOption,
  getSocketOriginOption,
};
