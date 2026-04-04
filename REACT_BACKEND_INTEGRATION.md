# 🚀 React Backend Integration Guide

Complete guide to integrate your React frontend with the Findoor Node.js/Express backend.

## 📁 FILES CREATED

### New Backend-Ready Components:
- `src/pages/Applications-Backend.jsx` - Applications list with real API
- `src/pages/ReviewApplication-Backend.jsx` - Application details with status updates
- `src/pages/Dashboard-Backend.jsx` - Dashboard with real statistics

### Supporting Files:
- `src/services/apiService.js` - API service layer
- `src/hooks/useApplications.js` - Custom React hooks
- `src/components/LoadingSpinner.jsx` - Loading component
- `src/components/ErrorMessage.jsx` - Error handling component

---

## 🔄 INTEGRATION STEPS

### Step 1: Start Your Backend Server

Open a new terminal and run:
```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Findoor Backend Server running on port 5000
📡 API Base URL: http://localhost:5000/api
✅ Connected to MongoDB database
```

### Step 2: Update Your React App

Replace your existing components with the backend-ready versions:

**Option A: Replace Files (Recommended)**
```bash
# Backup existing files
mv src/pages/Applications.jsx src/pages/Applications-Old.jsx
mv src/pages/ReviewApplication.jsx src/pages/ReviewApplication-Old.jsx
mv src/pages/Dashboard.jsx src/pages/Dashboard-Old.jsx

# Use backend-ready versions
mv src/pages/Applications-Backend.jsx src/pages/Applications.jsx
mv src/pages/ReviewApplication-Backend.jsx src/pages/ReviewApplication.jsx
mv src/pages/Dashboard-Backend.jsx src/pages/Dashboard.jsx
```

**Option B: Update App.jsx Routes**
```javascript
// In src/App.jsx, update the imports:
import Applications from './pages/Applications-Backend';
import ReviewApplication from './pages/ReviewApplication-Backend';
import Dashboard from './pages/Dashboard-Backend';
```

### Step 3: Start Your React Frontend

```bash
npm run dev
```

### Step 4: Test the Integration

Visit these URLs to test:

1. **Dashboard:** `http://localhost:5173/dashboard`
2. **Applications:** `http://localhost:5173/applications`
3. **Health Check:** `http://localhost:5000/api/health`

---

## 🎯 KEY FEATURES IMPLEMENTED

### 1. Applications List Page (`Applications-Backend.jsx`)

**Features:**
- ✅ Real-time data fetching from `/api/applications`
- ✅ Search functionality (name, email, project)
- ✅ Status filtering (pending, approved, rejected)
- ✅ Pagination support
- ✅ Loading states with spinner
- ✅ Error handling with retry
- ✅ Refresh functionality
- ✅ Responsive table design

**API Integration:**
```javascript
const { applications, loading, error, refetch } = useApplications({
  search: searchTerm || undefined,
  status: statusFilter !== 'all' ? statusFilter : undefined,
});
```

### 2. Application Details Page (`ReviewApplication-Backend.jsx`)

**Features:**
- ✅ Fetch single application from `/api/applications/:id`
- ✅ Approve/Reject functionality
- ✅ Rejection reason validation
- ✅ Real-time status updates
- ✅ Document viewing UI
- ✅ Success/error messages
- ✅ Navigation back to list

**API Integration:**
```javascript
// Approve
await updateStatus(id, {
  status: 'approved',
  reviewedBy: 'Admin User'
});

// Reject
await updateStatus(id, {
  status: 'rejected',
  rejectionReason: rejectReason.trim(),
  reviewedBy: 'Admin User'
});
```

### 3. Dashboard (`Dashboard-Backend.jsx`)

**Features:**
- ✅ Real-time statistics from `/api/applications/stats`
- ✅ Recent applications list
- ✅ System status indicators
- ✅ Quick action buttons
- ✅ Auto-refresh capability

**API Integration:**
```javascript
// Fetch statistics
const statsResponse = await applicationsAPI.getStats();
setStats(statsResponse.data);

// Fetch recent applications
const applicationsResponse = await applicationsAPI.getAll({ limit: 5 });
setRecentApplications(applicationsResponse.data);
```

---

## 🔧 CUSTOM HOOKS EXPLAINED

### `useApplications(params)`
Custom hook for managing applications list:

