const mongoose = require("mongoose");
const Note = require("../models/Note");
const Customer = require("../models/Customer");
const Lead = require("../models/Lead");
const Deal = require("../models/Deal");
const Task = require("../models/Task");
const Meeting = require("../models/Meeting");
const {
  paginate,
  buildSearchFilter,
  buildSort,
} = require("../utils/query.helpers");

const ENTITY_FIELDS = ["customer", "lead", "deal", "task", "meeting"];

const ENTITY_MODELS = {
  customer: Customer,
  lead: Lead,
  deal: Deal,
  task: Task,
  meeting: Meeting,
};

const ENTITY_LABELS = {
  customer: "Customer",
  lead: "Lead",
  deal: "Deal",
  task: "Task",
  meeting: "Meeting",
};

const SORTABLE_FIELDS = ["createdAt", "updatedAt", "content"];

const assertValidNoteId = (noteId) => {
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    const error = new Error("Note not found");
    error.status = 404;
    throw error;
  }
};

const assertEntityInCompany = async (Model, id, companyId, notFoundMessage) => {
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

const assertCanModify = (note, user) => {
  if (user.role === "sales" && String(note.createdBy) !== String(user._id)) {
    const error = new Error("You can only modify your own notes");
    error.status = 403;
    throw error;
  }
};

const resolveEntityReference = (noteData) => {
  const providedEntities = ENTITY_FIELDS.filter((field) => noteData[field]);

  if (providedEntities.length === 0) {
    throw new Error(
      "A note must be linked to exactly one entity (customer, lead, deal, task, or meeting)"
    );
  }

  if (providedEntities.length > 1) {
    throw new Error("A note can only be linked to one entity at a time");
  }

  const entityField = providedEntities[0];

  return {
    entityField,
    entityId: noteData[entityField],
    entityLabel: ENTITY_LABELS[entityField],
  };
};

const createNote = async (noteData, user) => {
  const { content, isPinned } = noteData;

  if (!content || !content.trim()) {
    throw new Error("Note content is required");
  }

  const { entityField, entityId, entityLabel } = resolveEntityReference(noteData);

  await assertEntityInCompany(
    ENTITY_MODELS[entityField],
    entityId,
    user.company,
    `${entityLabel} not found`
  );

  const note = await Note.create({
    content,
    isPinned: isPinned || false,
    [entityField]: entityId,
    company: user.company,
    createdBy: user._id,
  });

  return note;
};

const queryNotes = async (query, user, extraFilter = {}) => {
  const { page, limit, skip } = paginate(query);

  const filter = {
    company: user.company,
    isDeleted: false,
  };

  const searchFilter = buildSearchFilter(query.search, ["content"]);

  if (searchFilter) {
    Object.assign(filter, searchFilter);
  }

  if (query.customer) {
    filter.customer = query.customer;
  }

  if (query.lead) {
    filter.lead = query.lead;
  }

  if (query.deal) {
    filter.deal = query.deal;
  }

  if (query.task) {
    filter.task = query.task;
  }

  if (query.meeting) {
    filter.meeting = query.meeting;
  }

  if (query.createdBy) {
    filter.createdBy = query.createdBy;
  }

  if (query.isPinned !== undefined) {
    filter.isPinned = query.isPinned === "true";
  }

  Object.assign(filter, extraFilter);

  const sort = buildSort(query.sortBy, query.sortOrder, SORTABLE_FIELDS);

  const [notes, total] = await Promise.all([
    Note.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Note.countDocuments(filter),
  ]);

  return {
    notes,
    pagination: {
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    },
  };
};

const getNotes = async (query, user) => {
  return queryNotes(query, user);
};

const getNotesByEntity = async (entityField, entityId, query, user) => {
  await assertEntityInCompany(
    ENTITY_MODELS[entityField],
    entityId,
    user.company,
    `${ENTITY_LABELS[entityField]} not found`
  );

  return queryNotes(query, user, { [entityField]: entityId });
};

const getNoteById = async (noteId, user) => {
  assertValidNoteId(noteId);

  const note = await Note.findOne({
    _id: noteId,
    company: user.company,
    isDeleted: false,
  });

  if (!note) {
    const error = new Error("Note not found");
    error.status = 404;
    throw error;
  }

  return note;
};

const updateNote = async (noteId, updateData, user) => {
  const note = await getNoteById(noteId, user);

  assertCanModify(note, user);

  const {
    company,
    createdBy,
    customer,
    lead,
    deal,
    task,
    meeting,
    ...editableFields
  } = updateData;

  if (company || createdBy || customer || lead || deal || task || meeting) {
    throw new Error(
      "You can only update the content and pinned status of a note"
    );
  }

  if (editableFields.content !== undefined && !editableFields.content.trim()) {
    throw new Error("Note content is required");
  }

  if (
    editableFields.isPinned !== undefined &&
    typeof editableFields.isPinned !== "boolean"
  ) {
    throw new Error("isPinned must be a boolean");
  }

  note.set(editableFields);
  await note.save();

  return note;
};

const deleteNote = async (noteId, user) => {
  const note = await getNoteById(noteId, user);

  assertCanModify(note, user);

  note.isDeleted = true;
  await note.save();

  return note;
};

module.exports = {
  createNote,
  getNotes,
  getNotesByEntity,
  getNoteById,
  updateNote,
  deleteNote,
};
