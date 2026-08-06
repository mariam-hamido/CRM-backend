const mongoose = require("mongoose");
const Deal = require("../models/Deal");
const Customer = require("../models/Customer");
const Pipeline = require("../models/Pipeline");
const PipelineStage = require("../models/PipelineStage");
const User = require("../models/User");
const Activity = require("../models/Activity");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const SORTABLE_FIELDS = [
  "createdAt",
  "updatedAt",
  "title",
  "value",
  "probability",
  "expectedCloseDate",
];

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const assertValidObjectId = (id, notFoundMessage) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(notFoundMessage);
    error.status = 404;
    throw error;
  }
};

const assertCustomerOwnership = async (customerId, companyId) => {
  assertValidObjectId(customerId, "Customer not found");

  const customer = await Customer.findOne({
    _id: customerId,
    company: companyId,
    isDeleted: false,
  });

  if (!customer) {
    const error = new Error("Customer not found");
    error.status = 404;
    throw error;
  }

  return customer;
};

const assertPipelineOwnership = async (pipelineId, companyId) => {
  assertValidObjectId(pipelineId, "Pipeline not found");

  const pipeline = await Pipeline.findOne({
    _id: pipelineId,
    company: companyId,
    isDeleted: false,
  });

  if (!pipeline) {
    const error = new Error("Pipeline not found");
    error.status = 404;
    throw error;
  }

  return pipeline;
};

const assertStageBelongsToPipeline = async (stageId, pipelineId, companyId) => {
  assertValidObjectId(stageId, "Stage not found");

  const stage = await PipelineStage.findOne({
    _id: stageId,
    pipeline: pipelineId,
    company: companyId,
    isDeleted: false,
  });

  if (!stage) {
    const error = new Error("Stage not found");
    error.status = 404;
    throw error;
  }

  return stage;
};

const logActivity = async ({
  company,
  user,
  entityId,
  action,
  description,
  oldValues,
  newValues,
}) => {
  await Activity.create({
    company,
    user,
    entityType: "deal",
    entityId,
    action,
    description,
    oldValues,
    newValues,
  });
};

const buildSort = (sortBy, sortOrder) => {
  const field = SORTABLE_FIELDS.includes(sortBy) ? sortBy : "createdAt";
  const order = sortOrder === "asc" ? 1 : -1;

  return { [field]: order };
};

const createDeal = async (dealData, user) => {
  const { customer, pipeline, stage, value } = dealData;

  await assertCustomerOwnership(customer, user.company);
  await assertPipelineOwnership(pipeline, user.company);
  const stageDoc = await assertStageBelongsToPipeline(
    stage,
    pipeline,
    user.company
  );

  if (value !== undefined && value < 0) {
    throw new Error("Deal value must not be negative");
  }

  const deal = await Deal.create({
    ...dealData,
    company: user.company,
    owner: user._id,
    probability: stageDoc.probability,
  });

  return deal;
};

const getDeals = async (query, user) => {
  const page = Math.max(parseInt(query.page, 10) || DEFAULT_PAGE, 1);
  const limit = Math.min(
    Math.max(parseInt(query.limit, 10) || DEFAULT_LIMIT, 1),
    MAX_LIMIT
  );

  const filter = {
    company: user.company,
    isDeleted: false,
  };

  if (query.search) {
    const regex = new RegExp(escapeRegExp(query.search), "i");
    filter.$or = [{ title: regex }];

    if (mongoose.Types.ObjectId.isValid(query.search)) {
      filter.$or.push({ customer: query.search });
    }
  }

  if (query.stage) {
    filter.stage = query.stage;
  }

  if (query.pipeline) {
    filter.pipeline = query.pipeline;
  }

  if (query.owner) {
    filter.owner = query.owner;
  }

  if (query.status) {
    filter.status = query.status;
  }

  const sort = buildSort(query.sortBy, query.sortOrder);

  const [deals, total] = await Promise.all([
    Deal.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Deal.countDocuments(filter),
  ]);

  return {
    deals,
    pagination: {
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    },
  };
};

const getDealById = async (dealId, user) => {
  assertValidObjectId(dealId, "Deal not found");

  const deal = await Deal.findOne({
    _id: dealId,
    company: user.company,
    isDeleted: false,
  });

  if (!deal) {
    const error = new Error("Deal not found");
    error.status = 404;
    throw error;
  }

  return deal;
};

