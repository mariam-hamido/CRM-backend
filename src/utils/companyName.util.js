/**
 * Deterministic normalization for company identity.
 *
 * Produces the internal lookup value for Company.nameNormalized:
 *   - trims leading/trailing whitespace
 *   - collapses repeated internal whitespace to a single space
 *   - lowercases
 *
 * Deliberately NOT applied: punctuation removal, accent folding,
 * transliteration, slugification or any semantic matching.
 */
const normalizeCompanyName = (value) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ").toLowerCase() : "";

module.exports = { normalizeCompanyName };
