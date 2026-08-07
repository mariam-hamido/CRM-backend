/**
 * Local development seed script.
 *
 * Purpose
 * -------
 * Ensures the Company -> User.company -> Authenticated user chain is valid so
 * that `GET /api/companies/me` returns the authenticated user's company.
 *
 * It fixes the common local-setup problem where a User document has a dangling
 * `company` reference (an ObjectId that does not exist in the `companies`
 * collection). The backend service returns 404 "Company not found" in that
 * case, even though the auth middleware and the service logic are correct.
 *
 * Behavior (idempotent, safe to run repeatedly)
 * ---------------------------------------------
 *   1. Reuses an existing non-deleted Company (matched by name), falls back to
 *      any non-deleted Company, and creates one only when none exists.
 *   2. Repairs every User whose `company` reference is missing or points to a
 *      non-existent (or deleted) Company, pointing it at the dev Company.
 *   3. Creates a documented admin User (with role "admin") linked to the dev
 *      Company when SEED_ADMIN_EMAIL does not already exist.
 *
 * It never deletes data and makes no changes to runtime/production behavior.
 *
 * Configuration (all optional environment variables)
 * --------------------------------------------------
 *   SEED_DEV_COMPANY_NAME   Company name to reuse/create.   Default: "Mariam CRM"
 *   SEED_ADMIN_EMAIL        Admin user to ensure.           Default: "admin@example.com"
 *   SEED_ADMIN_PASSWORD     Password used on create only.   Default: "Admin1234!"
 *
 * Usage
 * -----
 *   npm run seed:dev
 */
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Company = require("../src/models/Company");
const User = require("../src/models/User");

const DEV_COMPANY_NAME = process.env.SEED_DEV_COMPANY_NAME || "Mariam CRM";
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Admin1234!";

const run = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set. Load the backend .env first.");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✓ MongoDB Connected");

  // 1. Ensure the dev company exists.
  let company = await Company.findOne({
    name: DEV_COMPANY_NAME,
    isDeleted: false,
  });

  if (!company) {
    company = await Company.findOne({ isDeleted: false });
  }

  if (!company) {
    company = await Company.create({ name: DEV_COMPANY_NAME });
    console.log(`+ Created company "${company.name}" (${company._id})`);
  } else {
    console.log(`= Using company "${company.name}" (${company._id})`);
  }

  // 2. Repair Users whose company reference is missing or dangling.
  const users = await User.find({});
  let repaired = 0;

  for (const user of users) {
    const linkedCompany = user.company
      ? await Company.exists({ _id: user.company, isDeleted: false })
      : false;

    if (!linkedCompany) {
      user.company = company._id;
      await user.save();
      repaired += 1;
      console.log(`~ Repaired user "${user.email}" company -> ${company._id}`);
    }
  }

  // 3. Ensure a documented admin user exists.
  let admin = await User.findOne({ email: ADMIN_EMAIL });

  if (!admin) {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    admin = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      company: company._id,
      role: "admin",
    });
    console.log(`+ Created admin user "${ADMIN_EMAIL}" (${admin._id})`);
  } else {
    console.log(`= Admin user "${ADMIN_EMAIL}" already exists`);
  }

  console.log("✓ Seed complete");
  console.log("────────────────────────────────────────────────");
  console.log("Local development setup:");
  console.log(`  Company name : ${company.name}`);
  console.log(`  Company ID   : ${company._id}`);
  console.log(`  Admin email  : ${ADMIN_EMAIL}`);
  console.log(`  Admin pass   : ${ADMIN_PASSWORD}`);
  console.log(
    `  Users repaired: ${repaired} (dangling company references repointed)`
  );
  console.log("────────────────────────────────────────────────");

  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(`✗ Seed failed: ${error.message}`);
  process.exit(1);
});
