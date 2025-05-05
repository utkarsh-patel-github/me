// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navLinkItems = document.querySelectorAll('.nav-links a');

// Theme Toggle Functionality
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
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
}

// Close mobile menu when clicking outside
function handleDocumentClick(e) {
    const isNavLink = e.target.closest('.nav-links a');
    const isMenuToggle = e.target.closest('#menu-toggle');
    
    if ((isNavLink || !e.target.closest('nav')) && !isMenuToggle && navLinks.classList.contains('active')) {
        toggleMenu();
    }
}

// Apply stored theme preference
function applyThemePreference() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}

// Initialize
function init() {
    // Apply theme preference
    applyThemePreference();
    
    // Theme toggling
    themeToggle.addEventListener('click', toggleTheme);
    
    // Mobile menu
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }
    
    // Close menu when clicking outside or on a link
    document.addEventListener('click', handleDocumentClick);
    
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
