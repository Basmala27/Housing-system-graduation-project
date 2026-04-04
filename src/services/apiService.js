// API Service for Findoor Backend Integration
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Applications API
export const applicationsAPI = {
  // Get all applications
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/applications?${queryString}` : '/applications';
    return apiCall(url);
  },

  // Get single application by ID
  getById: async (id) => {
    return apiCall(`/applications/${id}`);
  },

  // Update application status (approve/reject)
  updateStatus: async (id, statusData) => {
    return apiCall(`/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  },

  // Get application statistics
  getStats: async () => {
    return apiCall('/applications/stats');
  },

  // Create new application
  create: async (applicationData) => {
    return apiCall('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  },
};

// Health check
export const healthCheck = async () => {
  return apiCall('/health');
};

export default applicationsAPI;
