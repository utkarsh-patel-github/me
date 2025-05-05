// DOM Elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');

// New Countdown Tab Elements
const eventNameInput = document.getElementById('event-name');
const eventDateInput = document.getElementById('event-date');
const eventTimeInput = document.getElementById('event-time');
const showSecondsCheckbox = document.getElementById('show-seconds');
const saveCountdownCheckbox = document.getElementById('save-countdown');
const startCountdownBtn = document.getElementById('start-countdown-btn');
const countdownDisplay = document.getElementById('countdown-display');
const nameClearBtn = document.getElementById('name-clear-btn');

// Countdown Display Elements
const displayEventName = document.getElementById('display-event-name');
const displayEventDate = document.getElementById('display-event-date');
const daysValue = document.getElementById('days-value');
const hoursValue = document.getElementById('hours-value');
const minutesValue = document.getElementById('minutes-value');
const secondsValue = document.getElementById('seconds-value');
const resetBtn = document.getElementById('reset-btn');
const shareBtn = document.getElementById('share-btn');

// Saved Countdowns Tab Elements
const noSavedCountdowns = document.getElementById('no-saved-countdowns');
const savedList = document.getElementById('saved-list');
const createNewBtn = document.getElementById('create-new-btn');

// FAQ items
const faqItems = document.querySelectorAll('.faq-item');

// Global variables
let countdownInterval;
let targetDate;
let activeCountdownId;
const STORAGE_KEY = 'daily_tools_countdowns';

// Initialize date input min value to today
function initializeDateInput() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const todayString = `${year}-${month}-${day}`;
    eventDateInput.min = todayString;
    eventDateInput.value = todayString;
}

// Helper Functions
function formatDate(dateObj) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return dateObj.toLocaleDateString(undefined, options);
}

function formatTimeLeft(timeLeft) {
    if (timeLeft <= 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        };
    }
    
    // Calculate time components
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    return {
        days,
        hours,
        minutes,
        seconds
    };
}

function padNumber(num) {
    return String(num).padStart(2, '0');
}

function generateCountdownId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Countdown Functions
function startCountdown() {
    const eventName = eventNameInput.value.trim();
    const eventDate = eventDateInput.value;
    const eventTime = eventTimeInput.value;
    
    // Validate inputs
    if (!eventName) {
        showError(eventNameInput, 'Please enter an event name');
        return;
    } else {
        clearError(eventNameInput);
    }
    
    if (!eventDate) {
        showError(eventDateInput, 'Please select a date');
        return;
    } else {
        clearError(eventDateInput);
    }
    
    // Create target date
    const [hours, minutes] = eventTime.split(':');
    targetDate = new Date(eventDate);
    targetDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    
    // Check if target date is in the future
    const now = new Date();
    if (targetDate <= now) {
        showError(eventDateInput, 'Please select a future date and time');
        return;
    } else {
        clearError(eventDateInput);
    }
    
    // Setup display
    displayEventName.textContent = eventName;
    displayEventDate.textContent = formatDate(targetDate);
    
    // Toggle seconds visibility based on checkbox
    const showSeconds = showSecondsCheckbox.checked;
    document.body.classList.toggle('show-seconds-false', !showSeconds);
    
    // Save countdown if requested
    if (saveCountdownCheckbox.checked) {
        const countdownId = generateCountdownId();
        activeCountdownId = countdownId;
        
        const countdownData = {
            id: countdownId,
            name: eventName,
            targetDate: targetDate.getTime(),
            showSeconds: showSeconds,
            createdAt: Date.now()
        };
        
        saveCountdown(countdownData);
    }
    
    // Show countdown display
    countdownDisplay.classList.add('active');
    
    // Start updating countdown
    updateCountdown();
    clearInterval(countdownInterval);
    countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const now = new Date();
    const timeLeft = targetDate - now;
    
    // Format time left
    const { days, hours, minutes, seconds } = formatTimeLeft(timeLeft);
    
    // Update display
    daysValue.textContent = padNumber(days);
    hoursValue.textContent = padNumber(hours);
    minutesValue.textContent = padNumber(minutes);
    secondsValue.textContent = padNumber(seconds);
    
    // Check if countdown has expired
    if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        
        // Show expired state
        document.querySelector('.countdown-timer').classList.add('countdown-expired');
        
        // Create celebration message if it doesn't exist
        if (!document.querySelector('.celebration')) {
            const celebration = document.createElement('div');
            celebration.className = 'celebration';
            celebration.innerHTML = `
                <h3 class="celebration-title">🎉 It's time! 🎉</h3>
                <p class="celebration-message">${displayEventName.textContent} has arrived!</p>
                <button id="new-countdown-btn" class="action-button">
                    <i class="ri-add-line"></i> Create New Countdown
                </button>
            `;
            countdownDisplay.appendChild(celebration);
            
            // Add event listener to the new button
            document.getElementById('new-countdown-btn').addEventListener('click', resetCountdown);
            
            // Show celebration with animation
            setTimeout(() => {
                celebration.classList.add('active');
            }, 100);
        }
        
        // Remove from saved countdowns if it was saved
        if (activeCountdownId) {
            const savedCountdowns = getSavedCountdowns();
            const updatedCountdowns = savedCountdowns.filter(countdown => countdown.id !== activeCountdownId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCountdowns));
            
            // Update saved countdowns list
            renderSavedCountdowns();
        }
    }
}

