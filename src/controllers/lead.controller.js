const leadService = require("../services/lead.service");

const createLead = async (req, res) => {
  try {
    const lead = await leadService.createLead(req.body, req.user);

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getLeads = async (req, res) => {
  try {
    const result = await leadService.getLeads(req.query, req.user);

    res.status(200).json({
      success: true,
      message: "Leads fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getLead = async (req, res) => {
  try {
    const lead = await leadService.getLeadById(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "Lead fetched successfully",
      data: lead,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateLead = async (req, res) => {
  try {
    const lead = await leadService.updateLead(req.params.id, req.body, req.user);

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: lead,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteLead = async (req, res) => {
  try {
    await leadService.deleteLead(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const convertLead = async (req, res) => {
  try {
    const result = await leadService.convertLead(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "Lead converted successfully",
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
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  convertLead,
};
