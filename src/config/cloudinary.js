const { v2: cloudinary } = require("cloudinary");

const CLOUD_NAME_KEY = "CLOUDINARY_CLOUD_NAME";
const API_KEY = "CLOUDINARY_API_KEY";
const API_SECRET = "CLOUDINARY_API_SECRET";

let configured = false;

// Credentials are read exclusively from the environment (Render env vars in
// production, .env locally). They are never hardcoded here and never logged.
const isCloudinaryConfigured = () =>
  Boolean(process.env[CLOUD_NAME_KEY] && process.env[API_KEY] && process.env[API_SECRET]);

/**
 * Configures the Cloudinary SDK once, lazily, and returns the client.
 * Lazy so importing this module never requires Cloudinary to be set up (other
 * flows do not use it); the first avatar upload is what demands the env vars.
 */
const configureCloudinary = () => {
  if (configured) {
    return cloudinary;
  }

  if (!isCloudinaryConfigured()) {
    const error = new Error(
      `Image storage is unavailable. Set ${CLOUD_NAME_KEY}, ${API_KEY} and ${API_SECRET}.`
    );
    error.status = 503;

    throw error;
  }

  cloudinary.config({
    cloud_name: process.env[CLOUD_NAME_KEY],
    api_key: process.env[API_KEY],
    api_secret: process.env[API_SECRET],
    secure: true,
  });

  configured = true;

  return cloudinary;
};

module.exports = { configureCloudinary, isCloudinaryConfigured };