function resetCountdown() {
    // Clear form
    eventNameInput.value = '';
    initializeDateInput();
    eventTimeInput.value = '00:00';
    
    // Hide countdown display
    countdownDisplay.classList.remove('active');
    
    // Remove expired state and celebration
    document.querySelector('.countdown-timer').classList.remove('countdown-expired');
    const celebration = document.querySelector('.celebration');
    if (celebration) {
        celebration.remove();
    }
    
    // Clear interval
    clearInterval(countdownInterval);
    
    // Reset active countdown ID
    activeCountdownId = null;
}

// Saved Countdowns Functions
function getSavedCountdowns() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : [];
}

function saveCountdown(countdownData) {
    const savedCountdowns = getSavedCountdowns();
    savedCountdowns.push(countdownData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCountdowns));
    
    // Update saved countdowns list
    renderSavedCountdowns();
}

function renderSavedCountdowns() {
    const savedCountdowns = getSavedCountdowns();
    
    // Show/hide empty message
    if (savedCountdowns.length === 0) {
        noSavedCountdowns.style.display = 'flex';
        savedList.style.display = 'none';
        return;
    } else {
        noSavedCountdowns.style.display = 'none';
        savedList.style.display = 'flex';
    }
    
    // Clear list
    savedList.innerHTML = '';
    
    // Sort countdowns by date (closest first)
    savedCountdowns.sort((a, b) => a.targetDate - b.targetDate);
    
    // Add each countdown
    savedCountdowns.forEach(countdown => {
        const countdownDate = new Date(countdown.targetDate);
        const now = new Date();
        const timeLeft = countdownDate - now;
        const isExpired = timeLeft <= 0;
        
        // Create item element
        const item = document.createElement('div');
        item.className = 'saved-countdown-item';
        if (isExpired) {
            item.classList.add('countdown-expired');
        }
        
        // Format time left
        const { days, hours, minutes } = formatTimeLeft(timeLeft);
        let timeLeftText = isExpired 
            ? 'Expired'
            : `${days}d ${hours}h ${minutes}m remaining`;
        
        item.innerHTML = `
            <div class="saved-countdown-info">
                <div class="saved-countdown-name">${countdown.name}</div>
                <div class="saved-countdown-date">${formatDate(countdownDate)}</div>
                <div class="saved-countdown-time">${timeLeftText}</div>
            </div>
            <div class="saved-countdown-actions">
                <button class="saved-action-btn view-btn" data-id="${countdown.id}" title="View countdown">
                    <i class="ri-eye-line"></i>
                </button>
                <button class="saved-action-btn delete-btn delete" data-id="${countdown.id}" title="Delete countdown">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        `;
        
        savedList.appendChild(item);
        
        // Add event listeners
        item.querySelector('.view-btn').addEventListener('click', () => {
            loadSavedCountdown(countdown.id);
        });
        
        item.querySelector('.delete-btn').addEventListener('click', () => {
            deleteSavedCountdown(countdown.id);
        });
    });
}

