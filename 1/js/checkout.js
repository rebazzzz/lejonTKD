// checkout.js - Checkout page functionality

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutItems = document.getElementById('checkout-items');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    const orderSuccessModal = document.getElementById('order-success-modal');
    const successClose = document.getElementById('success-close');
    const successContinue = document.getElementById('success-continue');
    const orderNumberElement = document.getElementById('order-number');

    // Cart state
    let cart = JSON.parse(localStorage.getItem('lejonTkdCart')) || [];

    // Initialize checkout page
    function initCheckoutPage() {
        if (cart.length === 0) {
            // Redirect to cart if empty
            window.location.href = 'cart.html';
            return;
        }

        renderOrderSummary();
        setupEventListeners();
    }

    // Render order summary
    function renderOrderSummary() {
        if (!checkoutItems) return;

        const itemsHTML = cart.map(item => `
            <div class="order-item">
                <div class="order-item-info">
                    <span class="order-item-name">${item.name}</span>
                    <span class="order-item-quantity">x${item.quantity}</span>
                </div>
                <span class="order-item-price">${item.price * item.quantity} kr</span>
            </div>
        `).join('');

        checkoutItems.innerHTML = itemsHTML;

        // Update totals
        const subtotal = calculateSubtotal();
        const shipping = calculateShipping();
        const total = subtotal + shipping;

        if (subtotalElement) subtotalElement.textContent = `${subtotal} kr`;
        if (shippingElement) shippingElement.textContent = `${shipping} kr`;
        if (totalElement) totalElement.textContent = `${total} kr`;
    }

    // Calculate totals
    function calculateSubtotal() {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    function calculateShipping() {
        const subtotal = calculateSubtotal();
        return subtotal >= 500 ? 0 : 49; // Free shipping over 500 kr
    }

    // Setup event listeners
    function setupEventListeners() {
        // Form submission
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', processCheckout);
        }

        // Modal controls
        if (successClose) {
            successClose.addEventListener('click', closeOrderSuccess);
        }

        if (successContinue) {
            successContinue.addEventListener('click', function() {
                window.location.href = 'shop.html';
            });
        }

        // Close modal when clicking outside
        if (orderSuccessModal) {
            orderSuccessModal.addEventListener('click', function(e) {
                if (e.target === orderSuccessModal) {
                    closeOrderSuccess();
                }
            });
        }
    }

    // Process checkout
    function processCheckout(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(checkoutForm);
        const orderData = {
            customer: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone')
            },
            shipping: {
                address: formData.get('address'),
                postalCode: formData.get('postalCode'),
                city: formData.get('city')
            },
            paymentMethod: formData.get('paymentMethod'),
            orderNotes: formData.get('orderNotes'),
            items: cart,
            totals: {
                subtotal: calculateSubtotal(),
                shipping: calculateShipping(),
                total: calculateSubtotal() + calculateShipping()
            }
        };

        // Generate order number
        const orderNumber = `LTKD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

        // In a real application, you would send this data to your server
        console.log('Processing order:', orderData);

        // Show success modal
        if (orderNumberElement) orderNumberElement.textContent = orderNumber;
        if (orderSuccessModal) orderSuccessModal.classList.add('active');

        // Clear cart
        cart = [];
        localStorage.setItem('lejonTkdCart', JSON.stringify(cart));
    }

    function closeOrderSuccess() {
        if (orderSuccessModal) orderSuccessModal.classList.remove('active');
    }

    // Initialize the checkout page
    initCheckoutPage();
});
