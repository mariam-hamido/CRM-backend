const {
  registerUser,
  registerEmployeeUser,
  registerAdminUser,
  loginUser,
} = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const registerEmployee = async (req, res) => {
  try {
    const user = await registerEmployeeUser(req.body);

    res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const me = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

const registerAdmin = async (req, res) => {
  try {
    const user = await registerAdminUser(req.body);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { register, registerEmployee, registerAdmin, login, me };
