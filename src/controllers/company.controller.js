const { createCompany } = require("../services/company.service");

const create = async (req, res) => {
  try {
    const company = await createCompany(req.body, req.user._id);

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { create };
