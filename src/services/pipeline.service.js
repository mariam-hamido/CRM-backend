const mongoose = require("mongoose");
const Pipeline = require("../models/Pipeline");
const PipelineStage = require("../models/PipelineStage");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const SORTABLE_FIELDS = ["createdAt", "updatedAt", "name"];

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const assertValidPipelineId = (pipelineId) => {
  if (!mongoose.Types.ObjectId.isValid(pipelineId)) {
    const error = new Error("Pipeline not found");
    error.status = 404;
    throw error;
  }
};

const assertUniquePipelineName = async ({ company, name, excludeId }) => {
  const excludeFilter = excludeId ? { _id: { $ne: excludeId } } : {};

  const existing = await Pipeline.findOne({
    company,
    name,
    isDeleted: false,
    ...excludeFilter,
  });

  if (existing) {
    const error = new Error(
      "A pipeline with this name already exists in this company"
    );
    error.status = 409;
    throw error;
  }
};

const clearDefaultPipeline = async (companyId) => {
  await Pipeline.updateMany(
    { company: companyId, isDefault: true },
    { $set: { isDefault: false } }
  );
};

const buildSort = (sortBy, sortOrder) => {
  const field = SORTABLE_FIELDS.includes(sortBy) ? sortBy : "createdAt";
  const order = sortOrder === "asc" ? 1 : -1;

  return { [field]: order };
};

const createPipeline = async (pipelineData, user) => {
  const { name, isDefault } = pipelineData;

  await assertUniquePipelineName({ company: user.company, name });

  if (isDefault) {
    await clearDefaultPipeline(user.company);
  }

  const pipeline = await Pipeline.create({
    ...pipelineData,
    company: user.company,
  });

  return pipeline;
};

const getPipelines = async (query, user) => {
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
    filter.$or = [{ name: regex }, { description: regex }];
  }

  if (query.isDefault !== undefined) {
    filter.isDefault = query.isDefault === "true";
  }

  const sort = buildSort(query.sortBy, query.sortOrder);

  const [pipelines, total] = await Promise.all([
    Pipeline.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Pipeline.countDocuments(filter),
  ]);

  return {
    pipelines,
    pagination: {
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    },
  };
};

const getPipelineById = async (pipelineId, user) => {
  assertValidPipelineId(pipelineId);

  const pipeline = await Pipeline.findOne({
    _id: pipelineId,
    company: user.company,
    isDeleted: false,
  });

  if (!pipeline) {
    const error = new Error("Pipeline not found");
    error.status = 404;
    throw error;
  }

  return pipeline;
};

const updatePipeline = async (pipelineId, updateData, user) => {
  const pipeline = await getPipelineById(pipelineId, user);

  const { company, ...editableFields } = updateData;

  if (company) {
    throw new Error("You cannot change the company of a pipeline");
  }

  if (editableFields.name && editableFields.name !== pipeline.name) {
    await assertUniquePipelineName({
      company: user.company,
      name: editableFields.name,
      excludeId: pipelineId,
    });
  }

  if (editableFields.isDefault === true) {
    await clearDefaultPipeline(user.company);
  }

  pipeline.set(editableFields);
  await pipeline.save();

  return pipeline;
};

const deletePipeline = async (pipelineId, user) => {
  const pipeline = await getPipelineById(pipelineId, user);

  pipeline.isDeleted = true;
  await pipeline.save();

  await PipelineStage.updateMany(
    { pipeline: pipelineId, company: user.company },
    { $set: { isDeleted: true } }
  );

  return pipeline;
};

module.exports = {
  createPipeline,
  getPipelines,
  getPipelineById,
  updatePipeline,
  deletePipeline,
};
