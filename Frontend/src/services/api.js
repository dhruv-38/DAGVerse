// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth token
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Helper method to set auth token
  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  // Helper method to remove auth token
  removeAuthToken() {
    localStorage.removeItem('authToken');
  }

  // Helper method to get headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (data.token) {
      this.setAuthToken(data.token);
    }
    
    return data;
  }

  async walletChallenge(walletAddress) {
    return this.request('/auth/wallet-challenge', {
      method: 'POST',
      body: JSON.stringify({ walletAddress }),
    });
  }

  async walletVerify(walletData) {
    const data = await this.request('/auth/wallet-verify', {
      method: 'POST',
      body: JSON.stringify(walletData),
    });
    
    if (data.token) {
      this.setAuthToken(data.token);
    }
    
    return data;
  }

  // User endpoints
  async getCurrentUser() {
    return this.request('/user/profile');
  }

  async updateProfile(userData) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Wallet endpoints
  async getWalletBalance() {
    return this.request('/wallet/balance');
  }

  async getTransactionHistory() {
    return this.request('/wallet/transactions');
  }

  // Project endpoints
  async getProjects() {
    return this.request('/projects');
  }

  async createProject(projectData) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(projectId, projectData) {
    return this.request(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(projectId) {
    return this.request(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  // Logout
  logout() {
    this.removeAuthToken();
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 