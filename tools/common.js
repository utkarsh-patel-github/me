// Common JavaScript for All Tools

document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !savedTheme)) {
        document.body.classList.add('dark-mode');
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            // Save user preference to localStorage
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
                document.documentElement.setAttribute('data-theme', 'light');
            }
        });
    }
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            menuToggle.classList.toggle('active');
            
            // Toggle between menu and close icons
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

        // Close mobile menu on resize
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
    
    // Info tabs functionality
    const tabHeaders = document.querySelectorAll('.tab-header');
    tabHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Get the parent info-tab element
            const parentTab = header.closest('.info-tab');
            const tabId = header.getAttribute('data-tab');
            const tabContent = document.getElementById(`${tabId}-content`);
            
            // Check if this tab is already active
            const isActive = header.classList.contains('active');
            
            // Collapse all tabs first
            tabHeaders.forEach(h => h.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // If the clicked tab wasn't active before, expand it
            if (!isActive) {
                header.classList.add('active');
                if (tabContent) {
                    tabContent.style.display = 'block';
                }
            }
        });
    });
    
    // FAQ accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');
            
            // Check if this FAQ is already open
            const isOpen = answer.style.display === 'block';
            
            if (isOpen) {
                answer.style.display = 'none';
                icon.className = 'ri-add-line';
            } else {
                answer.style.display = 'block';
                icon.className = 'ri-subtract-line';
            }
        });
    });
    
    // Improved Toast message utility function
    window.showToast = function(message, type = 'info', duration = 3000) {
        // Check if toast container exists, create if not
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
            
            // Add styles for toast container if they don't exist
            if (!document.getElementById('toast-styles')) {
                const style = document.createElement('style');
                style.id = 'toast-styles';
                style.textContent = `
                    .toast-container {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        z-index: 9999;
                        max-width: 350px;
                    }
                    
                    .toast {
                        background: var(--card-bg, #fff);
                        color: var(--text-color, #333);
                        padding: 16px;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        opacity: 0;
                        transform: translateX(50px);
                        transition: all 0.3s ease;
                        border-left: 4px solid var(--primary-blue, #4285F4);
                    }
                    
                    .toast.show {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    
                    .toast i {
                        font-size: 20px;
                    }
                    
                    .toast.success {
                        border-left-color: var(--primary-green, #34A853);
                    }
                    
                    .toast.success i {
                        color: var(--primary-green, #34A853);
                    }
                    
                    .toast.error {
                        border-left-color: var(--primary-red, #EA4335);
                    }
                    
                    .toast.error i {
                        color: var(--primary-red, #EA4335);
                    }
                    
                    .toast.warning {
                        border-left-color: var(--primary-yellow, #FBBC05);
                    }
                    
                    .toast.warning i {
                        color: var(--primary-yellow, #FBBC05);
                    }
                    
                    .toast.info i {
                        color: var(--primary-blue, #4285F4);
                    }
                    
                    @media (max-width: 768px) {
                        .toast-container {
                            bottom: 10px;
                            right: 10px;
                            left: 10px;
                            max-width: none;
                        }
                        
                        .toast {
                            width: 100%;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Add icon based on type
        let icon = '';
        switch (type) {
            case 'success':
                icon = '<i class="ri-check-line"></i>';
                break;
            case 'error':
                icon = '<i class="ri-error-warning-line"></i>';
                break;
            case 'warning':
                icon = '<i class="ri-alert-line"></i>';
                break;
            default:
                icon = '<i class="ri-information-line"></i>';
        }
        
        toast.innerHTML = `${icon}<span>${message}</span>`;
        toastContainer.appendChild(toast);
        
        // Show toast with animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Hide and remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, duration);
    };
    
    // Copy to clipboard utility function
    window.copyToClipboard = function(text) {
        if (!text) return false;
        
        // Try to use modern navigator.clipboard API first
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(text)
                .then(() => {
                    window.showToast('Copied to clipboard!', 'success');
                    return true;
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    window.showToast('Failed to copy. Please try again.', 'error');
                    return false;
                });
        } else {
            // Fallback to older method
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed'; // Prevent scrolling to bottom
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textarea);
                
                if (successful) {
                    window.showToast('Copied to clipboard!', 'success');
                    return true;
                } else {
                    window.showToast('Failed to copy. Please try again.', 'error');
                    return false;
                }
            } catch (err) {
                console.error('Failed to copy: ', err);
                document.body.removeChild(textarea);
                window.showToast('Failed to copy. Please try again.', 'error');
                return false;
            }
        }
    };
    
    // Add copy functionality to all copy buttons
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-copy-target');
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    copyToClipboard(targetElement.value || targetElement.textContent);
                }
            }
        });
    });
    
    // Share functionality (if Web Share API is available)
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', () => {
            const shareTitle = button.getAttribute('data-share-title') || document.title;
            const shareText = button.getAttribute('data-share-text') || '';
            const shareUrl = button.getAttribute('data-share-url') || window.location.href;
            
            if (navigator.share) {
                navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl,
                })
                .then(() => window.showToast('Shared successfully!', 'success'))
                .catch((error) => {
                    console.error('Error sharing:', error);
                    window.showToast('Error sharing. Please try again.', 'error');
                });
            } else {
                copyToClipboard(shareUrl);
                window.showToast('Share URL copied to clipboard!', 'success');
            }
        });
    });
    
    // Print functionality
    const printButtons = document.querySelectorAll('.print-btn');
    printButtons.forEach(button => {
        button.addEventListener('click', () => {
            window.print();
        });
    });
    
    // Scroll to top button with improved design
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="ri-arrow-up-line"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
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
    if (!document.getElementById('scroll-top-styles')) {
        const style = document.createElement('style');
        style.id = 'scroll-top-styles';
        style.textContent = `
            .scroll-to-top {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--primary-blue, #4285F4), #1a73e8);
                color: white;
                border: none;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99;
                transition: all 0.3s ease;
                opacity: 0.9;
            }
            
            .scroll-to-top i {
                font-size: 22px;
            }
            
            .scroll-to-top:hover {
                transform: translateY(-4px);
                opacity: 1;
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
            }
            
            @media (max-width: 768px) {
                .scroll-to-top {
                    bottom: 15px;
                    right: 15px;
                    width: 42px;
                    height: 42px;
                }
                
                .scroll-to-top i {
                    font-size: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Handle keyboard accessibility
    document.addEventListener('keydown', (e) => {
        // ESC key to close modals
        if (e.key === 'Escape') {
            const visibleModals = document.querySelectorAll('.modal.visible');
            if (visibleModals.length > 0) {
                visibleModals.forEach(modal => {
                    if (typeof modal.close === 'function') {
                        modal.close();
                    } else {
                        modal.classList.remove('visible');
                    }
                });
            }
        }
    });
}); 