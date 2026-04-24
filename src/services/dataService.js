import dataJson from '../../data.json';

class DataService {
  constructor() {
    this.subscribers = [];
    this.cache = {
      users: null,
      projects: null,
      applications: null,
      auditLogs: null,
      notifications: null
    };
    this.lastUpdate = null;
    this.init();
  }

  init() {
    this.loadInitialData();
    this.setupStorageSync();
  }

  // Load initial data from data.json
  loadInitialData() {
    this.cache = {
      users: [...(dataJson.users || [])],
      projects: [...(dataJson.projects || [])],
      applications: [...(dataJson.applications || [])],
      auditLogs: [...(dataJson.auditLogs || [])],
      notifications: [...(dataJson.notifications || [])]
    };
    this.lastUpdate = new Date();
    this.applyPersistedChanges();
    this.notifySubscribers('initial_load');
  }

  // Apply any persisted status changes
  applyPersistedChanges() {
    try {
      const permanentStatus = localStorage.getItem('permanentApplicationStatus');
      if (permanentStatus) {
        const statusChanges = JSON.parse(permanentStatus);
        this.cache.applications = this.cache.applications.map(app => {
          if (statusChanges[app.id]) {
            const change = statusChanges[app.id];
            return {
              ...app,
              status: change.status,
              rejectionReason: change.rejectionReason,
              reviewedAt: change.reviewedAt,
              reviewedBy: change.reviewedBy
            };
          }
          return app;
        });
      }

      const updatedDataJson = localStorage.getItem('dataJsonApplications');
      if (updatedDataJson) {
        this.cache.applications = JSON.parse(updatedDataJson);
      }
    } catch (error) {
      console.error('Error applying persisted changes:', error);
    }
  }

  // Setup storage sync
  setupStorageSync() {
    window.addEventListener('storage', (e) => {
      if (e.key === 'dataJsonApplications' || e.key === 'permanentApplicationStatus') {
        this.loadInitialData();
      }
    });
  }

  // Subscribe to data changes
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // Notify all subscribers
  notifySubscribers(changeType, data = null) {
    this.subscribers.forEach(callback => {
      try {
        callback(changeType, data, this.cache);
      } catch (error) {
        console.error('Error in subscriber callback:', error);
      }
    });
  }

  // Get all applications
  getApplications() {
    return [...this.cache.applications];
  }

  // Get application by ID
  getApplication(id) {
    return this.cache.applications.find(app => app.id === id || app._id === id);
  }

  // Add new application
  addApplication(applicationData) {
    const newApplication = {
      id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: applicationData.userId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      projectId: applicationData.projectId,
      status: 'pending',
      priority: 'normal',
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
      applicationData: {
        requestedUnitType: applicationData.requestedUnitType || '2BR',
        preferredFloor: applicationData.preferredFloor || 'Any',
        paymentMethod: applicationData.paymentMethod || 'installments',
        specialRequirements: applicationData.specialRequirements || '',
        applicantName: applicationData.applicantName,
        applicantEmail: applicationData.applicantEmail,
        applicantPhone: applicationData.applicantPhone,
        nationalId: applicationData.nationalId,
        familySize: applicationData.familySize,
        income: applicationData.income,
        currentHousing: applicationData.currentHousing
      },
      documents: applicationData.documents || {
        nationalIdCopy: 'uploaded',
        incomeCertificate: 'uploaded',
        birthCertificate: 'uploaded',
        otherDocuments: []
      },
      reviewNotes: null,
      rejectionReason: null
    };

    this.cache.applications.unshift(newApplication); // Add to beginning for newest first
    this.saveToStorage();
    this.notifySubscribers('application_added', newApplication);
    
    // Add audit log
    this.addAuditLog({
      action: 'application_submitted',
      userId: newApplication.userId,
      userName: applicationData.applicantName,
      applicationId: newApplication.id,
      details: `New application submitted for ${this.getProjectName(applicationData.projectId)}`
    });

    return newApplication;
  }

