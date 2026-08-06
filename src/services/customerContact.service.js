const mongoose = require("mongoose");
const Customer = require("../models/Customer");
const CustomerContact = require("../models/CustomerContact");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const SORTABLE_FIELDS = ["createdAt", "updatedAt", "firstName", "lastName", "email"];

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const assertValidObjectId = (id, notFoundMessage) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(notFoundMessage);
    error.status = 404;
    throw error;
  }
};

const assertCustomerOwnership = async (customerId, companyId) => {
  assertValidObjectId(customerId, "Customer not found");

  const customer = await Customer.findOne({
    _id: customerId,
    company: companyId,
    isDeleted: false,
  });

  if (!customer) {
    const error = new Error("Customer not found");
    error.status = 404;
    throw error;
  }

  return customer;
};

const assertUniqueContactDetails = async ({
  customer,
  company,
  email,
  phone,
  excludeId,
}) => {
  const excludeFilter = excludeId ? { _id: { $ne: excludeId } } : {};

  if (email) {
    const emailExists = await CustomerContact.findOne({
      customer,
      company,
      email: email.toLowerCase(),
      isDeleted: false,
      ...excludeFilter,
    });

    if (emailExists) {
      const error = new Error(
        "A contact with this email already exists for this customer"
      );
      error.status = 409;
      throw error;
    }
  }

  if (phone) {
    const phoneExists = await CustomerContact.findOne({
      customer,
      company,
      phone,
      isDeleted: false,
      ...excludeFilter,
    });

    if (phoneExists) {
      const error = new Error(
        "A contact with this phone already exists for this customer"
      );
      error.status = 409;
      throw error;
    }
  }
};

const clearPrimaryContacts = async (customerId, companyId) => {
  await CustomerContact.updateMany(
    { customer: customerId, company: companyId, isPrimary: true },
    { $set: { isPrimary: false } }
  );
};

const buildSort = (sortBy, sortOrder) => {
  const field = SORTABLE_FIELDS.includes(sortBy) ? sortBy : "createdAt";
  const order = sortOrder === "asc" ? 1 : -1;

  return { [field]: order };
};

const createContact = async (contactData, user) => {
  const { customer, email, phone, isPrimary } = contactData;

  await assertCustomerOwnership(customer, user.company);

  await assertUniqueContactDetails({
    customer,
    company: user.company,
    email,
    phone,
  });

  if (isPrimary) {
    await clearPrimaryContacts(customer, user.company);
  }

  const contact = await CustomerContact.create({
    ...contactData,
    company: user.company,
    isPrimary: isPrimary || false,
  });

  return contact;
};

const getContacts = async (query, user) => {
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
    filter.$or = [
      { firstName: regex },
      { lastName: regex },
      { email: regex },
      { phone: regex },
      { jobTitle: regex },
    ];
  }

  if (query.customer) {
    filter.customer = query.customer;
  }

  if (query.isPrimary !== undefined) {
    filter.isPrimary = query.isPrimary === "true";
  }

  const sort = buildSort(query.sortBy, query.sortOrder);

  const [contacts, total] = await Promise.all([
    CustomerContact.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    CustomerContact.countDocuments(filter),
  ]);

  return {
    contacts,
    pagination: {
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    },
  };
};

const getCustomerContacts = async (customerId, query, user) => {
  await assertCustomerOwnership(customerId, user.company);

  return getContacts({ ...query, customer: customerId }, user);
};

const getContactById = async (contactId, user) => {
  assertValidObjectId(contactId, "Contact not found");

  const contact = await CustomerContact.findOne({
    _id: contactId,
    company: user.company,
    isDeleted: false,
  });

  if (!contact) {
    const error = new Error("Contact not found");
    error.status = 404;
    throw error;
  }

  return contact;
};

const updateContact = async (contactId, updateData, user) => {
  const contact = await getContactById(contactId, user);

  const { customer, company, ...editableFields } = updateData;

  if (customer || company) {
    throw new Error("You cannot change the customer or company of a contact");
  }

  await assertUniqueContactDetails({
    customer: contact.customer,
    company: user.company,
    email: editableFields.email,
    phone: editableFields.phone,
    excludeId: contactId,
  });

  if (editableFields.isPrimary === true) {
    await clearPrimaryContacts(contact.customer, user.company);
  }

  contact.set(editableFields);
  await contact.save();

  return contact;
};

const deleteContact = async (contactId, user) => {
  const contact = await getContactById(contactId, user);

  contact.isDeleted = true;
  await contact.save();

  return contact;
};

module.exports = {
  createContact,
  getContacts,
  getCustomerContacts,
  getContactById,
  updateContact,
  deleteContact,
};
