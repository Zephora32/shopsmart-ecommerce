#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generator för ShopSmart - Komplett E-handel med klickbara produkter
Kör: python generate-shopsmart.py
Output: shopsmart-final.html
"""

html_content = """<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShopSmart - Handla Smart</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --orange: #FF6B35;
            --orange-dark: #E55A2B;
            --yellow: #FFC107;
            --dark: #1a1a1a;
            --gray: #666;
            --light: #f5f5f5;
            --white: #fff;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            background: var(--light);
            color: var(--dark);
        }
        .hidden { display: none !important; }
        .container { max-width: 1400px; margin: 0 auto; padding: 0 1rem; }
        
        /* HEADER */
        .header {
            background: var(--white);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        .header-top {
            background: linear-gradient(90deg, var(--orange), var(--yellow));
            color: white;
            padding: 0.5rem 0;
            text-align: center;
            font-size: 0.875rem;
            font-weight: 600;
        }
        .header-main {
            padding: 1rem 0;
        }
        .header-container {
            display: flex;
            align-items: center;
            gap: 2rem;
            flex-wrap: wrap;
        }
        .logo {
            font-size: 2rem;
            font-weight: 900;
            background: linear-gradient(135deg, var(--orange), var(--yellow));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            cursor: pointer;
        }
        .search-container {
            flex: 1;
            max-width: 600px;
            position: relative;
        }
        .search-input {
            width: 100%;
            padding: 0.875rem 3rem 0.875rem 1rem;
            border: 2px solid var(--orange);
            border-radius: 25px;
            font-size: 1rem;
            outline: none;
        }
        .search-btn {
            position: absolute;
            right: 0.5rem;
            top: 50%;
            transform: translateY(-50%);
            background: var(--orange);
            color: white;
            border: none;
            padding: 0.5rem 1.5rem;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 600;
        }
        .header-icons {
            display: flex;
            gap: 1.5rem;
        }
        .icon-btn {
            position: relative;
            cursor: pointer;
            font-size: 1.5rem;
        }
        .badge {
            position: absolute;
            top: -8px;
            right: -8px;
            background: var(--orange);
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 700;
        }
        
        /* HERO */
        .hero {
            background: linear-gradient(135deg, var(--orange), var(--yellow));
            padding: 3rem 1rem;
            text-align: center;
            color: white;
        }
        .hero h1 {
            font-size: 3rem;
            font-weight: 900;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        .hero p {
            font-size: 1.5rem;
            margin-bottom: 2rem;
        }
        .hero-btn {
            background: white;
            color: var(--orange);
            padding: 1rem 3rem;
            border: none;
            border-radius: 30px;
            font-size: 1.25rem;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        /* PRODUCTS */
        .section {
            padding: 2rem 0;
        }
        .section-title {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
        }
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
        }
        .product-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .product-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        }
        .product-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        .product-info {
            padding: 1rem;
        }
        .product-price {
            font-size: 1.5rem;
            font-weight: 900;
            color: var(--orange);
        }
        .product-old-price {
            text-decoration: line-through;
            color: var(--gray);
            font-size: 0.875rem;
            margin-left: 0.5rem;
        }
        .product-name {
            font-size: 0.875rem;
            margin: 0.5rem 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .btn {
            width: 100%;
            background: var(--orange);
            color: white;
            border: none;
            padding: 0.75rem;
            border-radius: 8px;
            font-weight: 700;
            cursor: pointer;
            margin-top: 0.5rem;
        }
        .btn:hover {
            background: var(--orange-dark);
        }
        
        /* PRODUCT PAGE */
        .product-page {
            padding: 2rem 0;
        }
        .product-detail {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            background: white;
            padding: 2rem;
            border-radius: 12px;
        }
        .product-detail-image {
            width: 100%;
            border-radius: 12px;
        }
        .product-detail-info h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        .product-detail-price {
            font-size: 2.5rem;
            font-weight: 900;
            color: var(--orange);
            margin-bottom: 1rem;
        }
        .quantity-selector {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin: 1rem 0;
        }
        .quantity-btn {
            width: 40px;
            height: 40px;
            border: 2px solid var(--orange);
            background: white;
            color: var(--orange);
            font-size: 1.5rem;
            border-radius: 8px;
            cursor: pointer;
        }
        .quantity-input {
            width: 60px;
            text-align: center;
            font-size: 1.25rem;
            border: 2px solid var(--orange);
            border-radius: 8px;
            padding: 0.5rem;
        }
        .btn-group {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
        }
        .btn-secondary {
            background: var(--dark);
        }
        .btn-back {
            background: var(--gray);
            width: auto;
            padding: 0.75rem 1.5rem;
            margin-bottom: 1rem;
        }
        
        /* CART PAGE */
        .cart-page {
            padding: 2rem 0;
        }
        .cart-items {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        .cart-item {
            display: flex;
            gap: 1rem;
            background: white;
            padding: 1rem;
            border-radius: 12px;
            align-items: center;
        }
        .cart-item img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 8px;
        }
        .cart-item-details {
            flex: 1;
        }
        .cart-total {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            text-align: right;
        }
        .cart-total h3 {
            font-size: 1.5rem;
            color: var(--orange);
            margin-bottom: 1rem;
        }
        
        /* CHECKOUT PAGE */
        .checkout-page {
            padding: 2rem 0;
        }
        .checkout-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 2rem;
        }
        .checkout-form {
            background: white;
            padding: 2rem;
            border-radius: 12px;
        }
        .form-group {
            margin-bottom: 1rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }
        .form-group input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid var(--light);
            border-radius: 8px;
            font-size: 1rem;
        }
        .form-group input:focus {
            outline: none;
            border-color: var(--orange);
        }
        .order-summary {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            height: fit-content;
        }
        
        /* CONFIRMATION PAGE */
        .confirmation-page {
            padding: 4rem 0;
            text-align: center;
        }
        .confirmation-box {
            background: white;
            padding: 3rem;
            border-radius: 12px;
            max-width: 600px;
            margin: 0 auto;
        }
        .confirmation-icon {
            font-size: 5rem;
            margin-bottom: 1rem;
        }
        
        @media (max-width: 768px) {
            .product-detail, .checkout-grid {
                grid-template-columns: 1fr;
            }
            .hero h1 {
                font-size: 2rem;
            }
            .products-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    </style>
</head>
<body>
    <!-- HEADER -->
    <header class="header">
        <div class="header-top">
            🎉 FLASH SALE! Upp till 90% rabatt - Begränsad tid!
        </div>
        <div class="header-main">
            <div class="container header-container">
                <div class="logo" onclick="showHome()">ShopSmart</div>
                <div class="search-container">
                    <input type="text" class="search-input" placeholder="Sök produkter..." id="searchInput">
                    <button class="search-btn" onclick="searchProducts()">Sök</button>
                </div>
                <div class="header-icons">
                    <div class="icon-btn" onclick="showCart()">
                        🛒
                        <span class="badge" id="cartBadge">0</span>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- HOME PAGE -->
    <div id="home-page">
        <section class="hero">
            <h1>Handla Smart, Spara Mer!</h1>
            <p>Miljontals produkter till oslagbara priser</p>
            <button class="hero-btn" onclick="document.querySelector('.section').scrollIntoView({behavior:'smooth'})">
                Börja Handla Nu
            </button>
        </section>

        <section class="section">
            <div class="container">
                <h2 class="section-title">Alla Produkter</h2>
                <div class="products-grid" id="productsGrid"></div>
            </div>
        </section>
    </div>

    <!-- PRODUCT PAGE -->
    <div id="product-page" class="hidden">
        <div class="container product-page">
            <button class="btn btn-back" onclick="showHome()">← Tillbaka</button>
            <div id="productDetail"></div>
        </div>
    </div>

    <!-- CART PAGE -->
    <div id="cart-page" class="hidden">
        <div class="container cart-page">
            <h1>Varukorg</h1>
            <div id="cartContent"></div>
        </div>
    </div>

    <!-- CHECKOUT PAGE -->
    <div id="checkout-page" class="hidden">
        <div class="container checkout-page">
            <h1>Kassa</h1>
            <div class="checkout-grid">
                <div class="checkout-form">
                    <h2>Leveransadress</h2>
                    <form id="checkoutForm">
                        <div class="form-group">
                            <label>Namn *</label>
                            <input type="text" required>
                        </div>
                        <div class="form-group">
                            <label>E-post *</label>
                            <input type="email" required>
                        </div>
                        <div class="form-group">
                            <label>Telefon *</label>
                            <input type="tel" required>
                        </div>
                        <div class="form-group">
                            <label>Adress *</label>
                            <input type="text" required>
                        </div>
                        <div class="form-group">
                            <label>Postnummer *</label>
                            <input type="text" required>
                        </div>
                        <div class="form-group">
                            <label>Stad *</label>
                            <input type="text" required>
                        </div>
                        <button type="submit" class="btn">Slutför köp</button>
                    </form>
                </div>
                <div class="order-summary" id="orderSummary"></div>
            </div>
        </div>
    </div>

    <!-- CONFIRMATION PAGE -->
    <div id="confirmation-page" class="hidden">
        <div class="container confirmation-page">
            <div class="confirmation-box">
                <div class="confirmation-icon">✅</div>
                <h1>Tack för ditt köp!</h1>
                <p>Din order har mottagits och behandlas nu.</p>
                <p>Du kommer att få en orderbekräftelse via e-post.</p>
                <button class="btn" onclick="showHome(); cart=[]; saveCart();" style="margin-top: 2rem;">
                    Fortsätt handla
                </button>
            </div>
        </div>
    </div>

    <script>
        // PRODUCTS DATA
        const PRODUCTS = [
            {id:"p1",name:"Trådlösa Bluetooth Hörlurar Pro",price:149,oldPrice:599,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",category:"Elektronik",rating:4.8,sold:15234,desc:"Premium trådlösa hörlurar med aktiv brusreducering och 30 timmars batteritid. Perfekt för musik och samtal."},
            {id:"p2",name:"Smartwatch Fitness Tracker GPS",price:299,oldPrice:1299,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",category:"Elektronik",rating:4.7,sold:8932,desc:"Avancerad smartwatch med pulsmätare, GPS och vattentät design. Följ din hälsa och träning."},
            {id:"p3",name:"Premium Yogamatta Extra Tjock",price:89,oldPrice:349,image:"https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",category:"Sport",rating:4.9,sold:12456,desc:"Miljövänlig yogamatta med extra tjock dämpning för maximal komfort under träning."},
            {id:"p4",name:"Automatisk Kaffemaskin Deluxe",price:699,oldPrice:2499,image:"https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400",category:"Hem & Kök",rating:4.6,sold:3421,desc:"Automatisk kaffemaskin med inbyggd kvarn och perfekt bryggning varje gång."},
            {id:"p5",name:"LED Skrivbordslampa Justerbar",price:129,oldPrice:499,image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",category:"Hem & Kök",rating:4.5,sold:6789,desc:"Modern LED-lampa med justerbar ljusstyrka och färgtemperatur för perfekt arbetsbelysning."},
            {id:"p6",name:"Laptop Ryggsäck 15.6\\" Vattentät",price:199,oldPrice:799,image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",category:"Väskor",rating:4.7,sold:9876,desc:"Stilren och funktionell ryggsäck med skyddad laptopficka och vattentät design."},
            {id:"p7",name:"Bluetooth Högtalare 360° 20h",price:249,oldPrice:999,image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",category:"Elektronik",rating:4.8,sold:11234,desc:"Kraftfull portabel högtalare med 360° ljud och 20 timmars batteritid."},
            {id:"p8",name:"Keramisk Stekpanna Set",price:179,oldPrice:699,image:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",category:"Hem & Kök",rating:4.6,sold:5432,desc:"Högkvalitativ stekpanna med keramisk beläggning och induktionskompatibel."},
            {id:"p9",name:"Träningsbälte Premium",price:159,oldPrice:599,image:"https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400",category:"Sport",rating:4.7,sold:4321,desc:"Professionellt träningsbälte för tyngdlyftning med extra stöd och komfort."},
            {id:"p10",name:"Powerbank 20000mAh USB-C",price:169,oldPrice:649,image:"https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",category:"Elektronik",rating:4.8,sold:13567,desc:"Kraftfull powerbank med snabbladdning för flera enheter samtidigt."},
            {id:"p11",name:"Yogablock Set Kork",price:99,oldPrice:349,image:"https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",category:"Sport",rating:4.6,sold:7890,desc:"Stabila yogablock i kork för perfekt stöd i alla positioner."},
            {id:"p12",name:"Termosmugg 500ml Vakuum",price:119,oldPrice:399,image:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",category:"Hem & Kök",rating:4.9,sold:16789,desc:"Vakuumisolerad termosmugg som håller dryck varm i 6 timmar."}
        ];

        // STATE
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        let currentProduct = null;
        let productQuantity = 1;

        // INIT
        loadProducts();
        updateCartBadge();

        // FUNCTIONS
        function loadProducts() {
            document.getElementById('productsGrid').innerHTML = PRODUCTS.map(p => `
                <div class="product-card" onclick="showProductPage('${p.id}')">
                    <img src="${p.image}" alt="${p.name}" class="product-image">
                    <div class="product-info">
                        <div>
                            <span class="product-price">${p.price} kr</span>
                            <span class="product-old-price">${p.oldPrice} kr</span>
                        </div>
                        <div class="product-name">${p.name}</div>
                        <button class="btn" onclick="event.stopPropagation(); addToCart('${p.id}', 1)">
                            Lägg i varukorg
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function showProductPage(id) {
            currentProduct = PRODUCTS.find(p => p.id === id);
            productQuantity = 1;
            document.getElementById('productDetail').innerHTML = `
                <div class="product-detail">
                    <img src="${currentProduct.image}" alt="${currentProduct.name}" class="product-detail-image">
                    <div class="product-detail-info">
                        <h1>${currentProduct.name}</h1>
                        <div class="product-detail-price">${currentProduct.price} kr 
                            <span class="product-old-price">${currentProduct.oldPrice} kr</span>
                        </div>
                        <p>${currentProduct.desc}</p>
                        <div class="quantity-selector">
                            <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                            <input type="number" class="quantity-input" id="quantityInput" value="1" min="1" onchange="updateQuantity()">
                            <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
                        </div>
                        <div class="btn-group">
                            <button class="btn" onclick="addToCartFromProduct()">Lägg i varukorg</button>
                            <button class="btn btn-secondary" onclick="buyNow()">Köp nu</button>
                        </div>
                    </div>
                </div>
            `;
            showPage('product');
        }

        function changeQuantity(delta) {
            productQuantity = Math.max(1, productQuantity + delta);
            document.getElementById('quantityInput').value = productQuantity;
        }

        function updateQuantity() {
            productQuantity = Math.max(1, parseInt(document.getElementById('quantityInput').value) || 1);
            document.getElementById('quantityInput').value = productQuantity;
        }

        function addToCart(id, qty) {
            const product = PRODUCTS.find(p => p.id === id);
            const existing = cart.find(item => item.id === id);
            if (existing) {
                existing.quantity += qty;
            } else {
                cart.push({...product, quantity: qty});
            }
            saveCart();
            updateCartBadge();
            alert('Tillagd i varukorgen! 🎉');
        }

        function addToCartFromProduct() {
            addToCart(currentProduct.id, productQuantity);
        }

        function buyNow() {
            addToCart(currentProduct.id, productQuantity);
            showCheckout();
        }

        function showCart() {
            if (cart.length === 0) {
                document.getElementById('cartContent').innerHTML = `
                    <div style="text-align:center;padding:4rem;">
                        <h2>Din varukorg är tom</h2>
                        <button class="btn" onclick="showHome()" style="margin-top:2rem;width:auto;padding:0.75rem 2rem;">
                            Fortsätt handla
                        </button>
                    </div>
                `;
            } else {
                const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                document.getElementById('cartContent').innerHTML = `
                    <div class="cart-items">
                        ${cart.map((item, index) => `
                            <div class="cart-item">
                                <img src="${item.image}" alt="${item.name}">
                                <div class="cart-item-details">
                                    <h3>${item.name}</h3>
                                    <p>${item.price} kr</p>
                                    <p>Antal: ${item.quantity}</p>
                                </div>
                                <button class="btn" onclick="removeFromCart(${index})" style="width:auto;padding:0.75rem 1.5rem;">
                                    Ta bort
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <div class="cart-total">
                        <h3>Totalt: ${total} kr</h3>
                        <button class="btn" onclick="showCheckout()">Gå till kassan</button>
                    </div>
                `;
            }
            showPage('cart');
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            saveCart();
            updateCartBadge();
            showCart();
        }

        function showCheckout() {
            if (cart.length === 0) {
                alert('Din varukorg är tom!');
                return;
            }
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            document.getElementById('orderSummary').innerHTML = `
                <h2>Ordersammanfattning</h2>
                ${cart.map(item => `
                    <div style="display:flex;justify-content:space-between;margin:1rem 0;">
                        <span>${item.name} x${item.quantity}</span>
                        <span>${item.price * item.quantity} kr</span>
                    </div>
                `).join('')}
                <hr style="margin:1rem 0;">
                <div style="display:flex;justify-content:space-between;font-size:1.5rem;font-weight:700;color:var(--orange);">
                    <span>Totalt:</span>
                    <span>${total} kr</span>
                </div>
            `;
            document.getElementById('checkoutForm').onsubmit = function(e) {
                e.preventDefault();
                showPage('confirmation');
            };
            showPage('checkout');
        }

        function showHome() {
            showPage('home');
        }

        function showPage(page) {
            ['home', 'product', 'cart', 'checkout', 'confirmation'].forEach(p => {
                document.getElementById(p + '-page').classList.add('hidden');
            });
            document.getElementById(page + '-page').classList.remove('hidden');
            window.scrollTo(0, 0);
        }

        function saveCart() {
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        function updateCartBadge() {
            const count = cart.reduce((sum, item) => sum + item.quantity, 0);
            document.getElementById('cartBadge').textContent = count;
            document.getElementById('cartBadge').style.display = count > 0 ? 'flex' : 'none';
        }

        function searchProducts() {
            const query = document.getElementById('searchInput').value.toLowerCase();
            const filtered = PRODUCTS.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.category.toLowerCase().includes(query)
            );
            document.getElementById('productsGrid').innerHTML = filtered.map(p => `
                <div class="product-card" onclick="showProductPage('${p.id}')">
                    <img src="${p.image}" alt="${p.name}" class="product-image">
                    <div class="product-info">
                        <div>
                            <span class="product-price">${p.price} kr</span>
                            <span class="product-old-price">${p.oldPrice} kr</span>
                        </div>
                        <div class="product-name">${p.name}</div>
                        <button class="btn" onclick="event.stopPropagation(); addToCart('${p.id}', 1)">
                            Lägg i varukorg
                        </button>
                    </div>
                </div>
            `).join('');
            showHome();
        }
    </script>
</body>
</html>"""

# Write to file
with open('shopsmart-final.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("✅ shopsmart-final.html har skapats!")
print("📁 Storlek:", len(html_content), "bytes")
print("🚀 Öppna filen i webbläsare för att testa")
print("📤 Ladda upp till GitHub som index.html")
