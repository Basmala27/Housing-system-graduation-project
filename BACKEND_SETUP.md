# 🚀 Findoor Backend Setup Guide

Complete step-by-step guide to set up and run the Findoor backend API.

## 📋 Prerequisites

1. **Node.js** (v14 or higher)
   ```bash
   node --version  # Should show v14.x.x or higher
   ```

2. **MongoDB** (v4.0 or higher)
   ```bash
   mongod --version  # Should show v4.x.x or higher
   ```

3. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

## ⚙️ Setup Steps

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment Variables
```bash
# Copy the environment template
cp .env.example .env

# Edit the .env file with your configuration
notepad .env  # On Windows
nano .env      # On Mac/Linux
```

**Required .env configuration:**
```env
MONGODB_URI=mongodb://localhost:27017/findoor
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 4: Start MongoDB

**Option A: MongoDB Service (Recommended)**
```bash
# Start MongoDB service
sudo systemctl start mongod    # Linux
sudo service mongod start   # Some Linux systems
brew services start mongodb-community  # macOS
```

**Option B: Docker**
```bash
# Pull and run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo
```

**Option C: Direct MongoDB**
```bash
# Start MongoDB directly
mongod --dbpath /path/to/your/db
```

### Step 5: Seed Database (Optional - for testing)
```bash
npm run seed
```

### Step 6: Start the Backend Server

**Development Mode (with auto-restart):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

## ✅ Success Indicators

You should see these messages:

```
✅ Connected to MongoDB database
🚀 Findoor Backend Server running on port 5000
📡 API Base URL: http://localhost:5000/api
🏥 Health Check: http://localhost:5000/api/health
```

## 🧪 Testing the APIs

### 1. Health Check
Open your browser or use curl:
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Findoor Backend API is running",
  "timestamp": "2024-03-22T10:30:00.000Z"
}
```

### 2. Get All Applications
```bash
curl http://localhost:5000/api/applications
```

### 3. Create New Application
```bash
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "nationalId": "11112222333444",
    "email": "test@email.com",
    "phone": "01122334455",
    "projectId": "507f1f77bcf86cd799439011",
    "projectName": "Test Project",
    "income": 5000,
    "familySize": 4,
    "currentHousing": "Rented apartment"
  }'
```

## 🔗 Integration with React Frontend

### Update Your React App

1. **Install axios** in your React frontend:
   ```bash
   cd ../  # Go to frontend directory
   npm install axios
   ```

2. **Create API service** (`src/services/api.js`):
   ```javascript
   import axios from 'axios';

   const API_BASE_URL = 'http://localhost:5000/api';

   const api = axios.create({
     baseURL: API_BASE_URL,
     headers: {
       'Content-Type': 'application/json',
     },
   });

   export const applicationsAPI = {
     getAll: (params = {}) => api.get('/applications', { params }),
     getById: (id) => api.get(`/applications/${id}`),
     create: (data) => api.post('/applications', data),
     updateStatus: (id, data) => api.put(`/applications/${id}/status`, data),
     getStats: () => api.get('/applications/stats'),
   };

   export default applicationsAPI;
   ```

3. **Update your React components** to use the API:

   **Applications.jsx:**
   ```javascript
   import { applicationsAPI } from '../services/api';

   const Applications = () => {
     const [applications, setApplications] = useState([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       const fetchApplications = async () => {
         try {
           const response = await applicationsAPI.getAll();
           setApplications(response.data.data);
         } catch (error) {
           console.error('Error fetching applications:', error);
         } finally {
           setLoading(false);
         }
       };

       fetchApplications();
     }, []);

     // Your existing JSX code...
   };
   ```

   **ReviewApplication.jsx:**
   ```javascript
   import { applicationsAPI } from '../services/api';

   const handleApprove = async () => {
     try {
       await applicationsAPI.updateStatus(applicationId, {
         status: 'approved',
         reviewedBy: 'Admin User'
       });
       alert('Application approved successfully!');
       navigate('/applications');
     } catch (error) {
       console.error('Error approving application:', error);
       alert('Error approving application');
     }
   };

   const handleReject = async () => {
     if (!rejectReason.trim()) {
       alert('Please provide a rejection reason');
       return;
     }

     try {
       await applicationsAPI.updateStatus(applicationId, {
         status: 'rejected',
         rejectionReason: rejectReason,
         reviewedBy: 'Admin User'
       });
       alert('Application rejected successfully!');
       navigate('/applications');
     } catch (error) {
       console.error('Error rejecting application:', error);
       alert('Error rejecting application');
     }
   };
   ```

## 🐛 Common Issues & Solutions

### Issue 1: "MongoDB connection failed"
**Solution:**
- Make sure MongoDB is running: `sudo systemctl status mongod`
- Check connection string in `.env` file
- Verify MongoDB port (default: 27017)

### Issue 2: "Port 5000 already in use"
**Solution:**
- Change PORT in `.env` file: `PORT=5001`
- Kill process using port: `netstat -ano | findstr :5000`

### Issue 3: "CORS error in browser"
**Solution:**
- Check FRONTEND_URL in `.env` file
- Make sure it matches your React dev server URL
- Restart backend after changing `.env`

### Issue 4: "Module not found" errors
**Solution:**
- Run `npm install` in backend directory
- Check `node_modules` folder exists
- Delete `node_modules` and reinstall if needed

### Issue 5: "Validation errors"
**Solution:**
- Check request body format
- Ensure all required fields are included
- Validate field formats:
  - Email: must be valid email
  - Phone: must start with 01 and be 11 digits
  - National ID: must be exactly 14 digits

## 📊 Database Schema Reference

### Application Model Fields
| Field | Type | Required | Validation |
|-------|--------|----------|------------|
| name | String | ✅ | 3-100 characters |
| nationalId | String | ✅ | 14 digits, unique |
| email | String | ✅ | Valid email, unique |
| phone | String | ✅ | 01xxxxxxxxx format |
| projectId | ObjectId | ✅ | Valid project ID |
| projectName | String | ✅ | 3-100 characters |
| income | Number | ✅ | Positive number |
| familySize | Number | ✅ | 1-20 |
| currentHousing | String | ✅ | 10-200 characters |
| status | String | ❌ | pending/approved/rejected |
| rejectionReason | String | ❌ | 500 characters max |
| reviewedBy | String | ❌ | Admin name |
| reviewedAt | Date | ❌ | Review timestamp |

## 🚀 Production Deployment

### Environment Setup
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db-url
PORT=5000
FRONTEND_URL=https://your-domain.com
```

### PM2 Deployment (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start server.js --name "findoor-backend"

# View logs
pm2 logs findoor-backend

# Monitor
pm2 monit
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📞 Support

If you encounter any issues:

1. **Check the console logs** for detailed error messages
2. **Verify MongoDB connection** and status
3. **Validate request formats** using the examples above
4. **Check environment variables** in `.env` file
5. **Ensure all dependencies** are installed correctly

---

**🎓 Ready for Graduation Project Integration!**

Your Findoor backend is now ready to connect with your React admin dashboard.
