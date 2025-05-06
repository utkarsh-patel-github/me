// API Base URL - Change this to your production URL when deployed
const API_BASE_URL = 'https://dailytools-backend.vercel.app/api';

// DOM Elements - Profile Elements
const profileForm = document.getElementById('profile-form');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const profileAvatar = document.getElementById('profile-avatar');
const profileInputName = document.getElementById('profile-input-name');
const profileInputUsername = document.getElementById('profile-input-username');
const profileInputEmail = document.getElementById('profile-input-email');
const profileInputBio = document.getElementById('profile-input-bio');
const profileSuccessMessage = document.getElementById('profile-success-message');
const profileErrorMessage = document.getElementById('profile-error-message');
const profileSuccessAlert = document.querySelector('#profile-section .success-message');
const profileErrorAlert = document.querySelector('#profile-section .error-message');

// DOM Elements - Tabs
const profileTabs = document.querySelectorAll('.profile-tab');
const profileSections = document.querySelectorAll('.profile-section');

// DOM Elements - Saved Tools
const toolsGrid = document.getElementById('tools-grid');
const loadingMessage = document.querySelector('.loading-message');
const emptyState = document.querySelector('.empty-state');

// DOM Elements - Settings Form
const settingsForm = document.getElementById('settings-form');
const themeRadios = document.querySelectorAll('input[name="theme"]');
const languageSelect = document.getElementById('language');
const toolsLayoutRadios = document.querySelectorAll('input[name="toolsLayout"]');
const settingsSuccessMessage = document.getElementById('settings-success-message');
const settingsSuccessAlert = document.querySelector('#settings-section .success-message');

// DOM Elements - Notifications Form
const notificationsForm = document.getElementById('notifications-form');
const notificationsSuccessMessage = document.getElementById('notifications-success-message');
const notificationsSuccessAlert = document.querySelector('#notifications-section .success-message');

// DOM Elements - Password Form
const passwordForm = document.getElementById('password-form');
const currentPassword = document.getElementById('current-password');
const newPassword = document.getElementById('new-password');
const confirmPassword = document.getElementById('confirm-password');
const accountSuccessMessage = document.getElementById('account-success-message');
const accountErrorMessage = document.getElementById('account-error-message');
const accountSuccessAlert = document.querySelector('#account-section .success-message');
const accountErrorAlert = document.querySelector('#account-section .error-message');
const passwordToggles = document.querySelectorAll('.toggle-password');
const deleteAccountButton = document.getElementById('delete-account');

// User data cache
let userData = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // First check if the user is logged in
  checkAuthState();
  
  // Set up event listeners
  setupEventListeners();
});

// Set up all event listeners
function setupEventListeners() {
  // Tab navigation
  profileTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab.dataset.tab);
    });
  });
  
  // Password toggles
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const input = this.parentElement.querySelector('input');
      if (input.type === 'password') {
        input.type = 'text';
        this.querySelector('i').className = 'ri-eye-off-line';
      } else {
        input.type = 'password';
        this.querySelector('i').className = 'ri-eye-line';
      }
    });
  });
  
  // Profile form submission
  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileUpdate);
  }
  
  // Settings form submission
  if (settingsForm) {
    settingsForm.addEventListener('submit', handleSettingsUpdate);
  }
  
  // Notifications form submission
  if (notificationsForm) {
    notificationsForm.addEventListener('submit', handleNotificationsUpdate);
  }
  
  // Password form submission
  if (passwordForm) {
    passwordForm.addEventListener('submit', handlePasswordUpdate);
  }
  
  // Delete account button
  if (deleteAccountButton) {
    deleteAccountButton.addEventListener('click', handleDeleteAccount);
  }
}

// Check if the user is logged in
function checkAuthState() {
  // Try to get auth token
  const token = localStorage.getItem('auth_token') || getCookie('auth_token');
  
  if (!token) {
    // Not logged in, redirect to login page
    window.location.href = '/pages/user/login.html';
    return;
  }
  
  // Get user data and load profile
  fetchUserData(token);
}

// Fetch user data from the server
async function fetchUserData(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const data = await response.json();
    userData = data.user;
    
    // Update user interface with data
    updateProfileUI(userData);
    
    // Load saved tools
    fetchSavedTools(token);
    
    // Load user preferences
    if (userData.preferences) {
      updatePreferencesUI(userData.preferences);
    }
    
  } catch (error) {
    console.error('Error fetching user data:', error);
    
    // Token might be invalid, redirect to login
    //localStorage.removeItem('auth_token');
    //eraseCookie('auth_token');
    //window.location.href = '/pages/user/login.html';
  }
}

