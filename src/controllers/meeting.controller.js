const meetingService = require("../services/meeting.service");

const createMeeting = async (req, res) => {
  try {
    const meeting = await meetingService.createMeeting(req.body, req.user);

    res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      data: meeting,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMeetings = async (req, res) => {
  try {
    const result = await meetingService.getMeetings(req.query, req.user);

    res.status(200).json({
      success: true,
      message: "Meetings fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMeeting = async (req, res) => {
  try {
    const meeting = await meetingService.getMeetingById(
      req.params.id,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Meeting fetched successfully",
      data: meeting,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateMeeting = async (req, res) => {
  try {
    const meeting = await meetingService.updateMeeting(
      req.params.id,
      req.body,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Meeting updated successfully",
      data: meeting,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteMeeting = async (req, res) => {
  try {
    await meetingService.deleteMeeting(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const completeMeeting = async (req, res) => {
  try {
    const meeting = await meetingService.completeMeeting(
      req.params.id,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Meeting completed successfully",
      data: meeting,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const cancelMeeting = async (req, res) => {
  try {
    const meeting = await meetingService.cancelMeeting(
      req.params.id,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Meeting cancelled successfully",
      data: meeting,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createMeeting,
  getMeetings,
  getMeeting,
  updateMeeting,
  deleteMeeting,
  completeMeeting,
  cancelMeeting,
};
