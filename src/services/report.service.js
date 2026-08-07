const Customer = require("../models/Customer");
const Lead = require("../models/Lead");
const Deal = require("../models/Deal");
const Task = require("../models/Task");
const Meeting = require("../models/Meeting");

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const startOfWeek = (date) => {
  const d = startOfDay(date);
  const diffToMonday = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - diffToMonday);
  return d;
};

const endOfWeek = (date) => {
  const d = new Date(startOfWeek(date));
  d.setDate(d.getDate() + 7);
  return new Date(d.getTime() - 1);
};

const startOfMonth = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

const endOfMonth = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
};

const FILTER_OWNER_FIELDS = {
  customers: "owner",
  leads: "owner",
  deals: "owner",
  tasks: "assignedTo",
  meetings: "organizer",
};

const FILTER_DATE_FIELDS = {
  customers: "createdAt",
  leads: "createdAt",
  deals: "createdAt",
  tasks: "createdAt",
  meetings: "meetingDate",
};

const buildReportFilter = ({
  companyId,
  startDate,
  endDate,
  status,
  owner,
  pipelineStage,
  collection,
}) => {
  const filter = {
    company: companyId,
    isDeleted: false,
  };

  if (status) {
    filter.status = status;
  }

  const ownerField = FILTER_OWNER_FIELDS[collection];

  if (owner && ownerField) {
    filter[ownerField] = owner;
  }

  if (pipelineStage && collection === "deals") {
    filter.stage = pipelineStage;
  }

  const dateField = FILTER_DATE_FIELDS[collection];

  if (startDate || endDate) {
    filter[dateField] = {};

    if (startDate) {
      filter[dateField].$gte = new Date(startDate);
    }

    if (endDate) {
      filter[dateField].$lte = new Date(endDate);
    }
  }

  return filter;
};

const getCustomerReport = async (query, user) => {
  const base = buildReportFilter({
    ...query,
    companyId: user.company,
    collection: "customers",
  });

  const now = new Date();

  const createdThisMonth = {
    ...base,
    createdAt: { $gte: startOfMonth(now) },
  };

  const [total, active, inactive, createdThisMonthCount, topSources, growth] =
    await Promise.all([
      Customer.countDocuments(base),
      Customer.countDocuments({ ...base, status: "active" }),
      Customer.countDocuments({ ...base, status: "inactive" }),
      Customer.countDocuments(createdThisMonth),
      Customer.aggregate([
        { $match: base },
        {
          $group: {
            _id: "$source",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            source: "$_id",
            count: 1,
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      Customer.aggregate([
        { $match: base },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m",
                date: "$createdAt",
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            month: "$_id",
            count: 1,
          },
        },
        { $sort: { month: 1 } },
      ]),
    ]);

  return {
    total,
    active,
    inactive,
    createdThisMonth: createdThisMonthCount,
    topSources,
    growth,
  };
};

const getLeadReport = async (query, user) => {
  const base = buildReportFilter({
    ...query,
    companyId: user.company,
    collection: "leads",
  });

  const [total, qualified, contacted, converted, lost] = await Promise.all([
    Lead.countDocuments(base),
    Lead.countDocuments({ ...base, status: "qualified" }),
    Lead.countDocuments({ ...base, status: "contacted" }),
    Lead.countDocuments({ ...base, status: "converted" }),
    Lead.countDocuments({ ...base, status: "lost" }),
  ]);

  return {
    total,
    qualified,
    contacted,
    converted,
    lost,
    conversionPercentage: total > 0 ? (converted / total) * 100 : 0,
  };
};

const getDealReport = async (query, user) => {
  const base = buildReportFilter({
    ...query,
    companyId: user.company,
    collection: "deals",
  });

  const [total, won, lost, open, pipelineValueAgg, wonRevenueAgg, sizeAgg] =
    await Promise.all([
      Deal.countDocuments(base),
      Deal.countDocuments({ ...base, status: "won" }),
      Deal.countDocuments({ ...base, status: "lost" }),
      Deal.countDocuments({ ...base, status: "open" }),
      Deal.aggregate([
        { $match: { ...base, status: "open" } },
        {
          $group: {
            _id: null,
            total: { $sum: "$value" },
          },
        },
      ]),
      Deal.aggregate([
        { $match: { ...base, status: "won" } },
        {
          $group: {
            _id: null,
            total: { $sum: "$value" },
          },
        },
      ]),
      Deal.aggregate([
        { $match: base },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            total: { $sum: "$value" },
          },
        },
      ]),
    ]);

  const size = sizeAgg.length ? sizeAgg[0] : { count: 0, total: 0 };

  return {
    total,
    won,
    lost,
    open,
    totalPipelineValue: pipelineValueAgg.length
      ? pipelineValueAgg[0].total
      : 0,
    wonRevenue: wonRevenueAgg.length ? wonRevenueAgg[0].total : 0,
    averageDealSize: size.count > 0 ? size.total / size.count : 0,
  };
};