// Update profile UI with user data
function updateProfileUI(user) {
  // Update header information
  profileName.textContent = user.name || user.username;
  profileEmail.textContent = user.email;
  
  // Set avatar with first letter of name or username
  const firstLetter = (user.name || user.username).charAt(0).toUpperCase();
  profileAvatar.textContent = firstLetter;
  
  // Fill form fields
  profileInputName.value = user.name || '';
  profileInputUsername.value = user.username || '';
  profileInputEmail.value = user.email || '';
  profileInputBio.value = user.bio || '';
}

// Update preferences UI with saved preferences
function updatePreferencesUI(preferences) {
  // Theme preference
  if (preferences.theme) {
    const themeRadio = document.querySelector(`input[name="theme"][value="${preferences.theme}"]`);
    if (themeRadio) themeRadio.checked = true;
  } else {
    // Default to system
    document.getElementById('theme-system').checked = true;
  }
  
  // Language preference
  if (preferences.language) {
    languageSelect.value = preferences.language;
  }
  
  // Tools layout preference
  if (preferences.toolsLayout) {
    const layoutRadio = document.querySelector(`input[name="toolsLayout"][value="${preferences.toolsLayout}"]`);
    if (layoutRadio) layoutRadio.checked = true;
  } else {
    // Default to grid
    document.getElementById('layout-grid').checked = true;
  }
  
  // Notification preferences
  if (preferences.notifications) {
    const { notifications } = preferences;
    
    // Email notifications
    document.getElementById('notify-updates').checked = !!notifications.emailUpdates;
    document.getElementById('notify-saved').checked = !!notifications.emailSavedTools;
    document.getElementById('notify-newsletter').checked = !!notifications.emailNewsletter;
    
    // Site notifications
    document.getElementById('notify-site-updates').checked = !!notifications.siteUpdates;
    document.getElementById('notify-site-tools').checked = !!notifications.siteTools;
  }
}

// Fetch user's saved tools
async function fetchSavedTools(token) {
  if (!userData || !userData.savedTools || userData.savedTools.length === 0) {
    // No saved tools
    loadingMessage.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }
  
  try {
    // For now, show dummy data since we don't have a complete tools API yet
    const dummyTools = [
      {
        id: 'tool1',
        name: 'Age Calculator',
        description: 'Calculate age from date of birth',
        icon: 'calendar-line',
        color: 'var(--primary-blue)'
      },
      {
        id: 'tool2',
        name: 'Text Case Converter',
        description: 'Convert text to UPPERCASE, lowercase, Title Case, etc.',
        icon: 'text',
        color: 'var(--primary-purple)'
      },
      {
        id: 'tool3',
        name: 'Password Generator',
        description: 'Generate secure random passwords',
        icon: 'key-2-line',
        color: 'var(--primary-green)'
      }
    ];
    
    // Display saved tools
    displaySavedTools(dummyTools);
    
  } catch (error) {
    console.error('Error fetching saved tools:', error);
    loadingMessage.textContent = 'Failed to load saved tools. Please try again.';
  }
}

// Display saved tools in the grid
function displaySavedTools(tools) {
  loadingMessage.style.display = 'none';
  
  if (!tools || tools.length === 0) {
    emptyState.style.display = 'block';
    return;
  }
  
  toolsGrid.style.display = 'grid';
  toolsGrid.innerHTML = '';
  
  tools.forEach(tool => {
    const toolCard = document.createElement('div');
    toolCard.className = 'tool-card';
    toolCard.innerHTML = `
      <div class="tool-header">
        <h3>${tool.name}</h3>
        <div class="tool-actions">
          <button class="tool-action" data-tool-id="${tool.id}" title="Remove from saved tools">
            <i class="ri-star-fill"></i>
          </button>
        </div>
      </div>
      <div class="tool-body">
        <p class="tool-description">${tool.description}</p>
      </div>
      <div class="tool-footer">
        <a href="/tools/${tool.id}" class="btn-secondary">Open Tool</a>
      </div>
    `;
    
    // Add click handler for the remove button
    const removeButton = toolCard.querySelector('.tool-action');
    removeButton.addEventListener('click', () => {
      removeSavedTool(tool.id);
    });
    
    toolsGrid.appendChild(toolCard);
  });
}