```javascript
const { applications, loading, error, pagination, refetch } = useApplications({
  search: 'search term',
  status: 'pending',
  page: 1,
  limit: 10
});
```

**Returns:**
- `applications` - Array of application objects
- `loading` - Boolean loading state
- `error` - Error message or null
- `pagination` - Pagination info
- `refetch` - Function to refetch data

### `useApplication(id)`
Custom hook for single application:

```javascript
const { application, loading, error, refetch } = useApplication('application-id');
```

### `useStatusUpdate()`
Custom hook for status updates:

```javascript
const { updateStatus, loading, error } = useStatusUpdate();

// Usage
await updateStatus(id, { status: 'approved', reviewedBy: 'Admin' });
```

---

## 🌐 API SERVICE LAYER

### `apiService.js` Features:
- ✅ Centralized API configuration
- ✅ Automatic error handling
- ✅ JSON response parsing
- ✅ Request/response interceptors
- ✅ Base URL management

**Usage Examples:**
```javascript
// Get all applications
const response = await applicationsAPI.getAll({ status: 'pending' });

// Get single application
const response = await applicationsAPI.getById('application-id');

// Update status
const response = await applicationsAPI.updateStatus('id', {
  status: 'approved',
  reviewedBy: 'Admin'
});

// Create application
const response = await applicationsAPI.create(applicationData);
```

---

## 🎨 UI COMPONENTS

### `LoadingSpinner.jsx`
Reusable loading component:
```javascript
<LoadingSpinner size="md" text="Loading applications..." />
```

### `ErrorMessage.jsx`
Error display with retry functionality:
```javascript
<ErrorMessage error={error} onRetry={refetch} />
```

---

## 🔄 DATA FLOW

```
User Action → React Component → Custom Hook → API Service → Backend API
     ↓
UI Update ← State Change ← Response Data ← API Response ← Database
```

**Example Flow:**
1. User clicks "Approve" button
2. `ReviewApplication` component calls `handleApprove()`
3. `handleApprove()` calls `updateStatus()` hook
4. Hook calls `applicationsAPI.updateStatus()`
5. API service sends PUT request to backend
6. Backend updates database and returns response
7. Hook updates component state
8. Component shows success message and navigates

---

## 🧪 TESTING THE INTEGRATION

### 1. Backend Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Get Applications
```bash
curl http://localhost:5000/api/applications
```

### 3. Create Test Application
```bash
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "nationalId": "11112222333444",
    "email": "test@example.com",
    "phone": "01234567890",
    "projectId": "507f1f77bcf86cd799439011",
    "projectName": "Test Project",
    "income": 5000,
    "familySize": 4,
    "currentHousing": "Test housing"
  }'
```

### 4. Test Status Update
```bash
curl -X PUT http://localhost:5000/api/applications/{id}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "approved", "reviewedBy": "Admin User"}'
```

---

## 🐛 TROUBLESHOOTING

### Issue: "Failed to fetch"
**Solutions:**
1. Make sure backend is running on port 5000
2. Check CORS configuration in backend
3. Verify API_BASE_URL in apiService.js

### Issue: "Loading state never ends"
**Solutions:**
1. Check browser console for errors
2. Verify backend API is responding
3. Check network tab in developer tools

### Issue: "CORS error"
**Solutions:**
1. Ensure FRONTEND_URL in backend .env matches React dev server
2. Restart backend after changing .env
3. Check that backend CORS middleware is properly configured

### Issue: "Data not displaying"
**Solutions:**
1. Check API response format matches expected structure
2. Verify backend is returning `success: true` and `data` array
3. Check console for JavaScript errors

---

## 🚀 PRODUCTION DEPLOYMENT

### Environment Variables
```env
REACT_APP_API_URL=http://your-backend-url.com/api
```

### Update API Service
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### Build for Production
```bash
npm run build
```

---

## 🎓 GRADUATION PROJECT READY! 🎓

Your React frontend is now fully integrated with the Node.js backend:

✅ **Real-time data fetching**
✅ **CRUD operations**
✅ **Error handling**
✅ **Loading states**
✅ **Responsive design**
✅ **Production-ready code**
✅ **Clean architecture**
✅ **Reusable components**

**🚀 Your Findoor Government Housing System is now a complete full-stack application!**
