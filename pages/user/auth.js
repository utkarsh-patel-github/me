// API Base URL - Change this to your production URL when deployed
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const authTabs = document.querySelectorAll('.auth-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const passwordToggles = document.querySelectorAll('.toggle-password');
const registerPassword = document.getElementById('register-password');
const strengthBar = document.querySelector('.strength-bar');
const strengthValue = document.getElementById('strength-value');
const loginError = document.getElementById('login-error-message');
const registerError = document.getElementById('register-error-message');
const loginErrorContainer = loginForm.querySelector('.form-alert');
const registerErrorContainer = registerForm.querySelector('.form-alert');
const switchTabLinks = document.querySelectorAll('.switch-tab');
const rememberMe = document.getElementById('remember-me');

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is already logged in (from local storage or cookies)
  checkAuthState();
  
  // Set up event listeners
  setupEventListeners();
});

// Set up all event listeners
function setupEventListeners() {
  // Tab switching
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab.dataset.tab);
    });
  });
  
  // Switch tab links (in form footers)
  switchTabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(link.dataset.target);
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
  
  // Password strength meter
  if (registerPassword) {
    registerPassword.addEventListener('input', checkPasswordStrength);
  }
  
  // Form submissions
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
  
  // Social login buttons
  const googleButtons = document.querySelectorAll('.social-btn.google');
  googleButtons.forEach(btn => {
    btn.addEventListener('click', () => handleSocialLogin('google'));
  });
  
  const githubButtons = document.querySelectorAll('.social-btn.github');
  githubButtons.forEach(btn => {
    btn.addEventListener('click', () => handleSocialLogin('github'));
  });
}

// Switch between login and register tabs
function switchTab(tabName) {
  // Remove active class from all tabs
  authTabs.forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Add active class to selected tab
  document.querySelector(`.auth-tab[data-tab="${tabName}"]`).classList.add('active');
  
  // Hide all forms
  document.querySelectorAll('.auth-form').forEach(form => {
    form.classList.remove('active');
  });
  
  // Show selected form
  document.getElementById(`${tabName}-form`).classList.add('active');
  
  // Clear any error messages
  loginErrorContainer.style.display = 'none';
  registerErrorContainer.style.display = 'none';
}

// Handle login form submission
async function handleLogin(e) {
  e.preventDefault();
  
  // Get form data
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const remember = rememberMe.checked;
  
  // Validate
  if (!email || !password) {
    showLoginError('Please enter both email and password');
    return;
  }
  
  // Show loading state
  const submitBtn = loginForm.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  submitBtn.classList.add('btn-loading');
  
  try {
    // Make API request
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed. Please try again.');
    }
    
    // Login successful - save user data
    saveUserData(data.token, data.user, remember);
    
    // Update UI
    showSuccessMessage('Login successful! Redirecting...');
    
    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = '/'; // Redirect to homepage or dashboard
    }, 1500);
    
  } catch (error) {
    console.error('Error logging in:', error);
    // Check if it's a server/connection error or authentication error
    if (error.message.includes('buffering timed out') || 
        error.message.includes('NetworkError') || 
        error.name === 'TypeError') {
      showLoginError('Service temporarily unavailable. Please try again later.');
    } else {
      // showLoginError(error.message);
      showLoginError('Service is temporarily unavailable. Please try again later.');
    }
  } finally {
    // Reset button state
    submitBtn.classList.remove('btn-loading');
    submitBtn.textContent = originalBtnText;
  }
}

// Handle registration form submission
async function handleRegister(e) {
  e.preventDefault();
  
  // Get form data
  const name = document.getElementById('register-name').value;
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const termsAgreed = document.getElementById('agree-terms').checked;
  
  // Validate
  if (!name || !username || !email || !password) {
    showRegisterError('Please fill in all required fields');
    return;
  }
  
  if (!termsAgreed) {
    showRegisterError('You must agree to the Terms of Service and Privacy Policy');
    return;
  }
  
  // Password strength validation
  const passwordStrength = getPasswordStrength(password);
  if (passwordStrength < 2) {
    showRegisterError('Please choose a stronger password');
    return;
  }
  
  // Show loading state
  const submitBtn = registerForm.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  submitBtn.classList.add('btn-loading');
  
  try {
    // Make API request
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed. Please try again.');
    }
    
    // Registration successful - save user data
    saveUserData(data.token, data.user, true);
    
    // Update UI
    showSuccessMessage('Account created successfully! Redirecting...');
    
    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = '/'; // Redirect to homepage or dashboard
    }, 1500);
    
  } catch (error) {
    console.error('Error registering:', error);
    // Check if it's a server/connection error or authentication error
    if (error.message.includes('buffering timed out') || 
        error.message.includes('NetworkError') || 
        error.name === 'TypeError') {
      showRegisterError('Service temporarily unavailable. Please try again later.');
    } else {
      showRegisterError(error.message);
    }
  } finally {
    // Reset button state
    submitBtn.classList.remove('btn-loading');
    submitBtn.textContent = originalBtnText;
  }
}

