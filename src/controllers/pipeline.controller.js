const pipelineService = require("../services/pipeline.service");

const createPipeline = async (req, res) => {
  try {
    const pipeline = await pipelineService.createPipeline(req.body, req.user);

    res.status(201).json({
      success: true,
      message: "Pipeline created successfully",
      data: pipeline,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getPipelines = async (req, res) => {
  try {
    const result = await pipelineService.getPipelines(req.query, req.user);

    res.status(200).json({
      success: true,
      message: "Pipelines fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getPipeline = async (req, res) => {
  try {
    const pipeline = await pipelineService.getPipelineById(
      req.params.id,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Pipeline fetched successfully",
      data: pipeline,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePipeline = async (req, res) => {
  try {
    const pipeline = await pipelineService.updatePipeline(
      req.params.id,
      req.body,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Pipeline updated successfully",
      data: pipeline,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePipeline = async (req, res) => {
  try {
    await pipelineService.deletePipeline(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "Pipeline deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPipeline,
  getPipelines,
  getPipeline,
  updatePipeline,
  deletePipeline,
};
