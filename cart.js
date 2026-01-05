/**
 * Shopping Cart Module
 * Handles cart display and management
 */

import stateManager from './state.js';
import { formatPrice, showSuccess, showError, sanitizeHTML } from './utils.js';
import router from './router.js';

class Cart {
    constructor() {
        this.container = null;
    }
    
    /**
     * Render cart view
     */
    renderCart() {
        const cart = stateManager.getCart();
        const total = stateManager.getCartTotal();
        
        const container = document.getElementById('app');
        
        if (cart.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                        <circle cx="60" cy="60" r="50" stroke="#ddd" stroke-width="4"/>
                        <path d="M40 50L50 70L80 40" stroke="#ddd" stroke-width="4" stroke-linecap="round"/>
                    </svg>
                    <h2>Din varukorg är tom</h2>
                    <p>Lägg till produkter för att börja handla</p>
                    <a href="/" class="btn btn-primary" data-link>Fortsätt handla</a>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="cart-page">
                <div class="container">
                    <h1>Varukorg</h1>
                    
                    <div class="cart-content">
                        <div class="cart-items">
                            ${cart.map(item => this.renderCartItem(item)).join('')}
                        </div>
                        
                        <div class="cart-summary">
                            <h2>Ordersammanfattning</h2>
                            
                            <div class="summary-row">
                                <span>Delsumma</span>
                                <span>${formatPrice(total)}</span>
                            </div>
                            
                            <div class="summary-row">
                                <span>Frakt</span>
                                <span>Gratis</span>
                            </div>
                            
                            <div class="summary-row summary-total">
                                <span>Totalt</span>
                                <span>${formatPrice(total)}</span>
                            </div>
                            
                            <button class="btn btn-primary btn-block" id="checkout-btn">
                                Gå till kassan
                            </button>
                            
                            <a href="/" class="btn btn-secondary btn-block" data-link>
                                Fortsätt handla
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.attachEventListeners();
    }
    
    /**
     * Render single cart item
     */
    renderCartItem(item) {
        const itemTotal = item.price * item.quantity;
        
        return `
            <div class="cart-item" data-product-id="${item.productId}">
                <img src="${item.image}" alt="${sanitizeHTML(item.name)}" class="cart-item-image">
                
                <div class="cart-item-details">
                    <h3>${sanitizeHTML(item.name)}</h3>
                    <p class="cart-item-price">${formatPrice(item.price)}</p>
                </div>
                
                <div class="cart-item-quantity">
                    <button class="quantity-btn" data-action="decrease" data-product-id="${item.productId}">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 8H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                    
                    <input 
                        type="number" 
                        class="quantity-input" 
                        value="${item.quantity}" 
                        min="1" 
                        max="99"
                        data-product-id="${item.productId}"
                    >
                    
                    <button class="quantity-btn" data-action="increase" data-product-id="${item.productId}">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 4V12M4 8H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                
                <div class="cart-item-total">
                    ${formatPrice(itemTotal)}
                </div>
                
                <button class="cart-item-remove" data-product-id="${item.productId}">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6 6L14 14M6 14L14 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
        `;
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.productId;
                const action = e.currentTarget.dataset.action;
                const cart = stateManager.getCart();
                const item = cart.find(i => i.productId === productId);
                
                if (!item) return;
                
                let newQuantity = item.quantity;
                if (action === 'increase') {
                    newQuantity++;
                } else if (action === 'decrease') {
                    newQuantity--;
                }
                
                if (newQuantity > 0) {
                    stateManager.updateCart(productId, newQuantity);
                    this.updateCartItemDisplay(productId, newQuantity);
                } else {
                    this.removeItem(productId);
                }
            });
        });
        
        // Quantity input
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = e.target.dataset.productId;
                const quantity = parseInt(e.target.value);
                
                if (quantity > 0 && quantity <= 99) {
                    stateManager.updateCart(productId, quantity);
                    this.updateCartItemDisplay(productId, quantity);
                } else if (quantity <= 0) {
                    this.removeItem(productId);
                } else {
                    e.target.value = 99;
                    stateManager.updateCart(productId, 99);
                    this.updateCartItemDisplay(productId, 99);
                }
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.productId;
                this.removeItem(productId);
            });
        });
        
        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                router.navigate('/checkout');
            });
        }
    }
    
    /**
     * Update cart item display
     */
    updateCartItemDisplay(productId, quantity) {
        const cart = stateManager.getCart();
        const item = cart.find(i => i.productId === productId);
        
        if (!item) return;
        
        const itemElement = document.querySelector(`.cart-item[data-product-id="${productId}"]`);
        if (itemElement) {
            const quantityInput = itemElement.querySelector('.quantity-input');
            const totalElement = itemElement.querySelector('.cart-item-total');
            
            if (quantityInput) {
                quantityInput.value = quantity;
            }
            
            if (totalElement) {
                totalElement.textContent = formatPrice(item.price * quantity);
            }
        }
        
        // Update summary
        this.updateSummary();
        
        // Update header cart count
        this.updateCartBadge();
    }
    
    /**
     * Remove item from cart
     */
    removeItem(productId) {
        const cart = stateManager.getCart();
        const item = cart.find(i => i.productId === productId);
        
        if (!item) return;
        
        stateManager.removeFromCart(productId);
        
        // Remove from DOM with animation
        const itemElement = document.querySelector(`.cart-item[data-product-id="${productId}"]`);
        if (itemElement) {
            itemElement.style.opacity = '0';
            itemElement.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                itemElement.remove();
                
                // Check if cart is empty
                if (stateManager.getCart().length === 0) {
                    this.renderCart();
                } else {
                    this.updateSummary();
                }
            }, 300);
        }
        
        showSuccess('Produkt borttagen från varukorgen');
        this.updateCartBadge();
    }
    
    /**
     * Update summary totals
     */
    updateSummary() {
        const total = stateManager.getCartTotal();
        const summaryTotal = document.querySelector('.summary-total span:last-child');
        const summarySubtotal = document.querySelector('.summary-row:first-child span:last-child');
        
        if (summaryTotal) {
            summaryTotal.textContent = formatPrice(total);
        }
        
        if (summarySubtotal) {
            summarySubtotal.textContent = formatPrice(total);
        }
    }
    
    /**
     * Update cart badge in header
     */
    updateCartBadge() {
        const badge = document.getElementById('cart-count');
        if (badge) {
            const count = stateManager.getCartCount();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }
    
    /**
     * Add item to cart (called from product pages)
     */
    addItem(product, quantity = 1) {
        try {
            stateManager.addToCart(product, quantity);
            showSuccess('Produkt tillagd i varukorgen');
            this.updateCartBadge();
            return true;
        } catch (error) {
            showError('Kunde inte lägga till produkt');
            return false;
        }
    }
}

// Create singleton instance
const cart = new Cart();

export default cart;
