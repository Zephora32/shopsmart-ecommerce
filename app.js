/**
 * Main Application Entry Point
 * Initializes and wires together all modules
 */

import router from './router.js';
import stateManager from './state.js';
import auth from './auth.js';
import products from './products.js';
import cart from './cart.js';
import checkout from './checkout.js';
import user from './user.js';
import { debounce, showError } from './utils.js';

class App {
    constructor() {
        this.initialized = false;
    }
    
    /**
     * Initialize application
     */
    async init() {
        if (this.initialized) return;
        
        try {
            // Set up state listener
            stateManager.subscribe((state) => {
                this.updateUI(state);
            });
            
            // Set up routes
            this.setupRoutes();
            
            // Set up search
            this.setupSearch();
            
            // Set up mobile menu
            this.setupMobileMenu();
            
            // Update initial UI
            this.updateUI(stateManager.getState());
            
            // Initialize router
            router.init();
            
            this.initialized = true;
            
        } catch (error) {
            console.error('App initialization error:', error);
            showError('Ett fel uppstod vid start av applikationen');
        }
    }
    
    /**
     * Setup routes
     */
    setupRoutes() {
        // Home page
        router.addRoute('/', async () => {
            await products.renderHome();
        });
        
        // Product detail
        router.addRoute('/product/:id', async (params) => {
            await products.renderProductDetail(params.id);
        });
        
        // Cart
        router.addRoute('/cart', () => {
            cart.renderCart();
        });
        
        // Checkout
        router.addRoute('/checkout', async () => {
            await checkout.renderCheckout();
        });
        
        // Favorites
        router.addRoute('/favorites', async () => {
            await products.renderFavorites();
        });
        
        // Profile
        router.addRoute('/profile', () => {
            user.renderProfile();
        });
        
        // Orders
        router.addRoute('/orders', async () => {
            await user.renderOrders();
        });
        
        // Login
        router.addRoute('/login', () => {
            this.renderLogin();
        });
        
        // Register
        router.addRoute('/register', () => {
            this.renderRegister();
        });
        
        // 404 handler
        router.setNotFoundHandler(() => {
            this.render404();
        });
    }
    
    /**
     * Setup search functionality
     */
    setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput) {
            const debouncedSearch = debounce((query) => {
                stateManager.updateFilters({ searchQuery: query });
                if (router.getCurrentRoute() === '/') {
                    products.renderHome();
                } else {
                    router.navigate('/');
                }
            }, 300);
            
            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = e.target.value;
                    stateManager.updateFilters({ searchQuery: query });
                    if (router.getCurrentRoute() !== '/') {
                        router.navigate('/');
                    } else {
                        products.renderHome();
                    }
                }
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput.value;
                stateManager.updateFilters({ searchQuery: query });
                if (router.getCurrentRoute() !== '/') {
                    router.navigate('/');
                } else {
                    products.renderHome();
                }
            });
        }
    }
    
    /**
     * Setup mobile menu
     */
    setupMobileMenu() {
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const nav = document.querySelector('.header-nav');
        
        if (menuToggle && nav) {
            menuToggle.addEventListener('click', () => {
                nav.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                    nav.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            });
        }
    }
    
    /**
     * Update UI based on state changes
     */
    updateUI(state) {
        // Update cart badge
        const cartBadge = document.getElementById('cart-count');
        if (cartBadge) {
            const count = stateManager.getCartCount();
            cartBadge.textContent = count;
            cartBadge.style.display = count > 0 ? 'flex' : 'none';
        }
        
        // Update user display
        const userName = document.getElementById('user-name');
        const profileLink = document.getElementById('profile-link');
        
        if (state.user) {
            if (userName) {
                userName.textContent = state.user.name;
            }
            if (profileLink) {
                profileLink.href = '/profile';
            }
        } else {
            if (userName) {
                userName.textContent = 'Konto';
            }
            if (profileLink) {
                profileLink.href = '/login';
            }
        }
    }
    
    /**
     * Render login page
     */
    renderLogin() {
        const container = document.getElementById('app');
        
        container.innerHTML = `
            <div class="auth-page">
                <div class="auth-container">
                    <h1>Logga in</h1>
                    
                    <form id="login-form" class="auth-form">
                        <div class="form-group">
                            <label for="login-email">E-post</label>
                            <input 
                                type="email" 
                                id="login-email" 
                                name="email" 
                                required
                                autocomplete="email"
                            >
                        </div>
                        
                        <div class="form-group">
                            <label for="login-password">Lösenord</label>
                            <input 
                                type="password" 
                                id="login-password" 
                                name="password" 
                                required
                                autocomplete="current-password"
                            >
                        </div>
                        
                        <button type="submit" class="btn btn-primary btn-block">
                            Logga in
                        </button>
                    </form>
                    
                    <p class="auth-switch">
                        Har du inget konto? 
                        <a href="/register" data-link>Registrera dig här</a>
                    </p>
                </div>
            </div>
        `;
        
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const email = formData.get('email');
                const password = formData.get('password');
                
                const user = await auth.login(email, password);
                if (user) {
                    router.navigate('/');
                }
            });
        }
    }
    
    /**
     * Render register page
     */
    renderRegister() {
        const container = document.getElementById('app');
        
        container.innerHTML = `
            <div class="auth-page">
                <div class="auth-container">
                    <h1>Skapa konto</h1>
                    
                    <form id="register-form" class="auth-form">
                        <div class="form-group">
                            <label for="register-name">Namn</label>
                            <input 
                                type="text" 
                                id="register-name" 
                                name="name" 
                                required
                                autocomplete="name"
                            >
                        </div>
                        
                        <div class="form-group">
                            <label for="register-email">E-post</label>
                            <input 
                                type="email" 
                                id="register-email" 
                                name="email" 
                                required
                                autocomplete="email"
                            >
                        </div>
                        
                        <div class="form-group">
                            <label for="register-password">Lösenord</label>
                            <input 
                                type="password" 
                                id="register-password" 
                                name="password" 
                                required
                                autocomplete="new-password"
                            >
                            <small>Minst 8 tecken, stora och små bokstäver samt siffror</small>
                        </div>
                        
                        <button type="submit" class="btn btn-primary btn-block">
                            Skapa konto
                        </button>
                    </form>
                    
                    <p class="auth-switch">
                        Har du redan ett konto? 
                        <a href="/login" data-link>Logga in här</a>
                    </p>
                </div>
            </div>
        `;
        
        const form = document.getElementById('register-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const userData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password')
                };
                
                const user = await auth.register(userData);
                if (user) {
                    router.navigate('/');
                }
            });
        }
    }
    
    /**
     * Render 404 page
     */
    render404() {
        const container = document.getElementById('app');
        
        container.innerHTML = `
            <div class="error-page">
                <div class="error-content">
                    <h1>404</h1>
                    <h2>Sidan hittades inte</h2>
                    <p>Sidan du letar efter finns inte eller har flyttats.</p>
                    <a href="/" class="btn btn-primary" data-link>Tillbaka till startsidan</a>
                </div>
            </div>
        `;
    }
}

// Create and initialize app
const app = new App();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

export default app;
