const companyEmployeeService = require("../services/companyEmployee.service");

const list = async (req, res) => {
  try {
    const result = await companyEmployeeService.listEmployees(
      req.query,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const employee = await companyEmployeeService.removeEmployee(
      req.params.id,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Employee removed successfully",
      data: employee,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { list, remove };
