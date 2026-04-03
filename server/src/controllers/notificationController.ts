import { Request, Response } from 'express';
import Notification from '../models/notification';
import User from '../models/user';

export const createAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, message } = req.body;
    
    if (!title || !message) {
      res.status(400).json({ message: "Title and message are required" });
      return;
    }

    // Fetch all users
    const users = await User.find({}, '_id');
    
    // Create notifications array
    const notifications = users.map(user => ({
      userId: user._id,
      title,
      message,
      type: 'announcement'
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({ message: "Announcement distributed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user is populated by authenticate middleware
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ message: "Notification not found" });
      return;
    }

    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
