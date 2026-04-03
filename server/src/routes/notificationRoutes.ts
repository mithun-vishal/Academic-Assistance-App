import express from 'express';
import { createAnnouncement, getNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController';
import { authenticate } from '../middleware.ts/auth';
import { allowRoles } from '../middleware.ts/role';

const router = express.Router();

// Admin creates an announcement for all users
router.post('/announce', authenticate, allowRoles('admin'), createAnnouncement);

// Users get their own notifications
router.get('/', authenticate, getNotifications);

// Users mark all notifications as read
router.patch('/read-all', authenticate, markAllAsRead);

// Users mark a single notification as read
router.patch('/:id/read', authenticate, markAsRead);

export default router;
