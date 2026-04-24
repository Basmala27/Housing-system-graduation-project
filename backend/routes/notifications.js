const express = require('express');
const router = express.Router();

// Sample notifications (in real app, this would come from database)
let notifications = [
  {
    id: 'notif_001',
    type: 'new_application',
    title: 'New Housing Application Received',
    message: 'Fatma Ali Khalil has submitted a new application for Alexandria Coastal Towers - 4BR Sea View Unit',
    priority: 'high',
    category: 'applications',
    targetUserId: 'user_005',
    isRead: false,
    createdAt: '2024-02-15T11:25:00Z',
    actionUrl: '/applications/app_002'
  },
  {
    id: 'notif_002',
    type: 'application_approved',
    title: 'Application Approved',
    message: 'Ahmed Mohamed Hassan\'s application for Cairo Garden Residences has been approved',
    priority: 'medium',
    category: 'applications',
    targetUserId: 'user_001',
    isRead: true,
    createdAt: '2024-01-22T14:35:00Z',
    actionUrl: '/applications/app_001'
  },
  {
    id: 'notif_003',
    type: 'application_rejected',
    title: 'Application Rejected',
    message: 'Omar Abdel Rahman\'s application for Mansoura Gardens has been rejected due to insufficient income',
    priority: 'high',
    category: 'applications',
    targetUserId: 'user_003',
    isRead: false,
    createdAt: '2024-01-28T10:05:00Z',
    actionUrl: '/applications/app_003'
  },
  {
    id: 'notif_004',
    type: 'system_maintenance',
    title: 'System Maintenance',
    message: 'Scheduled maintenance on Sunday 2AM-4AM for system updates',
    priority: 'medium',
    category: 'system',
    targetUserId: 'all',
    isRead: true,
    createdAt: '2024-01-10T09:00:00Z',
    actionUrl: null
  },
  {
    id: 'notif_005',
    type: 'project_update',
    title: 'Project Update',
    message: 'Suez Canal City Residences construction progress updated to 40%',
    priority: 'low',
    category: 'projects',
    targetUserId: 'all',
    isRead: false,
    createdAt: '2024-02-01T09:15:00Z',
    actionUrl: '/projects/proj_005'
  },
  {
    id: 'notif_006',
    type: 'new_project',
    title: 'New Project Added',
    message: 'New affordable housing project "Suez Canal City Residences" has been added to the system',
    priority: 'medium',
    category: 'projects',
    targetUserId: 'user_005',
    isRead: true,
    createdAt: '2024-02-01T09:05:00Z',
    actionUrl: '/projects/proj_005'
  },
  {
    id: 'notif_007',
    type: 'deadline_reminder',
    title: 'Application Deadline',
    message: '3 applications pending review require attention before end of month',
    priority: 'high',
    category: 'applications',
    targetUserId: 'user_005',
    isRead: false,
    createdAt: '2024-03-25T16:00:00Z',
    actionUrl: '/applications'
  },
  {
    id: 'notif_008',
    type: 'user_verified',
    title: 'User Account Verified',
    message: 'Mona Mahmoud Ali\'s account has been successfully verified',
    priority: 'medium',
    category: 'users',
    targetUserId: 'user_004',
    isRead: true,
    createdAt: '2024-03-05T10:10:00Z',
    actionUrl: '/users/user_004'
  }
];

// GET /api/notifications - Get all notifications
router.get('/', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: notifications,
      count: notifications.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving notifications',
      error: error.message
    });
  }
});

// GET /api/notifications/:id - Get notification by ID
router.get('/:id', (req, res) => {
  try {
    const notification = notifications.find(n => n.id === req.params.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Notification retrieved successfully',
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving notification',
      error: error.message
    });
  }
});

// GET /api/notifications/user/:userId - Get notifications for specific user
router.get('/user/:userId', (req, res) => {
  try {
    const userNotifications = notifications.filter(n => 
      n.targetUserId === req.params.userId || n.targetUserId === 'all'
    );
    res.status(200).json({
      success: true,
      message: 'User notifications retrieved successfully',
      data: userNotifications,
      count: userNotifications.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user notifications',
      error: error.message
    });
  }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', (req, res) => {
  try {
    const index = notifications.findIndex(n => n.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    notifications[index].isRead = true;
    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notifications[index]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating notification',
      error: error.message
    });
  }
});

// POST /api/notifications - Create new notification
router.post('/', (req, res) => {
  try {
    const newNotification = {
      id: `notif_${Date.now()}`,
      ...req.body,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    notifications.push(newNotification);
    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: newNotification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating notification',
      error: error.message
    });
  }
});

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', (req, res) => {
  try {
    const index = notifications.findIndex(n => n.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    notifications.splice(index, 1);
    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    });
  }
});

module.exports = router;