const getTaskReport = async (query, user) => {
  const base = buildReportFilter({
    ...query,
    companyId: user.company,
    collection: "tasks",
  });

  const now = new Date();

  const [total, completed, pending, overdue] = await Promise.all([
    Task.countDocuments(base),
    Task.countDocuments({ ...base, status: "completed" }),
    Task.countDocuments({
      ...base,
      status: { $in: ["pending", "in_progress"] },
      dueDate: { $gte: now },
    }),
    Task.countDocuments({
      ...base,
      status: { $in: ["pending", "in_progress"] },
      dueDate: { $lt: now },
    }),
  ]);

  return {
    total,
    completed,
    pending,
    overdue,
    completionPercentage: total > 0 ? (completed / total) * 100 : 0,
  };
};

const getMeetingReport = async (query, user) => {
  const companyId = user.company;
  const now = new Date();

  const organizerFilter = query.owner ? { organizer: query.owner } : {};

  const meetingDateRange = {};

  if (query.startDate) {
    meetingDateRange.$gte = new Date(query.startDate);
  }

  if (query.endDate) {
    meetingDateRange.$lte = new Date(query.endDate);
  }

  const closedBase = {
    company: companyId,
    isDeleted: false,
    ...organizerFilter,
  };

  if (query.startDate || query.endDate) {
    closedBase.meetingDate = meetingDateRange;
  }

  const [today, week, month, completed, cancelled] = await Promise.all([
    Meeting.countDocuments({
      company: companyId,
      isDeleted: false,
      status: "scheduled",
      ...organizerFilter,
      meetingDate: { $gte: startOfDay(now), $lte: endOfDay(now) },
    }),
    Meeting.countDocuments({
      company: companyId,
      isDeleted: false,
      status: "scheduled",
      ...organizerFilter,
      meetingDate: { $gte: startOfWeek(now), $lte: endOfWeek(now) },
    }),
    Meeting.countDocuments({
      company: companyId,
      isDeleted: false,
      status: "scheduled",
      ...organizerFilter,
      meetingDate: { $gte: startOfMonth(now), $lte: endOfMonth(now) },
    }),
    Meeting.countDocuments({ ...closedBase, status: "completed" }),
    Meeting.countDocuments({ ...closedBase, status: "cancelled" }),
  ]);

  return {
    today,
    week,
    month,
    completed,
    cancelled,
  };
};

const escapeCSV = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  const str = value instanceof Date ? value.toISOString() : String(value);

  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
};

const toCSVRow = (values) => values.map(escapeCSV).join(",") + "\n";

const writeCSVRow = (res, values) => {
  if (res.write(toCSVRow(values))) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    res.once("drain", resolve);
    res.once("close", resolve);
  });
};

