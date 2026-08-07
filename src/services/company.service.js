const Company = require("../models/Company");

const EDITABLE_FIELDS = [
  "name",
  "logo",
  "industry",
  "website",
  "phone",
  "email",
  "country",
  "city",
  "address",
  "subscriptionPlan",
  "status",
  "timezone",
  "currency",
];

const createCompany = async (companyData, userId) => {
  const { name } = companyData;

  const existingCompany = await Company.findOne({ name });

  if (existingCompany) {
    const error = new Error("A company with this name already exists");
    error.status = 409;
    throw error;
  }

  const company = await Company.create({
    ...companyData,
    createdBy: userId,
  });

  return company;
};

const getCurrentCompany = async (companyId) => {
  const company = await Company.findOne({
    _id: companyId,
    isDeleted: false,
  });

  if (!company) {
    const error = new Error("Company not found");
    error.status = 404;
    throw error;
  }

  return company;
};

const updateCurrentCompany = async (companyId, companyData) => {
  const company = await getCurrentCompany(companyId);

  const editableFields = Object.fromEntries(
    Object.entries(companyData).filter(
      ([key, value]) =>
        EDITABLE_FIELDS.includes(key) && value !== undefined && value !== null
    )
  );

  const { name } = editableFields;

  if (name) {
    const existingCompany = await Company.findOne({
      name,
      _id: { $ne: companyId },
      isDeleted: false,
    });

    if (existingCompany) {
      const error = new Error("A company with this name already exists");
      error.status = 409;
      throw error;
    }
  }

  company.set(editableFields);
  await company.save();

  return company;
};

module.exports = {
  createCompany,
  getCurrentCompany,
  updateCurrentCompany,
};
