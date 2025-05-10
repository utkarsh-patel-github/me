// Initialize the converter
function initConverter() {
    setupEventListeners();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
}

// Setup event listeners
function setupEventListeners() {
    const fromDateTime = document.getElementById('fromDateTime');
    const fromTimezone = document.getElementById('fromTimezone');
    const toTimezone = document.getElementById('toTimezone');
    
    // Set initial datetime to current time
    const now = new Date();
    fromDateTime.value = formatDateTimeForInput(now);
    
    fromDateTime.addEventListener('input', convert);
    fromTimezone.addEventListener('change', convert);
    toTimezone.addEventListener('change', convert);
}

// Format date for datetime-local input
function formatDateTimeForInput(date) {
    return date.toISOString().slice(0, 16);
}

// Convert time between timezones
function convert() {
    const fromDateTime = document.getElementById('fromDateTime').value;
    const fromTimezone = document.getElementById('fromTimezone').value;
    const toTimezone = document.getElementById('toTimezone').value;
    const toDateTime = document.getElementById('toDateTime');
    const timeDifference = document.getElementById('timeDifference');
    
    if (!fromDateTime) {
        toDateTime.value = '';
        return;
    }
    
    try {
        // Create date object from input
        const date = new Date(fromDateTime);
        
        // Convert to target timezone
        const options = {
            timeZone: toTimezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        
        const convertedDate = new Date(date.toLocaleString('en-US', { timeZone: toTimezone }));
        toDateTime.value = formatDateTimeForInput(convertedDate);
        
        // Calculate time difference
        const fromOffset = new Date(date.toLocaleString('en-US', { timeZone: fromTimezone })).getTimezoneOffset();
        const toOffset = new Date(date.toLocaleString('en-US', { timeZone: toTimezone })).getTimezoneOffset();
        const diffHours = (toOffset - fromOffset) / 60;
        
        timeDifference.textContent = `${diffHours > 0 ? '+' : ''}${diffHours} hours`;
    } catch (error) {
        console.error('Error converting time:', error);
        toDateTime.value = '';
        timeDifference.textContent = 'Error';
    }
}

// Update current time display
function updateCurrentTime() {
    const currentTimeElement = document.getElementById('currentTime');
    const now = new Date();
    currentTimeElement.textContent = now.toLocaleString();
}

// Swap timezones
function swapTimezones() {
    const fromTimezone = document.getElementById('fromTimezone');
    const toTimezone = document.getElementById('toTimezone');
    const fromDateTime = document.getElementById('fromDateTime');
    const toDateTime = document.getElementById('toDateTime');
    
    const tempTimezone = fromTimezone.value;
    fromTimezone.value = toTimezone.value;
    toTimezone.value = tempTimezone;
    
    const tempDateTime = fromDateTime.value;
    fromDateTime.value = toDateTime.value;
    toDateTime.value = tempDateTime;
    
    convert();
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', initConverter); 