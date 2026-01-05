// SHOPSMART APP - Complete E-commerce Logic

// ==================== DATA ====================
const PRODUCTS = [
    {
        id: "p1",
        name: "Trådlösa Bluetooth Hörlurar Pro",
        description: "Premium trådlösa hörlurar med aktiv brusreducering, 30 timmars batteritid och kristallklart ljud. Perfekt för musik, samtal och träning. Vattentålig design (IPX5) och bekväm passform för hela dagen.",
        price: 149,
        oldPrice: 599,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
        category: "Elektronik",
        rating: 4.8,
        sold: 15234,
        stock: 450
    },
    {
        id: "p2",
        name: "Smartwatch Fitness Tracker",
        description: "Avancerad smartwatch med GPS, pulsmätare, sömnspårning och 50+ träningslägen. Vattentät upp till 50m. Batteritid upp till 14 dagar. Kompatibel med iOS och Android.",
        price: 299,
        oldPrice: 1299,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
        category: "Elektronik",
        rating: 4.7,
        sold: 8932,
        stock: 320
    },
    {
        id: "p3",
        name: "Premium Yogamatta Extra Tjock",
        description: "Miljövänlig yogamatta i TPE-material med extra tjock dämpning (8mm) för maximal komfort. Anti-slip yta på båda sidor. Lätt att rulla ihop och transportera. Perfekt för yoga, pilates och stretching.",
        price: 89,
        oldPrice: 349,
        image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600",
        category: "Sport",
        rating: 4.9,
        sold: 12456,
        stock: 780
    },
    {
        id: "p4",
        name: "Automatisk Kaffemaskin Deluxe",
        description: "Professionell kaffemaskin med inbyggd kvarn, 15 bars tryck och automatisk mjölkskummare. Brygger perfekt espresso, cappuccino och latte. Enkel rengöring och underhåll.",
        price: 699,
        oldPrice: 2499,
        image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600",
        category: "Hem & Kök",
        rating: 4.6,
        sold: 3421,
        stock: 150
    },
    {
        id: "p5",
        name: "LED Skrivbordslampa Justerbar",
        description: "Modern LED-lampa med 5 ljusstyrkenivåer och 3 färgtemperaturer. USB-laddningsport, flexibel arm och ögonvänligt ljus. Perfekt för arbete, studier och läsning.",
        price: 129,
        oldPrice: 499,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600",
        category: "Hem & Kök",
        rating: 4.5,
        sold: 6789,
        stock: 560
    },
    {
        id: "p6",
        name: "Laptop Ryggsäck 15.6\" Vattentät",
        description: "Stilren och funktionell ryggsäck med skyddad laptopficka, USB-laddningsport och anti-stöld design. Vattentåligt material och ergonomiska axelremmar. Perfekt för pendling och resor.",
        price: 199,
        oldPrice: 799,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
        category: "Väskor",
        rating: 4.7,
        sold: 9876,
        stock: 410
    },
    {
        id: "p7",
        name: "Bluetooth Högtalare 360° Ljud",
        description: "Kraftfull portabel högtalare med 360° ljud, 20 timmars batteritid och vattentät design (IPX7). Djup bas och kristallklart ljud. Perfekt för fest, strand och utomhusbruk.",
        price: 249,
        oldPrice: 999,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600",
        category: "Elektronik",
        rating: 4.8,
        sold: 11234,
        stock: 280
    },
    {
        id: "p8",
        name: "Keramisk Stekpanna Set 3-pack",
        description: "Högkvalitativa stekpannor med keramisk beläggning, induktionskompatibla och PFOA-fria. Jämn värmefördelning och lätt att rengöra. Inkluderar 20cm, 24cm och 28cm pannor.",
        price: 179,
        oldPrice: 699,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
        category: "Hem & Kök",
        rating: 4.6,
        sold: 5432,
        stock: 620
    },
    {
        id: "p9",
        name: "Träningsbälte Premium Läder",
        description: "Professionellt träningsbälte i äkta läder för tyngdlyftning. Extra stöd för ryggen, justerbar storlek och dubbla spännen. Perfekt för squats, deadlifts och styrketräning.",
        price: 159,
        oldPrice: 599,
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600",
        category: "Sport",
        rating: 4.7,
        sold: 4321,
        stock: 340
    },
    {
        id: "p10",
        name: "Powerbank 20000mAh Snabbladdning",
        description: "Kraftfull powerbank med USB-C snabbladdning (PD 20W), 3 utgångar och LED-display. Laddar iPhone 13 upp till 4 gånger. Kompakt design och säkerhetsskydd.",
        price: 169,
        oldPrice: 649,
        image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600",
        category: "Elektronik",
        rating: 4.8,
        sold: 13567,
        stock: 520
    },
    {
        id: "p11",
        name: "Yogablock Set 2-pack Kork",
        description: "Stabila yogablock i naturlig kork för perfekt stöd i alla positioner. Miljövänligt material, anti-slip yta och lätta att transportera. Perfekt för nybörjare och avancerade yogis.",
        price: 99,
        oldPrice: 349,
        image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600",
        category: "Sport",
        rating: 4.6,
        sold: 7890,
        stock: 710
    },
    {
        id: "p12",
        name: "Termosmugg 500ml Vakuumisolerad",
        description: "Premium termosmugg i rostfritt stål som håller dryck varm i 6 timmar och kall i 12 timmar. Läcksäker lock, passar i bilhållare och BPA-fri. Perfekt för kaffe, te och smoothies.",
        price: 119,
        oldPrice: 399,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600",
        category: "Hem & Kök",
        rating: 4.9,
        sold: 16789,
        stock: 820
    }
];

