// TEMU-BACKEND.JS - Backend Logic for ShopSmart E-commerce
// This file handles all data management, cart operations, and business logic

// ==================== DATA STORAGE ====================

const PRODUCTS_DATA = [
    {
        id: "p1",
        name: "Trådlösa Bluetooth Hörlurar Pro - Aktiv Brusreducering",
        price: 149,
        oldPrice: 599,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        category: "Elektronik",
        rating: 4.8,
        sold: 15234,
        stock: 450,
        discount: 75
    },
    {
        id: "p2",
        name: "Smartwatch Fitness Tracker - GPS & Pulsmätare",
        price: 299,
        oldPrice: 1299,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        category: "Elektronik",
        rating: 4.7,
        sold: 8932,
        stock: 320,
        discount: 77
    },
    {
        id: "p3",
        name: "Premium Yogamatta - Extra Tjock & Miljövänlig",
        price: 89,
        oldPrice: 349,
        image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
        category: "Sport",
        rating: 4.9,
        sold: 12456,
        stock: 780,
        discount: 74
    },
    {
        id: "p4",
        name: "Automatisk Kaffemaskin Deluxe - Inbyggd Kvarn",
        price: 699,
        oldPrice: 2499,
        image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop",
        category: "Hem & Kök",
        rating: 4.6,
        sold: 3421,
        stock: 150,
        discount: 72
    },
    {
        id: "p5",
        name: "LED Skrivbordslampa - Justerbar Ljusstyrka",
        price: 129,
        oldPrice: 499,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
        category: "Hem & Kök",
        rating: 4.5,
        sold: 6789,
        stock: 560,
        discount: 74
    },
    {
        id: "p6",
        name: "Laptop Ryggsäck 15.6\" - Vattentät & Anti-Stöld",
        price: 199,
        oldPrice: 799,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
        category: "Väskor",
        rating: 4.7,
        sold: 9876,
        stock: 410,
        discount: 75
    },
    {
        id: "p7",
        name: "Bluetooth Högtalare 360° - 20h Batteritid",
        price: 249,
        oldPrice: 999,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
        category: "Elektronik",
        rating: 4.8,
        sold: 11234,
        stock: 280,
        discount: 75
    },
    {
        id: "p8",
        name: "Keramisk Stekpanna Set - Induktionskompatibel",
        price: 179,
        oldPrice: 699,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
        category: "Hem & Kök",
        rating: 4.6,
        sold: 5432,
        stock: 620,
        discount: 74
    },
    {
        id: "p9",
        name: "Träningsbälte Premium - Professionell Kvalitet",
        price: 159,
        oldPrice: 599,
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
        category: "Sport",
        rating: 4.7,
        sold: 4321,
        stock: 340,
        discount: 73
    },
    {
        id: "p10",
        name: "Powerbank 20000mAh - Snabbladdning USB-C",
        price: 169,
        oldPrice: 649,
        image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop",
        category: "Elektronik",
        rating: 4.8,
        sold: 13567,
        stock: 520,
        discount: 74
    },
    {
        id: "p11",
        name: "Yogablock Set - Kork Material Premium",
        price: 99,
        oldPrice: 349,
        image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
        category: "Sport",
        rating: 4.6,
        sold: 7890,
        stock: 710,
        discount: 72
    },
    {
        id: "p12",
        name: "Termosmugg 500ml - Vakuumisolerad Rostfri",
        price: 119,
        oldPrice: 399,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
        category: "Hem & Kök",
        rating: 4.9,
        sold: 16789,
        stock: 820,
        discount: 70
    },
    {
        id: "p13",
        name: "Gaming Mus RGB - 16000 DPI Precision",
        price: 189,
        oldPrice: 799,
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop",
        category: "Elektronik",
        rating: 4.7,
        sold: 8765,
        stock: 390,
        discount: 76
    },
    {
        id: "p14",
        name: "Massagepistol - 6 Hastigheter & 4 Huvuden",
        price: 349,
        oldPrice: 1499,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
        category: "Sport",
        rating: 4.8,
        sold: 6543,
        stock: 210,
        discount: 77
    },
    {
        id: "p15",
        name: "Luftfuktare Ultraljud - LED Nattlampa",
        price: 139,
        oldPrice: 549,
        image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop",
        category: "Hem & Kök",
        rating: 4.6,
        sold: 9234,
        stock: 480,
        discount: 75
    },
    {
        id: "p16",
        name: "Solglasögon Polariserade - UV400 Skydd",
        price: 79,
        oldPrice: 299,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop",
        category: "Mode",
        rating: 4.5,
        sold: 11234,
        stock: 650,
        discount: 74
    },
    {
        id: "p17",
        name: "Köksskala Digital - Precision 0.1g",
        price: 69,
        oldPrice: 249,
        image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=400&fit=crop",
        category: "Hem & Kök",
        rating: 4.7,
        sold: 8901,
        stock: 720,
        discount: 72
    },
    {
        id: "p18",
        name: "Mobilhållare Bil - Magnetisk 360° Rotation",
        price: 59,
        oldPrice: 199,
        image: "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=400&h=400&fit=crop",
        category: "Elektronik",
        rating: 4.6,
        sold: 14567,
        stock: 890,
        discount: 70
    }
];