  // Update application status
  updateApplicationStatus(applicationId, status, rejectionReason = null, reviewedBy = 'Admin') {
    const applicationIndex = this.cache.applications.findIndex(app => 
      app.id === applicationId || app._id === applicationId
    );

    if (applicationIndex === -1) {
      throw new Error('Application not found');
    }

    const oldStatus = this.cache.applications[applicationIndex].status;
    this.cache.applications[applicationIndex] = {
      ...this.cache.applications[applicationIndex],
      status,
      rejectionReason: status === 'rejected' ? rejectionReason : null,
      reviewedAt: new Date().toISOString(),
      reviewedBy
    };

    this.saveToStorage();
    this.notifySubscribers('application_status_updated', this.cache.applications[applicationIndex]);
    
    // Add audit log
    this.addAuditLog({
      action: 'application_' + status,
      userId: this.cache.applications[applicationIndex].userId,
      userName: this.getApplicationUserName(this.cache.applications[applicationIndex]),
      applicationId,
      details: `Application ${status}${rejectionReason ? ` - Reason: ${rejectionReason}` : ''}`
    });

    // Add notification
    this.addNotification({
      type: status === 'approved' ? 'success' : 'warning',
      title: `Application ${status}`,
      message: `Your application has been ${status}`,
      userId: this.cache.applications[applicationIndex].userId,
      applicationId
    });

    return this.cache.applications[applicationIndex];
  }

  // Delete application
  deleteApplication(applicationId) {
    const applicationIndex = this.cache.applications.findIndex(app => 
      app.id === applicationId || app._id === applicationId
    );

    if (applicationIndex === -1) {
      throw new Error('Application not found');
    }

    const deletedApplication = this.cache.applications[applicationIndex];
    this.cache.applications.splice(applicationIndex, 1);
    this.saveToStorage();
    this.notifySubscribers('application_deleted', deletedApplication);
    
    // Add audit log
    this.addAuditLog({
      action: 'application_deleted',
      userId: deletedApplication.userId,
      userName: this.getApplicationUserName(deletedApplication),
      applicationId,
      details: `Application deleted`
    });

    return deletedApplication;
  }

  // Get all users
  getUsers() {
    return [...this.cache.users];
  }

  // Get user by ID
  getUser(userId) {
    return this.cache.users.find(user => user.id === userId);
  }

  // Get all projects
  getProjects() {
    return [...this.cache.projects];
  }

  // Get project by ID
  getProject(projectId) {
    return this.cache.projects.find(project => project.id === projectId);
  }

  // Get project name
  getProjectName(projectId) {
    const project = this.getProject(projectId);
    return project ? project.name : 'Unknown Project';
  }

  // Get user details for application
  getApplicationUser(application) {
    // Backend applications have name, email, phone directly
    if (application.name) {
      return {
        id: application.userId || application._id || 'unknown',
        name: application.name,
        email: application.email || 'unknown@example.com',
        phone: application.phone || 'N/A',
        role: 'citizen',
        isVerified: false
      };
    }
    
    // For data.json applications, try to find user by userId
    if (application.userId) {
      const user = this.getUser(application.userId);
      if (user) return user;
    }
    
    // For applications with applicationData
    if (application.applicationData && application.applicationData.applicantName) {
      return {
        id: application.userId || application.id || 'unknown',
        name: application.applicationData.applicantName,
        email: application.applicationData.applicantEmail || 'unknown@example.com',
        phone: application.applicationData.applicantPhone || 'N/A',
        role: 'citizen',
        isVerified: false
      };
    }
    
    return {
      id: 'unknown',
      name: 'Unknown User',
      email: 'unknown@example.com',
      phone: 'N/A',
      role: 'citizen',
      isVerified: false
    };
  }

  // Get application user name
  getApplicationUserName(application) {
    const user = this.getApplicationUser(application);
    return user ? user.name : 'Unknown User';
  }

  // Get enriched applications with user and project data
  getEnrichedApplications() {
    return this.cache.applications.map(app => {
      const user = this.getApplicationUser(app);
      const project = this.getProject(app.projectId);
      
      return {
        ...app,
        applicantName: user ? user.name : 'Unknown User',
        applicantEmail: user ? user.email : 'unknown@example.com',
        applicantPhone: user ? user.phone : 'N/A',
        projectName: project ? project.name : (app.projectName || 'Unknown Project'),
        priority: app.priority || 'normal'
      };
    });
  }

