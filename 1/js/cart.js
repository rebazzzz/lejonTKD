// cart.js - Cart page functionality

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cartContent = document.getElementById('cart-content');
    const proceedCheckout = document.getElementById('proceed-checkout');

    // Cart state
    let cart = JSON.parse(localStorage.getItem('lejonTkdCart')) || [];

    // Initialize cart page
    function initCartPage() {
        renderCart();
        setupEventListeners();
    }

    // Render cart content
    function renderCart() {
        if (!cartContent) return;

        if (cart.length === 0) {
            cartContent.innerHTML = `
                <div class="cart-empty-state">
                    <div class="empty-cart-icon">🛒</div>
                    <h2>Din varukorg är tom</h2>
                    <p>Lägg till några produkter från vår shop för att komma igång!</p>
                    <a href="shop.html" class="btn btn-primary">Börja handla</a>
                </div>
            `;
            if (proceedCheckout) proceedCheckout.disabled = true;
            return;
        }

        const cartHTML = `
            <div class="cart-items-list">
                ${cart.map(item => createCartItemHTML(item)).join('')}
            </div>
            <div class="cart-summary">
                <div class="cart-summary-row">
                    <span>Delsumma:</span>
                    <span>${calculateSubtotal()} kr</span>
                </div>
                <div class="cart-summary-row">
                    <span>Frakt:</span>
                    <span>${calculateShipping()} kr</span>
                </div>
                <div class="cart-summary-row total">
                    <span>Totalt:</span>
                    <span>${calculateTotal()} kr</span>
                </div>
            </div>
        `;

        cartContent.innerHTML = cartHTML;
        if (proceedCheckout) proceedCheckout.disabled = false;
    }

    // Create cart item HTML
    function createCartItemHTML(item) {
        return `
            <div class="cart-item-card" data-id="${item.id}">
                <div class="cart-item-image">
                    <span class="product-emoji">${item.image}</span>
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <p class="cart-item-price">${item.price} kr</p>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                            <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-btn" data-id="${item.id}">Ta bort</button>
                    </div>
                </div>
                <div class="cart-item-total">
                    <span>${item.price * item.quantity} kr</span>
                </div>
            </div>
        `;
    }

    // Calculate totals
    function calculateSubtotal() {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    function calculateShipping() {
        const subtotal = calculateSubtotal();
        return subtotal >= 500 ? 0 : 49; // Free shipping over 500 kr
    }

    function calculateTotal() {
        return calculateSubtotal() + calculateShipping();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Quantity controls
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('quantity-btn')) {
                const productId = parseInt(e.target.getAttribute('data-id'));
                const action = e.target.classList.contains('increase') ? 'increase' : 'decrease';
                updateQuantity(productId, action);
            }

            if (e.target.classList.contains('remove-btn')) {
                const productId = parseInt(e.target.getAttribute('data-id'));
                removeFromCart(productId);
            }
        });

        // Quantity input change
        document.addEventListener('change', function(e) {
            if (e.target.classList.contains('quantity-input')) {
                const productId = parseInt(e.target.getAttribute('data-id'));
                const newQuantity = parseInt(e.target.value);
                if (newQuantity > 0) {
                    setQuantity(productId, newQuantity);
                } else {
                    e.target.value = 1;
                }
            }
        });

        // Proceed to checkout
        if (proceedCheckout) {
            proceedCheckout.addEventListener('click', function() {
                window.location.href = 'checkout.html';
            });
        }
    }

    // Cart functions
    function updateQuantity(productId, action) {
        const item = cart.find(item => item.id === productId);
        if (!item) return;

        if (action === 'increase') {
            item.quantity += 1;
        } else if (action === 'decrease' && item.quantity > 1) {
            item.quantity -= 1;
        }

        saveCart();
        renderCart();
    }

    function setQuantity(productId, quantity) {
        const item = cart.find(item => item.id === productId);
        if (!item) return;

        item.quantity = quantity;
        saveCart();
        renderCart();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        renderCart();
    }

    function saveCart() {
        localStorage.setItem('lejonTkdCart', JSON.stringify(cart));
    }

    // Initialize the cart page
    initCartPage();
});
