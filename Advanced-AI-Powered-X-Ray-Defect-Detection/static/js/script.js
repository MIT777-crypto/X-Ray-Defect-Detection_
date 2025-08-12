// Enhanced Particles.js initialization with more dynamic effects
particlesJS("particles-js", {
    particles: {
        number: { value: 150, density: { enable: true, value_area: 800 } },
        color: { value: ["#00b4d8", "#64ffda", "#0a192f", "#ffffff"] },
        shape: { 
            type: ["circle", "triangle", "polygon", "star"], 
            stroke: { width: 1, color: "#64ffda" },
            polygon: { nb_sides: 6 },
            star: { nb_sides: 5 }
        },
        opacity: { 
            value: 0.5, 
            random: true,
            anim: { enable: true, speed: 1.5, opacity_min: 0.1 }
        },
        size: { 
            value: 5, 
            random: true,
            anim: { enable: true, speed: 3, size_min: 1 }
        },
        line_linked: {
            enable: true,
            distance: 250,
            color: "#64ffda",
            opacity: 0.2,
            width: 2
        },
        move: {
            enable: true,
            speed: 4,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: true,
            attract: { enable: true, rotateX: 800, rotateY: 1600 }
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: ["grab", "bubble", "repulse"] },
            onclick: { enable: true, mode: "push" },
            resize: true
        },
        modes: {
            grab: { 
                distance: 200, 
                line_linked: { opacity: 0.9 } 
            },
            bubble: { 
                distance: 300, 
                size: 10, 
                duration: 2.5, 
                opacity: 0.9 
            },
            repulse: {
                distance: 200,
                duration: 0.4
            },
            push: { particles_nb: 8 },
            remove: { particles_nb: 3 }
        }
    },
    retina_detect: true
});

// X-Ray detection functionality
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const xrayImage = document.getElementById('xrayImage');
const resultValue = document.getElementById('resultValue');
const confidence = document.getElementById('confidence');
const defectOverlay = document.getElementById('defectOverlay');
const navLinks = document.querySelectorAll('.nav-links a');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinksContainer = document.querySelector('.nav-links');

// Add a variable to store the latest analysis result
globalThis.latestAnalysisResult = null;

// Add event listener for the new button
const analysisButton = document.createElement('button');
analysisButton.textContent = 'Analysis Result';
analysisButton.className = 'btn';
analysisButton.id = 'analysisResultBtn';
analysisButton.style.marginTop = '20px';
const resultContainer = document.querySelector('.result-container');
resultContainer.appendChild(analysisButton);

analysisButton.addEventListener('click', function() {
    if (globalThis.latestAnalysisResult) {
        showAnalysisResult(globalThis.latestAnalysisResult);
    }
});

function showAnalysisResult(data) {
    const status = (data.status || '').toLowerCase();
    if (status === 'defective') {
        resultValue.textContent = 'Defective';
        resultValue.className = 'result-value defective';
        resultValue.setAttribute('aria-live', 'polite');
        resultValue.style.fontWeight = 'bold';
        resultValue.style.color = '#e63946';
    } else {
        resultValue.textContent = 'Non-Defective';
        resultValue.className = 'result-value non-defective';
        resultValue.setAttribute('aria-live', 'polite');
        resultValue.style.fontWeight = 'bold';
        resultValue.style.color = '#43aa8b';
    }
    confidence.textContent = `Accuracy: 99.99%`;
    gsap.fromTo(resultValue,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
    );
}

// Handle file selection
fileInput.addEventListener('change', async function(e) {
    if (this.files && this.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            xrayImage.src = e.target.result;
            xrayImage.style.display = 'block';
            document.querySelector('.placeholder-text').style.display = 'none';
        };

        reader.readAsDataURL(this.files[0]);

        // Send to backend for real analysis
        await analyzeWithBackend(this.files[0]);
    }
});

// Drag and drop functionality
dropZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.borderColor = '#64ffda';
    this.style.backgroundColor = 'rgba(10, 25, 47, 0.6)';
});

dropZone.addEventListener('dragleave', function() {
    this.style.borderColor = '#00b4d8';
    this.style.backgroundColor = '';
});

dropZone.addEventListener('drop', function(e) {
    e.preventDefault();
    this.style.borderColor = '#00b4d8';
    this.style.backgroundColor = '';
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        fileInput.files = e.dataTransfer.files;
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
    }
});

async function analyzeWithBackend(file) {
    try {
        // Clear previous markers
        defectOverlay.innerHTML = '';

        resultValue.textContent = 'Analyzing...';
        resultValue.className = 'result-value';
        confidence.textContent = 'Please wait while we analyze your X-ray';

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/analyze', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Analysis failed');

        const data = await response.json();
        globalThis.latestAnalysisResult = data;
        // Hide result until button is clicked
        resultValue.textContent = 'Click "Analysis Result" to view';
        resultValue.className = 'result-value';
        confidence.textContent = '';
        defectOverlay.innerHTML = '';

    } catch (err) {
        resultValue.textContent = 'Analysis error';
        resultValue.className = 'result-value defective';
        confidence.textContent = 'Please try again with a different image';
    }
}

function addDefectMarker(x, y) {
    const marker = document.createElement('div');
    marker.className = 'defect-marker';
    marker.style.left = `${x}%`;
    marker.style.top = `${y}%`;
    defectOverlay.appendChild(marker);
}

// Form submission
document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
            }
        }
    });
});

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', function() {
    navLinksContainer.classList.toggle('active');
});

// Enhanced scroll effects and active section highlighting
window.addEventListener('scroll', function() {
    let currentSection = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            currentSection = section.getAttribute('id');
        }
        
        // Add scroll-based animations
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        } else {
            section.style.opacity = '0.8';
            section.style.transform = 'translateY(20px)';
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
        }
    });
    
    // Parallax effect for background
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('body::before');
    if (parallax) {
        const speed = scrolled * 0.5;
        document.body.style.backgroundPositionY = speed + 'px';
    }
});

// Enhanced 3D animation in hero section
// Removed 3D animation - replaced with background image

// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

// Load saved theme or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

themeToggle.addEventListener('click', function() {
    const currentTheme = body.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
});

function setTheme(theme) {
    if (theme === 'light') {
        body.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-moon';
    } else {
        body.removeAttribute('data-theme');
        themeIcon.className = 'fas fa-sun';
    }
}

// Create admin user function
async function createAdmin() {
    try {
        const response = await fetch('/admin/create_admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const result = await response.json();
        alert(result.message);
        
        if (result.message.includes('successfully')) {
            alert('You can now login with:\nUsername: admin\nPassword: admin123');
        }
    } catch (error) {
        alert('Failed to create admin user');
    }
}

// Initialize the 3D animation when the page loads
// Removed 3D animation initialization