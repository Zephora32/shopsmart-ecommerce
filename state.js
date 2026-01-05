/**
 * Global State Manager
 * Centralized state management with observer pattern
 */

class StateManager {
    constructor() {
        this.state = {
            user: null,
            cart: this.loadCart(),
            favorites: this.loadFavorites(),
            products: [],
            filters: {
                category: null,
                priceMin: null,
                priceMax: null,
                sortBy: 'popularity',
                searchQuery: ''
            }
        };
        
        this.listeners = [];
    }
    
    /**
     * Get current state
     */
    getState() {
        return { ...this.state };
    }
    
    /**
     * Update state and notify listeners
     */
    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.notifyListeners();
    }
    
    /**
     * Subscribe to state changes
     */
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
    
    /**
     * Notify all listeners of state change
     */
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }
    
    // ===== CART MANAGEMENT =====
    
    /**
     * Load cart from localStorage
     */
    loadCart() {
        try {
            const cart = localStorage.getItem('cart');
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }
    
    /**
     * Save cart to localStorage
     */
    saveCart() {
        try {
            localStorage.setItem('cart', JSON.stringify(this.state.cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }
    
    /**
     * Get cart items
     */
    getCart() {
        return [...this.state.cart];
    }
    
    /**
     * Get cart item count
     */
    getCartCount() {
        return this.state.cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    /**
     * Get cart total price
     */
    getCartTotal() {
        return this.state.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    
    /**
     * Add item to cart
     */
    addToCart(product, quantity = 1) {
        const cart = [...this.state.cart];
        const existingIndex = cart.findIndex(item => item.productId === product.id);
        
        if (existingIndex >= 0) {
            // Update quantity if item already exists
            cart[existingIndex].quantity += quantity;
        } else {
            // Add new item
            cart.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        this.state.cart = cart;
        this.saveCart();
        this.notifyListeners();
        
        return true;
    }
    
    /**
     * Update cart item quantity
     */
    updateCart(productId, quantity) {
        if (quantity <= 0) {
            return this.removeFromCart(productId);
        }
        
        const cart = [...this.state.cart];
        const index = cart.findIndex(item => item.productId === productId);
        
        if (index >= 0) {
            cart[index].quantity = quantity;
            this.state.cart = cart;
            this.saveCart();
            this.notifyListeners();
            return true;
        }
        
        return false;
    }
    
    /**
     * Remove item from cart
     */
    removeFromCart(productId) {
        this.state.cart = this.state.cart.filter(item => item.productId !== productId);
        this.saveCart();
        this.notifyListeners();
        return true;
    }
    
    /**
     * Clear cart
     */
    clearCart() {
        this.state.cart = [];
        this.saveCart();
        this.notifyListeners();
    }
    
    // ===== FAVORITES MANAGEMENT =====
    
    /**
     * Load favorites from localStorage
     */
    loadFavorites() {
        try {
            const favorites = localStorage.getItem('favorites');
            return favorites ? JSON.parse(favorites) : [];
        } catch (error) {
            console.error('Error loading favorites:', error);
            return [];
        }
    }
    
    /**
     * Save favorites to localStorage
     */
    saveFavorites() {
        try {
            localStorage.setItem('favorites', JSON.stringify(this.state.favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }
    
    /**
     * Get favorites
     */
    getFavorites() {
        return [...this.state.favorites];
    }
    
    /**
     * Check if product is in favorites
     */
    isFavorite(productId) {
        return this.state.favorites.includes(productId);
    }
    
    /**
     * Toggle favorite
     */
    toggleFavorite(productId) {
        const favorites = [...this.state.favorites];
        const index = favorites.indexOf(productId);
        
        if (index >= 0) {
            // Remove from favorites
            favorites.splice(index, 1);
        } else {
            // Add to favorites
            favorites.push(productId);
        }
        
        this.state.favorites = favorites;
        this.saveFavorites();
        this.notifyListeners();
        
        return index < 0; // Return true if added, false if removed
    }
    
    // ===== USER MANAGEMENT =====
    
    /**
     * Set current user
     */
    setUser(user) {
        this.state.user = user;
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
        this.notifyListeners();
    }
    
    /**
     * Get current user
     */
    getUser() {
        return this.state.user;
    }
    
    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.state.user !== null;
    }
    
    /**
     * Load user from localStorage
     */
    loadUser() {
        try {
            const user = localStorage.getItem('user');
            if (user) {
                this.state.user = JSON.parse(user);
                this.notifyListeners();
            }
        } catch (error) {
            console.error('Error loading user:', error);
        }
    }
    
    // ===== FILTER MANAGEMENT =====
    
    /**
     * Update filters
     */
    updateFilters(filters) {
        this.state.filters = { ...this.state.filters, ...filters };
        this.notifyListeners();
    }
    
    /**
     * Get current filters
     */
    getFilters() {
        return { ...this.state.filters };
    }
    
    /**
     * Reset filters
     */
    resetFilters() {
        this.state.filters = {
            category: null,
            priceMin: null,
            priceMax: null,
            sortBy: 'popularity',
            searchQuery: ''
        };
        this.notifyListeners();
    }
}

// Create singleton instance
const stateManager = new StateManager();

// Load user on initialization
stateManager.loadUser();

export default stateManager;
