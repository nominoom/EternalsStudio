// About page specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
    console.log('About page loaded');
    
    animateElementsOnScroll();
});

function animateElementsOnScroll() {
    const animatedElements = document.querySelectorAll(
        '.about-banner-card, .mission-text-col, .mission-visual, .expertise-item, .team-card, .stat-item'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const parentGrid = entry.target.parentElement;
                
                // Stagger animations for elements inside grid layout wrappers
                if (parentGrid && (
                    parentGrid.classList.contains('expertise-grid') || 
                    parentGrid.classList.contains('team-grid') || 
                    parentGrid.classList.contains('stats')
                )) {
                    const siblings = Array.from(parentGrid.children);
                    const index = siblings.indexOf(entry.target);
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, index * 80);
                } else {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        
        // Custom entrance transforms depending on element type
        if (el.classList.contains('expertise-item') || el.classList.contains('team-card')) {
            el.style.transform = 'translateY(35px) scale(0.96)';
        } else {
            el.style.transform = 'translateY(40px)';
        }
        
        el.style.transition = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
}
