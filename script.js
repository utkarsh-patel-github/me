// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: false,
    mirror: true
});

// Mobile Navigation Functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const body = document.querySelector('body');
const navItems = document.querySelectorAll('.nav-links li a');

// Toggle navigation menu when hamburger is clicked
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    body.classList.toggle('menu-active');
});

// Close menu when a nav item is clicked on mobile
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 991) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.classList.remove('menu-active');
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Initialize Vanilla Tilt for skill cards and achievement cards
VanillaTilt.init(document.querySelectorAll(".skill-card, .achievement-card"), {
    max: 25,
    speed: 400,
    glare: true,
    "max-glare": 0.5,
});

// Initialize VanillaTilt for project cards
VanillaTilt.init(document.querySelectorAll(".project-card"), {
    max: 15,
    speed: 400,
    glare: true,
    "max-glare": 0.3,
});

// Three.js Background Animation
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('hero-background').appendChild(renderer.domElement);

// Create particles
const particles = new THREE.BufferGeometry();
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 5;
}

particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const material = new THREE.PointsMaterial({
    size: 0.005,
    color: '#2ecc71'
});

const particlesMesh = new THREE.Points(particles, material);
scene.add(particlesMesh);
camera.position.z = 3;

// Animation loop
const animate = () => {
    requestAnimationFrame(animate);
    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.001;
    renderer.render(scene, camera);
};
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animate skill bars on scroll
const animateSkillBars = () => {
    document.querySelectorAll('.progress-bar').forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.width = progress + '%';
    });
};

// Typewriter effect for tagline
const typeWriter = (text, i, fnCallback) => {
    if (i < text.length) {
        document.querySelector(".tagline").innerHTML = text.substring(0, i+1) + '<span aria-hidden="true"></span>';
        setTimeout(() => {
            typeWriter(text, i + 1, fnCallback)
        }, 100);
    } else if (typeof fnCallback == 'function') {
        setTimeout(fnCallback, 700);
    }
};

// Animate tech stack items
const animateTechStack = () => {
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('animate-in');
    });
};

// Handle scrolling animations
window.addEventListener('scroll', () => {
    // Parallax effect for achievements section
    const achievements = document.querySelector('.achievements');
    if (achievements) {
        const scrollPosition = window.scrollY;
        const achievementsPosition = achievements.offsetTop;
        const windowHeight = window.innerHeight;
        
        if (scrollPosition + windowHeight > achievementsPosition) {
            const parallaxOffset = (scrollPosition + windowHeight - achievementsPosition) * 0.1;
            achievements.style.backgroundPositionY = `-${parallaxOffset}px`;
        }
    }
});

// Start the typewriter effect and animations
window.addEventListener('load', () => {
    const text = document.querySelector(".tagline").innerHTML;
    document.querySelector(".tagline").innerHTML = '';
    typeWriter(text, 0);
    animateSkillBars();
    
    // Add active class to navbar based on scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
});

// Intersection Observer for skill bars animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.closest('.skills')) {
                animateSkillBars();
            }
            if (entry.target.closest('.tech-stack')) {
                animateTechStack();
            }
        }
    });
}, { threshold: 0.2 });

// Observe sections for animations
document.querySelectorAll('section').forEach((section) => {
    observer.observe(section);
});

// Add hover effect for achievement cards
document.querySelectorAll('.achievement-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Add animation for tech items
const techItems = document.querySelectorAll('.tech-item');
techItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
});
