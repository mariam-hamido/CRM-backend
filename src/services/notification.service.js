const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const {
  paginate,
  buildSearchFilter,
  buildSort,
} = require("../utils/query.helpers");

const TYPES = [
  "system",
  "task",
  "meeting",
  "customer",
  "lead",
  "deal",
  "reminder",
  "success",
  "warning",
  "error",
];

const ENTITY_TYPES = [
  "customer",
  "lead",
  "deal",
  "task",
  "meeting",
  "note",
  "attachment",
  "user",
  "company",
];

const SORTABLE_FIELDS = ["createdAt", "updatedAt", "title"];

const assertValidNotificationId = (notificationId) => {
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    const error = new Error("Notification not found");
    error.status = 404;
    throw error;
  }
};

const assertValidType = (type) => {
  if (!TYPES.includes(type)) {
    const error = new Error("Invalid notification type");
    error.status = 400;
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

const createNotification = async (data) => {
  const {
    company,
    user,
    title,
    message,
    type = "system",
    entityType = null,
    entityId = null,
    actionUrl = null,
    expiresAt = null,
  } = data || {};

  if (!company) {
    throw new Error("Company is required to create a notification");
  }

  if (!user) {
    throw new Error("User is required to create a notification");
  }

  if (!title || !title.trim()) {
    throw new Error("Title is required to create a notification");
  }

  if (!message || !message.trim()) {
    throw new Error("Message is required to create a notification");
  }

  if (!TYPES.includes(type)) {
    throw new Error("Invalid notification type");
  }

  if (entityType && !ENTITY_TYPES.includes(entityType)) {
    throw new Error("Invalid entity type");
  }

  if (entityId && !mongoose.Types.ObjectId.isValid(entityId)) {
    throw new Error("Invalid entity ID");
  }

  const notification = await Notification.create({
    company,
    user,
    title: title.trim(),
    message: message.trim(),
    type,
    entityType,
    entityId,
    actionUrl,
    expiresAt,
  });

  return notification;
};

const queryNotifications = async (query, user) => {
  const { page, limit, skip } = paginate(query);

  const filter = {
    company: user.company,
    user: user._id,
  };

  const searchFilter = buildSearchFilter(query.search, ["title", "message"]);

  if (searchFilter) {
    Object.assign(filter, searchFilter);
  }

  if (query.type) {
    assertValidType(query.type);
    filter.type = query.type;
  }

  if (query.isRead !== undefined) {
    filter.isRead = query.isRead === "true";
  }

  if (query.entityType) {
    assertValidEntityType(query.entityType);
    filter.entityType = query.entityType;
  }

  if (query.entityId) {
    filter.entityId = query.entityId;
  }

  const sort = buildSort(query.sortBy, query.sortOrder, SORTABLE_FIELDS);

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Notification.countDocuments(filter),
  ]);

  return {
    notifications,
    pagination: {
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    },
  };
};

const getNotifications = async (query, user) => {
  return queryNotifications(query, user);
};

const getUnreadCount = async (user) => {
  const count = await Notification.countDocuments({
    company: user.company,
    user: user._id,
    isRead: false,
  });

  return count;
};

const getNotificationById = async (notificationId, user) => {
  assertValidNotificationId(notificationId);

  const notification = await Notification.findOne({
    _id: notificationId,
    company: user.company,
    user: user._id,
  });

  if (!notification) {
    const error = new Error("Notification not found");
    error.status = 404;
    throw error;
  }

  return notification;
};

const markAsRead = async (notificationId, user) => {
  const notification = await getNotificationById(notificationId, user);

  if (!notification.isRead) {
    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();
  }

  return notification;
};

const markAllAsRead = async (user) => {
  const result = await Notification.updateMany(
    {
      company: user.company,
      user: user._id,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    }
  );

  return result.modifiedCount;
};

const deleteNotification = async (notificationId, user) => {
  const notification = await getNotificationById(notificationId, user);

  await Notification.deleteOne({ _id: notification._id });

  return notification;
};

module.exports = {
  createNotification,
  getNotifications,
  getUnreadCount,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
