const mongoose = require("mongoose");
const Pipeline = require("../models/Pipeline");
const PipelineStage = require("../models/PipelineStage");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const assertValidStageId = (stageId) => {
  if (!mongoose.Types.ObjectId.isValid(stageId)) {
    const error = new Error("Stage not found");
    error.status = 404;
    throw error;
  }
};

const assertPipelineOwnership = async (pipelineId, companyId) => {
  if (!mongoose.Types.ObjectId.isValid(pipelineId)) {
    const error = new Error("Pipeline not found");
    error.status = 404;
    throw error;
  }

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

const resolveProbability = ({ isWonStage, isLostStage, probability }) => {
  if (isWonStage && isLostStage) {
    throw new Error("A stage cannot be both a won and lost stage");
  }

  let resolvedProbability = probability;

  if (isWonStage) {
    resolvedProbability = 100;
  } else if (isLostStage) {
    resolvedProbability = 0;
  }

  if (
    resolvedProbability !== undefined &&
    (resolvedProbability < 0 || resolvedProbability > 100)
  ) {
    throw new Error("Probability must be between 0 and 100");
  }

  return resolvedProbability;
};

const assertUniqueOutcomeStages = async ({
  pipeline,
  company,
  isWonStage,
  isLostStage,
  excludeId,
}) => {
  const excludeFilter = excludeId ? { _id: { $ne: excludeId } } : {};

  if (isWonStage) {
    const wonStageExists = await PipelineStage.findOne({
      pipeline,
      company,
      isWonStage: true,
      isDeleted: false,
      ...excludeFilter,
    });

    if (wonStageExists) {
      const error = new Error("A Won stage already exists for this pipeline");
      error.status = 409;
      throw error;
    }
  }

  if (isLostStage) {
    const lostStageExists = await PipelineStage.findOne({
      pipeline,
      company,
      isLostStage: true,
      isDeleted: false,
      ...excludeFilter,
    });

    if (lostStageExists) {
      const error = new Error("A Lost stage already exists for this pipeline");
      error.status = 409;
      throw error;
    }
  }
};

const createStage = async (stageData, user) => {
  const { pipeline, order, isWonStage, isLostStage, probability } = stageData;

  await assertPipelineOwnership(pipeline, user.company);

  const resolvedProbability = resolveProbability({
    isWonStage,
    isLostStage,
    probability,
  });

  await assertUniqueOutcomeStages({
    pipeline,
    company: user.company,
    isWonStage,
    isLostStage,
  });

  let newOrder = order;

  if (newOrder === undefined) {
    const lastStage = await PipelineStage.findOne({
      pipeline,
      company: user.company,
      isDeleted: false,
    }).sort({ order: -1 });

    newOrder = lastStage ? lastStage.order + 1 : 1;
  }

  if (newOrder < 1) {
    throw new Error("Stage order must be at least 1");
  }

  await PipelineStage.updateMany(
    {
      pipeline,
      company: user.company,
      isDeleted: false,
      order: { $gte: newOrder },
    },
    { $inc: { order: 1 } }
  );

  const stage = await PipelineStage.create({
    ...stageData,
    company: user.company,
    order: newOrder,
    probability: resolvedProbability,
  });

  return stage;
};

const getStages = async (query, user) => {
  const page = Math.max(parseInt(query.page, 10) || DEFAULT_PAGE, 1);
  const limit = Math.min(
    Math.max(parseInt(query.limit, 10) || DEFAULT_LIMIT, 1),
    MAX_LIMIT
  );

  const filter = {
    company: user.company,
    isDeleted: false,
  };

  if (query.pipeline) {
    filter.pipeline = query.pipeline;
  }

  const [stages, total] = await Promise.all([
    PipelineStage.find(filter)
      .sort({ order: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    PipelineStage.countDocuments(filter),
  ]);

  return {
    stages,
    pagination: {
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    },
  };
};

const getPipelineStages = async (pipelineId, user) => {
  await assertPipelineOwnership(pipelineId, user.company);

  const stages = await PipelineStage.find({
    pipeline: pipelineId,
    company: user.company,
    isDeleted: false,
  }).sort({ order: 1 });

  return { stages };
};

const getStageById = async (stageId, user) => {
  assertValidStageId(stageId);

  const stage = await PipelineStage.findOne({
    _id: stageId,
    company: user.company,
    isDeleted: false,
  });

  if (!stage) {
    const error = new Error("Stage not found");
    error.status = 404;
    throw error;
  }

  return stage;
};

const updateStage = async (stageId, updateData, user) => {
  const stage = await getStageById(stageId, user);

  const { pipeline, company, ...editableFields } = updateData;

  if (pipeline || company) {
    throw new Error("You cannot change the pipeline or company of a stage");
  }

  const isWonStage =
    editableFields.isWonStage !== undefined
      ? editableFields.isWonStage
      : stage.isWonStage;

  const isLostStage =
    editableFields.isLostStage !== undefined
      ? editableFields.isLostStage
      : stage.isLostStage;

  const resolvedProbability = resolveProbability({
    isWonStage,
    isLostStage,
    probability: editableFields.probability,
  });

  if (resolvedProbability !== undefined) {
    editableFields.probability = resolvedProbability;
  }

  await assertUniqueOutcomeStages({
    pipeline: stage.pipeline,
    company: user.company,
    isWonStage,
    isLostStage,
    excludeId: stageId,
  });

  const newOrder = editableFields.order;

  if (newOrder !== undefined && newOrder !== stage.order) {
    if (newOrder < 1) {
      throw new Error("Stage order must be at least 1");
    }

    const oldOrder = stage.order;

    if (newOrder > oldOrder) {
      await PipelineStage.updateMany(
        {
          pipeline: stage.pipeline,
          company: user.company,
          isDeleted: false,
          order: { $gt: oldOrder, $lte: newOrder },
        },
        { $inc: { order: -1 } }
      );
    } else {
      await PipelineStage.updateMany(
        {
          pipeline: stage.pipeline,
          company: user.company,
          isDeleted: false,
          order: { $gte: newOrder, $lt: oldOrder },
        },
        { $inc: { order: 1 } }
      );
    }
  }

  stage.set(editableFields);
  await stage.save();

  return stage;
};

const deleteStage = async (stageId, user) => {
  const stage = await getStageById(stageId, user);

  stage.isDeleted = true;
  await stage.save();

  await PipelineStage.updateMany(
    {
      pipeline: stage.pipeline,
      company: user.company,
      isDeleted: false,
      order: { $gt: stage.order },
    },
    { $inc: { order: -1 } }
  );

  return stage;
};

module.exports = {
  createStage,
  getStages,
  getPipelineStages,
  getStageById,
  updateStage,
  deleteStage,
};
