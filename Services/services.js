// Services page specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
    console.log('Services page loaded');
    
    initializeServiceCards();
    animateServiceCards();
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

function animateServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}
