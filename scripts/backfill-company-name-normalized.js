/**
 * One-time backfill for Company.nameNormalized.
 *
 * Purpose
 * -------
 * Populates the server-derived normalized company identity
 * (see src/utils/companyName.util.js) on every existing Company document so
 * that the partial unique index on { nameNormalized: 1 } can be created
 * safely on startup.
 *
 * Without this backfill, multiple active companies lacking nameNormalized
 * would all carry null inside the index filter and violate the unique
 * constraint, preventing index creation.
 *
 * Behavior
 * --------
 *   - Idempotent: only documents whose nameNormalized is missing or empty are
 *     touched; the display `name` is never modified.
 *   - Non-destructive: adds a derived field, changes nothing else.
 *
 * Usage
 * -----
 *   node scripts/backfill-company-name-normalized.js
 */
require("dotenv").config();

const mongoose = require("mongoose");
const Company = require("../src/models/Company");
const { normalizeCompanyName } = require("../src/utils/companyName.util");

const run = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set. Load the backend .env first.");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✓ MongoDB Connected");

  const stale = {
    $or: [{ nameNormalized: { $exists: false } }, { nameNormalized: null }, { nameNormalized: "" }],
  };

  const companies = await Company.find(stale).select("name nameNormalized");
  console.log(`Companies to backfill: ${companies.length}`);

  let updated = 0;

  for (const company of companies) {
    const nameNormalized = normalizeCompanyName(company.name);

    if (!nameNormalized) {
      console.warn(
        `! Skipped company ${company._id} ("${company.name}") - name normalizes to an empty value`
      );
      continue;
    }

    // Bypass hooks intentionally: write exactly the derived value without
    // re-running validation against legacy documents.
    await Company.updateOne(
      { _id: company._id },
      { $set: { nameNormalized } }
    );
    updated += 1;
    console.log(`+ ${company.name} -> "${nameNormalized}"`);
  }

  console.log("✓ Backfill complete");
  console.log("────────────────────────────────────────────────");
  console.log(`  Documents scanned : ${companies.length}`);
  console.log(`  Documents updated : ${updated}`);
  console.log("────────────────────────────────────────────────");

  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(`✗ Backfill failed: ${error.message}`);
  process.exit(1);
});
