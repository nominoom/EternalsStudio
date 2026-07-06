// Function to load navbar into a page
function loadNavbar() {
    fetch('/components/navbar/navbar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('navbar-container').innerHTML = html;
            setActiveNavLink();
            initializeNavbarEvents();
            loadThemePreference(); // Ensure theme state is applied to the navbar controls
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
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const navActions = document.querySelector('.nav-actions');
    
    if (currentUser && navActions) {
        // Remove standard login link and CTA button if they exist
        const ctaBtn = navActions.querySelector('.cta-btn');
        const loginLink = navActions.querySelector('.login-link');
        if (ctaBtn) ctaBtn.remove();
        if (loginLink) loginLink.remove();
        
        // Create user profile dropdown menu
        const userMenu = document.createElement('div');
        userMenu.className = 'user-profile-menu';
        userMenu.innerHTML = `
            <button class="user-avatar-btn" aria-label="User profile">
                <span class="user-avatar-initial">${currentUser.username.charAt(0).toUpperCase()}</span>
            </button>
            <div class="user-dropdown-content">
                <div class="user-dropdown-header">
                    <span class="user-dropdown-name">${currentUser.username}</span>
                    <span class="user-dropdown-email">${currentUser.email}</span>
                </div>
                <hr class="dropdown-divider">
                <a href="/Store/store.html" class="dropdown-item">My Orders</a>
                <a href="#" class="dropdown-item" id="logout-btn">Log Out</a>
            </div>
        `;
        navActions.appendChild(userMenu);
        
        // Toggle dropdown open/close
        const avatarBtn = userMenu.querySelector('.user-avatar-btn');
        const dropdownContent = userMenu.querySelector('.user-dropdown-content');
        
        avatarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownContent.classList.toggle('show');
        });
        
        document.addEventListener('click', () => {
            dropdownContent.classList.remove('show');
        });
        
        // Logout button logic
        const logoutBtn = userMenu.querySelector('#logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                window.location.reload();
            });
        }
    } else if (navActions) {
        // If not logged in, ensure "Sign In" link is present
        if (!navActions.querySelector('.login-link')) {
            const loginLink = document.createElement('a');
            loginLink.href = '/Login/login.html';
            loginLink.className = 'login-link';
            loginLink.textContent = 'Sign In';
            
            const ctaBtn = navActions.querySelector('.cta-btn');
            if (ctaBtn) {
                navActions.insertBefore(loginLink, ctaBtn);
            } else {
                navActions.appendChild(loginLink);
            }
        }
    }

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

    // CTA button (if still present)
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
        if (themeToggle) themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        if (themeToggle) themeToggle.textContent = '🌙';
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
    } else {
        document.body.classList.remove('dark-theme');
        if (themeToggle) themeToggle.textContent = '🌙';
    }
}

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    loadThemePreference(); // Early load theme state
});
