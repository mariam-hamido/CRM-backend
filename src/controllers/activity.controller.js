const activityService = require("../services/activity.service");

const getActivities = async (req, res) => {
  try {
    const result = await activityService.getActivities(req.query, req.user);

    res.status(200).json({
      success: true,
      message: "Activities fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getActivity = async (req, res) => {
  try {
    const activity = await activityService.getActivityById(
      req.params.id,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Activity fetched successfully",
      data: activity,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getEntityActivities = async (req, res) => {
  try {
    const result = await activityService.getActivitiesByEntity(
      req.params.entityType,
      req.params.entityId,
      req.query,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Activities fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getActivities,
  getActivity,
  getEntityActivities,
};
