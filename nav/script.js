// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navLinkItems = document.querySelectorAll('.nav-links a');
const notificationBadge = document.querySelector('.notification-badge');
const notificationTrigger = document.querySelector('.notification-dropdown-trigger');
const userTrigger = document.querySelector('.user-dropdown-trigger');
const markAllReadBtn = document.querySelector('.mark-all-read');
const markReadBtns = document.querySelectorAll('.mark-read');
const notificationItems = document.querySelectorAll('.notification-item');

// Store states
let isNotificationOpen = false;
let isUserProfileOpen = false;

// Initialize after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Re-query elements since they might not be available immediately
    const notificationTriggerRecheck = document.querySelector('.notification-dropdown-trigger');
    const userTriggerRecheck = document.querySelector('.user-dropdown-trigger');
    
    // If elements weren't found, try to find by icon-button class instead
    if (!notificationTriggerRecheck) {
        // Try to find the notification button by its icon
        const notificationButtons = document.querySelectorAll('.icon-button');
        notificationButtons.forEach(button => {
            if (button.querySelector('.ri-notification-2-line')) {
                button.classList.add('notification-dropdown-trigger');
            }
        });
    }
    
    if (!userTriggerRecheck) {
        // Try to find the user profile button by its icon
        const userButtons = document.querySelectorAll('.icon-button');
        userButtons.forEach(button => {
            if (button.querySelector('.ri-user-3-line')) {
                button.classList.add('user-dropdown-trigger');
            }
        });
    }
    
    // Initialize after all elements are set up
    init();
});

// Helper function to lock/unlock body scroll for modals
function toggleBodyScroll(lock) {
    if (lock) {
        // Add class to prevent scrolling when dropdown is open
        document.body.classList.add('has-dropdown-open');
        
        // Store the current scroll position
        document.body.dataset.scrollY = window.scrollY;
        
        // On iOS Safari, we need additional handling
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            document.body.style.position = 'fixed';
            document.body.style.top = `-${window.scrollY}px`;
            document.body.style.width = '100%';
        }
    } else {
        // Remove class to allow scrolling again
        document.body.classList.remove('has-dropdown-open');
        
        // On iOS Safari, restore scroll position
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            const scrollY = document.body.dataset.scrollY || 0;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, parseInt(scrollY || 0));
        }
    }
}

// Cookie functions
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
}

// User state and authentication
let isLoggedIn = false;
let userData = null;

// Theme Toggle Functionality
window.toggleTheme = function() {
    const body = document.body;
    const isDarkMode = body.classList.toggle('dark-mode');
    
    // Save theme preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', isDarkMode ? '#1e293b' : '#ffffff');
    }
    
    // Update toggle button state
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const toggleCircle = themeToggle.querySelector('.toggle-circle');
        if (toggleCircle) {
            toggleCircle.style.transform = isDarkMode ? 'scale(1)' : 'scale(0)';
        }
    }
}

// Mobile Menu Toggle
function toggleMenu() {
    navLinks.classList.toggle('active');
    
    // Toggle menu icon
    const menuIcon = menuToggle.querySelector('i');
    if (menuIcon) {
        if (navLinks.classList.contains('active')) {
            menuIcon.classList.remove('ri-menu-line');
            menuIcon.classList.add('ri-close-line');
        } else {
            menuIcon.classList.remove('ri-close-line');
            menuIcon.classList.add('ri-menu-line');
        }
    }
    
    // Close any open dropdowns when opening the menu
    closeAllDropdowns();
}

// Open notification dropdown
function openNotificationDropdown() {
    // This function might be called before the button is properly selected
    const notificationBtn = document.querySelector('.notification-dropdown-trigger');
    if (!notificationBtn) {
        console.error('Notification button not found');
        return;
    }
    
    if (isUserProfileOpen) {
        closeUserDropdown();
    }
    
    notificationBtn.classList.add('active');
    isNotificationOpen = true;
    
    // On mobile, lock scroll
    if (window.innerWidth <= 900) {
        toggleBodyScroll(true);
    }
    
    // Close mobile menu if it's open
    if (navLinks.classList.contains('active')) {
        toggleMenu();
    }
    
}

