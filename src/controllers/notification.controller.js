const notificationService = require("../services/notification.service");

const getNotifications = async (req, res) => {
  try {
    const result = await notificationService.getNotifications(
      req.query,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user);

    res.status(200).json({
      success: true,
      message: "Unread count fetched successfully",
      data: { count },
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getNotification = async (req, res) => {
  try {
    const notification = await notificationService.getNotificationById(
      req.params.id,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Notification fetched successfully",
      data: notification,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(
      req.params.id,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const count = await notificationService.markAllAsRead(req.user);

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: { count },
    });
  } catch (error) {
    res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    await notificationService.deleteNotification(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
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
  getNotifications,
  getUnreadCount,
  getNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
