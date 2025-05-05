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
    
    // Notification handling
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
                            if (document.body.contains(toast)) {
                                document.body.removeChild(toast);
                            }
                        }, 300);
                    }, 6000);
                }, index * 300);
            });
        });
    }
    
    // Add styles for notification toast
    addCSSStyles(`
        .notification-toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--card-bg);
            color: var(--text-color);
            max-width: 350px;
            border-radius: var(--radius);
            box-shadow: var(--shadow-lg);
            padding: 16px;
            transform: translateX(400px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
            border-left: 4px solid var(--primary-blue);
        }
        
        .notification-toast.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .notification-header h4 {
            margin: 0;
            font-size: 1rem;
            font-weight: 600;
        }
        
        .close-notification {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            transition: all 0.2s ease;
        }
        
        .close-notification:hover {
            background-color: rgba(0, 0, 0, 0.1);
            color: var(--text-color);
        }
        
        .notification-toast p {
            margin: 8px 0 12px;
            font-size: 0.9rem;
            color: var(--text-secondary);
            line-height: 1.5;
        }
        
        .notification-link {
            display: inline-block;
            color: var(--primary-blue);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            margin-top: 8px;
            transition: all 0.2s ease;
        }
        
        .notification-link:hover {
            text-decoration: underline;
        }
        
        @media (max-width: 576px) {
            .notification-toast {
                left: 20px;
                right: 20px;
                bottom: 20px;
                max-width: none;
            }
        }
    `);
    
    // Utility function to add CSS styles
    function addCSSStyles(css) {
        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }
    
    // Scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.classList.add('scroll-to-top');
    scrollToTopBtn.innerHTML = '<i class="ri-arrow-up-line"></i>';
    scrollToTopBtn.style.display = 'none';
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add styles for scroll to top button
    addCSSStyles(`
        .scroll-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary-blue), #1a73e8);
            color: white;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 99;
            box-shadow: var(--shadow);
            transition: all 0.3s ease;
        }
        
        .scroll-to-top:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-lg);
        }
        
        .scroll-to-top i {
            font-size: 24px;
        }
        
        @media (max-width: 576px) {
            .scroll-to-top {
                bottom: 15px;
                right: 15px;
                width: 40px;
                height: 40px;
            }
            
            .scroll-to-top i {
                font-size: 20px;
            }
        }
    `);
});