// Remove a tool from saved tools
async function removeSavedTool(toolId) {
  const token = localStorage.getItem('auth_token') || getCookie('auth_token');
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/saved-tools/${toolId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove tool');
    }
    
    // Remove from UI
    const toolCard = document.querySelector(`.tool-action[data-tool-id="${toolId}"]`).closest('.tool-card');
    toolCard.style.opacity = '0';
    setTimeout(() => {
      toolCard.remove();
      
      // Check if there are any tools left
      if (toolsGrid.children.length === 0) {
        toolsGrid.style.display = 'none';
        emptyState.style.display = 'block';
      }
    }, 300);
    
    // Update userData
    userData.savedTools = userData.savedTools.filter(id => id !== toolId);
    
  } catch (error) {
    console.error('Error removing saved tool:', error);
    alert('Failed to remove tool. Please try again.');
  }
}

// Handle profile form submission
async function handleProfileUpdate(e) {
  e.preventDefault();
  
  const token = localStorage.getItem('auth_token') || getCookie('auth_token');
  const name = profileInputName.value.trim();
  const username = profileInputUsername.value.trim();
  const bio = profileInputBio.value.trim();
  
  // Validate
  if (!name || !username) {
    showProfileError('Name and username are required');
    return;
  }
  
  // Show loading state
  const submitBtn = profileForm.querySelector('button[type="submit"]');
  submitBtn.classList.add('btn-loading');
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, username, bio })
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to update profile');
    }
    
    const data = await response.json();
    
    // Update local userData
    userData = { ...userData, ...data.user };
    
    // Update local storage and cookies
    localStorage.setItem('user', JSON.stringify(userData));
    setCookie('user', JSON.stringify(userData), getCookie('auth_token') ? 30 : null);
    
    // Update UI
    updateProfileUI(userData);
    
    // Show success message
    showProfileSuccess('Profile updated successfully');
    
  } catch (error) {
    console.error('Error updating profile:', error);
    showProfileError(error.message);
  } finally {
    // Reset button state
    submitBtn.classList.remove('btn-loading');
  }
}

// Handle settings form submission
async function handleSettingsUpdate(e) {
  e.preventDefault();
  
  const token = localStorage.getItem('auth_token') || getCookie('auth_token');
  const theme = document.querySelector('input[name="theme"]:checked').value;
  const language = languageSelect.value;
  const toolsLayout = document.querySelector('input[name="toolsLayout"]:checked').value;
  
  // Show loading state
  const submitBtn = settingsForm.querySelector('button[type="submit"]');
  submitBtn.classList.add('btn-loading');
  
  try {
    // Build preferences object
    const preferences = {
      ...userData.preferences,
      theme,
      language,
      toolsLayout
    };
    
    const response = await fetch(`${API_BASE_URL}/auth/preferences`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ preferences })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update settings');
    }
    
    // Update local userData
    userData.preferences = preferences;
    
    // Update local storage and cookies
    localStorage.setItem('user', JSON.stringify(userData));
    setCookie('user', JSON.stringify(userData), getCookie('auth_token') ? 30 : null);
    
    // Apply theme immediately if changed
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else if (theme === 'light') {
      document.body.classList.remove('dark-mode');
    } else {
      // System default - check media query
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
    
    // Show success message
    showSettingsSuccess('Settings updated successfully');
    
  } catch (error) {
    console.error('Error updating settings:', error);
    alert('Failed to update settings. Please try again.');
  } finally {
    // Reset button state
    submitBtn.classList.remove('btn-loading');
  }
}

// Handle notifications form submission
async function handleNotificationsUpdate(e) {
  e.preventDefault();
  
  const token = localStorage.getItem('auth_token') || getCookie('auth_token');
  
  // Get notification values
  const emailUpdates = document.getElementById('notify-updates').checked;
  const emailSavedTools = document.getElementById('notify-saved').checked;
  const emailNewsletter = document.getElementById('notify-newsletter').checked;
  const siteUpdates = document.getElementById('notify-site-updates').checked;
  const siteTools = document.getElementById('notify-site-tools').checked;
  
  // Show loading state
  const submitBtn = notificationsForm.querySelector('button[type="submit"]');
  submitBtn.classList.add('btn-loading');
  
  try {
    // Build notifications object
    const notifications = {
      emailUpdates,
      emailSavedTools,
      emailNewsletter,
      siteUpdates,
      siteTools
    };
    
    // Build preferences object with updated notifications
    const preferences = {
      ...userData.preferences,
      notifications
    };
    
    const response = await fetch(`${API_BASE_URL}/auth/preferences`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ preferences })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update notification preferences');
    }
    
    // Update local userData
    userData.preferences = preferences;
    
    // Update local storage and cookies
    localStorage.setItem('user', JSON.stringify(userData));
    setCookie('user', JSON.stringify(userData), getCookie('auth_token') ? 30 : null);
    
    // Show success message
    showNotificationsSuccess('Notification preferences updated successfully');
    
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    alert('Failed to update notification preferences. Please try again.');
  } finally {
    // Reset button state
    submitBtn.classList.remove('btn-loading');
  }
}

