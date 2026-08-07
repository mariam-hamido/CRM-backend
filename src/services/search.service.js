const Customer = require("../models/Customer");
const Lead = require("../models/Lead");
const Deal = require("../models/Deal");
const Task = require("../models/Task");
const Meeting = require("../models/Meeting");
const Note = require("../models/Note");
const { escapeRegExp } = require("../utils/query.helpers");

const SEARCH_RESULT_LIMIT = 10;

const SEARCH_TARGETS = [
  {
    key: "customers",
    model: Customer,
    fields: ["companyName", "email", "phone"],
    select: "companyName email phone country city status",
  },
  {
    key: "leads",
    model: Lead,
    fields: [["firstName", "lastName"], "email", "phone", "companyName"],
    select: "firstName lastName email phone companyName status source",
  },
  {
    key: "deals",
    model: Deal,
    fields: ["title", "description"],
    select: "title description value status stage",
  },
  {
    key: "tasks",
    model: Task,
    fields: ["title", "description"],
    select: "title description status priority dueDate assignedTo",
  },
  {
    key: "meetings",
    model: Meeting,
    fields: ["title", "description"],
    select: "title description meetingDate status meetingType",
  },
  {
    key: "notes",
    model: Note,
    fields: ["content"],
    select: "content isPinned createdAt updatedAt",
  },
];

const buildRegex = (term) => new RegExp(escapeRegExp(term), "i");

const buildRegexFilter = (companyId, fields, regex) => {
  const orClauses = fields.map((field) => {
    if (Array.isArray(field)) {
      return {
        $or: field.map((subField) => ({ [subField]: regex })),
      };
    }

    return { [field]: regex };
  });

  return {
    company: companyId,
    isDeleted: false,
    $or: orClauses,
  };
};

const search = async (q, user) => {
  const term = q.trim();
  const regex = buildRegex(term);
  const companyId = user.company;

  const results = await Promise.all(
    SEARCH_TARGETS.map(({ model, fields, select }) =>
      model
        .find(buildRegexFilter(companyId, fields, regex))
        .select(select)
        .sort({ createdAt: -1 })
        .limit(SEARCH_RESULT_LIMIT)
    )
  );

  return SEARCH_TARGETS.reduce((grouped, target, index) => {
    grouped[target.key] = results[index];
    return grouped;
  }, {});
};

module.exports = { search };
