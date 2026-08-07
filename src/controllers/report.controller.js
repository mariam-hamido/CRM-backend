const reportService = require("../services/report.service");

const getCustomerReport = async (req, res) => {
  try {
    const data = await reportService.getCustomerReport(req.query, req.user);

    res.status(200).json({
      success: true,
      message: "Customer report fetched successfully",
      data,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getLeadReport = async (req, res) => {
  try {
    const data = await reportService.getLeadReport(req.query, req.user);

    res.status(200).json({
      success: true,
      message: "Lead report fetched successfully",
      data,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getDealReport = async (req, res) => {
  try {
    const data = await reportService.getDealReport(req.query, req.user);

    res.status(200).json({
      success: true,
      message: "Deal report fetched successfully",
      data,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getTaskReport = async (req, res) => {
  try {
    const data = await reportService.getTaskReport(req.query, req.user);

    res.status(200).json({
      success: true,
      message: "Task report fetched successfully",
      data,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMeetingReport = async (req, res) => {
  try {
    const data = await reportService.getMeetingReport(req.query, req.user);

    res.status(200).json({
      success: true,
      message: "Meeting report fetched successfully",
      data,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const handleExport = (collection) => async (req, res) => {
  try {
    await reportService.exportCollection(collection, req.query, req.user, res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(error.status || 400).json({
        success: false,
        message: error.message,
      });
    } else if (!res.writableEnded) {
      res.end();
    }
  }
};

const exportCustomers = handleExport("customers");
const exportLeads = handleExport("leads");
const exportDeals = handleExport("deals");
const exportTasks = handleExport("tasks");
const exportMeetings = handleExport("meetings");

module.exports = {
  getCustomerReport,
  getLeadReport,
  getDealReport,
  getTaskReport,
  getMeetingReport,
  exportCustomers,
  exportLeads,
  exportDeals,
  exportTasks,
  exportMeetings,
};
