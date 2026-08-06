const mongoose = require("mongoose");
const Activity = require("../models/Activity");
const {
  paginate,
  buildSearchFilter,
  buildSort,
} = require("../utils/query.helpers");

const ENTITY_TYPES = [
  "company",
  "user",
  "customer",
  "customer_contact",
  "lead",
  "pipeline",
  "pipeline_stage",
  "deal",
  "task",
  "meeting",
  "note",
  "attachment",
];

const ACTIONS = [
  "create",
  "update",
  "delete",
  "restore",
  "assign",
  "unassign",
  "convert",
  "move_stage",
  "login",
  "logout",
  "upload",
  "download",
];

const SORTABLE_FIELDS = ["createdAt", "updatedAt", "action", "entityType"];

const assertValidActivityId = (activityId) => {
  if (!mongoose.Types.ObjectId.isValid(activityId)) {
    const error = new Error("Activity not found");
    error.status = 404;
    throw error;
  }
};

const assertValidEntityType = (entityType) => {
  if (!ENTITY_TYPES.includes(entityType)) {
    const error = new Error("Invalid entity type");
    error.status = 400;
    throw error;
  }
};

const assertValidAction = (action) => {
  if (!ACTIONS.includes(action)) {
    const error = new Error("Invalid action");
    error.status = 400;
    throw error;
  }
};

const assertValidEntityId = (entityId) => {
  if (!mongoose.Types.ObjectId.isValid(entityId)) {
    const error = new Error("Invalid entity ID");
    error.status = 400;
    throw error;
  }
};

const logActivity = async (data) => {
  const {
    company,
    user,
    entityType,
    entityId,
    action,
    description,
    oldValues = null,
    newValues = null,
    metadata = {},
    ipAddress = null,
    userAgent = null,
    isSystem = false,
  } = data || {};

  if (!company) {
    throw new Error("Company is required to log an activity");
  }

  if (!user) {
    throw new Error("User is required to log an activity");
  }

  if (!entityType) {
    throw new Error("Entity type is required to log an activity");
  }

  if (!entityId) {
    throw new Error("Entity ID is required to log an activity");
  }

  if (!action) {
    throw new Error("Action is required to log an activity");
  }

  if (!description || !description.trim()) {
    throw new Error("Description is required to log an activity");
  }

  const activity = await Activity.create({
    company,
    user,
    entityType,
    entityId,
    action,
    description: description.trim(),
    oldValues,
    newValues,
    metadata,
    ipAddress,
    userAgent,
    isSystem,
  });

  return activity;
};

const queryActivities = async (query, user, extraFilter = {}) => {
  const { page, limit, skip } = paginate(query);

  const filter = {
    company: user.company,
  };

  const searchFilter = buildSearchFilter(query.search, ["description"]);

  if (searchFilter) {
    Object.assign(filter, searchFilter);
  }

  if (query.entityType) {
    assertValidEntityType(query.entityType);
    filter.entityType = query.entityType;
  }

  if (query.entityId) {
    assertValidEntityId(query.entityId);
    filter.entityId = query.entityId;
  }

  if (query.action) {
    assertValidAction(query.action);
    filter.action = query.action;
  }

  if (query.user) {
    filter.user = query.user;
  }

  if (query.isSystem !== undefined) {
    filter.isSystem = query.isSystem === "true";
  }

  Object.assign(filter, extraFilter);

  const sort = buildSort(query.sortBy, query.sortOrder, SORTABLE_FIELDS);

  const [activities, total] = await Promise.all([
    Activity.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Activity.countDocuments(filter),
  ]);

  return {
    activities,
    pagination: {
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    },
  };
};

const getActivities = async (query, user) => {
  return queryActivities(query, user);
};

const getActivitiesByEntity = async (entityType, entityId, query, user) => {
  assertValidEntityType(entityType);
  assertValidEntityId(entityId);

  return queryActivities(query, user, { entityType, entityId });
};

const getActivityById = async (activityId, user) => {
  assertValidActivityId(activityId);

  const activity = await Activity.findOne({
    _id: activityId,
    company: user.company,
  });

  if (!activity) {
    const error = new Error("Activity not found");
    error.status = 404;
    throw error;
  }

  return activity;
};

module.exports = {
  logActivity,
  getActivities,
  getActivitiesByEntity,
  getActivityById,
};
