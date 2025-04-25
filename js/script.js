document.addEventListener('DOMContentLoaded', () => {
    // Initialize all animations and interactions
    initNavbar();
    initSmoothScroll();
    initTestimonialSlider();
    initAnimations();
    initTilt();
});

// Mobile Navigation
function initNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.nav-container');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Close navbar when clicking on a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Hide/show navbar on scroll
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add box shadow when not at the top
        if (scrollTop > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show based on scroll direction
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down & not at the top
            navbar.classList.add('nav-hidden');
        } else {
            // Scrolling up or at the top
            navbar.classList.remove('nav-hidden');
        }
        
        lastScrollTop = scrollTop;
    });
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.nav-container').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Testimonial Slider
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    
    if (!slider || !prevBtn || !nextBtn) return;
    
    let currentSlide = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    const maxSlide = testimonials.length - 1;
    
    // Update slider position
    function updateSlider() {
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Next slide
    nextBtn.addEventListener('click', () => {
        currentSlide = currentSlide === maxSlide ? 0 : currentSlide + 1;
        updateSlider();
    });
    
    // Previous slide
    prevBtn.addEventListener('click', () => {
        currentSlide = currentSlide === 0 ? maxSlide : currentSlide - 1;
        updateSlider();
    });
    
    // Click on dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });
    
    // Auto slide
    let slideInterval = setInterval(() => {
        currentSlide = currentSlide === maxSlide ? 0 : currentSlide + 1;
        updateSlider();
    }, 5000);
    
    // Pause auto slide on hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            currentSlide = currentSlide === maxSlide ? 0 : currentSlide + 1;
            updateSlider();
        }, 5000);
    });
}

// Scroll-based animations
function initAnimations() {
    // Add the fade-in class to elements that should animate in
    const animateElements = document.querySelectorAll('.program-card, .hacker-card, .step, .resource-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add slide-in-left and slide-in-right to alternating sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        const header = section.querySelector('.section-header');
        if (header) {
            if (index % 2 === 0) {
                header.classList.add('slide-in-right');
            } else {
                header.classList.add('slide-in-left');
            }
        }
    });
}

// Tilt effect for cards
function initTilt() {
    const cards = document.querySelectorAll('.program-card, .hacker-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const x = e.clientX - cardRect.left;
            const y = e.clientY - cardRect.top;
            
            const centerX = cardRect.width / 2;
            const centerY = cardRect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

// Add neon glow effect to buttons on hover
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.classList.add('glow');
    });
    
    button.addEventListener('mouseleave', () => {
        button.classList.remove('glow');
    });
});

// Typing animation for hero heading (optional)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Particle background effect (advanced)
function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.classList.add('particles-canvas');
    document.querySelector('.gradient-bg').appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            color: i % 2 === 0 ? 'rgba(138, 43, 226, 0.3)' : 'rgba(0, 255, 255, 0.3)',
            speedX: Math.random() * 3 - 1.5,
            speedY: Math.random() * 3 - 1.5
        });
    }
    
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0 || particle.x > canvas.width) {
                particle.speedX = -particle.speedX;
            }
            
            if (particle.y < 0 || particle.y > canvas.height) {
                particle.speedY = -particle.speedY;
            }
        });
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Uncomment to enable particle background
// initParticles(); 