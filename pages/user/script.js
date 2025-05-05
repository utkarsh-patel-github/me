// User Pages JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching for login/register
    const tabs = document.querySelectorAll('.tab');
    const formContainers = document.querySelectorAll('.form-container');
    
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding form
                formContainers.forEach(container => {
                    container.classList.remove('active');
                    if (container.id === `${target}-form`) {
                        container.classList.add('active');
                    }
                });
                
                // Update URL hash without scrolling
                if (history.pushState) {
                    history.pushState(null, null, `#${target}`);
                } else {
                    location.hash = `#${target}`;
                }
            });
        });
        
        // Check for hash in URL to activate specific tab
        const hash = window.location.hash.substring(1); // Remove #
        if (hash) {
            const targetTab = document.querySelector(`.tab[data-tab="${hash}"]`);
            if (targetTab) {
                targetTab.click();
            }
        }
    }
    
    // Password visibility toggle
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Update icon
            const icon = button.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('ri-eye-line');
                icon.classList.add('ri-eye-off-line');
                button.setAttribute('title', 'Hide password');
            } else {
                icon.classList.remove('ri-eye-off-line');
                icon.classList.add('ri-eye-line');
                button.setAttribute('title', 'Show password');
            }
        });
    });
    
    // Password strength meter
    const passwordInput = document.getElementById('register-password');
    const confirmInput = document.getElementById('register-confirm');
    const strengthMeter = document.querySelector('.strength-meter span');
    const requirements = document.querySelectorAll('.requirement');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            let strength = 0;
            let color = '#EA4335'; // Default to red (weak)
            
            // Check requirements
            const hasLength = password.length >= 8;
            const hasUppercase = /[A-Z]/.test(password);
            const hasLowercase = /[a-z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            const hasSpecial = /[^A-Za-z0-9]/.test(password);
            
            // Update requirement indicators
            requirements.forEach(req => {
                const requirement = req.dataset.requirement;
                
                if (
                    (requirement === 'length' && hasLength) ||
                    (requirement === 'uppercase' && hasUppercase) ||
                    (requirement === 'lowercase' && hasLowercase) ||
                    (requirement === 'number' && hasNumber) ||
                    (requirement === 'special' && hasSpecial)
                ) {
                    req.classList.add('valid');
                } else {
                    req.classList.remove('valid');
                }
            });
            
            // Calculate strength
            if (hasLength) strength += 1;
            if (hasUppercase) strength += 1;
            if (hasLowercase) strength += 1;
            if (hasNumber) strength += 1;
            if (hasSpecial) strength += 1;
            
            // Set strength meter width and color
            let width = (strength / 5) * 100;
            
            if (strength >= 4) {
                color = '#34A853'; // Strong (green)
            } else if (strength >= 3) {
                color = '#FBBC05'; // Medium (yellow)
            } else if (strength >= 2) {
                color = '#F56C2D'; // Weak (orange)
            }
            
            strengthMeter.style.width = `${width}%`;
            strengthMeter.style.backgroundColor = color;
        });
    }
    
    // Form validation for register
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation
            const password = passwordInput.value;
            const confirmPassword = confirmInput.value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            // Here you would normally send the data to a server
            // For demo purposes, redirect to profile page
            window.location.href = '/pages/user/profile.html';
        });
    }
    
    // Form validation for login
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Here you would normally send the data to a server and authenticate
            // For demo purposes, redirect to profile page
            window.location.href = '/pages/user/profile.html';
        });
    }
    
    // Notification dropdown toggle
    const notificationTrigger = document.querySelector('.notification-dropdown-trigger');
    const notificationDropdown = document.querySelector('.notification-dropdown');
    
    if (notificationTrigger && notificationDropdown) {
        notificationTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationDropdown.classList.toggle('active');
            
            // Close user dropdown if open
            const userDropdown = document.querySelector('.user-dropdown');
            if (userDropdown && userDropdown.classList.contains('active')) {
                userDropdown.classList.remove('active');
            }
        });
    }
    
    // User dropdown toggle
    const userTrigger = document.querySelector('.user-dropdown-trigger');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userTrigger && userDropdown) {
        userTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
            
            // Close notification dropdown if open
            if (notificationDropdown && notificationDropdown.classList.contains('active')) {
                notificationDropdown.classList.remove('active');
            }
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (notificationDropdown && !notificationTrigger.contains(e.target)) {
            notificationDropdown.classList.remove('active');
        }
        
        if (userDropdown && !userTrigger.contains(e.target)) {
            userDropdown.classList.remove('active');
        }
    });
    
    // Mark notification as read
    const markReadButtons = document.querySelectorAll('.mark-read');
    markReadButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const notificationItem = button.closest('.notification-item');
            notificationItem.classList.remove('unread');
            
            // Update notification count
            updateNotificationCount();
        });
    });
    
    // Mark all notifications as read
    const markAllReadButton = document.querySelector('.mark-all-read');
    if (markAllReadButton) {
        markAllReadButton.addEventListener('click', () => {
            const unreadItems = document.querySelectorAll('.notification-item.unread');
            unreadItems.forEach(item => {
                item.classList.remove('unread');
            });
            
            // Update notification count
            updateNotificationCount();
        });
    }
    
    // Function to update notification count
    function updateNotificationCount() {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        const badge = document.querySelector('.notification-badge');
        
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }
    
    // Profile page tab navigation
    const profileNavItems = document.querySelectorAll('.profile-nav-item');
    const profileSections = document.querySelectorAll('.profile-section');
    
    if (profileNavItems.length > 0) {
        profileNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = item.getAttribute('href').substring(1); // Remove #
                
                // Update active nav item
                profileNavItems.forEach(navItem => navItem.classList.remove('active'));
                item.classList.add('active');
                
                // Show corresponding section
                profileSections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === target) {
                        section.classList.add('active');
                    }
                });
            });
        });
        
        // Check for hash in URL to activate specific tab
        const hash = window.location.hash;
        if (hash) {
            const targetNavItem = document.querySelector(`a[href="${hash}"]`);
            if (targetNavItem) {
                targetNavItem.click();
            }
        }
    }
    
    // Edit profile section
    const editButtons = document.querySelectorAll('.edit-section');
    
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.closest('.profile-section');
            const form = section.querySelector('form');
            const inputs = form.querySelectorAll('input, textarea');
            const formActions = form.querySelector('.form-actions');
            
            // Toggle input fields
            inputs.forEach(input => {
                if (input.type !== 'checkbox' && input.type !== 'radio') {
                    input.disabled = !input.disabled;
                }
            });
            
            // Show/hide form actions
            if (formActions) {
                formActions.classList.toggle('hidden');
            }
            
            // Update button text
            if (button.innerHTML.includes('Edit')) {
                button.innerHTML = '<i class="ri-close-line"></i> Cancel';
            } else {
                button.innerHTML = '<i class="ri-edit-line"></i> Edit';
            }
        });
    });
    
    // Cancel edit
    const cancelButtons = document.querySelectorAll('.cancel-edit');
    
    cancelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.closest('.profile-section');
            const form = section.querySelector('form');
            const inputs = form.querySelectorAll('input, textarea');
            const formActions = form.querySelector('.form-actions');
            const editButton = section.querySelector('.edit-section');
            
            // Disable input fields
            inputs.forEach(input => {
                if (input.type !== 'checkbox' && input.type !== 'radio') {
                    input.disabled = true;
                    input.value = input.defaultValue; // Reset to original value
                }
            });
            
            // Hide form actions
            if (formActions) {
                formActions.classList.add('hidden');
            }
            
            // Update edit button text
            if (editButton) {
                editButton.innerHTML = '<i class="ri-edit-line"></i> Edit';
            }
        });
    });
    
    // Remove saved tool
    const removeToolButtons = document.querySelectorAll('.remove-tool');
    
    removeToolButtons.forEach(button => {
        button.addEventListener('click', () => {
            const toolItem = button.closest('.saved-tool');
            
            if (confirm('Are you sure you want to remove this tool from your saved list?')) {
                toolItem.remove();
                
                // Check if there are any tools left
                const toolsGrid = document.querySelector('.saved-tools-grid');
                const remainingTools = toolsGrid.querySelectorAll('.saved-tool');
                
                if (remainingTools.length === 0) {
                    const noToolsMessage = document.querySelector('.no-saved-tools');
                    if (noToolsMessage) {
                        noToolsMessage.classList.remove('hidden');
                    }
                }
            }
        });
    });
    
    // Delete account confirmation
    const deleteAccountButton = document.getElementById('delete-account');
    
    if (deleteAccountButton) {
        deleteAccountButton.addEventListener('click', () => {
            if (confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
                if (prompt('Type "DELETE" to confirm account deletion') === 'DELETE') {
                    alert('Your account has been deleted. You will be redirected to the homepage.');
                    window.location.href = '/';
                }
            }
        });
    }
    
    // Logout functionality
    const logoutLink = document.getElementById('logout-link');
    
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Here you would normally handle logout server-side
            // For demo purposes, redirect to home
            window.location.href = '/';
        });
    }
    
    // Theme switcher in preferences
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeRadios.length > 0 && themeToggle) {
        themeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const theme = radio.value;
                
                if (theme === 'light') {
                    document.body.classList.remove('dark-mode');
                    localStorage.setItem('theme', 'light');
                } else if (theme === 'dark') {
                    document.body.classList.add('dark-mode');
                    localStorage.setItem('theme', 'dark');
                } else if (theme === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (prefersDark) {
                        document.body.classList.add('dark-mode');
                    } else {
                        document.body.classList.remove('dark-mode');
                    }
                    localStorage.setItem('theme', 'system');
                }
            });
        });
    }
}); 