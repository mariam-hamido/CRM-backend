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

  if (!origins || origins.length === 0) {
    return true;
  }

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