const dashboardService = require("../services/dashboard.service");

const getOverview = async (req, res) => {
  try {
    const data = await dashboardService.getOverview(req.user.company);

    res.status(200).json({
      success: true,
      message: "Dashboard overview fetched successfully",
      data,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getPipelineStats = async (req, res) => {
  try {
    const data = await dashboardService.getPipelineStats(req.user.company, {
      pipelineId: req.query.pipelineId,
    });

    res.status(200).json({
      success: true,
      message: "Dashboard pipeline stats fetched successfully",
      data,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getSalesStats = async (req, res) => {
  try {
    const data = await dashboardService.getSalesStats(req.user.company, {
      from: req.query.from,
      to: req.query.to,
    });

    res.status(200).json({
      success: true,
      message: "Dashboard sales stats fetched successfully",
      data,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getTaskStats = async (req, res) => {
  try {
    const data = await dashboardService.getTaskStats(req.user.company, {
      assignedTo: req.query.assignedTo,
    });

    res.status(200).json({
      success: true,
      message: "Dashboard task stats fetched successfully",
      data,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMeetingStats = async (req, res) => {
  try {
    const data = await dashboardService.getMeetingStats(req.user.company, {
      organizer: req.query.organizer,
    });

    res.status(200).json({
      success: true,
      message: "Dashboard meeting stats fetched successfully",
      data,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getRecentActivities = async (req, res) => {
  try {
    const data = await dashboardService.getRecentActivities(req.user.company);

    res.status(200).json({
      success: true,
      message: "Recent activities fetched successfully",
      data,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getOverview,
  getPipelineStats,
  getSalesStats,
  getTaskStats,
  getMeetingStats,
  getRecentActivities,
};
