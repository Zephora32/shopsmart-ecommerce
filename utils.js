/**
 * Utility Functions
 * Helper functions for validation, sanitization, and common operations
 */

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

/**
 * Validate email format
 */
export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate password strength
 * At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
export function validatePassword(password) {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    return true;
}

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove script tags and dangerous patterns
    let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=/gi, '');
    
    // Trim whitespace
    sanitized = sanitized.trim();
    
    return sanitized;
}

/**
 * Validate form input
 */
export function validateInput(value, type = 'text') {
    const sanitized = sanitizeInput(value);
    
    switch (type) {
        case 'email':
            return validateEmail(sanitized) ? sanitized : null;
        case 'password':
            return validatePassword(sanitized) ? sanitized : null;
        case 'text':
            return sanitized.length > 0 ? sanitized : null;
        case 'number':
            const num = parseFloat(sanitized);
            return !isNaN(num) && num >= 0 ? num : null;
        default:
            return sanitized;
    }
}

/**
 * Debounce function to limit function calls
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format price in SEK
 */
export function formatPrice(price) {
    return new Intl.NumberFormat('sv-SE', {
        style: 'currency',
        currency: 'SEK',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

/**
 * Format date
 */
export function formatDate(date) {
    return new Intl.DateTimeFormat('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

/**
 * Generate unique ID
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Show toast notification
 */
export function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Show error message
 */
export function showError(message) {
    showToast(message, 'error');
}

/**
 * Show success message
 */
export function showSuccess(message) {
    showToast(message, 'success');
}

/**
 * Log error for debugging
 */
export function logError(error, context = '') {
    const errorLog = {
        timestamp: new Date().toISOString(),
        context,
        message: error.message,
        stack: error.stack
    };
    
    console.error('Error:', errorLog);
    
    // In production, send to error tracking service
    if (window.location.hostname !== 'localhost') {
        // TODO: Send to error tracking service
    }
    
    return errorLog;
}

/**
 * Handle API errors
 */
export function handleError(error, userMessage = 'Ett fel uppstod. Försök igen.') {
    logError(error, 'API Error');
    showError(userMessage);
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Lazy load images
 */
export function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Scroll to top smoothly
 */
export function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Get query parameters from URL
 */
export function getQueryParams() {
    const params = {};
    const searchParams = new URLSearchParams(window.location.search);
    for (const [key, value] of searchParams) {
        params[key] = value;
    }
    return params;
}

/**
 * Set query parameters in URL
 */
export function setQueryParams(params) {
    const url = new URL(window.location);
    Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
            url.searchParams.set(key, params[key]);
        } else {
            url.searchParams.delete(key);
        }
    });
    window.history.pushState({}, '', url);
}

/**
 * Truncate text
 */
export function truncate(text, length = 100) {
    if (text.length <= length) return text;
    return text.substr(0, length) + '...';
}

/**
 * Check if user is on mobile device
 */
export function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Check if user is on tablet device
 */
export function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

/**
 * Get device type
 */
export function getDeviceType() {
    if (isMobile()) return 'mobile';
    if (isTablet()) return 'tablet';
    return 'desktop';
}

/**
 * Create loading spinner element
 */
export function createSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    return spinner;
}

/**
 * Show loading state
 */
export function showLoading(container) {
    const spinner = createSpinner();
    container.innerHTML = '';
    container.appendChild(spinner);
}

/**
 * Storage helper with error handling
 */
export const storage = {
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            logError(error, `Storage get: ${key}`);
            return null;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            logError(error, `Storage set: ${key}`);
            return false;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            logError(error, `Storage remove: ${key}`);
            return false;
        }
    },
    
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            logError(error, 'Storage clear');
            return false;
        }
    }
};