const CATEGORIES_DATA = [
    { name: "Elektronik", icon: "📱" },
    { name: "Hem & Kök", icon: "🏠" },
    { name: "Sport", icon: "⚽" },
    { name: "Mode", icon: "👗" },
    { name: "Väskor", icon: "🎒" },
    { name: "Skönhet", icon: "💄" },
    { name: "Leksaker", icon: "🧸" },
    { name: "Trädgård", icon: "🌱" }
];

// ==================== CART MANAGEMENT ====================

function getCart() {
    const cart = localStorage.getItem('temuCart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('temuCart', JSON.stringify(cart));
}

function addToCart(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) {
        showNotification('Produkten hittades inte', 'error');
        return;
    }

    let cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
            showNotification('Antal uppdaterat i varukorgen!', 'success');
        } else {
            showNotification('Tyvärr, inte mer i lager', 'warning');
            return;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
        showNotification('Tillagd i varukorgen! 🎉', 'success');
    }

    saveCart(cart);
    updateCartBadge();
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    showNotification('Borttagen från varukorgen', 'info');
    return cart;
}

function updateCartQuantity(productId, quantity) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        const product = PRODUCTS_DATA.find(p => p.id === productId);
        if (quantity <= 0) {
            return removeFromCart(productId);
        } else if (quantity > product.stock) {
            showNotification('Inte tillräckligt i lager', 'warning');
            return cart;
        } else {
            item.quantity = quantity;
            saveCart(cart);
        }
    }
    
    return cart;
}

function getCartCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function clearCart() {
    localStorage.removeItem('temuCart');
    showNotification('Varukorgen är tömd', 'info');
}

// ==================== PRODUCT FUNCTIONS ====================

function getAllProducts() {
    return PRODUCTS_DATA;
}

function getProductById(id) {
    return PRODUCTS_DATA.find(p => p.id === id);
}

function getProductsByCategory(category) {
    return PRODUCTS_DATA.filter(p => p.category === category);
}

function getFlashDeals() {
    // Return products with highest discount
    return PRODUCTS_DATA
        .filter(p => p.discount >= 75)
        .slice(0, 6);
}

function searchProductsByQuery(query) {
    if (!query || query.trim() === '') {
        return PRODUCTS_DATA;
    }
    
    const lowerQuery = query.toLowerCase();
    return PRODUCTS_DATA.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
}

function getCategories() {
    return CATEGORIES_DATA;
}

// ==================== NOTIFICATION SYSTEM ====================

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.temu-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `temu-notification temu-notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
if (!document.getElementById('temu-animations')) {
    const style = document.createElement('style');
    style.id = 'temu-animations';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ==================== UTILITY FUNCTIONS ====================

function formatPrice(price) {
    return price.toFixed(0) + ' kr';
}

function calculateDiscount(oldPrice, newPrice) {
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
}

// ==================== EXPORT FOR TESTING ====================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getAllProducts,
        getProductById,
        getProductsByCategory,
        getFlashDeals,
        searchProductsByQuery,
        getCategories,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        getCart,
        getCartCount,
        getCartTotal,
        clearCart
    };
}