const CATEGORIES = [
    { name: "Elektronik", icon: "📱" },
    { name: "Hem & Kök", icon: "🏠" },
    { name: "Sport", icon: "⚽" },
    { name: "Mode", icon: "👗" },
    { name: "Väskor", icon: "🎒" },
    { name: "Skönhet", icon: "💄" }
];

// ==================== STATE ====================
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let currentProduct = null;
let stripe = null;
let cardElement = null;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    loadProducts();
    updateCartBadge();
    initStripe();
    
    // Checkout form handler
    const form = document.getElementById('checkoutForm');
    if (form) {
        form.addEventListener('submit', handleCheckout);
    }
});

// ==================== STRIPE INITIALIZATION ====================
function initStripe() {
    // Replace with your Stripe publishable key
    const STRIPE_PUBLIC_KEY = 'pk_test_YOUR_KEY_HERE'; // TODO: Add your Stripe key
    
    try {
        stripe = Stripe(STRIPE_PUBLIC_KEY);
        const elements = stripe.elements();
        cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#1a1a1a',
                    '::placeholder': {
                        color: '#aab7c4',
                    },
                },
            },
        });
        cardElement.mount('#card-element');
    } catch (error) {
        console.log('Stripe not initialized. Add your Stripe key.');
    }
}

// ==================== NAVIGATION ====================
function showHome() {
    document.getElementById('homePage').classList.remove('hidden');
    document.getElementById('productDetailPage').classList.remove('active');
    document.getElementById('cartPage').classList.remove('active');
    document.getElementById('checkoutPage').classList.remove('active');
    window.scrollTo(0, 0);
}

function showProductDetail(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('productDetailPage').classList.add('active');
    document.getElementById('cartPage').classList.remove('active');
    document.getElementById('checkoutPage').classList.remove('active');
    
    document.getElementById('detailImage').src = product.image;
    document.getElementById('detailName').textContent = product.name;
    document.getElementById('detailRating').textContent = '⭐'.repeat(5) + ' ' + product.rating + ' (' + product.sold + ' sålda)';
    document.getElementById('detailPrice').innerHTML = product.price + ' kr <span class="product-old-price">' + product.oldPrice + ' kr</span>';
    document.getElementById('detailDescription').textContent = product.description;
    document.getElementById('qtyInput').value = 1;
    
    window.scrollTo(0, 0);
}

function showCart() {
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('productDetailPage').classList.remove('active');
    document.getElementById('cartPage').classList.add('active');
    document.getElementById('checkoutPage').classList.remove('active');
    
    renderCart();
    window.scrollTo(0, 0);
}

function goToCheckout() {
    if (cart.length === 0) {
        showNotification('Varukorgen är tom', 'error');
        return;
    }
    
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('productDetailPage').classList.remove('active');
    document.getElementById('cartPage').classList.remove('active');
    document.getElementById('checkoutPage').classList.add('active');
    
    renderCheckoutSummary();
    window.scrollTo(0, 0);
}

// ==================== RENDER FUNCTIONS ====================
function loadCategories() {
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = CATEGORIES.map(cat => `
        <div class="category-card" onclick="filterByCategory('${cat.name}')">
            <div class="category-icon">${cat.icon}</div>
            <div class="category-name">${cat.name}</div>
        </div>
    `).join('');
}

function loadProducts(products = PRODUCTS) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(p => `
        <div class="product-card" onclick="showProductDetail('${p.id}')">
            <img src="${p.image}" alt="${p.name}" class="product-img">
            <div class="product-info">
                <div class="product-price">
                    ${p.price} kr
                    <span class="product-old-price">${p.oldPrice} kr</span>
                </div>
                <div class="product-name">${p.name}</div>
                <div class="product-rating">⭐⭐⭐⭐⭐ ${p.rating} (${p.sold} sålda)</div>
            </div>
        </div>
    `).join('');
}