// Close notification dropdown
function closeNotificationDropdown() {
    const notificationBtn = document.querySelector('.notification-dropdown-trigger');
    if (!notificationBtn) return;
    
    notificationBtn.classList.remove('active');
    isNotificationOpen = false;
    
    // If no other dropdowns are open, unlock scroll
    if (!isUserProfileOpen && window.innerWidth <= 900) {
        toggleBodyScroll(false);
    }
    
}

// Open user dropdown
function openUserDropdown() {
    // This function might be called before the button is properly selected
    const userBtn = document.querySelector('.user-dropdown-trigger');
    if (!userBtn) {
        console.error('User button not found');
        return;
    }
    
    if (isNotificationOpen) {
        closeNotificationDropdown();
    }
    
    userBtn.classList.add('active');
    isUserProfileOpen = true;
    
    // On mobile, lock scroll
    if (window.innerWidth <= 900) {
        toggleBodyScroll(true);
    }
    
    // Close mobile menu if it's open
    if (navLinks.classList.contains('active')) {
        toggleMenu();
    }
    
}

// Close user dropdown
function closeUserDropdown() {
    const userBtn = document.querySelector('.user-dropdown-trigger');
    if (!userBtn) return;
    
    userBtn.classList.remove('active');
    isUserProfileOpen = false;
    
    // If no other dropdowns are open, unlock scroll
    if (!isNotificationOpen && window.innerWidth <= 900) {
        toggleBodyScroll(false);
    }
}

// Close all dropdown menus
function closeAllDropdowns() {
    closeNotificationDropdown();
    closeUserDropdown();
    
    // Make sure to unlock scroll when all dropdowns are closed
    if (window.innerWidth <= 900) {
        toggleBodyScroll(false);
    }
}

// Close mobile menu when clicking on a link
function handleNavLinkClick() {
    if (window.innerWidth <= 900 && navLinks.classList.contains('active')) {
        toggleMenu();
    }
}

// Handle document clicks to close dropdowns when clicking outside
function handleDocumentClick(e) {
    const isMenuToggle = e.target.closest('#menu-toggle');
    const isNotificationTrigger = e.target.closest('.notification-dropdown-trigger');
    const isUserTrigger = e.target.closest('.user-dropdown-trigger');
    
    // Close menu if clicking outside
    if (!isMenuToggle && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
        toggleMenu();
    }
    
    // Handle notification dropdown
    if (!isNotificationTrigger && isNotificationOpen && !e.target.closest('.notification-dropdown')) {
        closeNotificationDropdown();
    }
    
    // Handle user dropdown
    if (!isUserTrigger && isUserProfileOpen && !e.target.closest('.user-dropdown')) {
        closeUserDropdown();
    }
}

// Handle window resize
function handleWindowResize() {
    // Close mobile menu if window is resized to desktop
    if (window.innerWidth > 900 && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        const menuIcon = menuToggle.querySelector('i');
        if (menuIcon) {
            menuIcon.classList.remove('ri-close-line');
            menuIcon.classList.add('ri-menu-line');
        }
    }
    
    // Also close dropdowns on resize
    if (window.innerWidth !== lastWindowWidth) {
        closeAllDropdowns();
        lastWindowWidth = window.innerWidth;
    }
}

// Track window width for resize events
let lastWindowWidth = window.innerWidth;

