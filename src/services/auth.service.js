const bcrypt = require("bcrypt");
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

module.exports = { registerUser };
