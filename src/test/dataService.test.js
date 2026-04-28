import { describe, it, expect, beforeEach, vi } from 'vitest'
import DataService from '../services/dataService.js'

// Mock initial data
const mockData = {
  users: [
    {
      id: 'user_001',
      name: 'Test User',
      email: 'test@example.com',
      role: 'citizen',
      isVerified: true,
      createdAt: '2024-01-01T00:00:00Z'
    }
  ],
  projects: [
    {
      id: 'proj_001',
      name: 'Test Project',
      location: { city: 'Test City' },
      status: 'active',
      development: { totalUnits: 100, availableUnits: 50 },
      pricing: { priceRange: '1M - 2M EGP' }
    }
  ],
  applications: [],
  auditLogs: [],
  notifications: []
}

describe('DataService', () => {
  let dataService

  beforeEach(() => {
    // Clear localStorage mock
    localStorage.clear()
    vi.clearAllMocks()
    
    // Create fresh instance
    dataService = new DataService()
    
    // Initialize with mock data
    dataService.cache = { ...mockData }
  })

  describe('User Management', () => {
    it('should get all users', () => {
      const users = dataService.getUsers()
      expect(users).toHaveLength(1)
      expect(users[0].name).toBe('Test User')
    })

    it('should get user by ID', () => {
      const user = dataService.getUser('user_001')
      expect(user).toBeDefined()
      expect(user.name).toBe('Test User')
    })

    it('should return null for non-existent user', () => {
      const user = dataService.getUser('non_existent')
      expect(user).toBeNull()
    })

    it('should add new user', () => {
      const newUser = {
        name: 'New User',
        email: 'new@example.com',
        role: 'citizen'
      }
      
      const addedUser = dataService.addUser(newUser)
      
      expect(addedUser).toBeDefined()
      expect(addedUser.name).toBe('New User')
      expect(addedUser.id).toMatch(/^user_\d+_[a-z0-9]+$/)
      
      const users = dataService.getUsers()
      expect(users).toHaveLength(2)
    })

    it('should update user', () => {
      const updatedUser = dataService.updateUser('user_001', {
        name: 'Updated User'
      })
      
      expect(updatedUser.name).toBe('Updated User')
      
      const user = dataService.getUser('user_001')
      expect(user.name).toBe('Updated User')
    })

    it('should delete user', () => {
      const deletedUser = dataService.deleteUser('user_001')
      
      expect(deletedUser).toBeDefined()
      expect(deletedUser.name).toBe('Test User')
      
      const users = dataService.getUsers()
      expect(users).toHaveLength(0)
    })
  })

  describe('Project Management', () => {
    it('should get all projects', () => {
      const projects = dataService.getProjects()
      expect(projects).toHaveLength(1)
      expect(projects[0].name).toBe('Test Project')
    })

    it('should get project by ID', () => {
      const project = dataService.getProject('proj_001')
      expect(project).toBeDefined()
      expect(project.name).toBe('Test Project')
    })

    it('should get project name', () => {
      const projectName = dataService.getProjectName('proj_001')
      expect(projectName).toBe('Test Project')
    })

    it('should return unknown for non-existent project', () => {
      const projectName = dataService.getProjectName('non_existent')
      expect(projectName).toBe('Unknown Project')
    })

    it('should add new project', () => {
      const newProject = {
        name: 'New Project',
        location: { city: 'New City' },
        type: 'residential',
        status: 'active'
      }
      
      const addedProject = dataService.addProject(newProject)
      
      expect(addedProject).toBeDefined()
      expect(addedProject.name).toBe('New Project')
      expect(addedProject.id).toMatch(/^proj_\d+_[a-z0-9]+$/)
      
      const projects = dataService.getProjects()
      expect(projects).toHaveLength(2)
    })

    it('should update project', () => {
      const updatedProject = dataService.updateProject('proj_001', {
        name: 'Updated Project'
      })
      
      expect(updatedProject.name).toBe('Updated Project')
      
      const project = dataService.getProject('proj_001')
      expect(project.name).toBe('Updated Project')
    })

    it('should delete project', () => {
      const deletedProject = dataService.deleteProject('proj_001')
      
      expect(deletedProject).toBeDefined()
      expect(deletedProject.name).toBe('Test Project')
      
      const projects = dataService.getProjects()
      expect(projects).toHaveLength(0)
    })
  })

  describe('Application Management', () => {
    it('should get all applications', () => {
      const applications = dataService.getApplications()
      expect(applications).toHaveLength(0)
    })

    it('should get application by ID', () => {
      const application = dataService.getApplication('non_existent')
      expect(application).toBeNull()
    })

    it('should add new application', () => {
      const newApplication = {
        applicantName: 'John Doe',
        applicantEmail: 'john@example.com',
        applicantPhone: '01234567890',
        nationalId: '12345678901234',
        projectName: 'Test Project',
        projectId: 'proj_001',
        income: 25000,
        familySize: 4,
        currentHousing: 'Renting',
        requestedUnitType: '2BR'
      }
      
      const addedApp = dataService.addApplication(newApplication)
      
      expect(addedApp).toBeDefined()
      expect(addedApp.applicationData.applicantName).toBe('John Doe')
      expect(addedApp.id).toMatch(/^app_\d+_[a-z0-9]+$/)
      
      const applications = dataService.getApplications()
      expect(applications).toHaveLength(1)
    })

    it('should update application status', () => {
      // First add an application
      const newApplication = {
        applicantName: 'John Doe',
        applicantEmail: 'john@example.com',
        projectName: 'Test Project',
        projectId: 'proj_001'
      }
      const addedApp = dataService.addApplication(newApplication)
      
      // Then update status
      const updatedApp = dataService.updateApplicationStatus(addedApp.id, 'approved')
      
      expect(updatedApp.status).toBe('approved')
      expect(updatedApp.reviewedAt).toBeDefined()
      expect(updatedApp.reviewedBy).toBe('Admin')
    })

    it('should delete application', () => {
      // First add an application
      const newApplication = {
        applicantName: 'John Doe',
        applicantEmail: 'john@example.com',
        projectName: 'Test Project',
        projectId: 'proj_001'
      }
      const addedApp = dataService.addApplication(newApplication)
      
      // Then delete it
      const deletedApp = dataService.deleteApplication(addedApp.id)
      
      expect(deletedApp).toBeDefined()
      expect(deletedApp.applicationData.applicantName).toBe('John Doe')
      
      const applications = dataService.getApplications()
      expect(applications).toHaveLength(0)
    })
  })

  describe('Enriched Applications', () => {
    it('should get enriched applications with user and project data', () => {
      // Add an application
      const newApplication = {
        applicantName: 'John Doe',
        applicantEmail: 'john@example.com',
        projectName: 'Test Project',
        projectId: 'proj_001'
      }
      dataService.addApplication(newApplication)
      
      const enrichedApps = dataService.getEnrichedApplications()
      
      expect(enrichedApps).toHaveLength(1)
      expect(enrichedApps[0].applicantName).toBe('John Doe')
      expect(enrichedApps[0].projectName).toBe('Test Project')
    })

    it('should handle missing project gracefully', () => {
      // Add an application with non-existent project
      const newApplication = {
        applicantName: 'John Doe',
        applicantEmail: 'john@example.com',
        projectName: 'Unknown Project',
        projectId: 'non_existent'
      }
      dataService.addApplication(newApplication)
      
      const enrichedApps = dataService.getEnrichedApplications()
      
      expect(enrichedApps).toHaveLength(1)
      expect(enrichedApps[0].projectName).toBe('Unknown Project')
    })
  })

  describe('Search Functionality', () => {
    beforeEach(() => {
      // Add test applications
      dataService.addApplication({
        applicantName: 'John Doe',
        applicantEmail: 'john@example.com',
        projectName: 'Test Project',
        projectId: 'proj_001',
        status: 'pending'
      })
      
      dataService.addApplication({
        applicantName: 'Jane Smith',
        applicantEmail: 'jane@example.com',
        projectName: 'Another Project',
        projectId: 'proj_002',
        status: 'approved'
      })
    })

    it('should search applications by name', () => {
      const results = dataService.searchApplications('John')
      expect(results).toHaveLength(1)
      expect(results[0].applicantName).toBe('John Doe')
    })

    it('should search applications by email', () => {
      const results = dataService.searchApplications('jane@example.com')
      expect(results).toHaveLength(1)
      expect(results[0].applicantEmail).toBe('jane@example.com')
    })

    it('should filter applications by status', () => {
      const results = dataService.searchApplications('', 'pending')
      expect(results).toHaveLength(1)
      expect(results[0].status).toBe('pending')
    })

    it('should return all applications for empty search', () => {
      const results = dataService.searchApplications('', 'all')
      expect(results).toHaveLength(2)
    })
  })

  describe('Statistics', () => {
    beforeEach(() => {
      // Add test applications
      dataService.addApplication({
        applicantName: 'John Doe',
        status: 'pending'
      })
      
      dataService.addApplication({
        applicantName: 'Jane Smith',
        status: 'approved'
      })
      
      dataService.addApplication({
        applicantName: 'Bob Johnson',
        status: 'rejected'
      })
    })

    it('should calculate application statistics', () => {
      const stats = dataService.getApplicationStats()
      
      expect(stats.total).toBe(3)
      expect(stats.pending).toBe(1)
      expect(stats.approved).toBe(1)
      expect(stats.rejected).toBe(1)
      expect(parseFloat(stats.approvalRate)).toBe(33.3)
    })
  })

  describe('Subscription System', () => {
    it('should subscribe to data changes', () => {
      const callback = vi.fn()
      const unsubscribe = dataService.subscribe(callback)
      
      expect(typeof unsubscribe).toBe('function')
    })

    it('should notify subscribers on data change', () => {
      const callback = vi.fn()
      dataService.subscribe(callback)
      
      // Add a user to trigger notification
      dataService.addUser({
        name: 'Test User',
        email: 'test@example.com',
        role: 'citizen'
      })
      
      expect(callback).toHaveBeenCalledWith(
        'user_added',
        expect.any(Object),
        expect.any(Object)
      )
    })

    it('should unsubscribe correctly', () => {
      const callback = vi.fn()
      const unsubscribe = dataService.subscribe(callback)
      
      unsubscribe()
      
      // Add a user after unsubscribing
      dataService.addUser({
        name: 'Test User',
        email: 'test@example.com',
        role: 'citizen'
      })
      
      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('Audit Logging', () => {
    it('should add audit log', () => {
      const auditData = {
        action: 'test_action',
        userId: 'user_001',
        userName: 'Test User',
        details: 'Test audit log'
      }
      
      dataService.addAuditLog(auditData)
      
      const auditLogs = dataService.getAuditLogs()
      expect(auditLogs).toHaveLength(1)
      expect(auditLogs[0].action).toBe('test_action')
      expect(auditLogs[0].id).toMatch(/^audit_\d+_[a-z0-9]+$/)
    })

    it('should get audit logs', () => {
      dataService.addAuditLog({
        action: 'test_action',
        userId: 'user_001',
        details: 'Test audit log'
      })
      
      const auditLogs = dataService.getAuditLogs()
      expect(auditLogs).toHaveLength(1)
      expect(auditLogs[0].action).toBe('test_action')
    })
  })

  describe('Data Persistence', () => {
    it('should save to localStorage', () => {
      dataService.saveToStorage()
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'dataJsonUsers',
        expect.any(String)
      )
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'dataJsonProjects',
        expect.any(String)
      )
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'dataJsonApplications',
        expect.any(String)
      )
    })
  })
})
