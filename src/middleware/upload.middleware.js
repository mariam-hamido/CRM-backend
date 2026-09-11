const fs = require("fs");
const path = require("path");
const multer = require("multer");
const {
  TMP_DIR,
  isAllowedFile,
  isAllowedAvatar,
  generateSecureFileName,
  ensureUploadDirs,
} = require("../utils/file.util");

ensureUploadDirs();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdirSync(TMP_DIR, { recursive: true });
    cb(null, TMP_DIR);
  },
  filename: (_req, file, cb) => {
    cb(null, generateSecureFileName(file.originalname));
  },
});

const fileFilter = (_req, file, cb) => {
  const { allowed, error } = isAllowedFile(file);

  if (!allowed) {
    cb(new Error(error));
    return;
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

// Restricted image-only uploader used for avatar/profile pictures. Shares the
// same tmp/storage pipeline as generic attachments; a separate filter + limit.
const avatarFileFilter = (_req, file, cb) => {
  const { allowed, error } = isAllowedAvatar(file);

  if (!allowed) {
    cb(new Error(error));
    return;
  }

  cb(null, true);
};

const uploadAvatar = multer({
  storage,
  fileFilter: avatarFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const handleUploadErrors = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File is too large. Please upload a smaller file",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error && error.message) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
};

module.exports = { upload, uploadAvatar, handleUploadErrors };
