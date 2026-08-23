const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Company = require("../models/Company");
const CompanyInvitation = require("../models/CompanyInvitation");
const { normalizeEmail } = require("../utils/email.util");
const { normalizeCompanyName } = require("../utils/companyName.util");

// Shared canonical normalizations live in src/utils/*.util.js so every flow
// (register, login, invitations) compares identities identically.
const REGISTER_DEFAULT_ROLE = "sales";

// Uniform failure for company/invitation problems: never reveals whether the
// company exists or whether a given email is invited anywhere.
const INVALID_INVITATION_MESSAGE = "Invalid company name or unapproved email";

const registerUser = async (userData) => {
  try {
    const { firstName, lastName, password, company, phone, avatar } = userData;
    const email = normalizeEmail(userData.email);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const existingCompany = await Company.findOne({
      _id: company,
      isDeleted: false,
    });

    if (!existingCompany) {
      throw new Error("Company not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      company: existingCompany._id,
      phone,
      avatar,
      role: REGISTER_DEFAULT_ROLE,
    });

    const { password: _password, ...userWithoutPassword } = user.toObject();

    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
};

const loginUser = async ({ email, password }) => {
  try {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
      {
        userId: user._id,
        companyId: user.company,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _password, ...userWithoutPassword } = user.toObject();

    return {
      user: userWithoutPassword,
      token,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Employee FIRST registration: requires a pending invitation created by a
 * company admin for (company, email). Everything security-sensitive is derived
 * server-side: company from its normalized name, role fixed to "sales",
 * isActive from the model default. The client cannot supply company ids,
 * roles or invitation state.
 *
 * Failure safety without transactions (the project does not use them):
 *   1. All validation happens BEFORE the invitation is touched.
 *   2. The pending invitation is atomically CLAIMED (findOneAndUpdate with
 *      status:"pending" filter) so concurrent attempts cannot double-register.
 *   3. If User creation then fails, the claim is rolled back to pending, so a
 *      failed registration never consumes the invitation.
 * Remaining crash-window risk (process dies between claim and create) is
 * documented and accepted; no transaction infrastructure exists in this codebase.
 */
const registerEmployeeUser = async (userData) => {
  const { companyName, firstName, lastName, password } = userData;
  const email = normalizeEmail(userData.email);
  const nameNormalized = normalizeCompanyName(companyName);

  // 1. User.email is globally unique - checked FIRST so already-registered
  //    employees get the same business error as the legacy flow ("Email
  //    already exists") instead of a misleading invitation failure. Existing
  //    accounts must use login and are never moved between companies.
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // 2. Resolve the company by exact normalized identity - no fuzzy matching.
  const company = await Company.findOne({ nameNormalized, isDeleted: false });

  // 3. The invitation is the authorization to join; it must belong to THIS
  //    company and this normalized email.
  const invitation = company
    ? await CompanyInvitation.findOne({
        company: company._id,
        email,
        status: "pending",
      })
    : null;

  if (!company || !invitation) {
    throw new Error(INVALID_INVITATION_MESSAGE);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Atomically consume the pending invitation so simultaneous
  //    registrations cannot both proceed past this point.
  const claimed = await CompanyInvitation.findOneAndUpdate(
    { _id: invitation._id, status: "pending" },
    { $set: { status: "accepted", acceptedAt: new Date() } },
    { new: true }
  );

  if (!claimed) {
    throw new Error(INVALID_INVITATION_MESSAGE);
  }

  // 5. Create the employee; on ANY failure restore the invitation to pending
  //    so the failed attempt does not burn it.
  try {
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      company: company._id,
      role: REGISTER_DEFAULT_ROLE,
    });

    const { password: _password, ...userWithoutPassword } = user.toObject();

    return userWithoutPassword;
  } catch (error) {
    await CompanyInvitation.updateOne(
      { _id: claimed._id, status: "accepted" },
      { $set: { status: "pending", acceptedAt: null } }
    );

    if (error && error.code === 11000) {
      throw new Error("Email already exists");
    }

    throw error;
  }
};

module.exports = { registerUser, registerEmployeeUser, loginUser };
