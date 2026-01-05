/**
 * Checkout Module
 * Handles checkout process and payment
 */

import stateManager from './state.js';
import apiClient from './api.js';
import { formatPrice, showSuccess, showError, validateInput, generateId, sanitizeHTML } from './utils.js';
import router from './router.js';

class Checkout {
    constructor() {
        this.stripe = null;
        this.paypal = null;
        this.selectedPaymentMethod = 'stripe';
    }
    
    /**
     * Initialize payment providers
     */
    async initializePaymentProviders() {
        // Initialize Stripe
        if (window.Stripe) {
            this.stripe = window.Stripe('pk_test_YOUR_STRIPE_PUBLIC_KEY');
        }
        
        // PayPal is initialized via SDK in HTML
        this.paypal = window.paypal;
    }
    
    /**
     * Render checkout page
     */
    async renderCheckout() {
        const cart = stateManager.getCart();
        const total = stateManager.getCartTotal();
        const user = stateManager.getUser();
        
        if (cart.length === 0) {
            router.navigate('/cart');
            return;
        }
        
        await this.initializePaymentProviders();
        
        const container = document.getElementById('app');
        container.innerHTML = `
            <div class="checkout-page">
                <div class="container">
                    <h1>Kassa</h1>
                    
                    <div class="checkout-content">
                        <div class="checkout-form">
                            <form id="checkout-form">
                                <!-- Shipping Information -->
                                <div class="form-section">
                                    <h2>Leveransadress</h2>
                                    
                                    <div class="form-group">
                                        <label for="name">Namn *</label>
                                        <input 
                                            type="text" 
                                            id="name" 
                                            name="name" 
                                            required
                                            value="${user ? sanitizeHTML(user.name) : ''}"
                                        >
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="email">E-post *</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            name="email" 
                                            required
                                            value="${user ? sanitizeHTML(user.email) : ''}"
                                        >
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="phone">Telefon *</label>
                                        <input 
                                            type="tel" 
                                            id="phone" 
                                            name="phone" 
                                            required
                                        >
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="address">Adress *</label>
                                        <input 
                                            type="text" 
                                            id="address" 
                                            name="address" 
                                            required
                                        >
                                    </div>
                                    
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="city">Stad *</label>
                                            <input 
                                                type="text" 
                                                id="city" 
                                                name="city" 
                                                required
                                            >
                                        </div>
                                        
                                        <div class="form-group">
                                            <label for="postalCode">Postnummer *</label>
                                            <input 
                                                type="text" 
                                                id="postalCode" 
                                                name="postalCode" 
                                                required
                                                pattern="[0-9]{5}"
                                            >
                                        </div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="country">Land *</label>
                                        <select id="country" name="country" required>
                                            <option value="SE">Sverige</option>
                                            <option value="NO">Norge</option>
                                            <option value="DK">Danmark</option>
                                            <option value="FI">Finland</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <!-- Payment Method -->
                                <div class="form-section">
                                    <h2>Betalningsmetod</h2>
                                    
                                    <div class="payment-methods">
                                        <label class="payment-method active">
                                            <input 
                                                type="radio" 
                                                name="paymentMethod" 
                                                value="stripe" 
                                                checked
                                            >
                                            <span class="payment-method-content">
                                                <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                                                    <rect width="40" height="24" rx="4" fill="#635BFF"/>
                                                    <text x="20" y="16" text-anchor="middle" fill="white" font-size="10">Stripe</text>
                                                </svg>
                                                <span>Kort (Stripe)</span>
                                            </span>
                                        </label>
                                        
                                        <label class="payment-method">
                                            <input 
                                                type="radio" 
                                                name="paymentMethod" 
                                                value="paypal"
                                            >
                                            <span class="payment-method-content">
                                                <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                                                    <rect width="40" height="24" rx="4" fill="#0070BA"/>
                                                    <text x="20" y="16" text-anchor="middle" fill="white" font-size="8">PayPal</text>
                                                </svg>
                                                <span>PayPal</span>
                                            </span>
                                        </label>
                                    </div>
                                    
                                    <div id="payment-element"></div>
                                </div>
                                
                                <button type="submit" class="btn btn-primary btn-block" id="submit-btn">
                                    Slutför köp - ${formatPrice(total)}
                                </button>
                            </form>
                        </div>
                        
                        <div class="checkout-summary">
                            <h2>Din order</h2>
                            
                            <div class="order-items">
                                ${cart.map(item => `
                                    <div class="order-item">
                                        <img src="${item.image}" alt="${sanitizeHTML(item.name)}">
                                        <div class="order-item-details">
                                            <h4>${sanitizeHTML(item.name)}</h4>
                                            <p>Antal: ${item.quantity}</p>
                                        </div>
                                        <span class="order-item-price">${formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                `).join('')}
                            </div>
                            
                            <div class="order-summary">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.attachEventListeners();
        this.initializePaymentUI();
    }
    
    /**
     * Initialize payment UI
     */
    initializePaymentUI() {
        // For demo purposes, show a simple message
        const paymentElement = document.getElementById('payment-element');
        if (paymentElement && this.selectedPaymentMethod === 'stripe') {
            paymentElement.innerHTML = `
                <div class="payment-info">
                    <p>Betalning hanteras säkert via Stripe</p>
                    <small>Dina kortuppgifter skyddas med SSL-kryptering</small>
                </div>
            `;
        }
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        const form = document.getElementById('checkout-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        // Payment method selection
        document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.selectedPaymentMethod = e.target.value;
                
                // Update active state
                document.querySelectorAll('.payment-method').forEach(method => {
                    method.classList.remove('active');
                });
                e.target.closest('.payment-method').classList.add('active');
                
                this.initializePaymentUI();
            });
        });
    }
    
    /**
     * Handle form submission
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Behandlar...';
        
        try {
            // Validate form
            const formData = new FormData(e.target);
            const shippingInfo = {
                name: validateInput(formData.get('name'), 'text'),
                email: validateInput(formData.get('email'), 'email'),
                phone: validateInput(formData.get('phone'), 'text'),
                address: validateInput(formData.get('address'), 'text'),
                city: validateInput(formData.get('city'), 'text'),
                postalCode: validateInput(formData.get('postalCode'), 'text'),
                country: formData.get('country')
            };
            
            // Check if all fields are valid
            if (Object.values(shippingInfo).some(val => !val)) {
                throw new Error('Vänligen fyll i alla obligatoriska fält korrekt');
            }
            
            // Process payment
            const paymentResult = await this.processPayment(shippingInfo);
            
            if (paymentResult.success) {
                // Create order
                const order = await this.createOrder(shippingInfo, paymentResult);
                
                // Clear cart
                stateManager.clearCart();
                
                // Show confirmation
                this.renderConfirmation(order.id);
            } else {
                throw new Error(paymentResult.error || 'Betalning misslyckades');
            }
        } catch (error) {
            showError(error.message);
            submitBtn.disabled = false;
            submitBtn.textContent = `Slutför köp - ${formatPrice(stateManager.getCartTotal())}`;
        }
    }
    
    /**
     * Process payment
     */
    async processPayment(shippingInfo) {
        const cart = stateManager.getCart();
        const total = stateManager.getCartTotal();
        
        // For demo purposes, simulate successful payment
        // In production, this would integrate with real Stripe/PayPal
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    paymentId: generateId(),
                    method: this.selectedPaymentMethod
                });
            }, 1500);
        });
    }
    
    /**
     * Create order
     */
    async createOrder(shippingInfo, paymentResult) {
        const cart = stateManager.getCart();
        const total = stateManager.getCartTotal();
        const user = stateManager.getUser();
        
        const order = {
            id: generateId(),
            userId: user ? user.id : null,
            items: cart,
            total: total,
            shippingAddress: shippingInfo,
            status: 'confirmed',
            paymentMethod: paymentResult.method,
            paymentId: paymentResult.paymentId,
            createdAt: new Date().toISOString()
        };
        
        // Save order to localStorage for demo
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // In production, send to backend
        // await apiClient.createOrder(order);
        
        return order;
    }
    
    /**
     * Render order confirmation
     */
    renderConfirmation(orderId) {
        const container = document.getElementById('app');
        container.innerHTML = `
            <div class="confirmation-page">
                <div class="container">
                    <div class="confirmation-content">
                        <div class="confirmation-icon">
                            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                                <circle cx="40" cy="40" r="38" stroke="#4CAF50" stroke-width="4"/>
                                <path d="M25 40L35 50L55 30" stroke="#4CAF50" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        
                        <h1>Tack för din beställning!</h1>
                        <p class="confirmation-message">
                            Din order har bekräftats och kommer att skickas inom kort.
                        </p>
                        
                        <div class="order-number">
                            <strong>Ordernummer:</strong> ${orderId}
                        </div>
                        
                        <p class="confirmation-email">
                            En orderbekräftelse har skickats till din e-post.
                        </p>
                        
                        <div class="confirmation-actions">
                            <a href="/" class="btn btn-primary" data-link>Fortsätt handla</a>
                            ${stateManager.isAuthenticated() ? 
                                '<a href="/orders" class="btn btn-secondary" data-link>Se mina ordrar</a>' : 
                                ''
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        showSuccess('Order genomförd!');
    }
    
    /**
     * Validate shipping information
     */
    validateShippingInfo(info) {
        const required = ['name', 'email', 'phone', 'address', 'city', 'postalCode', 'country'];
        
        for (const field of required) {
            if (!info[field] || info[field].trim() === '') {
                return false;
            }
        }
        
        return true;
    }
}

// Create singleton instance
const checkout = new Checkout();

export default checkout;