// Handle password form submission
async function handlePasswordUpdate(e) {
  e.preventDefault();
  
  const token = localStorage.getItem('auth_token') || getCookie('auth_token');
  const currentPass = currentPassword.value;
  const newPass = newPassword.value;
  const confirmPass = confirmPassword.value;
  
  // Validate
  if (!currentPass || !newPass || !confirmPass) {
    showAccountError('All password fields are required');
    return;
  }
  
  if (newPass !== confirmPass) {
    showAccountError('New passwords do not match');
    return;
  }
  
  if (newPass.length < 8) {
    showAccountError('New password must be at least 8 characters long');
    return;
  }
  
  // Show loading state
  const submitBtn = passwordForm.querySelector('button[type="submit"]');
  submitBtn.classList.add('btn-loading');
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentPassword: currentPass,
        newPassword: newPass
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update password');
    }
    
    // Clear form
    passwordForm.reset();
    
    // Show success message
    showAccountSuccess('Password updated successfully');
    
  } catch (error) {
    console.error('Error updating password:', error);
    showAccountError(error.message);
  } finally {
    // Reset button state
    submitBtn.classList.remove('btn-loading');
  }
}

// Handle delete account button click
function handleDeleteAccount() {
  const confirm = window.confirm(
    'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
  );
  
  if (confirm) {
    deleteAccount();
  }
}

// Delete account
async function deleteAccount() {
  const token = localStorage.getItem('auth_token') || getCookie('auth_token');
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/account`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete account');
    }
    
    // Clear user data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    eraseCookie('auth_token');
    eraseCookie('user');
    
    // Redirect to home page
    window.location.href = '/';
    
  } catch (error) {
    console.error('Error deleting account:', error);
    alert('Failed to delete account. Please try again or contact support.');
  }
}

// Switch between tabs
function switchTab(tabName) {
  // Update tab buttons
  profileTabs.forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.tab === tabName) {
      tab.classList.add('active');
    }
  });
  
  // Update sections
  profileSections.forEach(section => {
    section.classList.remove('active');
    if (section.id === `${tabName}-section`) {
      section.classList.add('active');
    }
  });
  
  // Hide all alert messages
  document.querySelectorAll('.form-alert').forEach(alert => {
    alert.style.display = 'none';
  });
}

// Show profile success message
function showProfileSuccess(message) {
  profileSuccessMessage.textContent = message;
  profileSuccessAlert.style.display = 'flex';
  profileErrorAlert.style.display = 'none';
  
  // Hide after 5 seconds
  setTimeout(() => {
    profileSuccessAlert.style.display = 'none';
  }, 5000);
}

// Show profile error message
function showProfileError(message) {
  profileErrorMessage.textContent = message;
  profileErrorAlert.style.display = 'flex';
  profileSuccessAlert.style.display = 'none';
}

// Show settings success message
function showSettingsSuccess(message) {
  settingsSuccessMessage.textContent = message;
  settingsSuccessAlert.style.display = 'flex';
  
  // Hide after 5 seconds
  setTimeout(() => {
    settingsSuccessAlert.style.display = 'none';
  }, 5000);
}

// Show notifications success message
function showNotificationsSuccess(message) {
  notificationsSuccessMessage.textContent = message;
  notificationsSuccessAlert.style.display = 'flex';
  
  // Hide after 5 seconds
  setTimeout(() => {
    notificationsSuccessAlert.style.display = 'none';
  }, 5000);
}

// Show account success message
function showAccountSuccess(message) {
  accountSuccessMessage.textContent = message;
  accountSuccessAlert.style.display = 'flex';
  accountErrorAlert.style.display = 'none';
  
  // Hide after 5 seconds
  setTimeout(() => {
    accountSuccessAlert.style.display = 'none';
  }, 5000);
}

// Show account error message
function showAccountError(message) {
  accountErrorMessage.textContent = message;
  accountErrorAlert.style.display = 'flex';
  accountSuccessAlert.style.display = 'none';
}

// Cookie helper functions
function setCookie(name, value, days) {
  let expires = '';
  
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  
  document.cookie = `${name}=${value || ''}${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  
  return null;
}

function eraseCookie(name) {
  document.cookie = `${name}=; Max-Age=-99999999; path=/`;
} 