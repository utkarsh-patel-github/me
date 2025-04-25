/**
 * Theme Switcher for SecurityHub
 * Manages dark/light theme preferences and transitions
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeSwitcher();
});

function initThemeSwitcher() {
    // Get theme toggle button
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    
    // Check for saved theme preference or use device preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    let currentTheme;
    
    // Apply theme based on saved preference or system preference
    if (savedTheme) {
        // Use saved preference if available
        currentTheme = savedTheme;
    } else {
        // Otherwise use system preference
        currentTheme = prefersDarkScheme ? 'dark' : 'light';
    }
    
    // Apply theme and update button
    applyTheme(currentTheme);
    updateThemeToggleButton(currentTheme);
    
    // Add event listener for theme toggle button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only update if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            applyTheme(newTheme);
            updateThemeToggleButton(newTheme);
        }
    });
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    // Get current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    // Toggle to opposite theme
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Apply new theme with transition
    applyTheme(newTheme);
    
    // Update toggle button appearance
    updateThemeToggleButton(newTheme);
    
    // Save preference
    localStorage.setItem('theme', newTheme);
}

/**
 * Apply the specified theme with a smooth transition
 * @param {string} theme - 'light' or 'dark'
 */
function applyTheme(theme) {
    // Add transition class for smooth changes
    document.documentElement.classList.add('theme-transition');
    document.body.classList.add('theme-transition');
    
    // Set theme attribute
    document.documentElement.setAttribute('data-theme', theme);
    
    // Remove transition class after animation completes
    setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
        document.body.classList.remove('theme-transition');
    }, 300);
}

/**
 * Update the theme toggle button appearance based on current theme
 * @param {string} theme - 'light' or 'dark'
 */
function updateThemeToggleButton(theme) {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (!themeToggleBtn) return;
    
    if (theme === 'dark') {
        // Show sun icon when in dark mode
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggleBtn.setAttribute('title', 'Switch to light mode');
        themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
    } else {
        // Show moon icon when in light mode
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggleBtn.setAttribute('title', 'Switch to dark mode');
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
    }
} 