const mongoose = require("mongoose");
const path = require("path");
const fsPromises = require("fs").promises;
const Attachment = require("../models/Attachment");
const Customer = require("../models/Customer");
const Lead = require("../models/Lead");
const Deal = require("../models/Deal");
const Task = require("../models/Task");
const Meeting = require("../models/Meeting");
const Note = require("../models/Note");
const {
  paginate,
  buildSearchFilter,
  buildSort,
} = require("../utils/query.helpers");
const {
  ENTITY_FIELDS,
  ENTITY_FOLDERS,
  UPLOAD_DIR,
  getEntityFolder,
  getAttachmentFolder,
  getAttachmentFilePath,
  fileExists,
  deleteFileFromDisk,
} = require("../utils/file.util");

const ENTITY_MODELS = {
  customer: Customer,
  lead: Lead,
  deal: Deal,
  task: Task,
  meeting: Meeting,
  note: Note,
};

const ENTITY_LABELS = {
  customer: "Customer",
  lead: "Lead",
  deal: "Deal",
  task: "Task",
  meeting: "Meeting",
  note: "Note",
};

const SORTABLE_FIELDS = [
  "createdAt",
  "updatedAt",
  "fileName",
  "originalFileName",
  "fileSize",
];

const assertValidAttachmentId = (attachmentId) => {
  if (!mongoose.Types.ObjectId.isValid(attachmentId)) {
    const error = new Error("Attachment not found");
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

const assertCanDelete = (attachment, user) => {
  if (user.role === "sales" && String(attachment.uploadedBy) !== String(user._id)) {
    const error = new Error("You can only delete files you uploaded");
    error.status = 403;
    throw error;
  }
};

const resolveEntityReference = (body) => {
  const providedEntities = ENTITY_FIELDS.filter((field) => body[field]);

  if (providedEntities.length === 0) {
    throw new Error(
      "An attachment must be linked to exactly one entity (customer, lead, deal, task, meeting, or note)"
    );
  }

  if (providedEntities.length > 1) {
    throw new Error("An attachment can only be linked to one entity at a time");
  }

  const entityField = providedEntities[0];

  return {
    entityField,
    entityId: body[entityField],
    entityLabel: ENTITY_LABELS[entityField],
  };
};

const createAttachment = async (file, body, user) => {
  if (!file) {
    throw new Error("No file uploaded");
  }

  try {
    const { entityField, entityId, entityLabel } = resolveEntityReference(body);

    await assertEntityInCompany(
      ENTITY_MODELS[entityField],
      entityId,
      user.company,
      `${entityLabel} not found`
    );

    const folder = getEntityFolder(entityField);
    const finalDir = path.join(UPLOAD_DIR, folder);
    const finalPath = path.join(finalDir, file.filename);

    await fsPromises.mkdir(finalDir, { recursive: true });
    await fsPromises.rename(file.path, finalPath);

    const attachment = await Attachment.create({
      fileName: file.filename,
      originalFileName: path.basename(file.originalname),
      fileUrl: `/uploads/${folder}/${file.filename}`,
      mimeType: file.mimetype,
      fileSize: file.size,
      storageProvider: "local",
      [entityField]: entityId,
      company: user.company,
      uploadedBy: user._id,
    });

    return attachment;
  } catch (error) {
    await deleteFileFromDisk(file.path);
    throw error;
  }
};

const queryAttachments = async (query, user, extraFilter = {}) => {
  const { page, limit, skip } = paginate(query);

  const filter = {
    company: user.company,
    isDeleted: false,
  };

  const searchFilter = buildSearchFilter(query.search, [
    "fileName",
    "originalFileName",
  ]);

  if (searchFilter) {
    Object.assign(filter, searchFilter);
  }

  for (const field of ENTITY_FIELDS) {
    if (query[field]) {
      filter[field] = query[field];
    }
  }

  if (query.uploadedBy) {
    filter.uploadedBy = query.uploadedBy;
  }

  Object.assign(filter, extraFilter);

  const sort = buildSort(query.sortBy, query.sortOrder, SORTABLE_FIELDS);

  const [attachments, total] = await Promise.all([
    Attachment.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Attachment.countDocuments(filter),
  ]);

  return {
    attachments,
    pagination: {
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    },
  };
};

const getAttachments = async (query, user) => {
  return queryAttachments(query, user);
};

const getAttachmentsByEntity = async (entityField, entityId, query, user) => {
  await assertEntityInCompany(
    ENTITY_MODELS[entityField],
    entityId,
    user.company,
    `${ENTITY_LABELS[entityField]} not found`
  );

  return queryAttachments(query, user, { [entityField]: entityId });
};

const getAttachmentById = async (attachmentId, user) => {
  assertValidAttachmentId(attachmentId);

  const attachment = await Attachment.findOne({
    _id: attachmentId,
    company: user.company,
    isDeleted: false,
  });

  if (!attachment) {
    const error = new Error("Attachment not found");
    error.status = 404;
    throw error;
  }

  return attachment;
};

const downloadAttachment = async (attachmentId, user, res) => {
  const attachment = await getAttachmentById(attachmentId, user);

  const filePath = getAttachmentFilePath(attachment);

  if (!(await fileExists(filePath))) {
    const error = new Error("File not found on disk");
    error.status = 404;
    throw error;
  }

  res.download(filePath, attachment.originalFileName);
};

const deleteAttachment = async (attachmentId, user) => {
  const attachment = await getAttachmentById(attachmentId, user);

  assertCanDelete(attachment, user);

  attachment.isDeleted = true;
  await attachment.save();

  await deleteFileFromDisk(getAttachmentFilePath(attachment));

  return attachment;
};

module.exports = {
  createAttachment,
  getAttachments,
  getAttachmentsByEntity,
  getAttachmentById,
  downloadAttachment,
  deleteAttachment,
};
