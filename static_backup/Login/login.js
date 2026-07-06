// Authentication (Login/Register) Specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
    console.log('Auth page loaded');
    
    initializeAuthTabs();
    initializePasswordVisibilityToggles();
    initializeAuthForm();
    initializeSocialLogins();
});

let currentMode = 'signin'; // 'signin' or 'signup'

// Segmented slider and tab switching logic
function initializeAuthTabs() {
    const authTabs = document.querySelector('.auth-tabs');
    const signInTab = document.getElementById('signInTab');
    const signUpTab = document.getElementById('signUpTab');
    
    const usernameGroup = document.getElementById('usernameGroup');
    const emailLabel = document.getElementById('emailLabel');
    const checkboxText = document.getElementById('checkboxText');
    const forgotLink = document.getElementById('forgotLink');
    
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    const submitBtn = document.getElementById('submitBtn');
    
    if (signInTab && signUpTab && authTabs) {
        signInTab.addEventListener('click', () => {
            currentMode = 'signin';
            
            signInTab.classList.add('active');
            signUpTab.classList.remove('active');
            authTabs.classList.remove('signup-active');
            
            if (usernameGroup) usernameGroup.classList.add('hidden');
            if (emailLabel) emailLabel.textContent = 'Email';
            if (checkboxText) checkboxText.textContent = 'Remember me';
            if (forgotLink) forgotLink.style.display = 'inline-block';
            
            if (authTitle) authTitle.textContent = "Welcome to Eternals Studio";
            if (authSubtitle) authSubtitle.textContent = "Sign in to your account or create a new one";
            if (submitBtn) submitBtn.textContent = "Sign In";
            
            document.title = "Sign In - Eternals Studio";
        });
        
        signUpTab.addEventListener('click', () => {
            currentMode = 'signup';
            
            signUpTab.classList.add('active');
            signInTab.classList.remove('active');
            authTabs.classList.add('signup-active');
            
            if (usernameGroup) usernameGroup.classList.remove('hidden');
            if (emailLabel) emailLabel.textContent = 'Email Address';
            if (checkboxText) {
                checkboxText.innerHTML = 'I agree to the <a href="#" class="terms-link">Terms & Conditions</a>';
            }
            if (forgotLink) forgotLink.style.display = 'none';
            
            if (authTitle) authTitle.textContent = "Create an Account";
            if (authSubtitle) authSubtitle.textContent = "Join Eternals Studio today and start building";
            if (submitBtn) submitBtn.textContent = "Sign Up";
            
            document.title = "Sign Up - Eternals Studio";
        });
    }
}

// Toggle password visibility (eye icon)
function initializePasswordVisibilityToggles() {
    const toggleButtons = document.querySelectorAll('.password-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.parentElement.querySelector('input');
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    button.textContent = '🙈';
                } else {
                    input.type = 'password';
                    button.textContent = '👁️';
                }
            }
        });
    });
}

// Handle login / signup submission logic
function initializeAuthForm() {
    const authForm = document.getElementById('authForm');
    
    // Set up mock user accounts database
    if (!localStorage.getItem('eternals_users')) {
        const initialUsers = [
            { username: "fives", email: "fives@eternals.gg", password: "password123" },
            { username: "khas", email: "khas@eternals.gg", password: "password123" }
        ];
        localStorage.setItem('eternals_users', JSON.stringify(initialUsers));
    }
    
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('authEmail').value.trim().toLowerCase();
            const password = document.getElementById('authPassword').value;
            const users = JSON.parse(localStorage.getItem('eternals_users')) || [];
            
            if (currentMode === 'signup') {
                const username = document.getElementById('authUsername').value.trim();
                const rememberMe = document.getElementById('rememberMe').checked;
                
                if (!username) {
                    alert("Please enter a username.");
                    return;
                }
                
                if (!rememberMe) {
                    alert("You must agree to the Terms & Conditions.");
                    return;
                }
                
                // Check username taken
                const usernameExists = users.some(user => user.username.toLowerCase() === username.toLowerCase());
                if (usernameExists) {
                    alert("Username is already taken. Please choose another.");
                    return;
                }
                
                // Check email taken
                const emailExists = users.some(user => user.email === email);
                if (emailExists) {
                    alert("An account with this email address already exists.");
                    return;
                }
                
                // Save user
                const newUser = { username, email, password };
                users.push(newUser);
                localStorage.setItem('eternals_users', JSON.stringify(users));
                
                // Log in session
                localStorage.setItem('currentUser', JSON.stringify({ username, email }));
                
                alert(`Welcome to Eternals Studio, ${username}! Your account has been registered successfully.`);
                window.location.href = '/index.html';
                
            } else {
                // Sign In Mode
                const matchedUser = users.find(user => 
                    (user.username.toLowerCase() === email || user.email === email) &&
                    user.password === password
                );
                
                if (matchedUser) {
                    localStorage.setItem('currentUser', JSON.stringify({ 
                        username: matchedUser.username, 
                        email: matchedUser.email 
                    }));
                    
                    alert(`Welcome back, ${matchedUser.username}!`);
                    window.location.href = '/index.html';
                } else {
                    alert("Invalid username/email or password. Please try again.");
                }
            }
        });
    }
}

// Social logins simulation triggers
function initializeSocialLogins() {
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const providerName = btn.innerText.trim();
            alert(`Connecting with ${providerName} Single Sign-On service...`);
        });
    });
}
