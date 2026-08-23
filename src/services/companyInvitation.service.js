const Company = require("../models/Company");
const CompanyInvitation = require("../models/CompanyInvitation");
const User = require("../models/User");
const { normalizeEmail } = require("../utils/email.util");
const { paginate, buildSort } = require("../utils/query.helpers");

const SORTABLE_FIELDS = ["email", "status", "createdAt"];

const PENDING_CONFLICT_MESSAGE =
  "An invitation for this email is already pending";
const EMAIL_TAKEN_MESSAGE = "A user with this email already exists";

// The partial unique index is the race-safe enforcement layer; surface its
// violation with the same friendly conflict error.
const asDuplicateInvitationError = (error) => {
  if (error && error.code === 11000) {
    const conflict = new Error(PENDING_CONFLICT_MESSAGE);
    conflict.status = 409;
    return conflict;
  }
  return error;
};

// The invitation always belongs to the authenticated admin's own company,
// which must exist and not be soft-deleted (same rule as /companies/me).
const assertAdminCompany = async (user) => {
  const company = await Company.findOne({
    _id: user.company,
    isDeleted: false,
  });

  if (!company) {
    const error = new Error("Company not found");
    error.status = 404;
    throw error;
  }

  return company;
};

const createInvitation = async ({ email }, user) => {
  const normalizedEmail = normalizeEmail(email);

  await assertAdminCompany(user);

  // A pending or accepted invitation already reserves this email for the
  // company; only removed invitations free it for re-invitation.
  const activeInvitation = await CompanyInvitation.findOne({
    company: user.company,
    email: normalizedEmail,
    status: { $in: ["pending", "accepted"] },
  });

  if (activeInvitation) {
    const isActiveMember = activeInvitation.status === "accepted";
    const error = new Error(
      isActiveMember ? EMAIL_TAKEN_MESSAGE : PENDING_CONFLICT_MESSAGE
    );
    error.status = 409;
    throw error;
  }

  // User.email is globally unique. An email belonging to ANY existing account
  // can never be invited - users are never moved between companies.
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    const error = new Error(EMAIL_TAKEN_MESSAGE);
    error.status = 409;
    throw error;
  }

  try {
    // company, invitedBy and status are always derived server-side.
    return await CompanyInvitation.create({
      company: user.company,
      invitedBy: user._id,
      email: normalizedEmail,
    });
  } catch (error) {
    throw asDuplicateInvitationError(error);
  }
};

const listInvitations = async (query, user) => {
  await assertAdminCompany(user);

  const { page, limit, skip } = paginate(query);

  const filter = { company: user.company };

  if (query.status) {
    filter.status = query.status;
  }

  const sort = buildSort(query.sortBy, query.sortOrder, SORTABLE_FIELDS);

  const [invitations, total] = await Promise.all([
    CompanyInvitation.find(filter).sort(sort).skip(skip).limit(limit),
    CompanyInvitation.countDocuments(filter),
  ]);

  return {
    invitations,
    pagination: {
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    },
  };
};

const removeInvitation = async (invitationId, user) => {
  await assertAdminCompany(user);

  // Company scoping doubles as tenant isolation: another company's invitation
  // id resolves to a plain 404 without revealing existence.
  const invitation = await CompanyInvitation.findOne({
    _id: invitationId,
    company: user.company,
  });

  if (!invitation) {
    const error = new Error("Invitation not found");
    error.status = 404;
    throw error;
  }

  if (invitation.status !== "pending") {
    const error = new Error("Only pending invitations can be removed");
    error.status = 409;
    throw error;
  }

  invitation.status = "removed";
  invitation.removedAt = new Date();
  await invitation.save();

  return invitation;
};

module.exports = { createInvitation, listInvitations, removeInvitation };
