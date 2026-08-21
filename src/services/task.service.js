const mongoose = require("mongoose");
const Task = require("../models/Task");
const User = require("../models/User");
const Customer = require("../models/Customer");
const Deal = require("../models/Deal");
const Lead = require("../models/Lead");
const notificationService = require("./notification.service");
const { paginate, buildSearchFilter, buildSort } = require("../utils/query.helpers");

const SORTABLE_FIELDS = [
  "createdAt",
  "updatedAt",
  "title",
  "dueDate",
  "priority",
  "status",
];

const assertValidTaskId = (taskId) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    const error = new Error("Task not found");
    error.status = 404;
    throw error;
  }
};

const assertUserInCompany = async (userId, companyId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error("Assignee not found");
    error.status = 404;
    throw error;
  }

  const user = await User.findOne({ _id: userId, company: companyId, isActive: true });

  if (!user) {
    const error = new Error("Assignee not found");
    error.status = 404;
    throw error;
  }

  return user;
};

const assertEntityInCompany = async (Model, id, companyId, notFoundMessage) => {
  if (!id) {
    return null;
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(notFoundMessage);
    error.status = 404;
    throw error;
  }

  const doc = await Model.findOne({ _id: id, company: companyId, isDeleted: false });

  if (!doc) {
    const error = new Error(notFoundMessage);
    error.status = 404;
    throw error;
  }

  return doc;
};

const assertFutureDueDate = (dueDate) => {
  if (!dueDate) {
    throw new Error("Due date is required");
  }

  const due = new Date(dueDate);

  if (Number.isNaN(due.getTime())) {
    throw new Error("Due date must be a valid date");
  }

  if (due.getTime() < Date.now()) {
    throw new Error("Due date cannot be in the past");
  }

  return due;
};

const assertCanUpdate = (task, user) => {
  if (user.role === "sales" && String(task.assignedTo) !== String(user._id)) {
    const error = new Error("You can only update tasks assigned to you");
    error.status = 403;
    throw error;
  }
};

const assertCanDelete = (task, user) => {
  if (user.role === "sales" && String(task.createdBy) !== String(user._id)) {
    const error = new Error("You can only delete tasks you created");
    error.status = 403;
    throw error;
  }
};

const sendAssignmentNotification = async (task) => {
  try {
    await notificationService.createNotification({
      company: task.company,
      user: task.assignedTo,
      title: "New task assigned",
      message: `You have been assigned the task: ${task.title}`,
      type: "task",
      entityType: "task",
      entityId: task._id,
      actionUrl: `/tasks/${task._id}`,
    });
  } catch (error) {
    console.error(
      `Failed to create assignment notification for task ${task._id}: ${error.message}`
    );
  }
};

const createTask = async (taskData, user) => {
  const {
    title,
    description,
    priority,
    reminderDate,
    assignedTo,
    customer,
    deal,
    lead,
    dueDate,
  } = taskData;

  if (!title || !title.trim()) {
    throw new Error("Title is required");
  }

  const due = assertFutureDueDate(dueDate);

  await assertUserInCompany(assignedTo, user.company);
  await assertEntityInCompany(Customer, customer, user.company, "Customer not found");
  await assertEntityInCompany(Deal, deal, user.company, "Deal not found");
  await assertEntityInCompany(Lead, lead, user.company, "Lead not found");

  const task = await Task.create({
    title,
    description,
    priority,
    reminderDate,
    assignedTo,
    customer: customer || null,
    deal: deal || null,
    dueDate: due,
    company: user.company,
    createdBy: user._id,
    status: "pending",
  });

  if (String(assignedTo) !== String(user._id)) {
    sendAssignmentNotification(task);
  }

  return task;
};

const getTasks = async (query, user) => {
  const { page, limit, skip } = paginate(query);

  const filter = {
    company: user.company,
    isDeleted: false,
  };

  const searchFilter = buildSearchFilter(query.search, ["title", "description"]);

  if (searchFilter) {
    Object.assign(filter, searchFilter);
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.priority) {
    filter.priority = query.priority;
  }

  if (query.assignedTo) {
    filter.assignedTo = query.assignedTo;
  }

  if (query.createdBy) {
    filter.createdBy = query.createdBy;
  }

  if (query.customer) {
    filter.customer = query.customer;
  }

  if (query.deal) {
    filter.deal = query.deal;
  }

  const dueDateFilter = {};

  if (query.dueDate) {
    dueDateFilter.$eq = new Date(query.dueDate);
  }

  if (query.dueFrom) {
    dueDateFilter.$gte = new Date(query.dueFrom);
  }

  if (query.dueTo) {
    dueDateFilter.$lte = new Date(query.dueTo);
  }

  if (Object.keys(dueDateFilter).length > 0) {
    filter.dueDate = dueDateFilter;
  }

  const sort = buildSort(query.sortBy, query.sortOrder, SORTABLE_FIELDS);

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Task.countDocuments(filter),
  ]);

  return {
    tasks,
    pagination: {
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    },
  };
};

const getTaskById = async (taskId, user) => {
  assertValidTaskId(taskId);

  const task = await Task.findOne({
    _id: taskId,
    company: user.company,
    isDeleted: false,
  });

  if (!task) {
    const error = new Error("Task not found");
    error.status = 404;
    throw error;
  }

  return task;
};

const updateTask = async (taskId, updateData, user) => {
  const task = await getTaskById(taskId, user);

  assertCanUpdate(task, user);

  const previousAssignedTo = String(task.assignedTo);

  const { company, createdBy, completedAt, lead, ...editableFields } = updateData;

  if (company || createdBy || completedAt) {
    throw new Error(
      "You cannot change the company, creator, or completion date of a task"
    );
  }

  if (editableFields.assignedTo) {
    await assertUserInCompany(editableFields.assignedTo, user.company);
  }

  if (editableFields.customer !== undefined) {
    await assertEntityInCompany(
      Customer,
      editableFields.customer,
      user.company,
      "Customer not found"
    );
  }

  if (editableFields.deal !== undefined) {
    await assertEntityInCompany(
      Deal,
      editableFields.deal,
      user.company,
      "Deal not found"
    );
  }

  if (lead !== undefined) {
    await assertEntityInCompany(Lead, lead, user.company, "Lead not found");
  }

  if (editableFields.dueDate) {
    editableFields.dueDate = assertFutureDueDate(editableFields.dueDate);
  }

  if (editableFields.status === "completed") {
    editableFields.completedAt = new Date();
  } else if (editableFields.status !== undefined && task.status === "completed") {
    editableFields.completedAt = null;
  }

  task.set(editableFields);
  await task.save();

  if (
    editableFields.assignedTo !== undefined &&
    String(task.assignedTo) !== previousAssignedTo &&
    String(task.assignedTo) !== String(user._id)
  ) {
    sendAssignmentNotification(task);
  }

  return task;
};

const completeTask = async (taskId, user) => {
  const task = await getTaskById(taskId, user);

  assertCanUpdate(task, user);

  task.status = "completed";
  task.completedAt = new Date();
  await task.save();

  return task;
};

const cancelTask = async (taskId, user) => {
  const task = await getTaskById(taskId, user);

  assertCanUpdate(task, user);

  task.status = "cancelled";
  await task.save();

  return task;
};

const deleteTask = async (taskId, user) => {
  const task = await getTaskById(taskId, user);

  assertCanDelete(task, user);

  task.isDeleted = true;
  await task.save();

  return task;
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  completeTask,
  cancelTask,
  deleteTask,
};
