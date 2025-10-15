// Authentication utility functions

const API_BASE_URL = 'http://localhost:8000/api';

// Logout function for different user roles
export const logout = async (userRole) => {
  try {
    let logoutEndpoint = '';
    
    // Determine the correct logout endpoint based on user role
    switch (userRole) {
      case 'claimant':
      case 'community':
        logoutEndpoint = `${API_BASE_URL}/claimant/logout`;
        break;
      case 'gram_sabha':
      case 'gs':
        logoutEndpoint = `${API_BASE_URL}/gs/logout`;
        break;
      case 'block_officer':
        logoutEndpoint = `${API_BASE_URL}/block-officer/logout`;
        break;
      case 'subdivision':
      case 'subdivision_officer':
        logoutEndpoint = `${API_BASE_URL}/subdivision/logout`;
        break;
      case 'district':
      case 'district_officer':
        logoutEndpoint = `${API_BASE_URL}/district/logout`;
        break;
      case 'admin':
        logoutEndpoint = `${API_BASE_URL}/logout`;
        break;
      default:
        console.warn('Unknown user role:', userRole);
        logoutEndpoint = `${API_BASE_URL}/claimant/logout`; // Default fallback
    }

    // Call the logout endpoint
    const response = await fetch(logoutEndpoint, {
      method: 'POST',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      // Clear all local storage and session storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear any role-specific data
      clearAuthenticationData();
      
      console.log('Logout successful:', result.message);
      return { success: true, message: result.message };
    } else {
      console.error('Logout failed:', result.message);
      // Even if server logout fails, clear local data
      clearAuthenticationData();
      return { success: false, message: result.message || 'Logout failed' };
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Clear local data even if network request fails
    clearAuthenticationData();
    return { success: false, message: 'Network error during logout' };
  }
};

// Clear all authentication-related data
const clearAuthenticationData = () => {
  // Clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userRole');
  localStorage.removeItem('authToken');
  localStorage.removeItem('claimant');
  localStorage.removeItem('officer');
  localStorage.removeItem('admin');
  
  // Clear sessionStorage
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('userRole');
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('claimant');
  sessionStorage.removeItem('officer');
  sessionStorage.removeItem('admin');
  
  // Clear any cookies (client-side accessible ones)
  document.cookie.split(";").forEach((c) => {
    const eqPos = c.indexOf("=");
    const name = eqPos > -1 ? c.substr(0, eqPos) : c;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  });
};

// Redirect to appropriate login page based on user role
export const redirectToLogin = (userRole = 'claimant') => {
  switch (userRole) {
    case 'gram_sabha':
    case 'gs':
      window.location.href = '/auth?role=gs';
      break;
    case 'block_officer':
      window.location.href = '/auth?role=block';
      break;
    case 'subdivision':
    case 'subdivision_officer':
      window.location.href = '/auth?role=subdivision';
      break;
    case 'district':
    case 'district_officer':
      window.location.href = '/auth?role=district';
      break;
    case 'admin':
      window.location.href = '/auth?role=admin';
      break;
    case 'claimant':
    case 'community':
    default:
      window.location.href = '/auth';
      break;
  }
};

// Complete logout process with confirmation and redirect
export const performLogout = async (userRole, showConfirmation = true) => {
  if (showConfirmation) {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (!confirmed) {
      return { success: false, message: 'Logout cancelled' };
    }
  }

  const result = await logout(userRole);
  
  if (result.success || result.success === false) {
    // Redirect to appropriate login page after a short delay
    setTimeout(() => {
      redirectToLogin(userRole);
    }, 500);
  }
  
  return result;
};

// Check if user is authenticated (basic check)
export const isAuthenticated = () => {
  // Check for tokens in localStorage, sessionStorage, or cookies
  const hasLocalToken = localStorage.getItem('token') || localStorage.getItem('authToken');
  const hasSessionToken = sessionStorage.getItem('token') || sessionStorage.getItem('authToken');
  const hasCookie = document.cookie.includes('token') || 
                   document.cookie.includes('gs_token') || 
                   document.cookie.includes('block_officer_token') ||
                   document.cookie.includes('subdivision_token') ||
                   document.cookie.includes('district_token');
  
  return !!(hasLocalToken || hasSessionToken || hasCookie);
};

// Get current user role from storage
export const getCurrentUserRole = () => {
  return localStorage.getItem('userRole') || 
         sessionStorage.getItem('userRole') || 
         'claimant'; // default fallback
};