// Handle social login
function handleSocialLogin(provider) {
  // For now, show a message that this feature is coming soon
  alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login will be available soon!`);
  
  // This would typically redirect to the oauth provider's login page
  // window.location.href = `${API_BASE_URL}/auth/${provider}`;
}

// Check password strength and update UI
function checkPasswordStrength() {
  const password = registerPassword.value;
  const strength = getPasswordStrength(password);
  
  // Update strength bar and text
  strengthBar.className = 'strength-bar';
  
  if (password.length === 0) {
    strengthBar.style.width = '0';
    strengthValue.textContent = 'Weak';
  } else if (strength === 1) {
    strengthBar.style.width = '25%';
    strengthBar.classList.add('weak');
    strengthValue.textContent = 'Weak';
  } else if (strength === 2) {
    strengthBar.style.width = '50%';
    strengthBar.classList.add('medium');
    strengthValue.textContent = 'Medium';
  } else if (strength === 3) {
    strengthBar.style.width = '75%';
    strengthBar.classList.add('strong');
    strengthValue.textContent = 'Strong';
  } else if (strength === 4) {
    strengthBar.style.width = '100%';
    strengthBar.classList.add('very-strong');
    strengthValue.textContent = 'Very Strong';
  }
}

// Get password strength score (0-4)
function getPasswordStrength(password) {
  let score = 0;
  
  // Length check
  if (password.length >= 8) score++;
  
  // Complexity checks
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  return score;
}

// Show login form error message
function showLoginError(message) {
  loginError.textContent = message;
  loginErrorContainer.style.display = 'flex';
}

// Show registration form error message
function showRegisterError(message) {
  registerError.textContent = message;
  registerErrorContainer.style.display = 'flex';
}

// Show success message (replaces error container with success message)
function showSuccessMessage(message) {
  const activeForm = document.querySelector('.auth-form.active');
  const errorContainer = activeForm.querySelector('.form-alert');
  
  errorContainer.className = 'form-alert success-message';
  errorContainer.innerHTML = `<i class="ri-checkbox-circle-line"></i><span>${message}</span>`;
  errorContainer.style.display = 'flex';
}

// Save user data to local storage and/or cookies
function saveUserData(token, user, remember) {
  // Save to localStorage for easy access on the client
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  // If remember me is checked, also save in cookies with longer expiry
  if (remember) {
    setCookie('auth_token', token, 30); // 30 days
    setCookie('user', JSON.stringify(user), 30);
  } else {
    // Session cookie (expires when browser is closed)
    setCookie('auth_token', token, null);
    setCookie('user', JSON.stringify(user), null);
  }
  
  // Update UI to reflect logged in state
  updateAuthUI(true, user);
}

// Check if user is already logged in
function checkAuthState() {
  // Try to get user data from localStorage first
  let token = localStorage.getItem('auth_token');
  let userData = localStorage.getItem('user');
  
  // If not in localStorage, try cookies
  if (!token || !userData) {
    token = getCookie('auth_token');
    userData = getCookie('user');
  }
  
  if (token && userData) {
    try {
      const user = JSON.parse(userData);
      updateAuthUI(true, user);
      
      // Verify token with server if on a protected page
      validateToken(token);
      
      // If on login page, redirect to home
      if (window.location.pathname.includes('/pages/user/login')) {
        window.location.href = '/';
      }
    } catch (e) {
      // Handle invalid JSON
      console.error('Error parsing user data:', e);
      clearUserData();
    }
  }
}

// Validate token with server
async function validateToken(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      // Token is invalid or expired
      throw new Error('Invalid token');
    }
    
    // Update user data with latest from server
    const data = await response.json();
    localStorage.setItem('user', JSON.stringify(data.user));
    
  } catch (error) {
    console.error('Token validation failed:', error);
    clearUserData();
  }
}

// Update UI based on authentication state
function updateAuthUI(isLoggedIn, user) {
  // Find user dropdown content element
  const userDropdown = document.querySelector('.user-dropdown');
  
  if (!userDropdown) {
    // Dropdown not found on page
    return;
  }
  
  if (isLoggedIn && user) {
    // Show logged in view
    const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : 'U';
    
    userDropdown.innerHTML = `
      <div class="user-profile">
        <div class="user-info">
          <div class="user-avatar">${firstLetter}</div>
          <div class="user-details">
            <p class="user-name">${user.name || user.username}</p>
            <p class="user-email">${user.email}</p>
          </div>
        </div>
        <ul class="user-links">
          <li><a href="/pages/user/dashboard.html"><i class="ri-dashboard-line"></i> Dashboard</a></li>
          <li><a href="/pages/user/saved-tools.html"><i class="ri-star-line"></i> Saved Tools</a></li>
          <li><a href="/pages/user/settings.html"><i class="ri-settings-3-line"></i> Settings</a></li>
          <li class="logout-btn"><a href="#" id="logout-button"><i class="ri-logout-box-r-line"></i> Logout</a></li>
        </ul>
      </div>
    `;
    
    // Add logout handler
    const logoutButton = userDropdown.querySelector('#logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', handleLogout);
    }
    
  } else {
    // Show logged out view
    userDropdown.innerHTML = `
      <div class="user-login-options">
        <p>Sign in to save your preferences and access your saved tools.</p>
        <a href="/pages/user/login.html" class="btn-primary">Sign In</a>
        <div class="create-account">
          <span>Don't have an account?</span>
          <a href="/pages/user/login.html#register">Create Account</a>
        </div>
      </div>
    `;
  }
}

// Handle logout
function handleLogout(e) {
  e.preventDefault();
  
  // Clear user data
  clearUserData();
  
  // Update UI
  updateAuthUI(false);
  
  // Redirect to home page
  window.location.href = '/';
}

// Clear all user data on logout
function clearUserData() {
  // Clear localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  
  // Clear cookies
  eraseCookie('auth_token');
  eraseCookie('user');
}

// Cookie helpers
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

// Handle URL hash if present (for direct registration links)
(function checkUrlHash() {
  if (window.location.hash === '#register') {
    // Switch to register tab
    setTimeout(() => {
      switchTab('register');
    }, 100);
  }
})(); 