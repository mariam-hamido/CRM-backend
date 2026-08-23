const Company = require("../models/Company");
const { normalizeCompanyName } = require("../utils/companyName.util");

const DUPLICATE_NAME_MESSAGE = "A company with this name already exists";

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

// The partial unique index on nameNormalized is the race-safe enforcement
// layer; surface its violation with the same friendly conflict error.
const asDuplicateNameError = (error) => {
  if (error && error.code === 11000) {
    const conflict = new Error(DUPLICATE_NAME_MESSAGE);
    conflict.status = 409;
    return conflict;
  }
  return error;
};

const createCompany = async (companyData, userId) => {
  const { name } = companyData;

  const nameNormalized = normalizeCompanyName(name);

  // Friendly pre-check; the unique index remains the real guarantee.
  const existingCompany = await Company.findOne({
    nameNormalized,
    isDeleted: false,
  });

  if (existingCompany) {
    const error = new Error(DUPLICATE_NAME_MESSAGE);
    error.status = 409;
    throw error;
  }

  // Client-supplied identity values are never trusted.
  const payload = { ...companyData, createdBy: userId };
  delete payload.nameNormalized;
  delete payload.isDeleted;

  try {
    const company = await Company.create(payload);
    return company;
  } catch (error) {
    throw asDuplicateNameError(error);
  }
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
    // Only ACTIVE companies reserve a normalized name; soft-deleted ones do not.
    const existingCompany = await Company.findOne({
      nameNormalized: normalizeCompanyName(name),
      _id: { $ne: companyId },
      isDeleted: false,
    });

    if (existingCompany) {
      const error = new Error(DUPLICATE_NAME_MESSAGE);
      error.status = 409;
      throw error;
    }
  }

  // The pre-validate hook recomputes nameNormalized from the display name
  // on save; client-supplied values are never trusted.
  company.set(editableFields);

  try {
    await company.save();
  } catch (error) {
    throw asDuplicateNameError(error);
  }

  return company;
};

module.exports = {
  createCompany,
  getCurrentCompany,
  updateCurrentCompany,
};
