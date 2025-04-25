document.addEventListener('DOMContentLoaded', () => {
  // Initialize animate on scroll
  initScrollAnimations();
  
  // Set up statistics counters
  initStatCounters();
});

function initScrollAnimations() {
  // Get all elements with animation classes
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .zoom-in');
  
  // Set up Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // If element is in viewport
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve element after animation is triggered
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1, // Trigger when at least 10% of the element is visible
    rootMargin: '0px 0px -100px 0px' // Slightly before elements come into view
  });
  
  // Observe each animated element
  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

function initStatCounters() {
  // Get all stat counter elements
  const statElements = document.querySelectorAll('.stat-counter');
  
  // Set up Intersection Observer for stat counters
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const countTo = parseInt(target.getAttribute('data-count'), 10);
        const duration = 2000; // Animation duration in milliseconds
        
        // Animate counting up
        animateValue(target, 0, countTo, duration);
        
        // Unobserve after triggering animation
        observer.unobserve(target);
      }
    });
  }, {
    threshold: 0.5
  });
  
  // Observe each stat counter
  statElements.forEach((element, index) => {
    // Add animation delay index
    element.style.setProperty('--item-index', index);
    observer.observe(element);
  });
}

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeProgress = easeOutQuad(progress);
    const currentValue = Math.floor(easeProgress * (end - start) + start);
    
    obj.innerHTML = currentValue.toLocaleString();
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Easing function for smoother animation
function easeOutQuad(t) {
  return t * (2 - t);
}

// Add hover effects for cards
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card, .feature-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px)';
      card.style.boxShadow = '0 20px 30px rgba(0, 0, 0, 0.1)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'var(--card-shadow)';
    });
  });
});

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for fixed header
          behavior: 'smooth'
        });
      }
    });
  });
}); 