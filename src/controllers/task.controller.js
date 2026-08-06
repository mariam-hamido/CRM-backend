const taskService = require("../services/task.service");

const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body, req.user);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const result = await taskService.getTasks(req.query, req.user);

    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getTask = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      data: task,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body, req.user);

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const completeTask = async (req, res) => {
  try {
    const task = await taskService.completeTask(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "Task completed successfully",
      data: task,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const cancelTask = async (req, res) => {
  try {
    const task = await taskService.cancelTask(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "Task cancelled successfully",
      data: task,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  completeTask,
  cancelTask,
};
