import express, { RequestHandler } from "express";
import { ApiResponse } from "../../shared/orders.js";
import { orderService } from "../services/orderService";

const router = express.Router();

// GET /api/notifications - Get notifications
export const getNotifications: RequestHandler = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const notifications = await orderService.getNotifications(limit);

    const response: ApiResponse = {
      success: true,
      data: notifications
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch notifications"
    };
    res.status(500).json(response);
  }
};

// PUT /api/notifications/:id/read - Mark notification as read
export const markNotificationAsRead: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await orderService.markNotificationAsRead(id);

    if (!updated) {
      const response: ApiResponse = {
        success: false,
        error: "Notification not found"
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      message: "Notification marked as read"
    };

    res.json(response);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to mark notification as read"
    };
    res.status(500).json(response);
  }
};

// Setup routes
router.get('/', getNotifications);
router.put('/:id/read', markNotificationAsRead);

export default router;
