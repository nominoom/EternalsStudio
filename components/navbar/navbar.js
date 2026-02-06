// Function to load navbar into a page
function loadNavbar() {
    fetch('/components/navbar/navbar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('navbar-container').innerHTML = html;
            setActiveNavLink();
            initializeNavbarEvents();
        })
        .catch(error => console.error('Error loading navbar:', error));
}

// Set active nav link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = link.getAttribute('href');
        
        // Check if current page matches the link
        if (currentPage.includes(linkPath) || 
            (currentPage === '/' && linkPath.includes('index.html')) ||
            (currentPage.endsWith('/') && linkPath.includes('index.html'))) {
            link.classList.add('active');
        }
    });
}

// Initialize navbar event listeners
function initializeNavbarEvents() {
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Cart button
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            window.location.href = '/Store/store.html';
        });
    }

    // CTA button
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            window.location.href = '/Contact/contact.html';
        });
    }
}

// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
    
    body.classList.toggle('dark-theme');
    
    if (body.classList.contains('dark-theme')) {
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

// Load saved theme preference
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggle) themeToggle.textContent = '☀️';
    }
}

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
});
