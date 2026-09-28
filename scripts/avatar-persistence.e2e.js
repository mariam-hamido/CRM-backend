"use strict";
/* Avatar persistence E2E regression guard (runs against the LIVE backend
 * that is currently serving :5000 and its REAL Atlas DB through the backend's
 * own dotenv, mongoose, User model, and .env MONGODB_URI).
 *
 * Flow: register/admin -> login -> PATCH /auth/me (multipart "avatar")
 *       -> GET /auth/me -> static GET of avatar URL -> read the ACTUAL persisted
 *       User doc from Atlas (backend's own User.findOne) and assert the avatar
 *       field matches. Self-cleaning: deletes the probe user + company.
 *
 * Usage: node scripts/avatar-persistence.e2e.js   (cwd = backend root)
 * Exit 0 = pass, nonzero = fail.
 */
require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const User = require(path.join(__dirname, "..", "src", "models", "User.js"));
const Company = require(path.join(__dirname, "..", "src", "models", "Company.js"));

const API = "http://localhost:5000/api";
const uri = process.env.MONGODB_URI;
if (!uri) { console.error("MONGODB_URI missing"); process.exit(1); }

const UID = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const email = "avatar.e2e." + UID + "@example.com";
const password = "Str0ng!Pass1";
const companyName = "Avatar E2E " + UID;

const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

const j = (r) => r.json();
const H = (t) => ({ Authorization: "Bearer " + t });

async function call(url, opts) {
  const r = await fetch(url, opts);
  const b = await j(r);
  return { s: r.status, b };
}

async function run() {
  await mongoose.connect(uri);
  console.log("connected:", mongoose.connection.name);

  let r = await call(API + "/auth/register/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: "Avatar", lastName: "E2E", email, password, companyName,
    }),
  });
  if (!r.s.toString().startsWith("2")) throw new Error("register: " + JSON.stringify(r.b));

  r = await call(API + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const token = r.b && r.b.data && (r.b.data.token || (r.b.data.user && r.b.data.user.token));
  if (!token) throw new Error("login: " + JSON.stringify(r.b));

  const fd = new FormData();
  fd.append("avatar", new Blob([png], { type: "image/png" }), "probe.png");
  r = await call(API + "/auth/me", {
    method: "PATCH",
    headers: H(token),
    body: fd,
  });
  const avatar = r.b && r.b.data && (r.b.data.avatar || (r.b.data.user && r.b.data.user.avatar));
  if (!avatar) throw new Error("patch: " + JSON.stringify(r.b));

  const me = await call(API + "/auth/me", { headers: H(token) });
  const meAvatar = me.b && me.b.data && (me.b.data.avatar || (me.b.data.user && me.b.data.user.avatar));

  const st = await fetch("http://localhost:5000" + avatar);
  console.log("patch ok, avatar:", avatar, "| static:", st.status, "| me-avatar matches:", meAvatar === avatar);

  const doc = await User.findOne({ email });
  if (!doc) throw new Error("user doc missing in Atlas");
  const hasField = Object.prototype.hasOwnProperty.call(doc, "avatar");
  const persisted = hasField && doc.avatar === avatar;
  console.log("User doc has avatar field:", hasField, "| value:", doc.avatar, "| persisted:", persisted);

  await Company.deleteOne({ name: companyName });
  await User.deleteOne({ email });
  console.log("cleanup: removed probe company + user");

  if (!persisted) process.exitCode = 1;
}

run().catch((e) => { console.error("FAIL:", e.message); process.exitCode = 1; });
