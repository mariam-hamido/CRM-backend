const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (userData) => {
  try {
    const { firstName, lastName, email, password, company, phone, avatar, role } =
      userData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      company,
      phone,
      avatar,
      role,
    });

    const { password: _password, ...userWithoutPassword } = user.toObject();

    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
};

const loginUser = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
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
