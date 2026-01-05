/**
 * API Client
 * Handles all communication with backend
 */

import { handleError, logError } from './utils.js';

class APIClient {
    constructor() {
        // Use relative path for development, can be configured for production
        this.baseURL = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/api'
            : '/api';
        
        this.products = null; // Cache products
    }
    
    /**
     * Make HTTP request
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        // Add auth token if available
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Network error' }));
                throw new Error(error.message || `HTTP ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            logError(error, `API request: ${endpoint}`);
            throw error;
        }
    }
    
    // ===== AUTHENTICATION =====
    
    /**
     * Register new user
     */
    async register(userData) {
        try {
            const response = await this.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            
            if (response.token) {
                localStorage.setItem('token', response.token);
            }
            
            return response;
        } catch (error) {
            handleError(error, 'Registrering misslyckades. Försök igen.');
            throw error;
        }
    }
    
    /**
     * Login user
     */
    async login(email, password) {
        try {
            const response = await this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            
            if (response.token) {
                localStorage.setItem('token', response.token);
            }
            
            return response;
        } catch (error) {
            handleError(error, 'Inloggning misslyckades. Kontrollera dina uppgifter.');
            throw error;
        }
    }
    
    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
    
    // ===== PRODUCTS =====
    
    /**
     * Get all products with optional filters
     */
    async getProducts(filters = {}) {
        try {
            // For demo, load from local JSON file
            if (!this.products) {
                const response = await fetch('/data.json');
                const data = await response.json();
                this.products = data.products;
            }
            
            let filtered = [...this.products];
            
            // Apply search filter
            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                filtered = filtered.filter(p => 
                    p.name.toLowerCase().includes(query) ||
                    p.description.toLowerCase().includes(query)
                );
            }
            
            // Apply category filter
            if (filters.category) {
                filtered = filtered.filter(p => p.category === filters.category);
            }
            
            // Apply price filter
            if (filters.priceMin !== null && filters.priceMin !== undefined) {
                filtered = filtered.filter(p => p.price >= filters.priceMin);
            }
            if (filters.priceMax !== null && filters.priceMax !== undefined) {
                filtered = filtered.filter(p => p.price <= filters.priceMax);
            }
            
            // Apply sorting
            if (filters.sortBy === 'popularity') {
                filtered.sort((a, b) => b.popularity - a.popularity);
            } else if (filters.sortBy === 'date') {
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else if (filters.sortBy === 'price-asc') {
                filtered.sort((a, b) => a.price - b.price);
            } else if (filters.sortBy === 'price-desc') {
                filtered.sort((a, b) => b.price - a.price);
            }
            
            return filtered;
        } catch (error) {
            handleError(error, 'Kunde inte ladda produkter.');
            throw error;
        }
    }
    
    /**
     * Get single product by ID
     */
    async getProduct(id) {
        try {
            const products = await this.getProducts();
            const product = products.find(p => p.id === id);
            
            if (!product) {
                throw new Error('Product not found');
            }
            
            return product;
        } catch (error) {
            handleError(error, 'Kunde inte ladda produkt.');
            throw error;
        }
    }
    
    /**
     * Get product categories
     */
    async getCategories() {
        try {
            const products = await this.getProducts();
            const categories = [...new Set(products.map(p => p.category))];
            return categories.sort();
        } catch (error) {
            handleError(error, 'Kunde inte ladda kategorier.');
            throw error;
        }
    }
    
    // ===== ORDERS =====
    
    /**
     * Create new order
     */
    async createOrder(orderData) {
        try {
            const response = await this.request('/orders', {
                method: 'POST',
                body: JSON.stringify(orderData)
            });
            
            return response;
        } catch (error) {
            handleError(error, 'Kunde inte skapa order. Försök igen.');
            throw error;
        }
    }
    
    /**
     * Get user orders
     */
    async getOrders(userId) {
        try {
            const response = await this.request(`/orders/${userId}`);
            return response;
        } catch (error) {
            handleError(error, 'Kunde inte ladda orderhistorik.');
            throw error;
        }
    }
    
    /**
     * Get single order
     */
    async getOrder(orderId) {
        try {
            const response = await this.request(`/orders/detail/${orderId}`);
            return response;
        } catch (error) {
            handleError(error, 'Kunde inte ladda orderdetaljer.');
            throw error;
        }
    }
    
    // ===== PAYMENT =====
    
    /**
     * Process Stripe payment
     */
    async processStripePayment(paymentData) {
        try {
            const response = await this.request('/payment/stripe', {
                method: 'POST',
                body: JSON.stringify(paymentData)
            });
            
            return response;
        } catch (error) {
            handleError(error, 'Betalning misslyckades. Försök igen.');
            throw error;
        }
    }
    
    /**
     * Process PayPal payment
     */
    async processPayPalPayment(paymentData) {
        try {
            const response = await this.request('/payment/paypal', {
                method: 'POST',
                body: JSON.stringify(paymentData)
            });
            
            return response;
        } catch (error) {
            handleError(error, 'Betalning misslyckades. Försök igen.');
            throw error;
        }
    }
    
    /**
     * Verify payment
     */
    async verifyPayment(paymentId, method) {
        try {
            const response = await this.request('/payment/verify', {
                method: 'POST',
                body: JSON.stringify({ paymentId, method })
            });
            
            return response;
        } catch (error) {
            handleError(error, 'Kunde inte verifiera betalning.');
            throw error;
        }
    }
}

// Create singleton instance
const apiClient = new APIClient();

export default apiClient;
