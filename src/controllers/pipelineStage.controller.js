const pipelineStageService = require("../services/pipelineStage.service");

const createStage = async (req, res) => {
  try {
    const stage = await pipelineStageService.createStage(req.body, req.user);

    res.status(201).json({
      success: true,
      message: "Stage created successfully",
      data: stage,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getStages = async (req, res) => {
  try {
    const result = await pipelineStageService.getStages(req.query, req.user);

    res.status(200).json({
      success: true,
      message: "Stages fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getStage = async (req, res) => {
  try {
    const stage = await pipelineStageService.getStageById(
      req.params.id,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Stage fetched successfully",
      data: stage,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getPipelineStages = async (req, res) => {
  try {
    const result = await pipelineStageService.getPipelineStages(
      req.params.pipelineId,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Stages fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateStage = async (req, res) => {
  try {
    const stage = await pipelineStageService.updateStage(
      req.params.id,
      req.body,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Stage updated successfully",
      data: stage,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteStage = async (req, res) => {
  try {
    await pipelineStageService.deleteStage(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "Stage deleted successfully",
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
  createStage,
  getStages,
  getStage,
  getPipelineStages,
  updateStage,
  deleteStage,
};
