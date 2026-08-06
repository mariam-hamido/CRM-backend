const noteService = require("../services/note.service");

const createNote = async (req, res) => {
  try {
    const note = await noteService.createNote(req.body, req.user);

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getNotes = async (req, res) => {
  try {
    const result = await noteService.getNotes(req.query, req.user);

    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getNote = async (req, res) => {
  try {
    const note = await noteService.getNoteById(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "Note fetched successfully",
      data: note,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getNotesByEntity = (entityField) => async (req, res) => {
  try {
    const entityId = req.params[`${entityField}Id`];
    const result = await noteService.getNotesByEntity(
      entityField,
      entityId,
      req.query,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getCustomerNotes = getNotesByEntity("customer");
const getLeadNotes = getNotesByEntity("lead");
const getDealNotes = getNotesByEntity("deal");
const getTaskNotes = getNotesByEntity("task");
const getMeetingNotes = getNotesByEntity("meeting");

const updateNote = async (req, res) => {
  try {
    const note = await noteService.updateNote(req.params.id, req.body, req.user);

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: note,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    await noteService.deleteNote(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
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
  createNote,
  getNotes,
  getNote,
  getCustomerNotes,
  getLeadNotes,
  getDealNotes,
  getTaskNotes,
  getMeetingNotes,
  updateNote,
  deleteNote,
};
