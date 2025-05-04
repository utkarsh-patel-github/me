// Common JavaScript for all tool pages

document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality with enhanced animation
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            // Save user preference to localStorage
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // Check for saved user preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // Mobile menu toggle with animation
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
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                menuToggle.classList.remove('active');
                
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('ri-close-line');
                icon.classList.add('ri-menu-line');
            }
        });
        
        // Handle window resize
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
    
    // Tab functionality for info sections
    const infoTabs = document.querySelectorAll('.info-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (infoTabs.length > 0 && tabContents.length > 0) {
        infoTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                infoTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Hide all tab contents
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Show the corresponding content
                const targetContent = document.getElementById(tab.dataset.tab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
    
    // Rating stars functionality
    const ratingStars = document.querySelectorAll('.rating-stars i');
    const ratingValue = document.getElementById('rating-value');
    
    if (ratingStars.length > 0) {
        ratingStars.forEach(star => {
            star.addEventListener('mouseover', () => {
                const value = star.dataset.value;
                highlightStars(value);
            });
            
            star.addEventListener('mouseout', () => {
                const value = ratingValue ? ratingValue.value : 0;
                highlightStars(value);
            });
            
            star.addEventListener('click', () => {
                const value = star.dataset.value;
                if (ratingValue) {
                    ratingValue.value = value;
                }
                highlightStars(value);
            });
        });
        
        function highlightStars(value) {
            ratingStars.forEach(s => {
                if (s.dataset.value <= value) {
                    s.classList.remove('ri-star-line');
                    s.classList.add('ri-star-fill');
                    s.classList.add('active');
                } else {
                    s.classList.remove('ri-star-fill');
                    s.classList.add('ri-star-line');
                    s.classList.remove('active');
                }
            });
        }
    }
    
    // Bug report modal functionality
    const reportBugBtn = document.getElementById('report-bug-btn');
    const reportBugModal = document.getElementById('report-bug-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (reportBugBtn && reportBugModal) {
        reportBugBtn.addEventListener('click', () => {
            reportBugModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
        });
        
        closeModal.addEventListener('click', () => {
            reportBugModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
        
        // Close modal when clicking outside
        reportBugModal.addEventListener('click', (e) => {
            if (e.target === reportBugModal) {
                reportBugModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && reportBugModal.classList.contains('active')) {
                reportBugModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Copy button functionality
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    if (copyButtons.length > 0) {
        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.dataset.copyTarget;
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // For textarea/input elements
                    if (targetElement.tagName === 'TEXTAREA' || targetElement.tagName === 'INPUT') {
                        const originalText = targetElement.value;
                        
                        if (originalText) {
                            copyToClipboard(originalText);
                            showCopiedFeedback(button);
                        }
                    } 
                    // For div or other elements
                    else {
                        const originalText = targetElement.innerText;
                        
                        if (originalText) {
                            copyToClipboard(originalText);
                            showCopiedFeedback(button);
                        }
                    }
                }
            });
        });
        
        function copyToClipboard(text) {
            // Create a temporary textarea
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            
            // Select and copy
            textarea.select();
            document.execCommand('copy');
            
            // Clean up
            document.body.removeChild(textarea);
        }
        
        function showCopiedFeedback(button) {
            const originalIcon = button.querySelector('i').className;
            const originalText = button.textContent.trim();
            
            button.classList.add('copied');
            button.innerHTML = '<i class="ri-check-line"></i> Copied!';
            
            setTimeout(() => {
                button.classList.remove('copied');
                button.innerHTML = `<i class="${originalIcon}"></i> ${originalText}`;
            }, 2000);
        }
    }
    
    // Sidebar sticky behavior (for desktop)
    const sidebar = document.querySelector('.tool-sidebar');
    
    if (sidebar && window.innerWidth >= 992) {
        const toolCard = document.querySelector('.tool-card');
        
        if (toolCard) {
            const sidebarHeight = sidebar.offsetHeight;
            const toolCardHeight = toolCard.offsetHeight;
            
            if (sidebarHeight < toolCardHeight) {
                sidebar.style.position = 'sticky';
                sidebar.style.top = '100px';
            }
        }
    }

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            if (targetId !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Initialize social share buttons
    const shareButtons = document.querySelectorAll('.social-share a');
    
    if (shareButtons.length > 0) {
        shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);
                let shareUrl = '';
                
                if (this.classList.contains('facebook')) {
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                } else if (this.classList.contains('twitter')) {
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                } else if (this.classList.contains('linkedin')) {
                    shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
                } else if (this.classList.contains('whatsapp')) {
                    shareUrl = `https://wa.me/?text=${title}%20${url}`;
                } else if (this.classList.contains('email')) {
                    shareUrl = `mailto:?subject=${title}&body=Check%20out%20this%20tool:%20${url}`;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    }
}); 