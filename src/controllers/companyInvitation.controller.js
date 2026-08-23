const companyInvitationService = require("../services/companyInvitation.service");

const create = async (req, res) => {
  try {
    const invitation = await companyInvitationService.createInvitation(
      req.body,
      req.user
    );

    res.status(201).json({
      success: true,
      message: "Invitation created successfully",
      data: invitation,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const list = async (req, res) => {
  try {
    const result = await companyInvitationService.listInvitations(
      req.query,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Invitations fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const invitation = await companyInvitationService.removeInvitation(
      req.params.id,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Invitation removed successfully",
      data: invitation,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { create, list, remove };