const updateDeal = async (dealId, updateData, user) => {
  const deal = await getDealById(dealId, user);

  const { company, customer, ...editableFields } = updateData;

  if (company || customer) {
    throw new Error("You cannot change the company or customer of a deal");
  }

  if (editableFields.owner) {
    const ownerExists = await User.findOne({
      _id: editableFields.owner,
      company: user.company,
    });

    if (!ownerExists) {
      const error = new Error("Owner not found");
      error.status = 404;
      throw error;
    }
  }

  if (editableFields.pipeline || editableFields.stage) {
    const targetPipelineId = editableFields.pipeline || deal.pipeline;

    await assertPipelineOwnership(targetPipelineId, user.company);

    let targetStageId = editableFields.stage;

    if (editableFields.pipeline && !editableFields.stage) {
      const firstStage = await PipelineStage.findOne({
        pipeline: targetPipelineId,
        company: user.company,
        isDeleted: false,
      }).sort({ order: 1 });

      targetStageId = firstStage ? firstStage._id : null;

      if (!targetStageId) {
        throw new Error("The target pipeline has no stages");
      }
    }

    const stageDoc = await assertStageBelongsToPipeline(
      targetStageId,
      targetPipelineId,
      user.company
    );

    editableFields.stage = stageDoc._id;
    editableFields.probability = stageDoc.probability;
  }

  if (editableFields.value !== undefined && editableFields.value < 0) {
    throw new Error("Deal value must not be negative");
  }

  deal.set(editableFields);
  await deal.save();

  return deal;
};

const moveStage = async (dealId, { stageId }, user) => {
  const deal = await getDealById(dealId, user);

  const stageDoc = await assertStageBelongsToPipeline(
    stageId,
    deal.pipeline,
    user.company
  );

  const oldStageId = deal.stage;
  const oldProbability = deal.probability;

  deal.stage = stageDoc._id;
  deal.probability = stageDoc.probability;
  await deal.save();

  await logActivity({
    company: user.company,
    user: user._id,
    entityId: dealId,
    action: "move_stage",
    description: `Deal moved to stage: ${stageDoc.name}`,
    oldValues: { stage: oldStageId, probability: oldProbability },
    newValues: { stage: stageDoc._id, probability: stageDoc.probability },
  });

  return deal;
};

const markWon = async (dealId, user) => {
  const deal = await getDealById(dealId, user);

  deal.status = "won";
  deal.actualCloseDate = new Date();
  deal.probability = 100;
  deal.lostReason = null;

  const wonStage = await PipelineStage.findOne({
    pipeline: deal.pipeline,
    company: user.company,
    isWonStage: true,
    isDeleted: false,
  });

  if (wonStage) {
    deal.stage = wonStage._id;
  }

  await deal.save();

  await logActivity({
    company: user.company,
    user: user._id,
    entityId: dealId,
    action: "update",
    description: "Deal marked as won",
    oldValues: { status: "open" },
    newValues: { status: "won", actualCloseDate: deal.actualCloseDate },
  });

  return deal;
};

const markLost = async (dealId, { lostReason }, user) => {
  const deal = await getDealById(dealId, user);

  deal.status = "lost";
  deal.actualCloseDate = new Date();
  deal.probability = 0;

  if (lostReason) {
    deal.lostReason = lostReason;
  }

  const lostStage = await PipelineStage.findOne({
    pipeline: deal.pipeline,
    company: user.company,
    isLostStage: true,
    isDeleted: false,
  });

  if (lostStage) {
    deal.stage = lostStage._id;
  }

  await deal.save();

  await logActivity({
    company: user.company,
    user: user._id,
    entityId: dealId,
    action: "update",
    description: "Deal marked as lost",
    oldValues: { status: "open" },
    newValues: { status: "lost", actualCloseDate: deal.actualCloseDate },
  });

  return deal;
};

const deleteDeal = async (dealId, user) => {
  const deal = await getDealById(dealId, user);

  deal.isDeleted = true;
  await deal.save();

  return deal;
};

module.exports = {
  createDeal,
  getDeals,
  getDealById,
  updateDeal,
  moveStage,
  markWon,
  markLost,
  deleteDeal,
};
