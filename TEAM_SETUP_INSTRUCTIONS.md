# Team Setup Instructions - Shared Housing Data

## For Team Members: Flutter Developer & AI Model Developer

### **Step 1: Download Required Files**
Download these 2 files from the project:
1. `data.json` - **Main data file**
2. `API_DOCUMENTATION.md` - **API guide**

### **Step 2: Install json-server**
```bash
# Install globally
npm install -g json-server

# Or locally in your project
npm install json-server
```

### **Step 3: Start the API Server**
```bash
# Navigate to your project folder
# Place data.json in your project root

# Start the server
json-server --watch data.json --port 3001
```

### **Step 4: Verify API is Working**
Open these URLs in browser or test with curl:
- http://localhost:3001/users
- http://localhost:3001/projects  
- http://localhost:3001/applications

### **Step 5: Use in Your Projects**

#### **For Flutter Developer:**
```dart
// Base URL
const String baseUrl = 'http://localhost:3001';

// Example API calls
final usersResponse = await http.get(Uri.parse('$baseUrl/users'));
final projectsResponse = await http.get(Uri.parse('$baseUrl/projects'));
final applicationsResponse = await http.get(Uri.parse('$baseUrl/applications'));
```

#### **For AI Model Developer:**
```python
import requests

# Base URL
base_url = 'http://localhost:3001'

# Get data
users = requests.get(f'{base_url}/users').json()
projects = requests.get(f'{base_url}/projects').json()
applications = requests.get(f'{base_url}/applications').json()
```

## **Data Structure Overview**

### **Users (5 records):**
- user_001: Ahmed Mohamed Hassan (citizen)
- user_002: Fatma Ali Khalil (citizen)  
- user_003: Omar Abdel Rahman (citizen)
- user_004: Mona Mahmoud Ali (citizen)
- user_005: System Administrator (admin)

### **Projects (5 records):**
- proj_001: Cairo Garden Residences (New Cairo)
- proj_002: Alexandria Coastal Towers (Alexandria)
- proj_003: New Capital City Complex (New Capital)
- proj_004: Mansoura Gardens (Mansoura)
- proj_005: Suez Canal City Residences (Ismailia)

### **Applications (9 records):**
- Mix of statuses: pending, approved, rejected
- Each application links to user and project
- Realistic Egyptian housing scenarios

## **Important Notes**

### **Data Consistency:**
- **DO NOT MODIFY** data.json - this is the shared source of truth
- All team members use the exact same data
- Changes should be coordinated with the team lead

### **API Features:**
- **CORS Enabled**: Cross-origin requests work
- **Auto-save**: Changes persist automatically  
- **RESTful**: GET, POST, PUT, DELETE methods
- **Real-time**: Live data updates

### **Filtering Examples:**
```bash
# Get applications by user
curl "http://localhost:3001/applications?userId=user_001"

# Get applications by project
curl "http://localhost:3001/applications?projectId=proj_001"

# Get applications by status
curl "http://localhost:3001/applications?status=pending"
```

## **Troubleshooting**

### **Port 3001 Already in Use:**
```bash
# Use different port
json-server --watch data.json --port 3002
```

### **CORS Issues:**
- json-server automatically handles CORS
- If issues occur, contact team lead

### **Data Not Loading:**
- Ensure data.json is in correct location
- Check json-server is running
- Verify port is accessible

## **Contact Team Lead**
For any data changes or issues, contact the project lead.

---

**Ready to integrate! All team members now have access to the same consistent housing data.**