function renderCart() {
    const container = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <h2>Din varukorg är tom</h2>
                <p style="color: var(--gray); margin: 1rem 0;">Lägg till produkter för att börja handla</p>
                <button class="btn btn-primary" onclick="showHome()">Fortsätt handla</button>
            </div>
        `;
        document.getElementById('subtotal').textContent = '0 kr';
        document.getElementById('total').textContent = '0 kr';
        return;
    }
    
    container.innerHTML = cart.map(item => {
        const product = PRODUCTS.find(p => p.id === item.id);
        return `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-name">${product.name}</div>
                    <div class="cart-item-price">${product.price} kr</div>
                    <div style="margin-top: 0.5rem;">
                        <button class="qty-btn" onclick="updateCartQty('${item.id}', ${item.quantity - 1})">-</button>
                        <span style="margin: 0 1rem; font-weight: 700;">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQty('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="btn btn-secondary" onclick="removeFromCart('${item.id}')">Ta bort</button>
            </div>
        `;
    }).join('');
    
    const total = calculateTotal();
    document.getElementById('subtotal').textContent = total + ' kr';
    document.getElementById('total').textContent = total + ' kr';
}

function renderCheckoutSummary() {
    const container = document.getElementById('checkoutSummary');
    container.innerHTML = cart.map(item => {
        const product = PRODUCTS.find(p => p.id === item.id);
        return `
            <div class="summary-row">
                <span>${product.name} x${item.quantity}</span>
                <span>${product.price * item.quantity} kr</span>
            </div>
        `;
    }).join('');
    
    const total = calculateTotal();
    document.getElementById('checkoutSubtotal').textContent = total + ' kr';
    document.getElementById('checkoutTotal').textContent = total + ' kr';
}

// ==================== CART FUNCTIONS ====================
function addToCartFromDetail() {
    if (!currentProduct) return;
    
    const quantity = parseInt(document.getElementById('qtyInput').value);
    addToCart(currentProduct.id, quantity);
}

function addToCart(productId, quantity = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ id: productId, quantity: quantity });
    }
    
    saveCart();
    showNotification('Produkt tillagd i varukorgen! 🎉', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
    showNotification('Produkt borttagen', 'info');
}

function updateCartQty(productId, newQty) {
    if (newQty <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQty;
        saveCart();
        renderCart();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartBadge').textContent = count;
}

function calculateTotal() {
    return cart.reduce((sum, item) => {
        const product = PRODUCTS.find(p => p.id === item.id);
        return sum + (product.price * item.quantity);
    }, 0);
}

function changeQty(delta) {
    const input = document.getElementById('qtyInput');
    const newValue = parseInt(input.value) + delta;
    if (newValue >= 1) {
        input.value = newValue;
    }
}

function buyNow() {
    addToCartFromDetail();
    setTimeout(() => goToCheckout(), 500);
}

// ==================== SEARCH & FILTER ====================
function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const results = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    loadProducts(results);
}

function filterByCategory(category) {
    const results = PRODUCTS.filter(p => p.category === category);
    loadProducts(results);
    document.querySelector('.products').scrollIntoView({ behavior: 'smooth' });
}

// ==================== PAYMENT ====================
function selectPayment(method) {
    document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('active'));
    event.target.closest('.payment-method').classList.add('active');
    
    if (method === 'card') {
        document.getElementById('cardPayment').classList.remove('hidden');
        document.getElementById('paypalPayment').classList.add('hidden');
    } else {
        document.getElementById('cardPayment').classList.add('hidden');
        document.getElementById('paypalPayment').classList.remove('hidden');
    }
}

async function handleCheckout(e) {
    e.preventDefault();
    
    const activePayment = document.querySelector('.payment-method.active');
    const paymentMethod = activePayment ? activePayment.textContent.includes('PayPal') ? 'paypal' : 'card' : 'card';
    
    if (paymentMethod === 'card' && stripe && cardElement) {
        // Stripe payment
        const { error, paymentMethod: pm } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });
        
        if (error) {
            showNotification('Betalning misslyckades: ' + error.message, 'error');
            return;
        }
        
        // TODO: Send paymentMethod.id to your server
        console.log('Payment Method ID:', pm.id);
        completeOrder();
    } else if (paymentMethod === 'paypal') {
        // PayPal payment
        // TODO: Integrate PayPal SDK
        showNotification('PayPal-integration kommer snart', 'info');
        setTimeout(completeOrder, 2000);
    } else {
        // Demo mode
        showNotification('Demo-läge: Betalning simulerad', 'info');
        setTimeout(completeOrder, 2000);
    }
}

function completeOrder() {
    showNotification('Tack för ditt köp! Order bekräftelse skickas till din e-post. 🎉', 'success');
    cart = [];
    saveCart();
    setTimeout(() => showHome(), 3000);
}

// ==================== NOTIFICATIONS ====================
function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.background = type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
