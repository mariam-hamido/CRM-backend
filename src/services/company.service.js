const Company = require("../models/Company");

const createCompany = async (companyData, userId) => {
  const { name } = companyData;

  const existingCompany = await Company.findOne({ name });

  if (existingCompany) {
    throw new Error("A company with this name already exists");
  }

  const company = await Company.create({
    ...companyData,
    createdBy: userId,
  });

  return company;
};

module.exports = { createCompany };
