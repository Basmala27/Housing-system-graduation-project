// Simple authentication setup script
// Run this in browser console to set up authentication

const testUser = {
  email: 'admin@gov.eg',
  password: 'admin123',
  name: 'Admin User',
  role: 'admin',
  _id: 'admin_001'
};

const testToken = btoa(JSON.stringify({ 
  email: testUser.email, 
  timestamp: Date.now() 
}));

// Set authentication data
localStorage.setItem('authToken', testToken);
localStorage.setItem('currentUser', JSON.stringify(testUser));

console.log('✅ Authentication setup complete!');
console.log('👤 User:', testUser);
console.log('🔑 Token:', testToken);

// Redirect to dashboard
window.location.href = '/dashboard';
