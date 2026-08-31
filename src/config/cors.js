const getFrontendOrigins = () => {
  const raw = process.env.FRONTEND_URL;

  if (!raw || !raw.trim()) {
    return null;
  }

  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const getCorsOriginOption = () => {
  const origins = getFrontendOrigins();

  // Development: allow all origins
  if (!origins || origins.length === 0) {
    return true;
  }

  // Production: allow only the configured frontend origins
  return origins;
};

const getSocketOriginOption = () => {
  const origins = getFrontendOrigins();

  // Development: allow all origins
  return origins || "*";
};

module.exports = {
  getFrontendOrigins,
  getCorsOriginOption,
  getSocketOriginOption,
};