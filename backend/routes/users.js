const express = require('express');
const router = express.Router();

// Sample data (in real app, this would come from database)
let users = [
  {
    id: 'user_001',
    name: 'Ahmed Mohamed Hassan',
    email: 'ahmed.hassan@email.com',
    phone: '+20 100 123 4567',
    role: 'citizen',
    isVerified: true,
    createdAt: '2024-01-15T08:30:00Z',
    profile: {
      nationalId: '29001011234567',
      dateOfBirth: '1985-05-15',
      maritalStatus: 'married',
      familySize: 4,
      occupation: 'Software Engineer',
      monthlyIncome: 25000,
      address: '123 Al-Mohamed Al-Street, Nasr City, Cairo'
    }
  },
  {
    id: 'user_002',
    name: 'Fatma Ali Khalil',
    email: 'fatma.khalil@email.com',
    phone: '+20 100 234 5678',
    role: 'citizen',
    isVerified: true,
    createdAt: '2024-01-20T10:15:00Z',
    profile: {
      nationalId: '29001011234568',
      dateOfBirth: '1988-08-22',
      maritalStatus: 'single',
      familySize: 2,
      occupation: 'Teacher',
      monthlyIncome: 12000,
      address: '456 Gameel Street, Alexandria'
    }
  },
  {
    id: 'user_003',
    name: 'Omar Abdel Rahman',
    email: 'omar.abdelrahman@email.com',
    phone: '+20 100 345 6789',
    role: 'citizen',
    isVerified: true,
    createdAt: '2024-01-25T14:20:00Z',
    profile: {
      nationalId: '29001011234569',
      dateOfBirth: '1990-03-10',
      maritalStatus: 'married',
      familySize: 5,
      occupation: 'Business Owner',
      monthlyIncome: 18000,
      address: '789 El-Horreya Street, Mansoura'
    }
  },
  {
    id: 'user_004',
    name: 'Mona Mahmoud Ali',
    email: 'mona.mahmoud@email.com',
    phone: '+20 100 456 7890',
    role: 'citizen',
    isVerified: true,
    createdAt: '2024-02-10T09:45:00Z',
    profile: {
      nationalId: '29001011234570',
      dateOfBirth: '1992-12-05',
      maritalStatus: 'single',
      familySize: 1,
      occupation: 'Doctor',
      monthlyIncome: 35000,
      address: '321 Salah Salem Street, Cairo'
    }
  },
  {
    id: 'user_005',
    name: 'System Administrator',
    email: 'admin@gov.eg',
    phone: '+20 100 567 8901',
    role: 'admin',
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    profile: {
      nationalId: '29001011234571',
      dateOfBirth: '1980-01-01',
      maritalStatus: 'married',
      familySize: 3,
      occupation: 'Government Administrator',
      monthlyIncome: 50000,
      address: 'Ministry of Housing, Cairo'
    }
  }
];

// GET /api/users - Get all users
router.get('/', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message
    });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', (req, res) => {
  try {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: error.message
    });
  }
});

// POST /api/users - Create new user
router.post('/', (req, res) => {
  try {
    const newUser = {
      id: `user_${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString(),
      isVerified: false
    };
    users.push(newUser);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', (req, res) => {
  try {
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    users[index] = { ...users[index], ...req.body };
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: users[index]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', (req, res) => {
  try {
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    users.splice(index, 1);
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
});

module.exports = router;
