// Age Calculator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const birthDateInput = document.getElementById('birth-date');
    const currentDateInput = document.getElementById('current-date');
    const useTodayCheckbox = document.getElementById('use-today');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultSection = document.getElementById('result-section');
    const yearsDisplay = document.getElementById('years');
    const monthsDisplay = document.getElementById('months');
    const daysDisplay = document.getElementById('days');
    const totalMonthsDisplay = document.getElementById('total-months');
    const totalDaysDisplay = document.getElementById('total-days');
    const totalHoursDisplay = document.getElementById('total-hours');
    const totalMinutesDisplay = document.getElementById('total-minutes');
    const nextBirthdayDisplay = document.getElementById('next-birthday');
    const resultText = document.getElementById('result-text');
    const infoTabs = document.querySelectorAll('.info-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const copyBtn = document.querySelector('.copy-btn');
    const shareBtn = document.querySelector('.share-btn');
    const printBtn = document.querySelector('.print-btn');
    const bugReportBtn = document.getElementById('report-bug-btn');
    const modal = document.getElementById('report-bug-modal');
    const closeModal = document.querySelector('.close-modal');
    const ratingStars = document.querySelectorAll('.rating-stars i');
    
    // Set default dates
    setDefaultDates();
    
    // Event listeners
    useTodayCheckbox.addEventListener('change', function() {
        currentDateInput.disabled = this.checked;
        if (this.checked) {
            currentDateInput.value = getTodayString();
        }
    });
    
    calculateBtn.addEventListener('click', function() {
        // Add button animation
        this.classList.add('calculating');
        
        // Slight delay for button animation
        setTimeout(() => {
            calculateAge();
            this.classList.remove('calculating');
        }, 300);
    });
    
    resetBtn.addEventListener('click', function() {
        // Add button animation
        this.classList.add('resetting');
        
        // Fade out results
        resultSection.style.opacity = '0.5';
        
        // Slight delay for animations
        setTimeout(() => {
            resetCalculator();
            this.classList.remove('resetting');
            // Fade back in with a slight delay for visual effect
            setTimeout(() => {
                resultSection.style.opacity = '1';
            }, 300);
        }, 300);
    });
    
    // Tab navigation
    infoTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and content
            infoTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Copy results
    copyBtn.addEventListener('click', function() {
        copyToClipboard(resultText.value);
        
        // Show copied feedback
        this.classList.add('copied');
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="ri-check-line"></i> Copied!';
        
        // Reset button after 2 seconds
        setTimeout(() => {
            this.classList.remove('copied');
            this.innerHTML = originalText;
        }, 2000);
    });
    
    // Share functionality
    shareBtn.addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: 'My Age Calculation',
                text: resultText.value,
                url: window.location.href
            })
            .catch(error => console.log('Error sharing:', error));
        } else {
            // Fallback for browsers that don't support Web Share API
            copyToClipboard(resultText.value);
            this.classList.add('copied');
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="ri-check-line"></i> Copied to clipboard!';
            
            setTimeout(() => {
                this.classList.remove('copied');
                this.innerHTML = originalText;
            }, 2000);
        }
    });
    
    // Print functionality
    printBtn.addEventListener('click', function() {
        const printContent = `
            <html>
            <head>
                <title>Age Calculation Results</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
                    h1 { color: #4285F4; }
                    .result { margin-bottom: 20px; }
                    .detail { margin: 10px 0; }
                    .detail-label { font-weight: bold; }
                </style>
            </head>
            <body>
                <h1>Age Calculation Results</h1>
                <div class="result">
                    <h2>Age: ${yearsDisplay.textContent} years, ${monthsDisplay.textContent} months, ${daysDisplay.textContent} days</h2>
                </div>
                <div class="details">
                    <div class="detail"><span class="detail-label">Total Months:</span> ${totalMonthsDisplay.textContent}</div>
                    <div class="detail"><span class="detail-label">Total Days:</span> ${totalDaysDisplay.textContent}</div>
                    <div class="detail"><span class="detail-label">Total Hours:</span> ${totalHoursDisplay.textContent}</div>
                    <div class="detail"><span class="detail-label">Total Minutes:</span> ${totalMinutesDisplay.textContent}</div>
                    <div class="detail"><span class="detail-label">Next Birthday:</span> ${nextBirthdayDisplay.textContent}</div>
                </div>
                <div class="footer" style="margin-top: 50px; font-size: 0.8em; color: #666;">
                    Generated by Daily Tools - Age Calculator
                </div>
            </body>
            </html>
        `;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        
        // Slight delay to ensure content is loaded
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 300);
    });
    
    // Modal functionality
    bugReportBtn.addEventListener('click', function() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    closeModal.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
    
    // Rating stars functionality
    ratingStars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-value'));
            highlightStars(rating);
        });
        
        star.addEventListener('mouseout', function() {
            const currentRating = parseInt(document.getElementById('rating-value').value);
            highlightStars(currentRating);
        });
        
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-value'));
            document.getElementById('rating-value').value = rating;
            highlightStars(rating);
            
            // Show thank you message
            const feedbackSection = document.querySelector('.feedback-section');
            const ratingMessage = document.createElement('div');
            ratingMessage.className = 'rating-message';
            ratingMessage.innerHTML = `<p>Thank you for your ${rating}-star rating!</p>`;
            
            // Remove any existing message
            const existingMessage = document.querySelector('.rating-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            // Add new message with animation
            feedbackSection.appendChild(ratingMessage);
            setTimeout(() => {
                ratingMessage.style.opacity = '1';
                ratingMessage.style.transform = 'translateY(0)';
            }, 10);
        });
    });
    
    // Input field animations
    birthDateInput.addEventListener('focus', function() {
        this.parentElement.classList.add('input-focused');
    });
    
    birthDateInput.addEventListener('blur', function() {
        this.parentElement.classList.remove('input-focused');
    });
    
    currentDateInput.addEventListener('focus', function() {
        this.parentElement.classList.add('input-focused');
    });
    
    currentDateInput.addEventListener('blur', function() {
        this.parentElement.classList.remove('input-focused');
    });
    
    // Functions
    function setDefaultDates() {
        // Set today's date as the default for current date
        const today = new Date();
        currentDateInput.value = getTodayString();
        currentDateInput.disabled = useTodayCheckbox.checked;
        
        // Set a default birth date (25 years ago from today)
        const defaultBirthDate = new Date();
        defaultBirthDate.setFullYear(defaultBirthDate.getFullYear() - 25);
        birthDateInput.value = formatDateForInput(defaultBirthDate);
        
        // Force browser to redraw date inputs
        setTimeout(() => {
            birthDateInput.style.display = 'none';
            currentDateInput.style.display = 'none';
            void birthDateInput.offsetHeight;
            void currentDateInput.offsetHeight;
            birthDateInput.style.display = 'block';
            currentDateInput.style.display = 'block';
        }, 10);
    }
    
    function getTodayString() {
        return formatDateForInput(new Date());
    }
    
    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    function calculateAge() {
        const birthDate = new Date(birthDateInput.value);
        let currentDate = useTodayCheckbox.checked ? new Date() : new Date(currentDateInput.value);
        
        // Validate dates
        if (!birthDateInput.value) {
            showError('Please enter a birth date');
            return;
        }
        
        if (!useTodayCheckbox.checked && !currentDateInput.value) {
            showError('Please enter a current date');
            return;
        }
        
        if (birthDate > currentDate) {
            showError('Birth date cannot be in the future');
            return;
        }
        
        // Calculate age
        const ageData = calculateAgeData(birthDate, currentDate);
        
        // Prepare for animation
        resetDisplayValues();
        
        // Display results with animation
        displayResults(ageData);
    }
    
    function resetDisplayValues() {
        // Reset to allow for new animations
        yearsDisplay.textContent = '0';
        monthsDisplay.textContent = '0';
        daysDisplay.textContent = '0';
        totalMonthsDisplay.textContent = '0';
        totalDaysDisplay.textContent = '0';
        totalHoursDisplay.textContent = '0';
        totalMinutesDisplay.textContent = '0';
        nextBirthdayDisplay.textContent = '...';
    }
    
    function calculateAgeData(birthDate, currentDate) {
        // Copy dates to avoid modifying the originals
        const startDate = new Date(birthDate);
        const endDate = new Date(currentDate);
        
        // Calculate years
        let years = endDate.getFullYear() - startDate.getFullYear();
        
        // Calculate months
        let months = endDate.getMonth() - startDate.getMonth();
        
        // Calculate days
        let days = endDate.getDate() - startDate.getDate();
        
        // Adjust for negative days or months
        if (days < 0) {
            months--;
            // Get the last day of the previous month
            const lastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
            days += lastMonth.getDate();
        }
        
        if (months < 0) {
            years--;
            months += 12;
        }
        
        // Calculate total values
        const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
        const totalMonths = years * 12 + months;
        const totalHours = totalDays * 24;
        const totalMinutes = totalHours * 60;
        
        // Calculate next birthday
        const nextBirthday = calculateNextBirthday(startDate, endDate);
        
        return {
            years,
            months,
            days,
            totalMonths,
            totalDays,
            totalHours,
            totalMinutes,
            nextBirthday
        };
    }
    
    function calculateNextBirthday(birthDate, currentDate) {
        const nextBirthdayDate = new Date(currentDate);
        
        // Set the next birthday to this year
        nextBirthdayDate.setMonth(birthDate.getMonth());
        nextBirthdayDate.setDate(birthDate.getDate());
        
        // If the birthday has already occurred this year, set it to next year
        if (nextBirthdayDate < currentDate) {
            nextBirthdayDate.setFullYear(nextBirthdayDate.getFullYear() + 1);
        }
        
        // Calculate days until next birthday
        const daysUntil = Math.ceil((nextBirthdayDate - currentDate) / (1000 * 60 * 60 * 24));
        
        return {
            date: nextBirthdayDate,
            daysUntil: daysUntil
        };
    }
    
    function displayResults(ageData) {
        // Apply a fade-in effect to the result section
        resultSection.style.opacity = '0.6';
        
        setTimeout(() => {
            resultSection.style.opacity = '1';
            resultSection.classList.add('results-visible');
            
            // Animate main age values with counting effect
            animateValue(yearsDisplay, 0, ageData.years, 1000);
            animateValue(monthsDisplay, 0, ageData.months, 800);
            animateValue(daysDisplay, 0, ageData.days, 600);
            
            // Animate total values
            setTimeout(() => {
                animateValue(totalMonthsDisplay, 0, ageData.totalMonths, 800);
                animateValue(totalDaysDisplay, 0, ageData.totalDays, 1000);
                animateValue(totalHoursDisplay, 0, ageData.totalHours, 1200);
                animateValue(totalMinutesDisplay, 0, ageData.totalMinutes, 1400);
                
                // Animate detail items
                const detailItems = document.querySelectorAll('.detail-item');
                detailItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('detail-visible');
                    }, index * 100);
                });
            }, 600);
            
            // Display next birthday with a slight delay for visual effect
            setTimeout(() => {
                const formattedNextBirthdayDate = ageData.nextBirthday.date.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                });
                
                nextBirthdayDisplay.textContent = `${formattedNextBirthdayDate} (${ageData.nextBirthday.daysUntil} days)`;
            }, 1400);
            
            // Prepare result text for copy
            resultText.value = `Age: ${ageData.years} years, ${ageData.months} months, ${ageData.days} days\n` +
                `Total Months: ${ageData.totalMonths}\n` +
                `Total Days: ${ageData.totalDays}\n` +
                `Total Hours: ${ageData.totalHours}\n` +
                `Total Minutes: ${ageData.totalMinutes}\n` +
                `Next Birthday: ${ageData.nextBirthday.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} (${ageData.nextBirthday.daysUntil} days away)`;
            
        }, 200);
    }
    
    function animateValue(element, start, end, duration) {
        // Ensure the values are numbers
        start = Number(start);
        end = Number(end);
        
        // Don't animate if the end value is too large (avoid UI lag)
        if (end > 10000) {
            element.textContent = end.toLocaleString();
            return;
        }
        
        // Calculate step size
        const range = end - start;
        const increment = range > 100 ? Math.ceil(range / 100) : 1;
        const stepTime = Math.abs(Math.floor(duration / (range / increment)));
        
        // Start animation
        let current = start;
        const timer = setInterval(() => {
            current += increment;
            
            // Handle end of animation
            if (current >= end) {
                clearInterval(timer);
                element.textContent = end.toLocaleString();
                element.classList.add('highlight-value');
                
                // Remove highlight after animation
                setTimeout(() => {
                    element.classList.remove('highlight-value');
                }, 300);
            } else {
                element.textContent = current.toLocaleString();
            }
        }, stepTime);
    }
    
    function resetCalculator() {
        setDefaultDates();
        
        // Reset results with fade effect
        resultSection.classList.remove('results-visible');
        
        // Reset with animation
        setTimeout(() => {
            yearsDisplay.textContent = '--';
            monthsDisplay.textContent = '--';
            daysDisplay.textContent = '--';
            totalMonthsDisplay.textContent = '--';
            totalDaysDisplay.textContent = '--';
            totalHoursDisplay.textContent = '--';
            totalMinutesDisplay.textContent = '--';
            nextBirthdayDisplay.textContent = '--';
            
            // Reset detail item animations
            const detailItems = document.querySelectorAll('.detail-item');
            detailItems.forEach(item => {
                item.classList.remove('detail-visible');
            });
        }, 300);
        
        // Clear any errors
        clearError();
    }
    
    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerHTML = `<i class="ri-error-warning-fill"></i> ${message}`;
        
        // Remove any existing error message
        clearError();
        
        // Insert error before the tool actions
        const inputSection = document.querySelector('.input-section');
        inputSection.appendChild(errorElement);
        
        // Add entrance animation
        setTimeout(() => {
            errorElement.style.opacity = '1';
            errorElement.style.transform = 'translateY(0)';
        }, 10);
        
        // Add error styling to inputs
        birthDateInput.classList.add('error');
        if (!useTodayCheckbox.checked) {
            currentDateInput.classList.add('error');
        }
        
        // Shake animation for error fields
        birthDateInput.classList.add('shake');
        if (!useTodayCheckbox.checked) {
            currentDateInput.classList.add('shake');
        }
        
        setTimeout(() => {
            birthDateInput.classList.remove('shake');
            currentDateInput.classList.remove('shake');
        }, 600);
        
        // Remove error after 4 seconds
        setTimeout(clearError, 4000);
    }
    
    function clearError() {
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            // Fade out animation
            existingError.style.opacity = '0';
            existingError.style.transform = 'translateY(-10px)';
            
            // Remove after animation completes
            setTimeout(() => {
                existingError.remove();
            }, 300);
        }
        
        // Remove error styling from inputs
        birthDateInput.classList.remove('error');
        currentDateInput.classList.remove('error');
    }
    
    function copyToClipboard(text) {
        // Modern clipboard API
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';  // Avoid scrolling to bottom
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                document.execCommand('copy');
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
            
            document.body.removeChild(textarea);
        }
    }
    
    function highlightStars(rating) {
        ratingStars.forEach(star => {
            const starValue = parseInt(star.getAttribute('data-value'));
            if (starValue <= rating) {
                star.classList.remove('ri-star-line');
                star.classList.add('ri-star-fill');
                star.style.color = getStarColor(starValue);
            } else {
                star.classList.remove('ri-star-fill');
                star.classList.add('ri-star-line');
                star.style.color = '';
            }
        });
    }
    
    function getStarColor(value) {
        switch(value) {
            case 1: return '#ea4335'; // Red
            case 2: return '#fbbc05'; // Yellow
            case 3: return '#fbbc05'; // Yellow
            case 4: return '#34a853'; // Green
            case 5: return '#34a853'; // Green
            default: return '#4285f4'; // Blue
        }
    }
    
    // Run initial calculation with animation delay
    setTimeout(() => {
        calculateAge();
    }, 800);
}); 