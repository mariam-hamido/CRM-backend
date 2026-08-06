const attachmentService = require("../services/attachment.service");

const createAttachment = async (req, res) => {
  try {
    const attachment = await attachmentService.createAttachment(
      req.file,
      req.body,
      req.user
    );

    res.status(201).json({
      success: true,
      message: "Attachment uploaded successfully",
      data: attachment,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAttachments = async (req, res) => {
  try {
    const result = await attachmentService.getAttachments(req.query, req.user);

    res.status(200).json({
      success: true,
      message: "Attachments fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAttachment = async (req, res) => {
  try {
    const attachment = await attachmentService.getAttachmentById(
      req.params.id,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Attachment fetched successfully",
      data: attachment,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const downloadAttachment = async (req, res) => {
  try {
    await attachmentService.downloadAttachment(req.params.id, req.user, res);
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAttachmentsByEntity = (entityField) => async (req, res) => {
  try {
    const entityId = req.params[`${entityField}Id`];
    const result = await attachmentService.getAttachmentsByEntity(
      entityField,
      entityId,
      req.query,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Attachments fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getCustomerAttachments = getAttachmentsByEntity("customer");
const getLeadAttachments = getAttachmentsByEntity("lead");
const getDealAttachments = getAttachmentsByEntity("deal");
const getTaskAttachments = getAttachmentsByEntity("task");
const getMeetingAttachments = getAttachmentsByEntity("meeting");
const getNoteAttachments = getAttachmentsByEntity("note");

const deleteAttachment = async (req, res) => {
  try {
    await attachmentService.deleteAttachment(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "Attachment deleted successfully",
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
  createAttachment,
  getAttachments,
  getAttachment,
  downloadAttachment,
  getCustomerAttachments,
  getLeadAttachments,
  getDealAttachments,
  getTaskAttachments,
  getMeetingAttachments,
  getNoteAttachments,
  deleteAttachment,
};
