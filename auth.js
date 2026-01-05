/**
 * Authentication Module
 * Handles user authentication and session management
 */

import apiClient from './api.js';
import stateManager from './state.js';
import { validateEmail, validatePassword, sanitizeInput, showSuccess, showError } from './utils.js';

class Auth {
    constructor() {
        this.users = this.loadUsers();
    }
    
    /**
     * Load users from localStorage (for demo purposes)
     */
    loadUsers() {
        try {
            const users = localStorage.getItem('users');
            return users ? JSON.parse(users) : [];
        } catch (error) {
            console.error('Error loading users:', error);
            return [];
        }
    }
    
    /**
     * Save users to localStorage
     */
    saveUsers() {
        try {
            localStorage.setItem('users', JSON.stringify(this.users));
        } catch (error) {
            console.error('Error saving users:', error);
        }
    }
    
    /**
     * Hash password (simple hash for demo - use bcrypt in production)
     */
    hashPassword(password) {
        // In production, this should be done server-side with bcrypt
        // This is a simple client-side hash for demo purposes
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }
    
    /**
     * Register new user
     */
    async register(userData) {
        try {
            // Validate input
            const email = sanitizeInput(userData.email);
            const password = sanitizeInput(userData.password);
            const name = sanitizeInput(userData.name);
            
            if (!validateEmail(email)) {
                showError('Ogiltig e-postadress');
                return null;
            }
            
            if (!validatePassword(password)) {
                showError('Lösenordet måste vara minst 8 tecken och innehålla stora och små bokstäver samt siffror');
                return null;
            }
            
            if (!name || name.length < 2) {
                showError('Namnet måste vara minst 2 tecken');
                return null;
            }
            
            // Check if user already exists
            const existingUser = this.users.find(u => u.email === email);
            if (existingUser) {
                showError('En användare med denna e-postadress finns redan');
                return null;
            }
            
            // Create new user
            const newUser = {
                id: 'user_' + Date.now(),
                email,
                password: this.hashPassword(password),
                name,
                createdAt: new Date().toISOString(),
                orders: []
            };
            
            this.users.push(newUser);
            this.saveUsers();
            
            // Set user in state (without password)
            const userWithoutPassword = { ...newUser };
            delete userWithoutPassword.password;
            stateManager.setUser(userWithoutPassword);
            
            showSuccess('Konto skapat! Välkommen!');
            return userWithoutPassword;
            
        } catch (error) {
            console.error('Registration error:', error);
            showError('Registrering misslyckades. Försök igen.');
            return null;
        }
    }
    
    /**
     * Login user
     */
    async login(email, password) {
        try {
            // Validate input
            const sanitizedEmail = sanitizeInput(email);
            const sanitizedPassword = sanitizeInput(password);
            
            if (!validateEmail(sanitizedEmail)) {
                showError('Ogiltig e-postadress');
                return null;
            }
            
            // Find user
            const user = this.users.find(u => u.email === sanitizedEmail);
            
            if (!user) {
                showError('Felaktiga inloggningsuppgifter');
                return null;
            }
            
            // Verify password
            const hashedPassword = this.hashPassword(sanitizedPassword);
            if (user.password !== hashedPassword) {
                showError('Felaktiga inloggningsuppgifter');
                return null;
            }
            
            // Set user in state (without password)
            const userWithoutPassword = { ...user };
            delete userWithoutPassword.password;
            stateManager.setUser(userWithoutPassword);
            
            showSuccess(`Välkommen tillbaka, ${user.name}!`);
            return userWithoutPassword;
            
        } catch (error) {
            console.error('Login error:', error);
            showError('Inloggning misslyckades. Försök igen.');
            return null;
        }
    }
    
    /**
     * Logout user
     */
    logout() {
        stateManager.setUser(null);
        apiClient.logout();
        showSuccess('Du har loggats ut');
    }
    
    /**
     * Get current user
     */
    getCurrentUser() {
        return stateManager.getUser();
    }
    
    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return stateManager.isAuthenticated();
    }
    
    /**
     * Update user profile
     */
    async updateProfile(updates) {
        try {
            const currentUser = this.getCurrentUser();
            if (!currentUser) {
                showError('Du måste vara inloggad');
                return null;
            }
            
            // Find user in storage
            const userIndex = this.users.findIndex(u => u.id === currentUser.id);
            if (userIndex === -1) {
                showError('Användare hittades inte');
                return null;
            }
            
            // Validate and sanitize updates
            if (updates.name) {
                const name = sanitizeInput(updates.name);
                if (name.length < 2) {
                    showError('Namnet måste vara minst 2 tecken');
                    return null;
                }
                this.users[userIndex].name = name;
            }
            
            if (updates.email) {
                const email = sanitizeInput(updates.email);
                if (!validateEmail(email)) {
                    showError('Ogiltig e-postadress');
                    return null;
                }
                
                // Check if email is already taken
                const emailExists = this.users.some(u => u.email === email && u.id !== currentUser.id);
                if (emailExists) {
                    showError('E-postadressen används redan');
                    return null;
                }
                
                this.users[userIndex].email = email;
            }
            
            this.saveUsers();
            
            // Update state
            const updatedUser = { ...this.users[userIndex] };
            delete updatedUser.password;
            stateManager.setUser(updatedUser);
            
            showSuccess('Profil uppdaterad');
            return updatedUser;
            
        } catch (error) {
            console.error('Update profile error:', error);
            showError('Kunde inte uppdatera profil. Försök igen.');
            return null;
        }
    }
    
    /**
     * Change password
     */
    async changePassword(currentPassword, newPassword) {
        try {
            const currentUser = this.getCurrentUser();
            if (!currentUser) {
                showError('Du måste vara inloggad');
                return false;
            }
            
            // Find user in storage
            const userIndex = this.users.findIndex(u => u.id === currentUser.id);
            if (userIndex === -1) {
                showError('Användare hittades inte');
                return false;
            }
            
            // Verify current password
            const hashedCurrentPassword = this.hashPassword(sanitizeInput(currentPassword));
            if (this.users[userIndex].password !== hashedCurrentPassword) {
                showError('Felaktigt nuvarande lösenord');
                return false;
            }
            
            // Validate new password
            const sanitizedNewPassword = sanitizeInput(newPassword);
            if (!validatePassword(sanitizedNewPassword)) {
                showError('Nytt lösenord måste vara minst 8 tecken och innehålla stora och små bokstäver samt siffror');
                return false;
            }
            
            // Update password
            this.users[userIndex].password = this.hashPassword(sanitizedNewPassword);
            this.saveUsers();
            
            showSuccess('Lösenord ändrat');
            return true;
            
        } catch (error) {
            console.error('Change password error:', error);
            showError('Kunde inte ändra lösenord. Försök igen.');
            return false;
        }
    }
    
    /**
     * Add order to user
     */
    addOrderToUser(userId, order) {
        try {
            const userIndex = this.users.findIndex(u => u.id === userId);
            if (userIndex >= 0) {
                if (!this.users[userIndex].orders) {
                    this.users[userIndex].orders = [];
                }
                this.users[userIndex].orders.push(order);
                this.saveUsers();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Add order error:', error);
            return false;
        }
    }
    
    /**
     * Get user orders
     */
    getUserOrders(userId) {
        try {
            const user = this.users.find(u => u.id === userId);
            return user?.orders || [];
        } catch (error) {
            console.error('Get orders error:', error);
            return [];
        }
    }
}

// Create singleton instance
const auth = new Auth();

export default auth;
