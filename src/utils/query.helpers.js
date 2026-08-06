const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const paginate = (query, { defaultLimit = DEFAULT_LIMIT, maxLimit = MAX_LIMIT } = {}) => {
  const page = Math.max(parseInt(query.page, 10) || DEFAULT_PAGE, 1);
  const limit = Math.min(
    Math.max(parseInt(query.limit, 10) || defaultLimit, 1),
    maxLimit
  );

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const buildSearchFilter = (search, fields) => {
  if (!search || fields.length === 0) {
    return null;
  }

  const regex = new RegExp(escapeRegExp(search), "i");

  return {
    $or: fields.map((field) => ({ [field]: regex })),
  };
};

const buildSort = (sortBy, sortOrder, sortableFields = []) => {
  const field = sortableFields.includes(sortBy) ? sortBy : "createdAt";
  const order = sortOrder === "asc" ? 1 : -1;

  return { [field]: order };
};

module.exports = {
  paginate,
  buildSearchFilter,
  buildSort,
  escapeRegExp,
};
