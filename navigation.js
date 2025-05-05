// Tool navigation buttons
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Toggle theme when the button is clicked
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
                document.documentElement.setAttribute('data-theme', 'light');
            }
        });
    }
    
    // Mobile menu functionality
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            menuToggle.classList.toggle('active');
            
            // Change icon between menu and close
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('show')) {
                icon.classList.remove('ri-menu-line');
                icon.classList.add('ri-close-line');
            } else {
                icon.classList.remove('ri-close-line');
                icon.classList.add('ri-menu-line');
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('show') && 
                !navLinks.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                navLinks.classList.remove('show');
                menuToggle.classList.remove('active');
                
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('ri-close-line');
                icon.classList.add('ri-menu-line');
            }
        });
        
        // Close menu when window is resized to desktop size
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                menuToggle.classList.remove('active');
                
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('ri-close-line');
                icon.classList.add('ri-menu-line');
            }
        });
    }
    
    // Add active class to current nav link
    const currentLocation = window.location.href;
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(item => {
        if (item.href === currentLocation) {
            item.classList.add('active');
        }
    });
    
    // Tool button event listeners for the homepage
    const toolButtons = {
        'age-calculator-btn': 'tools/age-calculator/index.html',
        'word-counter-btn': 'tools/word-counter/index.html',
        'prime-factor-btn': 'tools/prime-factor/index.html',
        'roman-converter-btn': 'tools/roman-converter/index.html',
        'note-keeper-btn': 'tools/note-keeper/index.html',
        'age-calculator-btn-2': 'tools/age-calculator/index.html',
        'word-counter-btn-2': 'tools/word-counter/index.html',
        'prime-factor-btn-2': 'tools/prime-factor/index.html',
        'roman-converter-btn-2': 'tools/roman-converter/index.html'
    };
    
    Object.keys(toolButtons).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => {
                window.location.href = toolButtons[buttonId];
            });
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Press '/' to focus search
        if (e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-bar input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape key to close mobile menu
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('show')) {
            navLinks.classList.remove('show');
            
            if (menuToggle) {
                menuToggle.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('ri-close-line');
                    icon.classList.add('ri-menu-line');
                }
            }
        }
        
        // Escape key to close dropdowns
        if (e.key === 'Escape') {
            const notificationDropdown = document.querySelector('.notification-dropdown');
            const userDropdown = document.querySelector('.user-dropdown');
            
            if (notificationDropdown && notificationDropdown.classList.contains('active')) {
                notificationDropdown.classList.remove('active');
            }
            
            if (userDropdown && userDropdown.classList.contains('active')) {
                userDropdown.classList.remove('active');
            }
        }
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');
    
    if (searchInput && searchBtn) {
        // Search when Enter key is pressed
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Search when button is clicked
        searchBtn.addEventListener('click', performSearch);
        
        // Search keyword buttons
        const keywordButtons = document.querySelectorAll('.keywords button');
        keywordButtons.forEach(button => {
            button.addEventListener('click', () => {
                const keyword = button.textContent.trim().split(' ').slice(1).join(' ');
                searchInput.value = keyword;
                performSearch();
            });
        });
    }
    
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        // Define tool mappings
        const toolMappings = {
            'age calculator': 'tools/age-calculator/index.html',
            'age': 'tools/age-calculator/index.html',
            'word counter': 'tools/word-counter/index.html',
            'word count': 'tools/word-counter/index.html',
            'prime factor': 'tools/prime-factor/index.html',
            'prime': 'tools/prime-factor/index.html',
            'roman converter': 'tools/roman-converter/index.html',
            'roman': 'tools/roman-converter/index.html',
            'note keeper': 'tools/note-keeper/index.html',
            'notes': 'tools/note-keeper/index.html'
        };
        
        // Check if the query matches a tool
        let foundMatch = false;
        
        for (const [keyword, url] of Object.entries(toolMappings)) {
            if (query.includes(keyword)) {
                window.location.href = url;
                foundMatch = true;
                break;
            }
        }
        
        // If no direct match, go to a default search results page
        if (!foundMatch && query) {
            // You can implement a search results page in the future
            // For now, just show a message
            alert(`Search for "${query}" not found. Try a different keyword.`);
        }
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
        if (notificationDropdown && !notificationTrigger.contains(e.target) && notificationDropdown.classList.contains('active')) {
            notificationDropdown.classList.remove('active');
        }
        
        if (userDropdown && !userTrigger.contains(e.target) && userDropdown.classList.contains('active')) {
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
    
    // Notification handling (legacy - kept for compatibility)
    const notificationIcon = document.querySelector('.notification-icon');
    
    if (notificationIcon) {
        notificationIcon.addEventListener('click', () => {
            // Create a notification toast
            const notifications = [
                {
                    title: 'New Tool: Note Keeper',
                    message: 'Create and organize your notes online. Rich text editing, categorization, and more.',
                    link: 'tools/note-keeper/index.html'
                },
                {
                    title: 'Coming Soon: QR Generator',
                    message: 'Generate custom QR codes for any content. Launching next week.',
                    link: '#'
                }
            ];
            
            // Create notification toast
            notifications.forEach((notification, index) => {
                setTimeout(() => {
                    const toast = document.createElement('div');
                    toast.className = 'notification-toast';
                    toast.innerHTML = `
                        <div class="notification-header">
                            <h4>${notification.title}</h4>
                            <button class="close-notification"><i class="ri-close-line"></i></button>
                        </div>
                        <p>${notification.message}</p>
                        <a href="${notification.link}" class="notification-link">Check it out</a>
                    `;
                    
                    document.body.appendChild(toast);
                    
                    // Show the toast after a small delay
                    setTimeout(() => {
                        toast.classList.add('show');
                    }, 50);
                    
                    // Add close button functionality
                    const closeBtn = toast.querySelector('.close-notification');
                    closeBtn.addEventListener('click', () => {
                        toast.classList.remove('show');
                        setTimeout(() => {
                            document.body.removeChild(toast);
                        }, 300);
                    });
                    
                    // Auto-close after 6 seconds
                    setTimeout(() => {
                        toast.classList.remove('show');
                        setTimeout(() => {
                            document.body.removeChild(toast);
                        }, 300);
                    }, 6000);
                }, index * 1000); // Stagger notifications
            });
        });
    }
    
    // Helper function to add CSS styles
    function addCSSStyles(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
    
    // Add styles for notification dropdowns and user dropdowns
    addCSSStyles(`
        /* Notification Dropdown */
        .notification-dropdown-trigger {
            position: relative;
        }
        
        .notification-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            width: 320px;
            margin-top: 10px;
            background-color: var(--bg-light, #ffffff);
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            z-index: 100;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        }
        
        .notification-dropdown.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .notification-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border-bottom: 1px solid var(--border-color, #e0e0e0);
        }
        
        .notification-header h3 {
            font-size: 1rem;
            font-weight: 600;
            margin: 0;
        }
        
        .mark-all-read {
            background: none;
            border: none;
            color: var(--primary-color, #4285F4);
            font-size: 0.85rem;
            cursor: pointer;
        }
        
        .notification-list {
            max-height: 350px;
            overflow-y: auto;
        }
        
        .notification-item {
            display: flex;
            padding: 1rem;
            border-bottom: 1px solid var(--border-color, #e0e0e0);
            transition: background-color 0.2s ease;
        }
        
        .notification-item:last-child {
            border-bottom: none;
        }
        
        .notification-item.unread {
            background-color: rgba(66, 133, 244, 0.05);
        }
        
        .notification-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 1rem;
            flex-shrink: 0;
        }
        
        .notification-icon.tool-update {
            background-color: rgba(52, 168, 83, 0.1);
            color: var(--secondary-color, #34A853);
        }
        
        .notification-icon.account {
            background-color: rgba(66, 133, 244, 0.1);
            color: var(--primary-color, #4285F4);
        }
        
        .notification-icon.system {
            background-color: rgba(251, 188, 5, 0.1);
            color: var(--accent-color, #FBBC05);
        }
        
        .notification-content {
            flex: 1;
        }
        
        .notification-text {
            margin: 0 0 0.25rem;
            color: var(--text-primary, #333333);
            font-size: 0.9rem;
        }
        
        .notification-time {
            margin: 0;
            color: var(--text-light, #888888);
            font-size: 0.8rem;
        }
        
        .mark-read {
            background: none;
            border: none;
            color: var(--text-light, #888888);
            cursor: pointer;
            margin-left: 0.5rem;
        }
        
        .notification-footer {
            padding: 0.75rem;
            text-align: center;
            border-top: 1px solid var(--border-color, #e0e0e0);
        }
        
        .notification-footer a {
            color: var(--primary-color, #4285F4);
            text-decoration: none;
            font-size: 0.9rem;
        }
        
        .notification-footer a:hover {
            text-decoration: underline;
        }
        
        /* User Dropdown Menu */
        .user-dropdown-trigger {
            position: relative;
        }
        
        .user-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            width: 240px;
            margin-top: 10px;
            background-color: var(--bg-light, #ffffff);
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            z-index: 100;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        }
        
        .user-dropdown.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .user-login-options {
            padding: 1.25rem;
        }
        
        .user-login-options p {
            margin: 0 0 1rem;
            color: var(--text-secondary, #666666);
            font-size: 0.9rem;
        }
        
        .user-login-options .btn-primary {
            display: block;
            width: 100%;
            padding: 0.75rem;
            background-color: var(--primary-color, #4285F4);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 0.95rem;
            font-weight: 500;
            text-align: center;
            text-decoration: none;
            transition: background-color 0.2s ease;
            cursor: pointer;
        }
        
        .user-login-options .btn-primary:hover {
            background-color: var(--primary-hover, #2a75f3);
        }
        
        .create-account {
            margin-top: 1rem;
            text-align: center;
            font-size: 0.85rem;
            color: var(--text-secondary, #666666);
        }
        
        .create-account a {
            color: var(--primary-color, #4285F4);
            text-decoration: none;
            margin-left: 0.25rem;
        }
        
        .create-account a:hover {
            text-decoration: underline;
        }
        
        /* Dark mode adjustments */
        .dark-mode .notification-dropdown,
        .dark-mode .user-dropdown {
            background-color: var(--bg-dark, #1a1a1a);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
        }
        
        .dark-mode .notification-item.unread {
            background-color: rgba(66, 133, 244, 0.1);
        }
        
        @media (max-width: 768px) {
            .notification-dropdown,
            .user-dropdown {
                position: fixed;
                top: 80px;
                right: 0;
                left: 0;
                width: 100%;
                margin-top: 0;
                border-radius: 0;
                max-height: calc(100vh - 80px);
                overflow-y: auto;
            }
        }
    `);
});


