const mongoose = require("mongoose");
const Lead = require("../models/Lead");
const Customer = require("../models/Customer");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const SORTABLE_FIELDS = [
  "createdAt",
  "updatedAt",
  "firstName",
  "lastName",
  "companyName",
  "score",
  "estimatedValue",
  "status",
];

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const assertValidLeadId = (leadId) => {
  if (!mongoose.Types.ObjectId.isValid(leadId)) {
    const error = new Error("Lead not found");
    error.status = 404;
    throw error;
  }
};

const assertValidNumericFields = ({ score, estimatedValue }) => {
  if (score !== undefined && (score < 0 || score > 100)) {
    throw new Error("Score must be between 0 and 100");
  }

  if (estimatedValue !== undefined && estimatedValue < 0) {
    throw new Error("Estimated value must not be negative");
  }
};

const assertUniqueLeadDetails = async ({ company, email, phone, excludeId }) => {
  const excludeFilter = excludeId ? { _id: { $ne: excludeId } } : {};

  if (email) {
    const emailExists = await Lead.findOne({
      company,
      email: email.toLowerCase(),
      isDeleted: false,
      ...excludeFilter,
    });

    if (emailExists) {
      const error = new Error(
        "A lead with this email already exists in this company"
      );
      error.status = 409;
      throw error;
    }
  }

  if (phone) {
    const phoneExists = await Lead.findOne({
      company,
      phone,
      isDeleted: false,
      ...excludeFilter,
    });

    if (phoneExists) {
      const error = new Error(
        "A lead with this phone already exists in this company"
      );
      error.status = 409;
      throw error;
    }
  }
};

const buildSort = (sortBy, sortOrder) => {
  const field = SORTABLE_FIELDS.includes(sortBy) ? sortBy : "createdAt";
  const order = sortOrder === "asc" ? 1 : -1;

  return { [field]: order };
};

const createLead = async (leadData, user) => {
  const { company, owner, email, phone, score, estimatedValue } = leadData;

  assertValidNumericFields({ score, estimatedValue });

  await assertUniqueLeadDetails({
    company: user.company,
    email,
    phone,
  });

  const lead = await Lead.create({
    ...leadData,
    company: user.company,
    owner: user._id,
  });

  return lead;
};

const getLeads = async (query, user) => {
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
      { companyName: regex },
      { email: regex },
      { phone: regex },
    ];
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.source) {
    filter.source = query.source;
  }

  if (query.owner) {
    filter.owner = query.owner;
  }

  if (
    query.score !== undefined ||
    query.minScore !== undefined ||
    query.maxScore !== undefined
  ) {
    filter.score = {};

    if (query.score !== undefined) {
      filter.score.$eq = Number(query.score);
    }

    if (query.minScore !== undefined) {
      filter.score.$gte = Number(query.minScore);
    }

    if (query.maxScore !== undefined) {
      filter.score.$lte = Number(query.maxScore);
    }
  }

  const sort = buildSort(query.sortBy, query.sortOrder);

  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Lead.countDocuments(filter),
  ]);

  return {
    leads,
    pagination: {
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    },
  };
};

const getLeadById = async (leadId, user) => {
  assertValidLeadId(leadId);

  const lead = await Lead.findOne({
    _id: leadId,
    company: user.company,
    isDeleted: false,
  });

  if (!lead) {
    const error = new Error("Lead not found");
    error.status = 404;
    throw error;
  }

  return lead;
};

const updateLead = async (leadId, updateData, user) => {
  const lead = await getLeadById(leadId, user);

  const { company, owner, ...editableFields } = updateData;

  if (company || owner) {
    throw new Error("You cannot change the company or owner of a lead");
  }

  assertValidNumericFields({
    score: editableFields.score,
    estimatedValue: editableFields.estimatedValue,
  });

  await assertUniqueLeadDetails({
    company: user.company,
    email: editableFields.email,
    phone: editableFields.phone,
    excludeId: leadId,
  });

  lead.set(editableFields);
  await lead.save();

  return lead;
};

const deleteLead = async (leadId, user) => {
  const lead = await getLeadById(leadId, user);

  lead.isDeleted = true;
  await lead.save();

  return lead;
};

const convertLead = async (leadId, user) => {
  const lead = await getLeadById(leadId, user);

  if (lead.status === "converted") {
    const error = new Error("Lead is already converted");
    error.status = 409;
    throw error;
  }

  const customer = await Customer.create({
    company: lead.company,
    owner: lead.owner,
    companyName: lead.companyName || `${lead.firstName} ${lead.lastName}`,
    email: lead.email,
    phone: lead.phone,
  });

  lead.status = "converted";
  lead.convertedCustomer = customer._id;
  lead.convertedAt = new Date();
  await lead.save();

  return { lead, customer };
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  convertLead,
};
