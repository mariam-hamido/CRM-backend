/**
 * Single source of truth for email normalization: lowercase + trim only.
 * Matches the convention stored in the users collection (User.email) and the
 * auth service. No provider-specific transformations.
 */
const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : email;

module.exports = { normalizeEmail };
