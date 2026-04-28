import { test, expect } from '@playwright/test'

test.describe('Housing System E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:5173')
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle')
  })

  test.describe('Authentication Flow', () => {
    test('should allow admin login', async ({ page }) => {
      // Click login button
      await page.click('text=Login')
      
      // Fill login form
      await page.fill('input[type="email"]', 'admin@housing.gov.eg')
      await page.fill('input[type="password"]', 'admin123')
      
      // Submit login
      await page.click('button[type="submit"]')
      
      // Should redirect to dashboard
      await expect(page).toHaveURL('http://localhost:5173/dashboard')
      await expect(page.locator('text=Admin Dashboard')).toBeVisible()
    })

    test('should allow citizen login', async ({ page }) => {
      // Click login button
      await page.click('text=Login')
      
      // Fill login form
      await page.fill('input[type="email"]', 'ahmed.hassan@email.com')
      await page.fill('input[type="password"]', 'password123')
      
      // Submit login
      await page.click('button[type="submit"]')
      
      // Should redirect to dashboard
      await expect(page).toHaveURL('http://localhost:5173/dashboard')
      await expect(page.locator('text=Dashboard')).toBeVisible()
    })

    test('should show error for invalid credentials', async ({ page }) => {
      // Click login button
      await page.click('text=Login')
      
      // Fill login form with invalid credentials
      await page.fill('input[type="email"]', 'invalid@example.com')
      await page.fill('input[type="password"]', 'wrongpassword')
      
      // Submit login
      await page.click('button[type="submit"]')
      
      // Should show error message
      await expect(page.locator('text=Invalid credentials')).toBeVisible()
    })
  })

  test.describe('Application Submission Flow', () => {
    test.beforeEach(async ({ page }) => {
      // Login as citizen
      await page.click('text=Login')
      await page.fill('input[type="email"]', 'ahmed.hassan@email.com')
      await page.fill('input[type="password"]', 'password123')
      await page.click('button[type="submit"]')
      await page.waitForURL('http://localhost:5173/dashboard')
    })

    test('should submit new housing application', async ({ page }) => {
      // Navigate to new application page
      await page.click('text=New Application')
      await expect(page).toHaveURL('http://localhost:5173/applications/new')
      
      // Fill application form
      await page.fill('input[name="applicantName"]', 'John Doe')
      await page.fill('input[name="nationalId"]', '12345678901234')
      await page.fill('input[name="applicantEmail"]', 'john.doe@example.com')
      await page.fill('input[name="applicantPhone"]', '01234567890')
      await page.fill('input[name="income"]', '25000')
      await page.fill('input[name="familySize"]', '4')
      await page.fill('textarea[name="currentHousing"]', 'Currently renting apartment in Cairo')
      
      // Select project
      await page.selectOption('select[name="projectName"]', 'Cairo Garden Residences')
      
      // Submit application
      await page.click('button[type="submit"]')
      
      // Should show success message
      await expect(page.locator('text=Application submitted successfully')).toBeVisible()
      
      // Should redirect to applications page
      await expect(page).toHaveURL('http://localhost:5173/applications')
    })

    test('should validate required fields', async ({ page }) => {
      // Navigate to new application page
      await page.click('text=New Application')
      await expect(page).toHaveURL('http://localhost:5173/applications/new')
      
      // Submit empty form
      await page.click('button[type="submit"]')
      
      // Should show validation errors
      await expect(page.locator('text=Applicant name is required')).toBeVisible()
      await expect(page.locator('text=Email address is required')).toBeVisible()
      await expect(page.locator('text=Phone number is required')).toBeVisible()
    })

    test('should validate email format', async ({ page }) => {
      // Navigate to new application page
      await page.click('text=New Application')
      await expect(page).toHaveURL('http://localhost:5173/applications/new')
      
      // Fill form with invalid email
      await page.fill('input[name="applicantName"]', 'John Doe')
      await page.fill('input[name="applicantEmail"]', 'invalid-email')
      await page.fill('input[name="applicantPhone"]', '01234567890')
      await page.fill('input[name="nationalId"]', '12345678901234')
      await page.fill('input[name="income"]', '25000')
      await page.fill('input[name="familySize"]', '4')
      await page.fill('textarea[name="currentHousing"]', 'Currently renting apartment')
      
      // Submit form
      await page.click('button[type="submit"]')
      
      // Should show email validation error
      await expect(page.locator('text=Please enter a valid email address')).toBeVisible()
    })
  })

  test.describe('Application Review Flow', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin
      await page.click('text=Login')
      await page.fill('input[type="email"]', 'admin@housing.gov.eg')
      await page.fill('input[type="password"]', 'admin123')
      await page.click('button[type="submit"]')
      await page.waitForURL('http://localhost:5173/dashboard')
    })

    test('should view application details', async ({ page }) => {
      // Navigate to applications page
      await page.click('text=Applications')
      await expect(page).toHaveURL('http://localhost:5173/applications')
      
      // Wait for applications to load
      await page.waitForSelector('text=Housing Applications')
      
      // Click view button on first application
      await page.click('button:has-text("View")')
      
      // Should navigate to application details
      await expect(page.locator('text=Application Details')).toBeVisible()
      
      // Should show application information
      await expect(page.locator('text=Applicant Information')).toBeVisible()
      await expect(page.locator('text=Project Information')).toBeVisible()
      await expect(page.locator('text=Financial Information')).toBeVisible()
    })

    test('should approve application', async ({ page }) => {
      // Navigate to applications page
      await page.click('text=Applications')
      await expect(page).toHaveURL('http://localhost:5173/applications')
      
      // Wait for applications to load
      await page.waitForSelector('text=Housing Applications')
      
      // Click view button on first application
      await page.click('button:has-text("View")')
      
      // Wait for application details to load
      await page.waitForSelector('text=Application Details')
      
      // Click approve button
      await page.click('button:has-text("Approve")')
      
      // Should show success message
      await expect(page.locator('text=Application approved successfully')).toBeVisible()
      
      // Should update status badge
      await expect(page.locator('text=Approved')).toBeVisible()
    })

    test('should reject application with reason', async ({ page }) => {
      // Navigate to applications page
      await page.click('text=Applications')
      await expect(page).toHaveURL('http://localhost:5173/applications')
      
      // Wait for applications to load
      await page.waitForSelector('text=Housing Applications')
      
      // Click view button on first application
      await page.click('button:has-text("View")')
      
      // Wait for application details to load
      await page.waitForSelector('text=Application Details')
      
      // Click reject button
      await page.click('button:has-text("Reject")')
      
      // Fill rejection reason
      await page.fill('textarea[placeholder*="rejection reason"]', 'Insufficient income')
      
      // Confirm rejection
      await page.click('button:has-text("Confirm Rejection")')
      
      // Should show success message
      await expect(page.locator('text=Application rejected successfully')).toBeVisible()
      
      // Should update status badge
      await expect(page.locator('text=Rejected')).toBeVisible()
    })
  })

  test.describe('Dashboard Flow', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin
      await page.click('text=Login')
      await page.fill('input[type="email"]', 'admin@housing.gov.eg')
      await page.fill('input[type="password"]', 'admin123')
      await page.click('button[type="submit"]')
      await page.waitForURL('http://localhost:5173/dashboard')
    })

    test('should display dashboard statistics', async ({ page }) => {
      // Should show dashboard title
      await expect(page.locator('text=Admin Dashboard')).toBeVisible()
      
      // Should show statistics cards
      await expect(page.locator('text=Total Users')).toBeVisible()
      await expect(page.locator('text=Total Projects')).toBeVisible()
      await expect(page.locator('text=Total Applications')).toBeVisible()
      await expect(page.locator('text=Pending')).toBeVisible()
      await expect(page.locator('text=Approved')).toBeVisible()
      await expect(page.locator('text=Rejected')).toBeVisible()
      
      // Should show charts
      await expect(page.locator('canvas')).toBeVisible()
    })

    test('should navigate to different sections', async ({ page }) => {
      // Test navigation to Applications
      await page.click('text=Applications')
      await expect(page).toHaveURL('http://localhost:5173/applications')
      
      // Test navigation to Projects
      await page.click('text=Projects')
      await expect(page).toHaveURL('http://localhost:5173/projects')
      
      // Test navigation to Reports
      await page.click('text=Reports')
      await expect(page).toHaveURL('http://localhost:5173/reports')
      
      // Test navigation to Audit
      await page.click('text=Audit')
      await expect(page).toHaveURL('http://localhost:5173/audit')
      
      // Test navigation to Roles
      await page.click('text=Roles')
      await expect(page).toHaveURL('http://localhost:5173/roles')
    })

    test('should refresh dashboard data', async ({ page }) => {
      // Click refresh button
      await page.click('button:has-text("Refresh")')
      
      // Should show loading state
      await expect(page.locator('.spinner-border')).toBeVisible()
      
      // Should complete refresh
      await page.waitForSelector('.spinner-border', { state: 'hidden' })
      
      // Should update last updated time
      await expect(page.locator('text=Last updated')).toBeVisible()
    })
  })

  test.describe('Project Management Flow', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin
      await page.click('text=Login')
      await page.fill('input[type="email"]', 'admin@housing.gov.eg')
      await page.fill('input[type="password"]', 'admin123')
      await page.click('button[type="submit"]')
      await page.waitForURL('http://localhost:5173/dashboard')
    })

    test('should display projects list', async ({ page }) => {
      // Navigate to projects page
      await page.click('text=Projects')
      await expect(page).toHaveURL('http://localhost:5173/projects')
      
      // Should show projects table
      await expect(page.locator('text=Housing Projects')).toBeVisible()
      await expect(page.locator('table')).toBeVisible()
      
      // Should show project columns
      await expect(page.locator('text=Project Name')).toBeVisible()
      await expect(page.locator('text=Location')).toBeVisible()
      await expect(page.locator('text=Type')).toBeVisible()
      await expect(page.locator('text=Units')).toBeVisible()
      await expect(page.locator('text=Price Range')).toBeVisible()
      await expect(page.locator('text=Status')).toBeVisible()
    })

    test('should add new project', async ({ page }) => {
      // Navigate to projects page
      await page.click('text=Projects')
      await expect(page).toHaveURL('http://localhost:5173/projects')
      
      // Click add project button
      await page.click('button:has-text("Add Project")')
      
      // Fill project form
      await page.fill('input[name="name"]', 'New Test Project')
      await page.fill('input[name="location"]', 'Test City')
      await page.fill('input[name="totalUnits"]', '100')
      await page.fill('input[name="availableUnits"]', '50')
      await page.fill('input[name="priceRange"]', '1M - 2M EGP')
      
      // Submit form
      await page.click('button:has-text("Save Project")')
      
      // Should show success message
      await expect(page.locator('text=Project added successfully')).toBeVisible()
      
      // Should close modal
      await expect(page.locator('.modal')).not.toBeVisible()
    })

    test('should edit existing project', async ({ page }) => {
      // Navigate to projects page
      await page.click('text=Projects')
      await expect(page).toHaveURL('http://localhost:5173/projects')
      
      // Wait for projects to load
      await page.waitForSelector('text=Housing Projects')
      
      // Click edit button on first project
      await page.click('button:has-text("Edit")')
      
      // Update project name
      await page.fill('input[name="name"]', 'Updated Project Name')
      
      // Save changes
      await page.click('button:has-text("Save Project")')
      
      // Should show success message
      await expect(page.locator('text=Project updated successfully')).toBeVisible()
    })

    test('should toggle project status', async ({ page }) => {
      // Navigate to projects page
      await page.click('text=Projects')
      await expect(page).toHaveURL('http://localhost:5173/projects')
      
      // Wait for projects to load
      await page.waitForSelector('text=Housing Projects')
      
      // Click toggle status button on first project
      await page.click('button[title*="Toggle Status"]')
      
      // Should show success message
      await expect(page.locator('text=Project status updated')).toBeVisible()
    })
  })

  test.describe('Reports Flow', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin
      await page.click('text=Login')
      await page.fill('input[type="email"]', 'admin@housing.gov.eg')
      await page.fill('input[type="password"]', 'admin123')
      await page.click('button[type="submit"]')
      await page.waitForURL('http://localhost:5173/dashboard')
    })

    test('should generate application reports', async ({ page }) => {
      // Navigate to reports page
      await page.click('text=Reports')
      await expect(page).toHaveURL('http://localhost:5173/reports')
      
      // Should show reports title
      await expect(page.locator('text=Reports')).toBeVisible()
      
      // Should show report filters
      await expect(page.locator('text=Date Range')).toBeVisible()
      await expect(page.locator('text=Status Filter')).toBeVisible()
      
      // Should show export buttons
      await expect(page.locator('button:has-text("Export CSV")')).toBeVisible()
      await expect(page.locator('button:has-text("Print Report")')).toBeVisible()
    })

    test('should export applications to CSV', async ({ page }) => {
      // Navigate to reports page
      await page.click('text=Reports')
      await expect(page).toHaveURL('http://localhost:5173/reports')
      
      // Click export CSV button
      const downloadPromise = page.waitForEvent('download')
      await page.click('button:has-text("Export CSV")')
      
      // Should trigger file download
      const download = await downloadPromise
      expect(download.suggestedFilename()).toContain('applications')
    })

    test('should filter reports by date range', async ({ page }) => {
      // Navigate to reports page
      await page.click('text=Reports')
      await expect(page).toHaveURL('http://localhost:5173/reports')
      
      // Set date range
      await page.fill('input[name="startDate"]', '2024-01-01')
      await page.fill('input[name="endDate"]', '2024-12-31')
      
      // Click apply filter
      await page.click('button:has-text("Apply Filter")')
      
      // Should update report data
      await expect(page.locator('text=Showing results for')).toBeVisible()
    })
  })

  test.describe('Audit Trail Flow', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin
      await page.click('text=Login')
      await page.fill('input[type="email"]', 'admin@housing.gov.eg')
      await page.fill('input[type="password"]', 'admin123')
      await page.click('button[type="submit"]')
      await page.waitForURL('http://localhost:5173/dashboard')
    })

    test('should display audit logs', async ({ page }) => {
      // Navigate to audit page
      await page.click('text=Audit')
      await expect(page).toHaveURL('http://localhost:5173/audit')
      
      // Should show audit title
      await expect(page.locator('text=Audit Trail')).toBeVisible()
      
      // Should show audit table
      await expect(page.locator('table')).toBeVisible()
      
      // Should show audit columns
      await expect(page.locator('text=Timestamp')).toBeVisible()
      await expect(page.locator('text=Action')).toBeVisible()
      await expect(page.locator('text=User')).toBeVisible()
      await expect(page.locator('text=Details')).toBeVisible()
    })

    test('should filter audit logs by action', async ({ page }) => {
      // Navigate to audit page
      await page.click('text=Audit')
      await expect(page).toHaveURL('http://localhost:5173/audit')
      
      // Wait for audit logs to load
      await page.waitForSelector('text=Audit Trail')
      
      // Filter by action type
      await page.selectOption('select[name="actionFilter"]', 'application_submitted')
      
      // Should update filtered results
      await expect(page.locator('text=application_submitted')).toBeVisible()
    })

    test('should search audit logs', async ({ page }) => {
      // Navigate to audit page
      await page.click('text=Audit')
      await expect(page).toHaveURL('http://localhost:5173/audit')
      
      // Wait for audit logs to load
      await page.waitForSelector('text=Audit Trail')
      
      // Search for specific user
      await page.fill('input[placeholder*="Search"]', 'admin')
      
      // Should filter search results
      await expect(page.locator('text=admin')).toBeVisible()
    })
  })

  test.describe('User Management Flow', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin
      await page.click('text=Login')
      await page.fill('input[type="email"]', 'admin@housing.gov.eg')
      await page.fill('input[type="password"]', 'admin123')
      await page.click('button[type="submit"]')
      await page.waitForURL('http://localhost:5173/dashboard')
    })

    test('should display users list', async ({ page }) => {
      // Navigate to roles page
      await page.click('text=Roles')
      await expect(page).toHaveURL('http://localhost:5173/roles')
      
      // Should show users title
      await expect(page.locator('text=User Management')).toBeVisible()
      
      // Should show users table
      await expect(page.locator('table')).toBeVisible()
      
      // Should show user columns
      await expect(page.locator('text=Name')).toBeVisible()
      await expect(page.locator('text=Email')).toBeVisible()
      await expect(page.locator('text=Role')).toBeVisible()
      await expect(page.locator('text=Status')).toBeVisible()
    })

    test('should add new user', async ({ page }) => {
      // Navigate to roles page
      await page.click('text=Roles')
      await expect(page).toHaveURL('http://localhost:5173/roles')
      
      // Click add user button
      await page.click('button:has-text("Add User")')
      
      // Fill user form
      await page.fill('input[name="name"]', 'New Test User')
      await page.fill('input[name="email"]', 'newuser@example.com')
      await page.fill('input[name="phone"]', '01234567890')
      await page.fill('input[name="nationalId"]', '12345678901234')
      
      // Select role
      await page.selectOption('select[name="role"]', 'citizen')
      
      // Submit form
      await page.click('button:has-text("Save User")')
      
      // Should show success message
      await expect(page.locator('text=User added successfully')).toBeVisible()
    })

    test('should toggle user status', async ({ page }) => {
      // Navigate to roles page
      await page.click('text=Roles')
      await expect(page).toHaveURL('http://localhost:5173/roles')
      
      // Wait for users to load
      await page.waitForSelector('text=User Management')
      
      // Click toggle status button on first user
      await page.click('button[title*="Toggle Status"]')
      
      // Should show success message
      await expect(page.locator('text=User status updated')).toBeVisible()
    })
  })

  test.describe('Real-time Updates Flow', () => {
    test('should update dashboard in real-time', async ({ page }) => {
      // Login as admin
      await page.click('text=Login')
      await page.fill('input[type="email"]', 'admin@housing.gov.eg')
      await page.fill('input[type="password"]', 'admin123')
      await page.click('button[type="submit"]')
      await page.waitForURL('http://localhost:5173/dashboard')
      
      // Get initial application count
      const initialCount = await page.locator('text=Total Applications').textContent()
      
      // Navigate to new application page
      await page.click('text=New Application')
      await expect(page).toHaveURL('http://localhost:5173/applications/new')
      
      // Submit a new application
      await page.fill('input[name="applicantName"]', 'Real-time Test User')
      await page.fill('input[name="nationalId"]', '12345678901234')
      await page.fill('input[name="applicantEmail"]', 'realtime@example.com')
      await page.fill('input[name="applicantPhone"]', '01234567890')
      await page.fill('input[name="income"]', '25000')
      await page.fill('input[name="familySize"]', '4')
      await page.fill('textarea[name="currentHousing"]', 'Testing real-time updates')
      await page.selectOption('select[name="projectName"]', 'Cairo Garden Residences')
      await page.click('button[type="submit"]')
      
      // Wait for success message
      await expect(page.locator('text=Application submitted successfully')).toBeVisible()
      
      // Navigate back to dashboard
      await page.click('text=Dashboard')
      await expect(page).toHaveURL('http://localhost:5173/dashboard')
      
      // Should show updated application count
      const updatedCount = await page.locator('text=Total Applications').textContent()
      expect(updatedCount).not.toBe(initialCount)
    })
  })

  test.describe('Responsive Design Flow', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      
      // Login as admin
      await page.click('text=Login')
      await page.fill('input[type="email"]', 'admin@housing.gov.eg')
      await page.fill('input[type="password"]', 'admin123')
      await page.click('button[type="submit"]')
      await page.waitForURL('http://localhost:5173/dashboard')
      
      // Should show mobile navigation
      await expect(page.locator('.navbar-toggler')).toBeVisible()
      
      // Should be able to navigate to different sections
      await page.click('.navbar-toggler')
      await page.click('text=Applications')
      await expect(page).toHaveURL('http://localhost:5173/applications')
      
      // Should show responsive table
      await expect(page.locator('table')).toBeVisible()
    })

    test('should work on tablet devices', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 })
      
      // Login as admin
      await page.click('text=Login')
      await page.fill('input[type="email"]', 'admin@housing.gov.eg')
      await page.fill('input[type="password"]', 'admin123')
      await page.click('button[type="submit"]')
      await page.waitForURL('http://localhost:5173/dashboard')
      
      // Should show tablet layout
      await expect(page.locator('text=Admin Dashboard')).toBeVisible()
      
      // Should show charts properly
      await expect(page.locator('canvas')).toBeVisible()
    })
  })

  test.describe('Performance Flow', () => {
    test('should load pages quickly', async ({ page }) => {
      // Login as admin
      await page.click('text=Login')
      await page.fill('input[type="email"]', 'admin@housing.gov.eg')
      await page.fill('input[type="password"]', 'admin123')
      await page.click('button[type="submit"]')
      await page.waitForURL('http://localhost:5173/dashboard')
      
      // Test navigation speed
      const startTime = Date.now()
      
      await page.click('text=Applications')
      await page.waitForURL('http://localhost:5173/applications')
      
      const endTime = Date.now()
      const loadTime = endTime - startTime
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000)
    })

    test('should handle large datasets', async ({ page }) => {
      // Login as admin
      await page.click('text=Login')
      await page.fill('input[type="email"]', 'admin@housing.gov.eg')
      await page.fill('input[type="password"]', 'admin123')
      await page.click('button[type="submit"]')
      await page.waitForURL('http://localhost:5173/dashboard')
      
      // Navigate to applications page
      await page.click('text=Applications')
      await expect(page).toHaveURL('http://localhost:5173/applications')
      
      // Should handle large number of applications
      await page.waitForSelector('text=Housing Applications')
      
      // Should be able to scroll through results
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(1000)
      
      // Should still be responsive
      await page.click('button:has-text("Export CSV")')
      await expect(page.locator('button:has-text("Export CSV")')).toBeVisible()
    })
  })
})
