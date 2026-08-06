const dealService = require("../services/deal.service");

const createDeal = async (req, res) => {
  try {
    const deal = await dealService.createDeal(req.body, req.user);

    res.status(201).json({
      success: true,
      message: "Deal created successfully",
      data: deal,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getDeals = async (req, res) => {
  try {
    const result = await dealService.getDeals(req.query, req.user);

    res.status(200).json({
      success: true,
      message: "Deals fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getDeal = async (req, res) => {
  try {
    const deal = await dealService.getDealById(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "Deal fetched successfully",
      data: deal,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateDeal = async (req, res) => {
  try {
    const deal = await dealService.updateDeal(req.params.id, req.body, req.user);

    res.status(200).json({
      success: true,
      message: "Deal updated successfully",
      data: deal,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteDeal = async (req, res) => {
  try {
    await dealService.deleteDeal(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "Deal deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const moveStage = async (req, res) => {
  try {
    const deal = await dealService.moveStage(req.params.id, req.body, req.user);

    res.status(200).json({
      success: true,
      message: "Deal stage updated successfully",
      data: deal,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const markWon = async (req, res) => {
  try {
    const deal = await dealService.markWon(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "Deal marked as won",
      data: deal,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const markLost = async (req, res) => {
  try {
    const deal = await dealService.markLost(req.params.id, req.body, req.user);

    res.status(200).json({
      success: true,
      message: "Deal marked as lost",
      data: deal,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createDeal,
  getDeals,
  getDeal,
  updateDeal,
  deleteDeal,
  moveStage,
  markWon,
  markLost,
};
