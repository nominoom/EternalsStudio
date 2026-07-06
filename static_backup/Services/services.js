// Services page specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
    console.log('Services page loaded');
    
    initializeServiceCards();
    animateElementsOnScroll();
});

function initializeServiceCards() {
    const serviceButtons = document.querySelectorAll('.service-btn');
    
    serviceButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const serviceName = this.parentElement.querySelector('h3').textContent;
            console.log('Service selected:', serviceName);
            
            // Navigate to contact page with service pre-selected
            window.location.href = `/Contact/contact.html?service=${encodeURIComponent(serviceName)}`;
        });
    });
}

function animateElementsOnScroll() {
    const animatedElements = document.querySelectorAll('.service-card, .process-step, .industry-card, .cta-banner-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Apply a slight delay to create a stagger effect for items in grids
                const parentGrid = entry.target.parentElement;
                if (parentGrid && (parentGrid.classList.contains('process-grid') || parentGrid.classList.contains('industries-grid') || parentGrid.classList.contains('services-grid'))) {
                    const siblings = Array.from(parentGrid.children);
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
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
}
