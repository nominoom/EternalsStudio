// Store page specific JavaScript
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log('Store page loaded');
    
    initializeCategoryFilters();
    initializeAddToCart();
    loadCart();
});

function initializeCategoryFilters() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-category');
            
            productCards.forEach(card => {
                if (category === 'all') {
                    card.classList.remove('hidden');
                } else {
                    const productCategory = card.getAttribute('data-category');
                    if (productCategory === category) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });
}

function initializeAddToCart() {
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const priceText = productCard.querySelector('.product-price').textContent;
            
            // Extract price (handle sale prices)
            let price = priceText.match(/\$(\d+\.\d+)/g);
            price = price ? parseFloat(price[price.length - 1].replace('$', '')) : 0;
            
            addToCart({
                name: productName,
                price: price
            });
            
            // Visual feedback
            this.textContent = 'Added!';
            setTimeout(() => {
                this.textContent = 'Add to Cart';
            }, 1500);
        });
    });
}

function addToCart(product) {
    cart.push(product);
    saveCart();
    updateCartDisplay();
}

function saveCart() {
    localStorage.setItem('eternalsCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('eternalsCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartSummary = document.getElementById('cartSummary');
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartSummary.style.display = 'none';
        return;
    }
    
    cartSummary.style.display = 'block';
    cartCount.textContent = cart.length;
    
    // Display cart items
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
        `;
        cartItems.appendChild(itemDiv);
        total += item.price;
    });
    
    cartTotal.textContent = total.toFixed(2);
}

// Checkout functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('checkout-btn')) {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // TODO: Implement actual checkout process
        alert('Checkout functionality coming soon! Total: $' + document.getElementById('cartTotal').textContent);
    }
});
