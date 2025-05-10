// Contact Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Form validation and submission
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const isValid = validateForm();
            
            if (isValid) {
                // Simulate form submission
                submitForm();
            }
        });
    }
    
    // Form validation function
    function validateForm() {
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        let isValid = true;
        
        // Reset previous error states
        clearErrors();
        
        // Name validation
        if (!name.value.trim()) {
            showError(name, 'Please enter your name');
            isValid = false;
        }
        
        // Email validation
        if (!email.value.trim()) {
            showError(email, 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Subject validation
        if (!subject.value || subject.value === '') {
            showError(subject, 'Please select a subject');
            isValid = false;
        }
        
        // Message validation
        if (!message.value.trim()) {
            showError(message, 'Please enter your message');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError(message, 'Message must be at least 10 characters');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Email validation helper
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Show error message
    function showError(input, message) {
        input.classList.add('invalid');
        const formGroup = input.closest('.form-group');
        
        // Remove any existing error message
        const existingError = formGroup.querySelector('.error-feedback');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-feedback';
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);
    }
    
    // Clear all error messages
    function clearErrors() {
        document.querySelectorAll('.form-group .error-feedback').forEach(el => el.remove());
        document.querySelectorAll('.form-group .invalid').forEach(el => el.classList.remove('invalid'));
    }
    
    // Form submission
    function submitForm() {
        const submitBtn = contactForm.querySelector('.submit-button');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="ri-loader-2-line loading"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call with timeout
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success toast
            showToast('success', 'Message sent successfully!');
            
            // Reset form
            contactForm.reset();
            
        }, 1500);
    }
    
    // Toast notification function
    function showToast(type, message) {
        // Remove any existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        
        // Set icon based on type
        let icon = 'ri-check-line';
        if (type === 'error') {
            icon = 'ri-error-warning-line';
        }
        
        toast.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
        `;
        
        // Add to document
        document.body.appendChild(toast);
        
        // Show toast (with a slight delay for animation)
        setTimeout(() => {
            toast.classList.add('visible');
        }, 10);
        
        // Hide and remove toast after timeout
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    }
}); 