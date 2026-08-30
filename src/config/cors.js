const getFrontendOrigins = () => {
  const raw = process.env.FRONTEND_URL;

  if (!raw || !raw.trim()) {
    return null;
  }

  const origins = raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return origins.length > 0 ? origins : null;
};

const getCorsOriginOption = () => {
  const origins = getFrontendOrigins();

  // Development: allow all origins
  if (!origins) {
    return true;
  }

  // Production: allow only configured frontend origins
  return origins;
};

const getSocketOriginOption = () => {
  const origins = getFrontendOrigins();

  return origins || "*";
};

module.exports = {
  getFrontendOrigins,
  getCorsOriginOption,
  getSocketOriginOption,
};