const REQUIRED_ENV_KEYS = ["PORT", "MONGODB_URI", "JWT_SECRET"];

const validateEnvironment = () => {
  const missing = REQUIRED_ENV_KEYS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  const port = Number(process.env.PORT);

  if (Number.isNaN(port)) {
    throw new Error("PORT must be a valid number");
  }

  return {
    port,
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
  };
};

module.exports = validateEnvironment;
