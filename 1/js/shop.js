// shop.js - Shopping cart functionality for the shop page

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const productsGrid = document.getElementById('products-grid');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartToggle = document.getElementById('cart-toggle');
    const cartClose = document.getElementById('cart-close');
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartCount = document.getElementById('cart-count');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const checkoutBtn = document.getElementById('checkout-btn');
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');

    // Product data
    const products = [
        {
            id: 1,
            name: 'Lejon TKD T-shirt',
            category: 'clothing',
            price: 199,
            originalPrice: 249,
            image: '🥋',
            description: 'Officiell Lejon TKD T-shirt i hög kvalitet. Tillgänglig i alla storlekar.',
            badge: 'Rea'
        },
        {
            id: 2,
            name: 'Taekwondo Dobok',
            category: 'clothing',
            price: 599,
            originalPrice: null,
            image: '👕',
            description: 'Professionell Taekwondo-dräkt för träning och tävling.',
            badge: null
        },
        {
            id: 3,
            name: 'Skyddsväst',
            category: 'equipment',
            price: 349,
            originalPrice: 399,
            image: '🦺',
            description: 'Skyddsväst för tävling och träning. Justerbar för perfekt passform.',
            badge: 'Rea'
        },
        {
            id: 4,
            name: 'Handskydd',
            category: 'equipment',
            price: 199,
            originalPrice: null,
            image: '🥊',
            description: 'Högkvalitativa handskydd för optimalt skydd och komfort.',
            badge: null
        },
        {
            id: 5,
            name: 'Fot-skydd',
            category: 'equipment',
            price: 229,
            originalPrice: null,
            image: '👟',
            description: 'Lättvikts fot-skydd för sparring och tävling.',
            badge: null
        },
        {
            id: 6,
            name: 'Vit bälte',
            category: 'belts',
            price: 89,
            originalPrice: null,
            image: '📿',
            description: 'Högkvalitativt vitt bälte för nybörjare.',
            badge: null
        },
        {
            id: 7,
            name: 'Arm-skydd',
            category: 'equipment',
            price: 149,
            originalPrice: null,
            image: '📿',
            description: 'Skydd för armar vid träning och tävling.',
            badge: null
        },
        {
            id: 8,
            name: 'Vattenflaska',
            category: 'accessories',
            price: 79,
            originalPrice: 99,
            image: '💧',
            description: 'Lejon TKD vattenflaska med klubblogga. 750ml.',
            badge: 'Rea'
        }
    ];

    // Cart state
    let cart = JSON.parse(localStorage.getItem('lejonTkdCart')) || [];
    let filteredProducts = [...products];

    // Initialize the shop
    function initShop() {
        renderProducts();
        updateCartUI();
        setupEventListeners();
    }

    // Render products grid
    function renderProducts() {
        if (!productsGrid) return;

        productsGrid.innerHTML = '';

        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = '<p class="no-products">Inga produkter hittades.</p>';
            return;
        }

        filteredProducts.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }

    // Create product card HTML
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const badge = product.badge ? `<div class="product-badge">${product.badge}</div>` : '';
        const originalPrice = product.originalPrice ? 
            `<span class="price-original">${product.originalPrice} kr</span>` : '';
        
        card.innerHTML = `
            <div class="product-image">
                ${badge}
                <span class="product-emoji">${product.image}</span>
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="price-current">${product.price} kr</span>
                    ${originalPrice}
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-small add-to-cart" data-id="${product.id}">
                        Lägg i varukorg
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }

    // Get category name in Swedish
    function getCategoryName(category) {
        const categories = {
            'clothing': 'Kläder',
            'equipment': 'Utrustning',
            'belts': 'Bälten',
            'accessories': 'Tillbehör'
        };
        return categories[category] || category;
    }

    // Setup event listeners
    function setupEventListeners() {
        // Cart toggle
        if (cartToggle) {
            cartToggle.addEventListener('click', toggleCart);
        }

        if (cartClose) {
            cartClose.addEventListener('click', closeCart);
        }

        // Checkout flow - redirect to checkout page
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                window.location.href = 'checkout.html';
            });
        }

        // Filters and sorting
        if (categoryFilter) {
            categoryFilter.addEventListener('change', filterProducts);
        }

        if (sortBy) {
            sortBy.addEventListener('change', sortProducts);
        }
    }

    // Add to cart event delegation
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
        
        if (e.target.classList.contains('quantity-btn')) {
            const productId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
            const action = e.target.classList.contains('increase') ? 'increase' : 'decrease';
            updateQuantity(productId, action);
        }
        
        if (e.target.classList.contains('remove-btn')) {
            const productId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
            removeFromCart(productId);
        }
    });

    // Cart functions
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        saveCart();
        updateCartUI();
        showAddToCartAnimation(productId);
    }

    function updateQuantity(productId, action) {
        const item = cart.find(item => item.id === productId);
        if (!item) return;
        
        if (action === 'increase') {
            item.quantity += 1;
        } else if (action === 'decrease' && item.quantity > 1) {
            item.quantity -= 1;
        }
        
        saveCart();
        updateCartUI();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartUI();
    }

    function clearCart() {
        cart = [];
        saveCart();
        updateCartUI();
    }

    function saveCart() {
        localStorage.setItem('lejonTkdCart', JSON.stringify(cart));
    }

    // Update cart UI
    function updateCartUI() {
        updateCartCount();
        updateCartItems();
        updateCartTotal();
        updateCheckoutButton();
    }

    function updateCartCount() {
        if (!cartCount) return;
        
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    function updateCartItems() {
        if (!cartItems || !cartEmpty) return;
        
        if (cart.length === 0) {
            cartItems.innerHTML = '';
            cartEmpty.style.display = 'block';
            return;
        }
        
        cartEmpty.style.display = 'none';
        
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <span>${item.image}</span>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price} kr</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn decrease">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn increase">+</button>
                        <button class="remove-btn" aria-label="Ta bort">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function updateCartTotal() {
        if (!cartTotalAmount) return;
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalAmount.textContent = `${total} kr`;
    }

    function updateCheckoutButton() {
        if (!checkoutBtn) return;
        
        if (cart.length === 0) {
            checkoutBtn.disabled = true;
        } else {
            checkoutBtn.disabled = false;
        }
    }

    // Cart sidebar functions
    function toggleCart() {
        cartSidebar.classList.toggle('active');
    }

    function closeCart() {
        cartSidebar.classList.remove('active');
    }

    // Filter and sort functions
    function filterProducts() {
        const category = categoryFilter.value;
        
        if (category === 'all') {
            filteredProducts = [...products];
        } else {
            filteredProducts = products.filter(product => product.category === category);
        }
        
        // Apply current sort
        const sortValue = sortBy.value;
        sortProductsBy(sortValue);
        
        renderProducts();
    }

    function sortProducts() {
        const sortValue = sortBy.value;
        sortProductsBy(sortValue);
        renderProducts();
    }

    function sortProductsBy(sortValue) {
        switch (sortValue) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                // Since we don't have dates, we'll sort by ID (newer products have higher IDs)
                filteredProducts.sort((a, b) => b.id - a.id);
                break;
            case 'name':
            default:
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
    }

    // Animation for adding to cart
    function showAddToCartAnimation(productId) {
        // This would typically involve a more sophisticated animation
        // For now, we'll just show a simple confirmation
        const product = products.find(p => p.id === productId);
        if (product) {
            // You could add a toast notification here
            console.log(`Added ${product.name} to cart`);
        }
    }

    // Initialize the shop
    initShop();
});