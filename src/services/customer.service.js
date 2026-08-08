const mongoose = require("mongoose");
const Customer = require("../models/Customer");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isSameId = (a, b) => String(a) === String(b);

const assertValidCustomerId = (customerId) => {
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    const error = new Error("Customer not found");
    error.status = 404;
    throw error;
  }
};

const assertUniqueContactDetails = async ({
  company,
  email,
  phone,
  excludeId,
}) => {
  const excludeFilter = excludeId ? { _id: { $ne: excludeId } } : {};

  if (email) {
    const emailExists = await Customer.findOne({
      company,
      email: email.toLowerCase(),
      isDeleted: false,
      ...excludeFilter,
    });

    if (emailExists) {
      const error = new Error(
        "A customer with this email already exists in this company"
      );
      error.status = 409;
      throw error;
    }
  }

  if (phone) {
    const phoneExists = await Customer.findOne({
      company,
      phone,
      isDeleted: false,
      ...excludeFilter,
    });

    if (phoneExists) {
      const error = new Error(
        "A customer with this phone already exists in this company"
      );
      error.status = 409;
      throw error;
    }
  }
};

const createCustomer = async (customerData, user) => {
  const { company, owner, email, phone } = customerData;

  if (!user.company) {
    const error = new Error(
      "Authenticated user has no company. Cannot create a customer."
    );
    error.status = 403;
    throw error;
  }

  if (company && !isSameId(company, user.company)) {
    throw new Error("Customer must belong to your company");
  }

  if (owner && !isSameId(owner, user._id)) {
    throw new Error("Owner must be the authenticated user");
  }

  await assertUniqueContactDetails({
    company: user.company,
    email,
    phone,
  });

  const customer = await Customer.create({
    ...customerData,
    company: user.company,
    owner: user._id,
  });

  return customer;
};

const getCustomers = async (query, user) => {
  const page = Math.max(parseInt(query.page, 10) || DEFAULT_PAGE, 1);
  const limit = Math.min(
    Math.max(parseInt(query.limit, 10) || DEFAULT_LIMIT, 1),
    MAX_LIMIT
  );

  const filter = {
    company: user.company,
    isDeleted: false,
  };

  if (query.search) {
    const regex = new RegExp(escapeRegExp(query.search), "i");
    filter.$or = [{ companyName: regex }, { email: regex }, { phone: regex }];
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.source) {
    filter.source = query.source;
  }

  const [customers, total] = await Promise.all([
    Customer.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Customer.countDocuments(filter),
  ]);

  return {
    customers,
    pagination: {
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    },
  };
};

const getCustomerById = async (customerId, user) => {
  assertValidCustomerId(customerId);

  const customer = await Customer.findOne({
    _id: customerId,
    company: user.company,
    isDeleted: false,
  });

  if (!customer) {
    const error = new Error("Customer not found");
    error.status = 404;
    throw error;
  }

  return customer;
};

const updateCustomer = async (customerId, updateData, user) => {
  const customer = await getCustomerById(customerId, user);

  const { company, owner, ...editableFields } = updateData;

  if (company && !isSameId(company, user.company)) {
    throw new Error("You cannot change the company of a customer");
  }

  if (owner && !isSameId(owner, customer.owner)) {
    throw new Error("You cannot change the owner of a customer");
  }

  await assertUniqueContactDetails({
    company: user.company,
    email: editableFields.email,
    phone: editableFields.phone,
    excludeId: customerId,
  });

  customer.set(editableFields);
  await customer.save();

  return customer;
};

const deleteCustomer = async (customerId, user) => {
  const customer = await getCustomerById(customerId, user);

  customer.isDeleted = true;
  await customer.save();

  return customer;
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
