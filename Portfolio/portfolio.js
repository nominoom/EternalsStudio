// Portfolio page specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio page loaded');
    
    initializeFilters();
    animateElementsOnScroll();
});

function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            let visibleIndex = 0;
            
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    // Show item
                    item.classList.remove('hidden');
                    // Reset opacity/transform for clean state
                    item.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    
                    // Stagger the animation of visible items
                    const staggerDelay = visibleIndex * 50;
                    visibleIndex++;
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1) translateY(0)';
                    }, staggerDelay);
                } else {
                    // Hide item
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.85) translateY(15px)';
                    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
}

function animateElementsOnScroll() {
    const animatedElements = document.querySelectorAll('.portfolio-item, .cta-banner-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // If this is a portfolio card inside the grid, stagger its fade-in based on its visual index
                const parentGrid = entry.target.parentElement;
                if (parentGrid && parentGrid.classList.contains('portfolio-grid')) {
                    // Get all visible (non-hidden) children
                    const visibleSiblings = Array.from(parentGrid.children).filter(el => !el.classList.contains('hidden'));
                    const index = visibleSiblings.indexOf(entry.target);
                    if (index !== -1) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'scale(1) translateY(0)';
                        }, index * 60);
                    } else {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'scale(1) translateY(0)';
                    }
                } else {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1) translateY(0)';
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'scale(0.95) translateY(30px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
}
