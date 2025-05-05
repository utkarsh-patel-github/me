document.addEventListener('DOMContentLoaded', function() {
    // Get all FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Add click event listeners to FAQ questions
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Toggle active class on clicked item
            item.classList.toggle('active');
            
            // Close other FAQ items when one is opened (optional accordion behavior)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });
    
    // Show first FAQ item by default
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }
    
    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formDataObj = {};
            
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            // Simulate form submission (in a real application, this would be an API call)
            // Show loading state
            formStatus.textContent = 'Sending message...';
            formStatus.className = 'form-status';
            formStatus.style.display = 'block';
            
            // Simulate API delay
            setTimeout(() => {
                // Success response
                formStatus.textContent = 'Your message has been sent successfully! We will get back to you soon.';
                formStatus.className = 'form-status success';
                
                // Reset form after successful submission
                contactForm.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            }, 1500);
            
            // Error handling would be added here in a real application
        });
    }
    
    // Newsletter Form Handling
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Validate email (basic validation)
            if (!email || !email.includes('@')) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Simulate subscription (in a real application, this would be an API call)
            const button = newsletterForm.querySelector('button');
            const originalText = button.textContent;
            
            // Show loading state
            button.textContent = 'Subscribing...';
            button.disabled = true;
            
            // Simulate API delay
            setTimeout(() => {
                // Success response
                button.textContent = 'Subscribed!';
                
                // Reset form after successful submission
                newsletterForm.reset();
                
                // Restore original button text after 2 seconds
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                }, 2000);
            }, 1500);
        });
    }
    
    // Live Chat Button Handling
    const openChatBtn = document.getElementById('open-chat-btn');
    
    if (openChatBtn) {
        openChatBtn.addEventListener('click', function() {
            // In a real application, this would open a chat widget
            alert('Chat functionality would open here in a real application.');
        });
    }
}); 