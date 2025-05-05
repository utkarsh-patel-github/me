document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const birthDateInput = document.getElementById('birth-date');
    const currentDateInput = document.getElementById('current-date');
    const useTodayCheckbox = document.getElementById('use-today');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultSection = document.getElementById('result-section');
    const yearsElement = document.getElementById('years');
    const monthsElement = document.getElementById('months');
    const daysElement = document.getElementById('days');
    const totalDaysElement = document.getElementById('total-days');
    const nextBirthdayElement = document.getElementById('next-birthday');
    const copyBtn = document.getElementById('copy-btn');
    const resultText = document.getElementById('result-text');
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Initialize dates
    const today = new Date();
    const formattedToday = formatDateForInput(today);
    
    // Set max date for birth date input
    birthDateInput.setAttribute('max', formattedToday);
    
    // Initialize current date input with today's date
    currentDateInput.value = formattedToday;
    
    // Event listeners
    useTodayCheckbox.addEventListener('change', function() {
        currentDateInput.disabled = this.checked;
        if (this.checked) {
            currentDateInput.value = formattedToday;
        }
    });
    
    calculateBtn.addEventListener('click', calculateAge);
    resetBtn.addEventListener('click', resetCalculator);
    copyBtn.addEventListener('click', copyResults);
    
    // Handle FAQ accordion
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
    
    // Theme toggle if it exists
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        
        // Check for saved theme preference or respect OS preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.body.classList.add('dark-mode');
        }
    }
    
    // Mobile menu toggle if it exists
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.querySelector('.nav-links').classList.toggle('active');
        });
    }
    
    // Functions
    function calculateAge() {
        const birthDate = new Date(birthDateInput.value);
        
        // Validate birth date
        if (!birthDateInput.value) {
            alert('Please enter your date of birth');
            return;
        }
        
        // Get comparison date (today or selected)
        let compareDate;
        if (useTodayCheckbox.checked) {
            compareDate = new Date();
        } else {
            if (!currentDateInput.value) {
                alert('Please enter a comparison date');
                return;
            }
            compareDate = new Date(currentDateInput.value);
        }
        
        // Validate dates
        if (birthDate > compareDate) {
            alert('Birth date cannot be in the future of the comparison date');
            return;
        }
        
        // Calculate age
        const ageDetails = getAgeDetails(birthDate, compareDate);
        
        // Display results
        yearsElement.textContent = ageDetails.years;
        monthsElement.textContent = ageDetails.months;
        daysElement.textContent = ageDetails.days;
        totalDaysElement.textContent = ageDetails.totalDays.toLocaleString();
        nextBirthdayElement.textContent = ageDetails.nextBirthday;
        
        // Create text for clipboard
        resultText.value = `Age: ${ageDetails.years} years, ${ageDetails.months} months, ${ageDetails.days} days\nTotal days: ${ageDetails.totalDays.toLocaleString()}\nNext birthday: ${ageDetails.nextBirthday}`;
        
        // Show result section with animation
        resultSection.style.opacity = '0';
        resultSection.style.display = 'block';
        setTimeout(() => {
            resultSection.style.opacity = '1';
        }, 10);
    }
    
    function getAgeDetails(birthDate, currentDate) {
        // Calculate total days
        const totalDays = Math.floor((currentDate - birthDate) / (1000 * 60 * 60 * 24));
        
        // Calculate years, months, days
        let years = currentDate.getFullYear() - birthDate.getFullYear();
        let months = currentDate.getMonth() - birthDate.getMonth();
        let days = currentDate.getDate() - birthDate.getDate();
        
        // Adjust if days are negative
        if (days < 0) {
            months--;
            // Get the last day of the previous month
            const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            days += lastMonth.getDate();
        }
        
        // Adjust if months are negative
        if (months < 0) {
            years--;
            months += 12;
        }
        
        // Calculate next birthday
        const nextBirthday = getNextBirthday(birthDate, currentDate);
        
        return {
            years,
            months,
            days,
            totalDays,
            nextBirthday
        };
    }
    
    function getNextBirthday(birthDate, currentDate) {
        // Get this year's birthday
        const thisYearBirthday = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        
        // If this year's birthday has passed, get next year's birthday
        if (thisYearBirthday < currentDate) {
            thisYearBirthday.setFullYear(currentDate.getFullYear() + 1);
        }
        
        // Calculate days until next birthday
        const daysUntil = Math.ceil((thisYearBirthday - currentDate) / (1000 * 60 * 60 * 24));
        
        return `In ${daysUntil} days (${formatDate(thisYearBirthday)})`;
    }
    
    function resetCalculator() {
        birthDateInput.value = '';
        if (!useTodayCheckbox.checked) {
            currentDateInput.value = '';
        }
        resultSection.style.opacity = '0';
        setTimeout(() => {
            resultSection.style.display = 'none';
            yearsElement.textContent = '--';
            monthsElement.textContent = '--';
            daysElement.textContent = '--';
            totalDaysElement.textContent = '--';
            nextBirthdayElement.textContent = '--';
        }, 300);
    }
    
    function copyResults() {
        resultText.select();
        document.execCommand('copy');
        
        // Show copied feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="ri-check-line"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }
    
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
    
    // Helper functions
    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }
});

// Create and add the age calculator icon if it doesn't exist
(function() {
    const iconExists = document.querySelector('.header-image img').complete;
    if (!iconExists) {
        // Create a placeholder SVG icon
        const iconSVG = `
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="10" fill="#F3F4F6"/>
            <rect x="25" y="25" width="70" height="70" rx="8" fill="#E5E7EB"/>
            <rect x="35" y="20" width="50" height="8" rx="4" fill="#4F46E5"/>
            <rect x="35" y="35" width="50" height="6" rx="3" fill="#9CA3AF"/>
            <rect x="35" y="45" width="50" height="6" rx="3" fill="#9CA3AF"/>
            <rect x="35" y="55" width="30" height="6" rx="3" fill="#9CA3AF"/>
            <circle cx="60" cy="75" r="15" fill="#4F46E5"/>
            <path d="M60 65V75L67 82" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        `;
        
        // Create a blob from the SVG
        const blob = new Blob([iconSVG], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        // Create and set the image
        const img = document.createElement('img');
        img.src = url;
        img.alt = "Age Calculator";
        
        // Find the header image container and add the image
        const headerImage = document.querySelector('.header-image');
        if (headerImage) {
            headerImage.innerHTML = '';
            headerImage.appendChild(img);
        }
    }
})();
