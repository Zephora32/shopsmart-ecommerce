/**
 * User Module
 * Handles user profile and order history
 */

import stateManager from './state.js';
import apiClient from './api.js';
import { formatPrice, formatDate, showError, sanitizeHTML } from './utils.js';
import router from './router.js';

class User {
    constructor() {
        this.container = null;
    }
    
    /**
     * Render profile page
     */
    renderProfile() {
        const user = stateManager.getUser();
        
        if (!user) {
            router.navigate('/login');
            return;
        }
        
        const container = document.getElementById('app');
        container.innerHTML = `
            <div class="profile-page">
                <div class="container">
                    <h1>Min profil</h1>
                    
                    <div class="profile-content">
                        <div class="profile-sidebar">
                            <nav class="profile-nav">
                                <a href="/profile" class="profile-nav-link active" data-link>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <circle cx="10" cy="6" r="3" stroke="currentColor" stroke-width="2"/>
                                        <path d="M3 18C3 14.6863 5.68629 12 9 12H11C14.3137 12 17 14.6863 17 18" stroke="currentColor" stroke-width="2"/>
                                    </svg>
                                    Profil
                                </a>
                                <a href="/orders" class="profile-nav-link" data-link>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
                                        <path d="M7 3V5M13 3V5" stroke="currentColor" stroke-width="2"/>
                                    </svg>
                                    Mina ordrar
                                </a>
                                <a href="/favorites" class="profile-nav-link" data-link>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M10 17L8.5 15.7C4.5 12.36 2 10.28 2 7.5C2 5.42 3.42 4 5.5 4C6.74 4 7.91 4.81 9 5.09C10.09 4.81 11.26 4 12.5 4C14.58 4 16 5.42 16 7.5C16 10.28 13.5 12.36 9.5 15.7L10 17Z" stroke="currentColor" stroke-width="2"/>
                                    </svg>
                                    Favoriter
                                </a>
                                <button class="profile-nav-link" id="logout-btn">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M7 17H4C3.44772 17 3 16.5523 3 16V4C3 3.44772 3.44772 3 4 3H7M13 13L17 10M17 10L13 7M17 10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                    </svg>
                                    Logga ut
                                </button>
                            </nav>
                        </div>
                        
                        <div class="profile-main">
                            <div class="profile-info">
                                <h2>Kontoinformation</h2>
                                
                                <div class="info-group">
                                    <label>Namn</label>
                                    <p>${sanitizeHTML(user.name)}</p>
                                </div>
                                
                                <div class="info-group">
                                    <label>E-post</label>
                                    <p>${sanitizeHTML(user.email)}</p>
                                </div>
                                
                                <div class="info-group">
                                    <label>Medlem sedan</label>
                                    <p>${formatDate(user.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.attachProfileEventListeners();
    }
    
    /**
     * Render orders page
     */
    async renderOrders() {
        const user = stateManager.getUser();
        
        if (!user) {
            router.navigate('/login');
            return;
        }
        
        const container = document.getElementById('app');
        
        // Load orders
        const orders = this.loadOrders(user.id);
        
        if (orders.length === 0) {
            container.innerHTML = `
                <div class="orders-page">
                    <div class="container">
                        <h1>Mina ordrar</h1>
                        
                        <div class="orders-empty">
                            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                                <rect x="30" y="30" width="60" height="60" rx="8" stroke="#ddd" stroke-width="4"/>
                                <path d="M45 30V40M75 30V40" stroke="#ddd" stroke-width="4"/>
                            </svg>
                            <h2>Inga ordrar ännu</h2>
                            <p>När du gör en beställning kommer den att visas här</p>
                            <a href="/" class="btn btn-primary" data-link>Börja handla</a>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="orders-page">
                <div class="container">
                    <h1>Mina ordrar</h1>
                    
                    <div class="orders-list">
                        ${orders.map(order => this.renderOrderCard(order)).join('')}
                    </div>
                </div>
            </div>
        `;
        
        this.attachOrdersEventListeners();
    }
    
    /**
     * Render single order card
     */
    renderOrderCard(order) {
        const statusClass = order.status === 'confirmed' ? 'status-confirmed' : 'status-pending';
        const statusText = order.status === 'confirmed' ? 'Bekräftad' : 'Behandlas';
        
        return `
            <div class="order-card" data-order-id="${order.id}">
                <div class="order-header">
                    <div class="order-info">
                        <h3>Order #${order.id.substring(0, 8)}</h3>
                        <p class="order-date">${formatDate(order.createdAt)}</p>
                    </div>
                    <span class="order-status ${statusClass}">${statusText}</span>
                </div>
                
                <div class="order-items">
                    ${order.items.slice(0, 3).map(item => `
                        <div class="order-item-preview">
                            <img src="${item.image}" alt="${sanitizeHTML(item.name)}">
                            <span>${item.quantity}x</span>
                        </div>
                    `).join('')}
                    ${order.items.length > 3 ? `<span class="more-items">+${order.items.length - 3} till</span>` : ''}
                </div>
                
                <div class="order-footer">
                    <div class="order-total">
                        <span>Totalt:</span>
                        <strong>${formatPrice(order.total)}</strong>
                    </div>
                    <button class="btn btn-secondary btn-sm view-order-btn" data-order-id="${order.id}">
                        Visa detaljer
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Render order detail view
     */
    renderOrderDetail(orderId) {
        const orders = this.loadOrders();
        const order = orders.find(o => o.id === orderId);
        
        if (!order) {
            showError('Order hittades inte');
            router.navigate('/orders');
            return;
        }
        
        const container = document.getElementById('app');
        const statusClass = order.status === 'confirmed' ? 'status-confirmed' : 'status-pending';
        const statusText = order.status === 'confirmed' ? 'Bekräftad' : 'Behandlas';
        
        container.innerHTML = `
            <div class="order-detail-page">
                <div class="container">
                    <div class="order-detail-header">
                        <button class="btn-back" id="back-to-orders">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M12 4L6 10L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            Tillbaka
                        </button>
                        <h1>Order #${order.id.substring(0, 8)}</h1>
                        <span class="order-status ${statusClass}">${statusText}</span>
                    </div>
                    
                    <div class="order-detail-content">
                        <div class="order-detail-section">
                            <h2>Produkter</h2>
                            <div class="order-items-detail">
                                ${order.items.map(item => `
                                    <div class="order-item-detail">
                                        <img src="${item.image}" alt="${sanitizeHTML(item.name)}">
                                        <div class="item-info">
                                            <h3>${sanitizeHTML(item.name)}</h3>
                                            <p>Antal: ${item.quantity}</p>
                                            <p>Pris: ${formatPrice(item.price)}</p>
                                        </div>
                                        <div class="item-total">
                                            ${formatPrice(item.price * item.quantity)}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="order-detail-section">
                            <h2>Leveransadress</h2>
                            <div class="address-info">
                                <p>${sanitizeHTML(order.shippingAddress.name)}</p>
                                <p>${sanitizeHTML(order.shippingAddress.address)}</p>
                                <p>${sanitizeHTML(order.shippingAddress.postalCode)} ${sanitizeHTML(order.shippingAddress.city)}</p>
                                <p>${order.shippingAddress.country}</p>
                            </div>
                        </div>
                        
                        <div class="order-detail-section">
                            <h2>Betalning</h2>
                            <div class="payment-info">
                                <p>Metod: ${order.paymentMethod === 'stripe' ? 'Kort (Stripe)' : 'PayPal'}</p>
                                <p>Betalnings-ID: ${order.paymentId}</p>
                            </div>
                        </div>
                        
                        <div class="order-detail-summary">
                            <div class="summary-row">
                                <span>Delsumma</span>
                                <span>${formatPrice(order.total)}</span>
                            </div>
                            <div class="summary-row">
                                <span>Frakt</span>
                                <span>Gratis</span>
                            </div>
                            <div class="summary-row summary-total">
                                <span>Totalt</span>
                                <span>${formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('back-to-orders')?.addEventListener('click', () => {
            router.navigate('/orders');
        });
    }
    
    /**
     * Load orders from localStorage
     */
    loadOrders(userId = null) {
        try {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            
            if (userId) {
                return orders.filter(o => o.userId === userId);
            }
            
            return orders;
        } catch (error) {
            console.error('Error loading orders:', error);
            return [];
        }
    }
    
    /**
     * Attach profile event listeners
     */
    attachProfileEventListeners() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                stateManager.setUser(null);
                apiClient.logout();
                router.navigate('/');
            });
        }
    }
    
    /**
     * Attach orders event listeners
     */
    attachOrdersEventListeners() {
        document.querySelectorAll('.view-order-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = e.target.dataset.orderId;
                this.renderOrderDetail(orderId);
            });
        });
    }
}

// Create singleton instance
const user = new User();

export default user;
