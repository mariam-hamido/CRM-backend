const Company = require("../models/Company");
const User = require("../models/User");
const { paginate, buildSort } = require("../utils/query.helpers");

const SORTABLE_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "role",
  "isActive",
  "createdAt",
];

// Roles an admin may manage. Admins themselves are a separate ownership
// concern and can never be deactivated through employee management.
const MANAGEABLE_ROLES = ["manager", "sales"];

// Safe projection for list/detail responses - no password, no lastLogin,
// no auth internals (User.toJSON additionally strips password).
const SAFE_FIELDS = "_id firstName lastName email role isActive createdAt";

const SELF_REMOVAL_MESSAGE = "You cannot remove your own account";
const ADMIN_TARGET_MESSAGE =
  "Company admins cannot be removed through employee management";

// The employee list always belongs to the authenticated admin's own company,
// which must exist and not be soft-deleted (same rule as invitations).
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

/**
 * List the authenticated admin's company users EXCLUDING the admin themself.
 * Co-admins appear in the list (with their role) but are never removable;
 * inactive members stay listed so removals remain visible.
 */
const listEmployees = async (query, user) => {
  await assertAdminCompany(user);

  const { page, limit, skip } = paginate(query);

  const filter = { company: user.company, _id: { $ne: user._id } };

  if (query.status === "active") {
    filter.isActive = true;
  } else if (query.status === "inactive") {
    filter.isActive = false;
  }

  const sort = buildSort(query.sortBy, query.sortOrder, SORTABLE_FIELDS);

  const [employees, total] = await Promise.all([
    User.find(filter).select(SAFE_FIELDS).sort(sort).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    employees,
    pagination: {
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    },
  };
};

/**
 * Soft-remove an employee by deactivating the account (isActive=false).
 * The User document is never hard-deleted, so every historical CRM record
 * keeps its owner/assignee reference and remains fully auditable. Email,
 * company and role are untouched; only isActive flips.
 */
const removeEmployee = async (targetUserId, user) => {
  await assertAdminCompany(user);

  // Self-protection first: an admin must never lock themself out.
  if (String(targetUserId) === String(user._id)) {
    const error = new Error(SELF_REMOVAL_MESSAGE);
    error.status = 400;
    throw error;
  }

  // Company scoping doubles as tenant isolation: another company's user id
  // resolves to a plain 404 without revealing existence.
  const target = await User.findOne({
    _id: targetUserId,
    company: user.company,
  }).select(SAFE_FIELDS);

  if (!target) {
    const error = new Error("Employee not found");
    error.status = 404;
    throw error;
  }

  if (!MANAGEABLE_ROLES.includes(target.role)) {
    const error = new Error(ADMIN_TARGET_MESSAGE);
    error.status = 403;
    throw error;
  }

  if (!target.isActive) {
    const error = new Error("Employee is already inactive");
    error.status = 409;
    throw error;
  }

  target.isActive = false;
  await target.save();

  return target;
};

module.exports = { listEmployees, removeEmployee };
