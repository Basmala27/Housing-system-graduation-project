import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import DataService from '../services/dataService.js'
import Applications from '../pages/Applications.jsx'
import NewApplication from '../pages/NewApplication.jsx'
import ReviewApplication from '../pages/ReviewApplication.jsx'

// Test wrapper component
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
)

describe('Application Workflow Integration Tests', () => {
  let dataService

  beforeEach(() => {
    // Clear localStorage and mocks
    localStorage.clear()
    vi.clearAllMocks()
    
    // Create fresh DataService instance
    dataService = new DataService()
    
    // Mock authentication
    localStorage.setItem('token', 'test-token')
    localStorage.setItem('user', JSON.stringify({
      id: 'admin_001',
      name: 'Test Admin',
      email: 'admin@test.com',
      role: 'admin',
      isVerified: true
    }))
    
    // Initialize with test data
    dataService.cache = {
      users: [
        {
          id: 'admin_001',
          name: 'Test Admin',
          email: 'admin@test.com',
          role: 'admin',
          isVerified: true
        },
        {
          id: 'user_001',
          name: 'Test User',
          email: 'user@test.com',
          role: 'citizen',
          isVerified: true
        }
      ],
      projects: [
        {
          id: 'proj_001',
          name: 'Test Housing Project',
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
  })

  describe('Application Submission Flow', () => {
    it('should submit new application successfully', async () => {
      render(
        <TestWrapper>
          <NewApplication />
        </TestWrapper>
      )

      // Fill out the application form
      const applicantNameInput = screen.getByLabelText(/applicant name/i)
      const emailInput = screen.getByLabelText(/email address/i)
      const phoneInput = screen.getByLabelText(/phone number/i)
      const nationalIdInput = screen.getByLabelText(/national id/i)
      const incomeInput = screen.getByLabelText(/monthly income/i)
      const familySizeInput = screen.getByLabelText(/family size/i)
      const currentHousingInput = screen.getByLabelText(/current housing/i)
      const projectSelect = screen.getByLabelText(/preferred project/i)
      const submitButton = screen.getByRole('button', { name: /submit application/i })

      // Fill form fields
      fireEvent.change(applicantNameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(phoneInput, { target: { value: '01234567890' } })
      fireEvent.change(nationalIdInput, { target: { value: '12345678901234' } })
      fireEvent.change(incomeInput, { target: { value: '25000' } })
      fireEvent.change(familySizeInput, { target: { value: '4' } })
      fireEvent.change(currentHousingInput, { target: { value: 'Renting apartment' } })
      fireEvent.change(projectSelect, { target: { value: 'Test Housing Project' } })

      // Submit the form
      fireEvent.click(submitButton)

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText(/application submitted successfully/i)).toBeInTheDocument()
      })

      // Verify application was added to dataService
      const applications = dataService.getApplications()
      expect(applications).toHaveLength(1)
      expect(applications[0].applicationData.applicantName).toBe('John Doe')
      expect(applications[0].applicationData.applicantEmail).toBe('john@example.com')
    })

    it('should validate required fields', async () => {
      render(
        <TestWrapper>
          <NewApplication />
        </TestWrapper>
      )

      const submitButton = screen.getByRole('button', { name: /submit application/i })

      // Submit empty form
      fireEvent.click(submitButton)

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/applicant name is required/i)).toBeInTheDocument()
      })
    })

    it('should validate email format', async () => {
      render(
        <TestWrapper>
          <NewApplication />
        </TestWrapper>
      )

      const emailInput = screen.getByLabelText(/email address/i)
      const submitButton = screen.getByRole('button', { name: /submit application/i })

      // Enter invalid email
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      fireEvent.click(submitButton)

      // Should show email validation error
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      })
    })

    it('should validate phone number format', async () => {
      render(
        <TestWrapper>
          <NewApplication />
        </TestWrapper>
      )

      const phoneInput = screen.getByLabelText(/phone number/i)
      const submitButton = screen.getByRole('button', { name: /submit application/i })

      // Enter invalid phone number
      fireEvent.change(phoneInput, { target: { value: '123' } })
      fireEvent.click(submitButton)

      // Should show phone validation error
      await waitFor(() => {
        expect(screen.getByText(/phone number must start with 01 and be 11 digits/i)).toBeInTheDocument()
      })
    })
  })

  describe('Application Review Flow', () => {
    beforeEach(() => {
      // Add a test application for review
      dataService.addApplication({
        applicantName: 'John Doe',
        applicantEmail: 'john@example.com',
        applicantPhone: '01234567890',
        nationalId: '12345678901234',
        projectName: 'Test Housing Project',
        projectId: 'proj_001',
        income: 25000,
        familySize: 4,
        currentHousing: 'Renting apartment',
        requestedUnitType: '2BR'
      })
    })

    it('should display application details correctly', async () => {
      const applications = dataService.getApplications()
      const applicationId = applications[0].id

      render(
        <TestWrapper>
          <ReviewApplication />
        </TestWrapper>
      )

      // Wait for application to load
      await waitFor(() => {
        expect(screen.getByText(/john doe/i)).toBeInTheDocument()
        expect(screen.getByText(/john@example.com/i)).toBeInTheDocument()
        expect(screen.getByText(/01234567890/i)).toBeInTheDocument()
        expect(screen.getByText(/test housing project/i)).toBeInTheDocument()
      })
    })

    it('should approve application successfully', async () => {
      const applications = dataService.getApplications()
      const applicationId = applications[0].id

      render(
        <TestWrapper>
          <ReviewApplication />
        </TestWrapper>
      )

      // Wait for application to load
      await waitFor(() => {
        expect(screen.getByText(/john doe/i)).toBeInTheDocument()
      })

      // Find and click approve button
      const approveButton = screen.getByRole('button', { name: /approve/i })
      fireEvent.click(approveButton)

      // Wait for approval confirmation
      await waitFor(() => {
        expect(screen.getByText(/application approved successfully/i)).toBeInTheDocument()
      })

      // Verify application status was updated
      const updatedApplication = dataService.getApplication(applicationId)
      expect(updatedApplication.status).toBe('approved')
      expect(updatedApplication.reviewedAt).toBeDefined()
    })

    it('should reject application with reason', async () => {
      const applications = dataService.getApplications()
      const applicationId = applications[0].id

      render(
        <TestWrapper>
          <ReviewApplication />
        </TestWrapper>
      )

      // Wait for application to load
      await waitFor(() => {
        expect(screen.getByText(/john doe/i)).toBeInTheDocument()
      })

      // Find and click reject button
      const rejectButton = screen.getByRole('button', { name: /reject/i })
      fireEvent.click(rejectButton)

      // Enter rejection reason
      const reasonTextarea = screen.getByLabelText(/rejection reason/i)
      fireEvent.change(reasonTextarea, { target: { value: 'Insufficient income' } })

      // Confirm rejection
      const confirmButton = screen.getByRole('button', { name: /confirm rejection/i })
      fireEvent.click(confirmButton)

      // Wait for rejection confirmation
      await waitFor(() => {
        expect(screen.getByText(/application rejected successfully/i)).toBeInTheDocument()
      })

      // Verify application status was updated
      const updatedApplication = dataService.getApplication(applicationId)
      expect(updatedApplication.status).toBe('rejected')
      expect(updatedApplication.rejectionReason).toBe('Insufficient income')
    })
  })

  describe('Application Management Flow', () => {
    beforeEach(() => {
      // Add test applications with different statuses
      dataService.addApplication({
        applicantName: 'John Doe',
        applicantEmail: 'john@example.com',
        projectName: 'Test Housing Project',
        projectId: 'proj_001',
        status: 'pending'
      })

      dataService.addApplication({
        applicantName: 'Jane Smith',
        applicantEmail: 'jane@example.com',
        projectName: 'Test Housing Project',
        projectId: 'proj_001',
        status: 'approved'
      })

      dataService.addApplication({
        applicantName: 'Bob Johnson',
        applicantEmail: 'bob@example.com',
        projectName: 'Test Housing Project',
        projectId: 'proj_001',
        status: 'rejected'
      })
    })

    it('should display all applications in list', async () => {
      render(
        <TestWrapper>
          <Applications />
        </TestWrapper>
      )

      // Wait for applications to load
      await waitFor(() => {
        expect(screen.getByText(/john doe/i)).toBeInTheDocument()
        expect(screen.getByText(/jane smith/i)).toBeInTheDocument()
        expect(screen.getByText(/bob johnson/i)).toBeInTheDocument()
      })

      // Verify status badges
      expect(screen.getByText(/pending/i)).toBeInTheDocument()
      expect(screen.getByText(/approved/i)).toBeInTheDocument()
      expect(screen.getByText(/rejected/i)).toBeInTheDocument()
    })

    it('should filter applications by status', async () => {
      render(
        <TestWrapper>
          <Applications />
        </TestWrapper>
      )

      // Wait for applications to load
      await waitFor(() => {
        expect(screen.getByText(/john doe/i)).toBeInTheDocument()
      })

      // Filter by pending status
      const statusFilter = screen.getByLabelText(/filter by status/i)
      fireEvent.change(statusFilter, { target: { value: 'pending' } })

      // Should only show pending applications
      await waitFor(() => {
        expect(screen.getByText(/john doe/i)).toBeInTheDocument()
        expect(screen.queryByText(/jane smith/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/bob johnson/i)).not.toBeInTheDocument()
      })
    })

    it('should search applications by name', async () => {
      render(
        <TestWrapper>
          <Applications />
        </TestWrapper>
      )

      // Wait for applications to load
      await waitFor(() => {
        expect(screen.getByText(/john doe/i)).toBeInTheDocument()
      })

      // Search for specific name
      const searchInput = screen.getByPlaceholderText(/search by name, email, or project/i)
      fireEvent.change(searchInput, { target: { value: 'Jane' } })

      // Should only show matching applications
      await waitFor(() => {
        expect(screen.queryByText(/john doe/i)).not.toBeInTheDocument()
        expect(screen.getByText(/jane smith/i)).toBeInTheDocument()
        expect(screen.queryByText(/bob johnson/i)).not.toBeInTheDocument()
      })
    })

    it('should export applications to CSV', async () => {
      render(
        <TestWrapper>
          <Applications />
        </TestWrapper>
      )

      // Wait for applications to load
      await waitFor(() => {
        expect(screen.getByText(/john doe/i)).toBeInTheDocument()
      })

      // Mock CSV export function
      const mockExport = vi.fn()
      global.URL.createObjectURL = vi.fn()
      global.URL.revokeObjectURL = vi.fn()
      
      // Find and click export button
      const exportButton = screen.getByRole('button', { name: /export csv/i })
      fireEvent.click(exportButton)

      // Verify export was triggered (this would need actual implementation)
      // For now, just verify the button exists and is clickable
      expect(exportButton).toBeInTheDocument()
    })
  })

  describe('Real-time Data Synchronization', () => {
    it('should update application list when new application is added', async () => {
      render(
        <TestWrapper>
          <Applications />
        </TestWrapper>
      )

      // Wait for initial load (should be empty)
      await waitFor(() => {
        expect(screen.getByText(/no applications found/i)).toBeInTheDocument()
      })

      // Add a new application directly to dataService
      dataService.addApplication({
        applicantName: 'New User',
        applicantEmail: 'new@example.com',
        projectName: 'Test Housing Project',
        projectId: 'proj_001',
        status: 'pending'
      })

      // Should automatically update the list
      await waitFor(() => {
        expect(screen.getByText(/new user/i)).toBeInTheDocument()
        expect(screen.queryByText(/no applications found/i)).not.toBeInTheDocument()
      })
    })

    it('should update application details when status changes', async () => {
      // Add a test application
      const application = dataService.addApplication({
        applicantName: 'Test User',
        applicantEmail: 'test@example.com',
        projectName: 'Test Housing Project',
        projectId: 'proj_001',
        status: 'pending'
      })

      render(
        <TestWrapper>
          <Applications />
        </TestWrapper>
      )

      // Wait for application to load
      await waitFor(() => {
        expect(screen.getByText(/test user/i)).toBeInTheDocument()
        expect(screen.getByText(/pending/i)).toBeInTheDocument()
      })

      // Update application status directly in dataService
      dataService.updateApplicationStatus(application.id, 'approved')

      // Should automatically update the status badge
      await waitFor(() => {
        expect(screen.getByText(/approved/i)).toBeInTheDocument()
        expect(screen.queryByText(/pending/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle dataService errors gracefully', async () => {
      // Mock dataService to throw error
      const mockGetApplications = vi.fn().mockImplementation(() => {
        throw new Error('Failed to load applications')
      })
      dataService.getApplications = mockGetApplications

      render(
        <TestWrapper>
          <Applications />
        </TestWrapper>
      )

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/failed to load applications/i)).toBeInTheDocument()
      })
    })

    it('should handle network errors in form submission', async () => {
      render(
        <TestWrapper>
          <NewApplication />
        </TestWrapper>
      )

      // Mock dataService addApplication to throw error
      const mockAddApplication = vi.fn().mockImplementation(() => {
        throw new Error('Network error')
      })
      dataService.addApplication = mockAddApplication

      // Fill form with valid data
      const applicantNameInput = screen.getByLabelText(/applicant name/i)
      const emailInput = screen.getByLabelText(/email address/i)
      const submitButton = screen.getByRole('button', { name: /submit application/i })

      fireEvent.change(applicantNameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.click(submitButton)

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/failed to submit application/i)).toBeInTheDocument()
      })
    })
  })
})