// Notifications functionality
function handleNotifications() {
    // Add event listeners directly to buttons, regardless of class
    const notificationButtons = document.querySelectorAll('.icon-button');
    notificationButtons.forEach(button => {
        if (button.querySelector('.ri-notification-2-line')) {
            // This is a notification button
            button.classList.add('notification-dropdown-trigger');
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                
                // Toggle notification dropdown
                if (isNotificationOpen) {
                    closeNotificationDropdown();
                } else {
                    openNotificationDropdown();
                }
            });
            
            // Prevent hover behavior on touch devices
            button.addEventListener('touchstart', function(e) {
                e.preventDefault(); // Prevent default hover
                if (window.innerWidth <= 900) {
                    if (isNotificationOpen) {
                        closeNotificationDropdown();
                    } else {
                        openNotificationDropdown();
                    }
                }
            }, { passive: false });
            
            // Prevent clicks within dropdown from closing it
            const notificationDropdown = button.querySelector('.notification-dropdown');
            if (notificationDropdown) {
                notificationDropdown.addEventListener('click', function(e) {
                    // Don't propagate clicks on dropdown content (except mark-read buttons)
                    if (!e.target.closest('.mark-read') && !e.target.closest('.mark-all-read')) {
                        e.stopPropagation();
                    }
                });
            }
        }
    });
    
    // Mark all read button
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent closing dropdown
            notificationItems.forEach(item => {
                item.classList.remove('unread');
            });
            
            updateNotificationBadge();
            setCookie('notifications_read', 'true', 7);
        });
    }
    
    // Individual mark read buttons
    markReadBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent closing dropdown
            const notificationItem = this.closest('.notification-item');
            if (notificationItem) {
                notificationItem.classList.remove('unread');
                updateNotificationBadge();
            }
        });
    });
    
    // Update notification badge count
    function updateNotificationBadge() {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = unreadCount;
            if (unreadCount === 0) {
                badge.style.display = 'none';
            } else {
                badge.style.display = 'flex';
            }
            
            // Store unread count in cookie
            setCookie('unread_notifications', unreadCount, 7);
        }
    }
    
    // Check for notifications on page load
    function checkNotifications() {
        const notificationsRead = getCookie('notifications_read');
        if (notificationsRead === 'true') {
            notificationItems.forEach(item => {
                item.classList.remove('unread');
            });
            updateNotificationBadge();
        } else {
            updateNotificationBadge();
        }
    }
    
    checkNotifications();
}

// User profile functionality
function handleUserProfile() {
    // Add event listeners directly to buttons, regardless of class
    const userButtons = document.querySelectorAll('.icon-button');
    userButtons.forEach(button => {
        if (button.querySelector('.ri-user-3-line')) {
            // This is a user profile button
            button.classList.add('user-dropdown-trigger');
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                
                // Toggle user dropdown
                if (isUserProfileOpen) {
                    closeUserDropdown();
                } else {
                    openUserDropdown();
                }
            });
            
            // Prevent hover behavior on touch devices
            button.addEventListener('touchstart', function(e) {
                e.preventDefault(); // Prevent default hover
                if (window.innerWidth <= 900) {
                    if (isUserProfileOpen) {
                        closeUserDropdown();
                    } else {
                        openUserDropdown();
                    }
                }
            }, { passive: false });
            
            // Prevent clicks within dropdown from closing it
            const userDropdown = button.querySelector('.user-dropdown');
            if (userDropdown) {
                userDropdown.addEventListener('click', function(e) {
                    // Don't propagate clicks on dropdown content (except logout button)
                    if (!e.target.closest('#logout-button')) {
                        e.stopPropagation();
                    }
                });
            }
        }
    });
    
    // Check if user is logged in from cookie
    function checkUserLogin() {
        const userToken = getCookie('user_token');
        if (userToken) {
            // User is logged in
            isLoggedIn = true;
            
            // Try to get user data
            try {
                userData = JSON.parse(getCookie('user_data'));
                updateUserInterface(true, userData);
            } catch (e) {
                // If user data is corrupted, clear cookies
                eraseCookie('user_token');
                eraseCookie('user_data');
                isLoggedIn = false;
                updateUserInterface(false);
            }
        } else {
            // User is not logged in
            updateUserInterface(false);
        }
    }
    
    // Update UI based on login state
    function updateUserInterface(isLoggedIn, userData = null) {
        const userButton = document.querySelector('.user-dropdown-trigger');
        if (!userButton) return;
        
        const dropdown = userButton.querySelector('.user-dropdown');
        if (!dropdown) return;
        
        if (isLoggedIn && userData) {
            // Show logged in view
            dropdown.innerHTML = `
                <div class="user-profile">
                    <div class="user-info">
                        <div class="user-avatar">${userData.name.charAt(0)}</div>
                        <div class="user-details">
                            <p class="user-name">${userData.name}</p>
                            <p class="user-email">${userData.email}</p>
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
            
            // Add logout functionality
            const logoutBtn = dropdown.querySelector('#logout-button');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Clear user data
                    eraseCookie('user_token');
                    eraseCookie('user_data');
                    isLoggedIn = false;
                    userData = null;
                    updateUserInterface(false);
                    
                    // Close dropdown
                    closeUserDropdown();
                });
            }
        } else {
            // Show login view
            dropdown.innerHTML = `
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
    
    // Initialize user state
    checkUserLogin();
    
    // Example function to simulate login (for testing)
    window.simulateLogin = function(name, email) {
        const userData = {
            name: name || 'Test User',
            email: email || 'test@example.com'
        };
        
        setCookie('user_token', 'sample-token-123', 7);
        setCookie('user_data', JSON.stringify(userData), 7);
        
        isLoggedIn = true;
        updateUserInterface(true, userData);
    };
}

// Apply stored theme preference
function applyThemePreference() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const toggleCircle = themeToggle.querySelector('.toggle-circle');
            if (toggleCircle) {
                toggleCircle.style.transform = 'scale(1)';
            }
        }
    }
}