const EXPORT_DEFINITIONS = {
  customers: {
    model: Customer,
    filename: "customers.csv",
    select: [
      "companyName",
      "industry",
      "website",
      "email",
      "phone",
      "country",
      "city",
      "status",
      "source",
      "annualRevenue",
      "employeesCount",
      "createdAt",
    ].join(" "),
    headers: [
      { label: "Company Name", get: (doc) => doc.companyName },
      { label: "Industry", get: (doc) => doc.industry },
      { label: "Website", get: (doc) => doc.website },
      { label: "Email", get: (doc) => doc.email },
      { label: "Phone", get: (doc) => doc.phone },
      { label: "Country", get: (doc) => doc.country },
      { label: "City", get: (doc) => doc.city },
      { label: "Status", get: (doc) => doc.status },
      { label: "Source", get: (doc) => doc.source },
      { label: "Annual Revenue", get: (doc) => doc.annualRevenue },
      { label: "Employees", get: (doc) => doc.employeesCount },
      { label: "Created At", get: (doc) => doc.createdAt },
    ],
  },
  leads: {
    model: Lead,
    filename: "leads.csv",
    select: [
      "firstName",
      "lastName",
      "email",
      "phone",
      "companyName",
      "status",
      "source",
      "score",
      "estimatedValue",
      "convertedAt",
      "createdAt",
    ].join(" "),
    headers: [
      { label: "First Name", get: (doc) => doc.firstName },
      { label: "Last Name", get: (doc) => doc.lastName },
      { label: "Email", get: (doc) => doc.email },
      { label: "Phone", get: (doc) => doc.phone },
      { label: "Company", get: (doc) => doc.companyName },
      { label: "Status", get: (doc) => doc.status },
      { label: "Source", get: (doc) => doc.source },
      { label: "Score", get: (doc) => doc.score },
      { label: "Estimated Value", get: (doc) => doc.estimatedValue },
      { label: "Converted At", get: (doc) => doc.convertedAt },
      { label: "Created At", get: (doc) => doc.createdAt },
    ],
  },
  deals: {
    model: Deal,
    filename: "deals.csv",
    select: [
      "title",
      "value",
      "probability",
      "status",
      "stage",
      "customer",
      "owner",
      "expectedCloseDate",
      "actualCloseDate",
      "lostReason",
      "description",
      "createdAt",
    ].join(" "),
    populate: [
      { path: "stage", select: "name" },
      { path: "customer", select: "companyName" },
      { path: "owner", select: "firstName lastName" },
    ],
    headers: [
      { label: "Title", get: (doc) => doc.title },
      { label: "Value", get: (doc) => doc.value },
      { label: "Probability", get: (doc) => doc.probability },
      { label: "Status", get: (doc) => doc.status },
      { label: "Stage", get: (doc) => (doc.stage ? doc.stage.name : "") },
      { label: "Customer", get: (doc) => (doc.customer ? doc.customer.companyName : "") },
      {
        label: "Owner",
        get: (doc) =>
          doc.owner
            ? `${doc.owner.firstName || ""} ${doc.owner.lastName || ""}`.trim()
            : "",
      },
      { label: "Expected Close Date", get: (doc) => doc.expectedCloseDate },
      { label: "Actual Close Date", get: (doc) => doc.actualCloseDate },
      { label: "Lost Reason", get: (doc) => doc.lostReason },
      { label: "Description", get: (doc) => doc.description },
      { label: "Created At", get: (doc) => doc.createdAt },
    ],
  },
  tasks: {
    model: Task,
    filename: "tasks.csv",
    select: [
      "title",
      "description",
      "status",
      "priority",
      "dueDate",
      "reminderDate",
      "completedAt",
      "assignedTo",
      "createdAt",
    ].join(" "),
    populate: [{ path: "assignedTo", select: "firstName lastName" }],
    headers: [
      { label: "Title", get: (doc) => doc.title },
      { label: "Description", get: (doc) => doc.description },
      { label: "Status", get: (doc) => doc.status },
      { label: "Priority", get: (doc) => doc.priority },
      { label: "Due Date", get: (doc) => doc.dueDate },
      { label: "Reminder Date", get: (doc) => doc.reminderDate },
      { label: "Completed At", get: (doc) => doc.completedAt },
      {
        label: "Assigned To",
        get: (doc) =>
          doc.assignedTo
            ? `${doc.assignedTo.firstName || ""} ${doc.assignedTo.lastName || ""}`.trim()
            : "",
      },
      { label: "Created At", get: (doc) => doc.createdAt },
    ],
  },
  meetings: {
    model: Meeting,
    filename: "meetings.csv",
    select: [
      "title",
      "meetingDate",
      "duration",
      "meetingType",
      "location",
      "meetingLink",
      "status",
      "notes",
      "organizer",
      "createdAt",
    ].join(" "),
    populate: [{ path: "organizer", select: "firstName lastName" }],
    headers: [
      { label: "Title", get: (doc) => doc.title },
      { label: "Meeting Date", get: (doc) => doc.meetingDate },
      { label: "Duration (Minutes)", get: (doc) => doc.duration },
      { label: "Type", get: (doc) => doc.meetingType },
      { label: "Location", get: (doc) => doc.location },
      { label: "Meeting Link", get: (doc) => doc.meetingLink },
      { label: "Status", get: (doc) => doc.status },
      { label: "Notes", get: (doc) => doc.notes },
      {
        label: "Organizer",
        get: (doc) =>
          doc.organizer
            ? `${doc.organizer.firstName || ""} ${doc.organizer.lastName || ""}`.trim()
            : "",
      },
      { label: "Created At", get: (doc) => doc.createdAt },
    ],
  },
};

const exportCollection = async (collection, query, user, res) => {
  const config = EXPORT_DEFINITIONS[collection];

  const filter = buildReportFilter({
    ...query,
    companyId: user.company,
    collection,
  });

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${config.filename}"`
  );

  res.write("\uFEFF");
  await writeCSVRow(res, config.headers.map((header) => header.label));

  const cursor = config.model
    .find(filter)
    .select(config.select)
    .populate(config.populate || [])
    .sort({ createdAt: -1 })
    .lean()
    .cursor();

  try {
    for await (const doc of cursor) {
      await writeCSVRow(res, config.headers.map((header) => header.get(doc)));
    }
  } finally {
    if (!res.destroyed && !res.writableEnded) {
      res.end();
    }
  }
};

module.exports = {
  getCustomerReport,
  getLeadReport,
  getDealReport,
  getTaskReport,
  getMeetingReport,
  exportCollection,
};
