const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const fsPromises = fs.promises;

const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");
const TMP_DIR = path.join(UPLOAD_DIR, "tmp");

const EXTENSION_MIME_MAP = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx":
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".txt": "text/plain",
  ".csv": "text/csv",
  ".zip": "application/zip",
};

const ALLOWED_EXTENSIONS = Object.keys(EXTENSION_MIME_MAP);

const ENTITY_FIELDS = ["customer", "lead", "deal", "task", "meeting", "note"];

const ENTITY_FOLDERS = {
  customer: "customers",
  lead: "leads",
  deal: "deals",
  task: "tasks",
  meeting: "meetings",
  note: "notes",
};

const ensureUploadDirs = () => {
  const dirs = [UPLOAD_DIR, TMP_DIR, ...Object.values(ENTITY_FOLDERS)];

  for (const dir of dirs) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const getExtension = (filename) => path.extname(filename || "").toLowerCase();

const isAllowedExtension = (ext) => ALLOWED_EXTENSIONS.includes(ext);

const getExpectedMimeType = (ext) => EXTENSION_MIME_MAP[ext] || null;

const isAllowedFile = (file) => {
  const ext = getExtension(file.originalname);

  if (!isAllowedExtension(ext)) {
    return { allowed: false, error: "Unsupported file type" };
  }

  if (file.mimetype !== getExpectedMimeType(ext)) {
    return { allowed: false, error: "File type does not match its extension" };
  }

  return { allowed: true, error: null };
};

const generateSecureFileName = (originalName) => {
  const ext = getExtension(originalName);
  const randomName = crypto.randomBytes(16).toString("hex");

  return `${randomName}${ext}`;
};

const getEntityFolder = (entityField) => ENTITY_FOLDERS[entityField] || "misc";

const getAttachmentFolder = (attachment) => {
  const entityField = ENTITY_FIELDS.find((field) => attachment[field]);

  return getEntityFolder(entityField);
};

const getAttachmentFilePath = (attachment) => {
  const folder = getAttachmentFolder(attachment);

  return path.join(UPLOAD_DIR, folder, attachment.fileName);
};

const fileExists = async (filePath) => {
  try {
    await fsPromises.access(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
};

const deleteFileFromDisk = async (filePath) => {
  if (!filePath) {
    return;
  }

  if (!(await fileExists(filePath))) {
    return;
  }

  await fsPromises.unlink(filePath);
};

module.exports = {
  UPLOAD_DIR,
  TMP_DIR,
  ENTITY_FIELDS,
  ENTITY_FOLDERS,
  ALLOWED_EXTENSIONS,
  EXTENSION_MIME_MAP,
  ensureUploadDirs,
  getExtension,
  isAllowedExtension,
  getExpectedMimeType,
  isAllowedFile,
  generateSecureFileName,
  getEntityFolder,
  getAttachmentFolder,
  getAttachmentFilePath,
  fileExists,
  deleteFileFromDisk,
};