  // Get application statistics
  getApplicationStats() {
    const applications = this.cache.applications;
    return {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      approvalRate: applications.length > 0 ? 
        ((applications.filter(app => app.status === 'approved').length / applications.length) * 100).toFixed(1) : 0
    };
  }

  // Get latest applications
  getLatestApplications(limit = 5) {
    return this.getEnrichedApplications()
      .sort((a, b) => new Date(b.submittedAt || b.createdAt) - new Date(a.submittedAt || a.createdAt))
      .slice(0, limit);
  }

  // Add audit log
  addAuditLog(logData) {
    const newLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action: logData.action,
      userId: logData.userId,
      userName: logData.userName,
      applicationId: logData.applicationId,
      details: logData.details
    };

    this.cache.auditLogs.unshift(newLog);
    this.saveToStorage();
    this.notifySubscribers('audit_log_added', newLog);
  }

  // Get audit logs
  getAuditLogs() {
    return [...this.cache.auditLogs];
  }

  // Add notification
  addNotification(notificationData) {
    const newNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      userId: notificationData.userId,
      applicationId: notificationData.applicationId,
      read: false
    };

    this.cache.notifications.unshift(newNotification);
    this.saveToStorage();
    this.notifySubscribers('notification_added', newNotification);
  }

  // Get notifications
  getNotifications() {
    return [...this.cache.notifications];
  }

  // Mark notification as read
  markNotificationRead(notificationId) {
    const notificationIndex = this.cache.notifications.findIndex(notif => notif.id === notificationId);
    if (notificationIndex !== -1) {
      this.cache.notifications[notificationIndex].read = true;
      this.saveToStorage();
      this.notifySubscribers('notification_read', this.cache.notifications[notificationIndex]);
    }
  }

  // Save to localStorage for persistence
  saveToStorage() {
    try {
      localStorage.setItem('dataJsonApplications', JSON.stringify(this.cache.applications));
      localStorage.setItem('dataJsonUsers', JSON.stringify(this.cache.users));
      localStorage.setItem('dataJsonProjects', JSON.stringify(this.cache.projects));
      localStorage.setItem('dataJsonAuditLogs', JSON.stringify(this.cache.auditLogs));
      localStorage.setItem('dataJsonNotifications', JSON.stringify(this.cache.notifications));
      
      // Also save permanent status changes
      const permanentStatus = {};
      this.cache.applications.forEach(app => {
        if (app.status !== 'pending') {
          permanentStatus[app.id] = {
            status: app.status,
            rejectionReason: app.rejectionReason,
            reviewedAt: app.reviewedAt,
            reviewedBy: app.reviewedBy
          };
        }
      });
      localStorage.setItem('permanentApplicationStatus', JSON.stringify(permanentStatus));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  // Search applications
  searchApplications(query, statusFilter = 'all') {
    let applications = this.getEnrichedApplications();
    
    // Filter by status
    if (statusFilter !== 'all') {
      applications = applications.filter(app => app.status === statusFilter);
    }
    
    // Search by query
    if (query) {
      const searchQuery = query.toLowerCase();
      applications = applications.filter(app => 
        app.applicantName?.toLowerCase().includes(searchQuery) ||
        app.applicantEmail?.toLowerCase().includes(searchQuery) ||
        app.projectName?.toLowerCase().includes(searchQuery) ||
        app.id?.toLowerCase().includes(searchQuery)
      );
    }
    
    return applications;
  }

  // Refresh data from backend API (if available)
  async refreshFromBackend() {
    try {
      const response = await fetch('http://localhost:5000/api/applications');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          this.cache.applications = data.data;
          this.saveToStorage();
          this.notifySubscribers('backend_refresh');
          return true;
        }
      }
    } catch (error) {
      console.log('Backend refresh failed, using local data');
    }
    return false;
  }
}

// Create singleton instance
const dataService = new DataService();

export default dataService;
