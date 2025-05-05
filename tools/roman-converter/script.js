// DOM Elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');

// Decimal to Roman tab elements
const decimalInput = document.getElementById('decimal-input');
const decimalToRomanBtn = document.getElementById('decimal-to-roman-btn');
const romanResult = document.getElementById('roman-result');
const decimalCopyBtn = document.getElementById('decimal-copy-btn');
const decimalClearBtn = document.getElementById('decimal-clear-btn');
const decimalExampleBtn = document.getElementById('decimal-example-btn');

// Roman to Decimal tab elements
const romanInput = document.getElementById('roman-input');
const romanToDecimalBtn = document.getElementById('roman-to-decimal-btn');
const decimalResult = document.getElementById('decimal-result');
const romanCopyBtn = document.getElementById('roman-copy-btn');
const romanClearBtn = document.getElementById('roman-clear-btn');
const romanExampleBtn = document.getElementById('roman-example-btn');

// FAQ items
const faqItems = document.querySelectorAll('.faq-item');

// Theme Toggle and Navigation
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navLinkItems = document.querySelectorAll('.nav-links a');

// Conversion Functions
function decimalToRoman(num) {
    if (num < 1 || num > 3999) {
        return 'Error: Number must be between 1 and 3999';
    }

    const romanNumerals = [
        { value: 1000, symbol: 'M' },
        { value: 900, symbol: 'CM' },
        { value: 500, symbol: 'D' },
        { value: 400, symbol: 'CD' },
        { value: 100, symbol: 'C' },
        { value: 90, symbol: 'XC' },
        { value: 50, symbol: 'L' },
        { value: 40, symbol: 'XL' },
        { value: 10, symbol: 'X' },
        { value: 9, symbol: 'IX' },
        { value: 5, symbol: 'V' },
        { value: 4, symbol: 'IV' },
        { value: 1, symbol: 'I' }
    ];

    let result = '';
    
    for (let i = 0; i < romanNumerals.length; i++) {
        while (num >= romanNumerals[i].value) {
            result += romanNumerals[i].symbol;
            num -= romanNumerals[i].value;
        }
    }
    
    return result;
}

function romanToDecimal(roman) {
    if (!roman) return 'Error: Please enter a Roman numeral';
    
    // Convert to uppercase for case insensitivity
    roman = roman.toUpperCase();
    
    // Validate input format
    const validRomanRegex = /^[MDCLXVI]+$/;
    if (!validRomanRegex.test(roman)) {
        return 'Error: Invalid Roman numeral format';
    }

    const romanValues = {
        'I': 1,
        'V': 5,
        'X': 10,
        'L': 50,
        'C': 100,
        'D': 500,
        'M': 1000
    };
    
    let result = 0;
    let prevValue = 0;
    
    // Iterate from right to left
    for (let i = roman.length - 1; i >= 0; i--) {
        const currentChar = roman[i];
        const currentValue = romanValues[currentChar];
        
        // If current value is greater than or equal to previous value, add it
        // Otherwise, subtract it (handle cases like IV for 4, IX for 9)
        if (currentValue >= prevValue) {
            result += currentValue;
        } else {
            result -= currentValue;
        }
        
        prevValue = currentValue;
    }
    
    // Final validation for correct Roman numeral format
    if (decimalToRoman(result) !== roman) {
        return 'Error: Invalid Roman numeral';
    }
    
    return result;
}

