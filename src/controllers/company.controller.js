const companyService = require("../services/company.service");

const create = async (req, res) => {
  try {
    const company = await companyService.createCompany(req.body, req.user._id);

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getCurrentCompany = async (req, res) => {
  try {
    const company = await companyService.getCurrentCompany(req.user.company);

    res.status(200).json({
      success: true,
      message: "Company fetched successfully",
      data: company,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCurrentCompany = async (req, res) => {
  try {
    const company = await companyService.updateCurrentCompany(
      req.user.company,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: company,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { create, getCurrentCompany, updateCurrentCompany };
