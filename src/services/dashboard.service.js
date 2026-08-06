const Customer = require("../models/Customer");
const Lead = require("../models/Lead");
const Deal = require("../models/Deal");
const Task = require("../models/Task");
const Meeting = require("../models/Meeting");
const Activity = require("../models/Activity");
const PipelineStage = require("../models/PipelineStage");

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

const getOverview = async (companyId) => {
  const now = new Date();

  const [
    totalCustomers,
    totalLeads,
    totalDeals,
    openDealAggregation,
    wonDeals,
    lostDeals,
    activeTasks,
    overdueTasks,
    upcomingMeetings,
  ] = await Promise.all([
    Customer.countDocuments({ company: companyId, isDeleted: false }),
    Lead.countDocuments({ company: companyId, isDeleted: false }),
    Deal.countDocuments({ company: companyId, isDeleted: false }),
    Deal.aggregate([
      {
        $match: {
          company: companyId,
          isDeleted: false,
          status: "open",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$value" },
        },
      },
    ]),
    Deal.countDocuments({
      company: companyId,
      isDeleted: false,
      status: "won",
    }),
    Deal.countDocuments({
      company: companyId,
      isDeleted: false,
      status: "lost",
    }),
    Task.countDocuments({
      company: companyId,
      isDeleted: false,
      status: { $in: ["pending", "in_progress", "overdue"] },
    }),
    Task.countDocuments({
      company: companyId,
      isDeleted: false,
      status: { $in: ["pending", "in_progress"] },
      dueDate: { $lt: now },
    }),
    Meeting.countDocuments({
      company: companyId,
      isDeleted: false,
      status: "scheduled",
      meetingDate: { $gt: now },
    }),
  ]);

  return {
    totalCustomers,
    totalLeads,
    totalDeals,
    totalPipelineValue: openDealAggregation.length
      ? openDealAggregation[0].total
      : 0,
    wonDeals,
    lostDeals,
    activeTasks,
    overdueTasks,
    upcomingMeetings,
  };
};

const getPipelineStats = async (companyId, { pipelineId } = {}) => {
  const match = {
    company: companyId,
    isDeleted: false,
    status: "open",
  };

  if (pipelineId) {
    match.pipeline = pipelineId;
  }

  const stages = await Deal.aggregate([
    { $match: match },
    {
      $lookup: {
        from: PipelineStage.collection.name,
        localField: "stage",
        foreignField: "_id",
        as: "stageDoc",
      },
    },
    { $unwind: "$stageDoc" },
    {
      $group: {
        _id: "$stageDoc.name",
        order: { $first: "$stageDoc.order" },
        count: { $sum: 1 },
        value: { $sum: "$value" },
      },
    },
    {
      $project: {
        _id: 0,
        stage: "$_id",
        order: 1,
        count: 1,
        value: 1,
      },
    },
    { $sort: { order: 1 } },
  ]);

  return stages;
};

const getSalesStats = async (companyId, { from, to } = {}) => {
  const now = new Date();

  const range = {
    from: from ? new Date(from) : startOfMonth(now),
    to: to ? new Date(to) : now,
  };

  const dealAggregation = await Deal.aggregate([
    {
      $match: {
        company: companyId,
        isDeleted: false,
        status: { $in: ["won", "lost"] },
      },
    },
    {
      $addFields: {
        closedDate: { $ifNull: ["$actualCloseDate", "$updatedAt"] },
      },
    },
    {
      $match: {
        closedDate: { $gte: range.from, $lte: range.to },
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        value: { $sum: "$value" },
      },
    },
  ]);

  const won = dealAggregation.find((item) => item._id === "won");
  const lost = dealAggregation.find((item) => item._id === "lost");

  const wonDeals = won ? won.count : 0;
  const lostDeals = lost ? lost.count : 0;
  const monthlyRevenue = won ? won.value : 0;
  const closedDeals = wonDeals + lostDeals;

  return {
    monthlyRevenue,
    wonDeals,
    lostDeals,
    conversionRate: closedDeals > 0 ? (wonDeals / closedDeals) * 100 : 0,
    period: {
      from: range.from,
      to: range.to,
    },
  };
};

const getTaskStats = async (companyId, { assignedTo } = {}) => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const baseFilter = {
    company: companyId,
    isDeleted: false,
  };

  if (assignedTo) {
    baseFilter.assignedTo = assignedTo;
  }

  const [completed, pending, overdue, dueToday] = await Promise.all([
    Task.countDocuments({ ...baseFilter, status: "completed" }),
    Task.countDocuments({
      ...baseFilter,
      status: { $in: ["pending", "in_progress"] },
      dueDate: { $gte: now },
    }),
    Task.countDocuments({
      ...baseFilter,
      status: { $in: ["pending", "in_progress"] },
      dueDate: { $lt: now },
    }),
    Task.countDocuments({
      ...baseFilter,
      status: { $in: ["pending", "in_progress"] },
      dueDate: { $gte: todayStart, $lte: todayEnd },
    }),
  ]);

  return {
    completed,
    pending,
    overdue,
    dueToday,
  };
};

const getMeetingStats = async (companyId, { organizer } = {}) => {
  const now = new Date();

  const baseFilter = {
    company: companyId,
    isDeleted: false,
    status: "scheduled",
  };

  if (organizer) {
    baseFilter.organizer = organizer;
  }

  const [today, week, month] = await Promise.all([
    Meeting.countDocuments({
      ...baseFilter,
      meetingDate: { $gte: startOfDay(now), $lte: endOfDay(now) },
    }),
    Meeting.countDocuments({
      ...baseFilter,
      meetingDate: { $gte: startOfWeek(now), $lte: endOfWeek(now) },
    }),
    Meeting.countDocuments({
      ...baseFilter,
      meetingDate: { $gte: startOfMonth(now), $lte: endOfMonth(now) },
    }),
  ]);

  return {
    today,
    week,
    month,
  };
};

const getRecentActivities = async (companyId) => {
  return Activity.find({ company: companyId })
    .sort({ createdAt: -1 })
    .limit(10);
};

module.exports = {
  getOverview,
  getPipelineStats,
  getSalesStats,
  getTaskStats,
  getMeetingStats,
  getRecentActivities,
};