// Event Handlers
function handleTabClick(e) {
    const targetTab = e.target.closest('.tab-button').dataset.tab;
    
    // Update tab buttons
    tabButtons.forEach(button => {
        if (button.dataset.tab === targetTab) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Update tab panes
    tabPanes.forEach(pane => {
        if (pane.id === targetTab) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });
}

function handleDecimalToRoman() {
    const input = decimalInput.value.trim();
    
    // Validate input
    if (!input) {
        showError(decimalInput, 'Please enter a number');
        romanResult.textContent = '-';
        return;
    }
    
    const num = parseInt(input, 10);
    
    if (isNaN(num)) {
        showError(decimalInput, 'Please enter a valid number');
        romanResult.textContent = '-';
        return;
    }
    
    if (num < 1 || num > 3999) {
        showError(decimalInput, 'Number must be between 1 and 3999');
        romanResult.textContent = '-';
        return;
    }
    
    // Convert and display result
    clearError(decimalInput);
    const result = decimalToRoman(num);
    romanResult.textContent = result;
}

function handleRomanToDecimal() {
    const input = romanInput.value.trim();
    
    // Validate input
    if (!input) {
        showError(romanInput, 'Please enter a Roman numeral');
        decimalResult.textContent = '-';
        return;
    }
    
    // Convert and display result
    clearError(romanInput);
    const result = romanToDecimal(input);
    
    if (typeof result === 'string' && result.startsWith('Error')) {
        showError(romanInput, result.replace('Error: ', ''));
        decimalResult.textContent = '-';
        return;
    }
    
    decimalResult.textContent = result;
}

function handleCopyResult(resultElement) {
    const textToCopy = resultElement.textContent;
    
    if (textToCopy === '-') return;
    
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            const button = resultElement === romanResult ? decimalCopyBtn : romanCopyBtn;
            
            // Show success state
            button.classList.add('copy-success');
            button.innerHTML = '<i class="ri-check-line"></i> Copied!';
            
            // Reset after 2 seconds
            setTimeout(() => {
                button.classList.remove('copy-success');
                button.innerHTML = '<i class="ri-clipboard-line"></i> Copy';
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
        });
}

function handleClearInput(inputElement, resultElement) {
    inputElement.value = '';
    resultElement.textContent = '-';
    clearError(inputElement);
}

function handleExample(inputElement, isDecimal) {
    if (isDecimal) {
        const examples = [1999, 2023, 888, 444, 3999];
        inputElement.value = examples[Math.floor(Math.random() * examples.length)];
    } else {
        const examples = ['MCMXCIX', 'MMXXIII', 'DCCCLXXXVIII', 'CDXLIV', 'MMMCMXCIX'];
        inputElement.value = examples[Math.floor(Math.random() * examples.length)];
    }
    clearError(inputElement);
}

function showError(inputElement, message) {
    // Add error class to input
    inputElement.classList.add('input-error');
    
    // Get hint element and update message
    const hintElement = inputElement.parentElement.nextElementSibling;
    hintElement.classList.add('error-message');
    hintElement.textContent = message;
}

function clearError(inputElement) {
    // Remove error class from input
    inputElement.classList.remove('input-error');
    
    // Reset hint message
    const hintElement = inputElement.parentElement.nextElementSibling;
    hintElement.classList.remove('error-message');
    
    if (inputElement === decimalInput) {
        hintElement.textContent = 'Enter a number between 1 and 3999';
    } else {
        hintElement.textContent = 'Use symbols I, V, X, L, C, D, M (case insensitive)';
    }
}

function toggleFaq(e) {
    const faqItem = e.target.closest('.faq-item');
    
    // Toggle active class on clicked item
    faqItem.classList.toggle('active');
    
    // Option: Close other FAQ items (accordion behavior)
    // faqItems.forEach(item => {
    //     if (item !== faqItem) {
    //         item.classList.remove('active');
    //     }
    // });
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

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

// Handle responsive layout
function setupResponsiveLayout() {
    // Move buttons to the correct position on mobile
    if (window.innerWidth <= 576) {
        const nav = document.querySelector('nav');
        const navRight = document.querySelector('.nav-right');
        const menuToggle = document.getElementById('menu-toggle');
        
        // Ensure proper ordering for mobile
        nav.appendChild(navRight);
        nav.appendChild(menuToggle);
    }
}

// Initialize
function init() {
    // Apply theme preference
    applyThemePreference();
    
    // Setup responsive layout
    setupResponsiveLayout();
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', handleTabClick);
    });
    
    // Decimal to Roman conversion
    decimalToRomanBtn.addEventListener('click', handleDecimalToRoman);
    decimalInput.addEventListener('keyup', e => {
        if (e.key === 'Enter') handleDecimalToRoman();
    });
    decimalCopyBtn.addEventListener('click', () => handleCopyResult(romanResult));
    decimalClearBtn.addEventListener('click', () => handleClearInput(decimalInput, romanResult));
    decimalExampleBtn.addEventListener('click', () => {
        handleExample(decimalInput, true);
        handleDecimalToRoman();
    });
    
    // Roman to Decimal conversion
    romanToDecimalBtn.addEventListener('click', handleRomanToDecimal);
    romanInput.addEventListener('keyup', e => {
        if (e.key === 'Enter') handleRomanToDecimal();
    });
    romanCopyBtn.addEventListener('click', () => handleCopyResult(decimalResult));
    romanClearBtn.addEventListener('click', () => handleClearInput(romanInput, decimalResult));
    romanExampleBtn.addEventListener('click', () => {
        handleExample(romanInput, false);
        handleRomanToDecimal();
    });
    
    // FAQ interactivity
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', toggleFaq);
    });
    
    // Theme toggling
    themeToggle.addEventListener('click', toggleTheme);
    
    // Mobile menu
    menuToggle.addEventListener('click', toggleMenu);
    
    // Close menu when clicking outside or on a link
    document.addEventListener('click', handleDocumentClick);
    
    // Handle window resize
    window.addEventListener('resize', setupResponsiveLayout);
    
    // Active link highlighting
    const currentPath = window.location.pathname;
    navLinkItems.forEach(link => {
        if (currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
