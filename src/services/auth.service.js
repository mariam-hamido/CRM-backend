const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Company = require("../models/Company");

// Single source of truth for email normalization: lowercase + trim only.
// Must match the convention already stored in the users collection
// (User.email uses lowercase + trim). No provider-specific transformations.
const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : email;

const REGISTER_DEFAULT_ROLE = "sales";

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

module.exports = { registerUser, loginUser };
