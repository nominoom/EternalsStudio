// Contact page specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
    console.log('Contact page loaded');
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    animateElementsOnScroll();
});

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        company: document.getElementById('company').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    console.log('Form submitted:', formData);
    alert(`Thank you for your message, ${formData.firstName}! We will get back to you soon.`);
    e.target.reset();
}

function animateElementsOnScroll() {
    const animatedElements = document.querySelectorAll(
        '.contact-form-card, .info-card, .newsletter-card'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const parentElement = entry.target.parentElement;
                
                // If cards inside the stack, apply stagger delay
                if (parentElement && parentElement.classList.contains('contact-cards-stack')) {
                    const siblings = Array.from(parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 80);
                } else {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(35px)';
        el.style.transition = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
}
