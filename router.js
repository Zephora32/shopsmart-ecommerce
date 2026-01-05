/**
 * Client-Side Router
 * Handles navigation without page reloads
 */

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.notFoundHandler = null;
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.handleRoute(window.location.pathname);
        });
        
        // Handle link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-link]');
            if (link) {
                e.preventDefault();
                this.navigate(link.getAttribute('href'));
            }
        });
    }
    
    /**
     * Register a route
     */
    addRoute(path, handler) {
        // Convert path with parameters to regex
        const paramNames = [];
        const regexPath = path.replace(/:([^/]+)/g, (match, paramName) => {
            paramNames.push(paramName);
            return '([^/]+)';
        });
        
        this.routes.set(path, {
            regex: new RegExp(`^${regexPath}$`),
            handler,
            paramNames,
            path
        });
    }
    
    /**
     * Set 404 handler
     */
    setNotFoundHandler(handler) {
        this.notFoundHandler = handler;
    }
    
    /**
     * Navigate to a path
     */
    navigate(path) {
        window.history.pushState({}, '', path);
        this.handleRoute(path);
    }
    
    /**
     * Handle route change
     */
    async handleRoute(path) {
        // Find matching route
        let matchedRoute = null;
        let params = {};
        
        for (const [routePath, route] of this.routes) {
            const match = path.match(route.regex);
            if (match) {
                matchedRoute = route;
                
                // Extract parameters
                route.paramNames.forEach((name, index) => {
                    params[name] = match[index + 1];
                });
                
                break;
            }
        }
        
        // Update current route
        this.currentRoute = path;
        
        // Call handler
        if (matchedRoute) {
            try {
                await matchedRoute.handler(params);
            } catch (error) {
                console.error('Route handler error:', error);
                if (this.notFoundHandler) {
                    this.notFoundHandler();
                }
            }
        } else if (this.notFoundHandler) {
            this.notFoundHandler();
        }
        
        // Scroll to top on navigation
        window.scrollTo(0, 0);
    }
    
    /**
     * Get current route
     */
    getCurrentRoute() {
        return this.currentRoute;
    }
    
    /**
     * Initialize router
     */
    init() {
        this.handleRoute(window.location.pathname);
    }
    
    /**
     * Get all registered routes
     */
    getRoutes() {
        return Array.from(this.routes.keys());
    }
}

// Create singleton instance
const router = new Router();

export default router;
