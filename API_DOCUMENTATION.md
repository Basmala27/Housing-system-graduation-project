# Housing Management System API Documentation
## Shared API for Team Integration

### **Base URL**
```
http://localhost:3001
```

### **Available Endpoints**

#### **1. Users Management**
- **GET** `/users` - Get all users
- **GET** `/users/:id` - Get specific user
- **POST** `/users` - Create new user
- **PUT** `/users/:id` - Update user
- **DELETE** `/users/:id` - Delete user

#### **2. Projects Management**
- **GET** `/projects` - Get all projects
- **GET** `/projects/:id` - Get specific project
- **POST** `/projects` - Create new project
- **PUT** `/projects/:id` - Update project
- **DELETE** `/projects/:id` - Delete project

#### **3. Applications Management**
- **GET** `/applications` - Get all applications
- **GET** `/applications/:id` - Get specific application
- **POST** `/applications` - Create new application
- **PUT** `/applications/:id` - Update application
- **DELETE** `/applications/:id` - Delete application

### **Data Relationships**
- Each `application` has `userId` (references user)
- Each `application` has `projectId` (references project)
- All IDs are consistent: `user_XXX`, `proj_XXX`, `app_XXX`

### **Sample API Calls**

#### **Get All Users**
```bash
curl http://localhost:3001/users
```

#### **Get Specific Project**
```bash
curl http://localhost:3001/projects/proj_001
```

#### **Get Applications by User**
```bash
curl "http://localhost:3001/applications?userId=user_001"
```

#### **Get Applications by Project**
```bash
curl "http://localhost:3001/applications?projectId=proj_001"
```

#### **Get Pending Applications**
```bash
curl "http://localhost:3001/applications?status=pending"
```

### **Data Structure Examples**

#### **User Object**
```json
{
  "id": "user_001",
  "name": "Ahmed Mohamed Hassan",
  "email": "ahmed.hassan@email.com",
  "phone": "01234567890",
  "nationalId": "29012345678901",
  "role": "citizen",
  "isVerified": true,
  "createdAt": "2024-01-15T08:30:00Z",
  "profile": {
    "address": "123 El-Tahrir Street, Cairo, Egypt",
    "occupation": "Software Engineer",
    "familySize": 4,
    "monthlyIncome": 25000
  }
}
```

#### **Project Object**
```json
{
  "id": "proj_001",
  "name": "Cairo Garden Residences",
  "location": {
    "city": "Cairo",
    "district": "New Cairo",
    "address": "90th Street, Fifth Settlement"
  },
  "type": "residential",
  "status": "active",
  "development": {
    "totalUnits": 450,
    "availableUnits": 120,
    "soldUnits": 330
  },
  "pricing": {
    "priceRange": "2.5M - 4.5M EGP",
    "downPayment": "10%",
    "installmentYears": 8
  }
}
```

#### **Application Object**
```json
{
  "id": "app_001",
  "userId": "user_001",
  "projectId": "proj_001",
  "status": "approved",
  "submittedAt": "2024-01-20T09:15:00Z",
  "reviewedBy": "user_005",
  "applicationData": {
    "requestedUnitType": "3BR",
    "paymentMethod": "installments"
  },
  "documents": {
    "nationalIdCopy": "uploaded",
    "incomeCertificate": "uploaded"
  }
}
```

### **For Flutter Developer**
- Use HTTP requests to `http://localhost:3001`
- Parse JSON responses into Dart models
- Handle relationships (userId, projectId)
- Use query parameters for filtering

### **For AI Model Developer**
- Access real-time housing data
- Train on consistent, realistic Egyptian data
- Use relationships for complex queries
- API supports CRUD operations

### **Features Enabled**
- **CORS**: Enabled for cross-origin requests
- **Auto-reload**: Changes update automatically
- **Real-time**: Live data updates
- **RESTful**: Standard HTTP methods
- **JSON**: Clean JSON responses

### **Current Data Summary**
- **5 Users**: Including admin and citizens
- **5 Projects**: Cairo, Alexandria, New Capital, Mansoura, Ismailia
- **9 Applications**: Mixed statuses (approved, pending, rejected)
- **Real Relationships**: Proper foreign key references

### **Server Status**
- **Running**: `http://localhost:3001`
- **Database**: `data.json` file
- **Auto-save**: Changes persist automatically
- **Hot-reload**: No restart needed for data changes

---

**Team Integration Ready!** 
All team members can now use the same API endpoint for consistent data access.