// Initialize
function init() {
    
    // Apply theme preference
    applyThemePreference();
    
    // Theme toggling
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Mobile menu
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }
    
    // Navigation links
    navLinkItems.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', handleDocumentClick);
    
    // Handle window resize
    window.addEventListener('resize', handleWindowResize);
    
    // Initialize notifications
    handleNotifications();
    
    // Initialize user profile
    handleUserProfile();
    
    // Active link highlighting
    const currentPath = window.location.pathname;
    navLinkItems.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '/' && currentPath === '/') {
            link.classList.add('active');
        } else if (href !== '/' && currentPath.startsWith(href)) {
            link.classList.add('active');
        }
    });
    
}

// Make sure we only initialize once when the DOM is loaded
if (document.readyState === 'loading') {
    // Still loading, do nothing, wait for the DOMContentLoaded event
} else {
    // DOM already loaded, initialize now
    init();
}

// Notification dropdown interaction
document.addEventListener('DOMContentLoaded', function() {
    var seeAllBtn = document.getElementById('refresh-notifications');
    var dropdown = document.querySelector('.notification-dropdown');
    if (seeAllBtn && dropdown) {
        seeAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            var footer = dropdown.querySelector('.notification-footer');
            var content = document.createElement('div');
            content.className = 'notification-loading';
            content.style.display = 'flex';
            content.style.justifyContent = 'center';
            content.style.alignItems = 'center';
            content.style.height = '60px';
            content.innerHTML = '<div class="loader"></div>';
            // Remove footer and show loading
            if (footer) footer.replaceWith(content);
            // Add simple CSS loader
            if (!document.getElementById('notif-loader-style')) {
              var style = document.createElement('style');
              style.id = 'notif-loader-style';
              style.innerHTML = '.loader { border: 4px solid #f3f3f3; border-top: 4px solid #555; border-radius: 50%; width: 28px; height: 28px; animation: spin 1s linear infinite; margin: 0 auto; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
              document.head.appendChild(style);
            }
            setTimeout(function() {
                content.innerHTML = '<span style="color:#888;font-size:15px;">No new notification.</span>';
            }, 2000);
        });
    }
});