function loadSavedCountdown(countdownId) {
    const savedCountdowns = getSavedCountdowns();
    const countdown = savedCountdowns.find(c => c.id === countdownId);
    
    if (!countdown) return;
    
    // Switch to new countdown tab
    tabButtons[0].click();
    
    // Fill form
    eventNameInput.value = countdown.name;
    
    const date = new Date(countdown.targetDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    eventDateInput.value = `${year}-${month}-${day}`;
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    eventTimeInput.value = `${hours}:${minutes}`;
    
    showSecondsCheckbox.checked = countdown.showSeconds;
    saveCountdownCheckbox.checked = true;
    
    // Set target date
    targetDate = date;
    activeCountdownId = countdownId;
    
    // Start countdown
    startCountdown();
}

function deleteSavedCountdown(countdownId) {
    if (!confirm('Are you sure you want to delete this countdown?')) return;
    
    const savedCountdowns = getSavedCountdowns();
    const updatedCountdowns = savedCountdowns.filter(countdown => countdown.id !== countdownId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCountdowns));
    
    // Update saved countdowns list
    renderSavedCountdowns();
    
    // If the active countdown is deleted, reset it
    if (activeCountdownId === countdownId) {
        resetCountdown();
    }
}

// Error Handling
function showError(inputElement, message) {
    // Add error class to input
    inputElement.classList.add('input-error');
    
    // Create or update error message
    let errorElement = inputElement.parentElement.querySelector('.error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        inputElement.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearError(inputElement) {
    // Remove error class from input
    inputElement.classList.remove('input-error');
    
    // Remove error message if it exists
    const errorElement = inputElement.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Sharing functionality
function shareCountdown() {
    if (!targetDate) return;
    
    const eventName = displayEventName.textContent;
    const shareUrl = window.location.href;
    
    // Create share text
    const shareText = `Check out my countdown to ${eventName} on ${formatDate(targetDate)}!`;
    
    // Try to use Web Share API if available
    if (navigator.share) {
        navigator.share({
            title: `Countdown to ${eventName}`,
            text: shareText,
            url: shareUrl
        })
        .catch(error => {
            console.log('Error sharing:', error);
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
    
    function fallbackShare() {
        // Fallback to clipboard
        const fullShareText = `${shareText}\n\n${shareUrl}`;
        
        navigator.clipboard.writeText(fullShareText)
            .then(() => {
                alert('Countdown link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Unable to share countdown. Please copy the link manually.');
            });
    }
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
    
    // If switching to saved countdowns tab, refresh the list
    if (targetTab === 'saved-countdowns') {
        renderSavedCountdowns();
    }
}

function toggleFaq(e) {
    const faqItem = e.target.closest('.faq-item');
    
    // Toggle active class on clicked item
    faqItem.classList.toggle('active');
}

// Initialize
function init() {
    // Initialize date input
    initializeDateInput();
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', handleTabClick);
    });
    
    // Countdown form controls
    startCountdownBtn.addEventListener('click', startCountdown);
    resetBtn.addEventListener('click', resetCountdown);
    shareBtn.addEventListener('click', shareCountdown);
    nameClearBtn.addEventListener('click', () => {
        eventNameInput.value = '';
        clearError(eventNameInput);
    });
    
    // Saved countdowns
    createNewBtn.addEventListener('click', () => {
        tabButtons[0].click(); // Switch to new countdown tab
    });
    
    // Render saved countdowns
    renderSavedCountdowns();
    
    // FAQ interactivity
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', toggleFaq);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 