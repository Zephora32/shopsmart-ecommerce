# Design Document

## Overview

E-handelsplattformen är en modern, snabb och fullt fungerande webbapplikation inspirerad av Temu. Systemet implementeras som en Single Page Application (SPA) med minimal kodstruktur (max 15 filer) och fokuserar på verklig funktionalitet utan onödiga abstraktioner.

Plattformen använder vanilla JavaScript för att minimera dependencies och hålla kodbasen liten. Backend-funktionalitet hanteras via serverless functions eller en minimal Node.js server. Data lagras i localStorage för snabb åtkomst och synkroniseras med backend vid behov.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (SPA)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Router  │  │   Views  │  │  State   │  │   API   │ │
│  │          │  │          │  │  Manager │  │  Client │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Backend API                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │   Auth   │  │ Products │  │  Orders  │              │
│  │          │  │          │  │          │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              External Services                           │
│  ┌──────────┐  ┌──────────┐                             │
│  │  Stripe  │  │   JSON   │                             │
│  │  PayPal  │  │   Store  │                             │
│  └──────────┘  └──────────┘                             │
└─────────────────────────────────────────────────────────┘
```

### File Structure (15 Files Maximum)

```
/
├── index.html              # Main HTML file
├── styles.css              # All styles in one file
├── app.js                  # Main application entry point
├── router.js               # Client-side routing
├── state.js                # Global state management
├── api.js                  # API client for backend calls
├── auth.js                 # Authentication logic
├── products.js             # Product listing and filtering
├── cart.js                 # Shopping cart functionality
├── checkout.js             # Checkout and payment
├── user.js                 # User profile and orders
├── utils.js                # Utility functions
├── data.json               # Product data
├── server.js               # Minimal backend server
└── README.md               # Documentation
```

## Components and Interfaces

### Frontend Components

#### 1. Router (router.js)
Hanterar client-side navigation utan page reloads.

```javascript
class Router {
  navigate(path)           // Navigate to a new route
  addRoute(path, handler)  // Register route handler
  getCurrentRoute()        // Get current route
}
```

#### 2. State Manager (state.js)
Centraliserad state management med observer pattern.

```javascript
class StateManager {
  getState()                    // Get current state
  setState(updates)             // Update state
  subscribe(listener)           // Subscribe to state changes
  getCart()                     // Get cart items
  addToCart(product, quantity)  // Add item to cart
  updateCart(itemId, quantity)  // Update cart item
  removeFromCart(itemId)        // Remove from cart
  getFavorites()                // Get favorite products
  toggleFavorite(productId)     // Add/remove favorite
}
```

#### 3. API Client (api.js)
Hanterar all kommunikation med backend.

```javascript
class APIClient {
  async login(email, password)           // User login
  async register(userData)               // User registration
  async getProducts(filters)             // Get products with filters
  async getProduct(id)                   // Get single product
  async createOrder(orderData)           // Create new order
  async getOrders(userId)                // Get user orders
  async processPayment(paymentData)      // Process payment via Stripe/PayPal
}
```

#### 4. Authentication (auth.js)
Hanterar användarautentisering och sessioner.

```javascript
class Auth {
  async login(email, password)    // Login user
  async register(userData)        // Register new user
  logout()                        // Logout user
  getCurrentUser()                // Get logged in user
  isAuthenticated()               // Check if user is logged in
}
```

#### 5. Products (products.js)
Hanterar produktvisning, sökning och filtrering.

```javascript
class Products {
  async loadProducts()                    // Load all products
  filterByCategory(category)              // Filter by category
  filterByPrice(min, max)                 // Filter by price range
  sortBy(criteria)                        // Sort products
  search(query)                           // Search products
  renderProductGrid(products)             // Render product list
  renderProductDetail(product)            // Render product page
}
```

#### 6. Cart (cart.js)
Hanterar varukorgsfunktionalitet.

```javascript
class Cart {
  addItem(product, quantity)      // Add item to cart
  updateItem(itemId, quantity)    // Update item quantity
  removeItem(itemId)              // Remove item
  getTotal()                      // Calculate total
  clear()                         // Clear cart
  renderCart()                    // Render cart view
}
```

#### 7. Checkout (checkout.js)
Hanterar checkout-processen och betalning.

```javascript
class Checkout {
  async initializePayment(method)         // Initialize Stripe/PayPal
  async processOrder(orderData)           // Process order
  validateShippingInfo(info)              // Validate shipping details
  renderCheckout()                        // Render checkout view
  renderConfirmation(orderId)             // Render order confirmation
}
```

#### 8. User (user.js)
Hanterar användarprofil och orderhistorik.

```javascript
class User {
  async loadProfile()             // Load user profile
  async updateProfile(data)       // Update profile
  async loadOrders()              // Load order history
  renderProfile()                 // Render profile view
  renderOrders()                  // Render orders view
}
```

### Backend API Endpoints

```
POST   /api/auth/register        # Register new user
POST   /api/auth/login           # Login user
GET    /api/products             # Get all products (with filters)
GET    /api/products/:id         # Get single product
POST   /api/orders               # Create order
GET    /api/orders/:userId       # Get user orders
POST   /api/payment/stripe       # Process Stripe payment
POST   /api/payment/paypal       # Process PayPal payment
```

## Data Models

### User
```javascript
{
  id: string,
  email: string,
  password: string (hashed),
  name: string,
  createdAt: timestamp,
  favorites: [productId]
}
```

### Product
```javascript
{
  id: string,
  name: string,
  description: string,
  price: number,
  image: string,
  category: string,
  stock: number,
  popularity: number,
  createdAt: timestamp
}
```

### CartItem
```javascript
{
  productId: string,
  name: string,
  price: number,
  quantity: number,
  image: string
}
```

### Order
```javascript
{
  id: string,
  userId: string,
  items: [CartItem],
  total: number,
  shippingAddress: {
    name: string,
    address: string,
    city: string,
    postalCode: string,
    country: string
  },
  status: string,
  paymentMethod: string,
  createdAt: timestamp
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After reviewing all testable properties from the prework, several can be consolidated:
- Properties 1.2 and 1.3 (login success/failure) can be combined into one comprehensive authentication property
- Properties 6.1, 6.3, and 6.4 (cart operations) can be combined into a cart invariant property
- Properties 10.2, 10.3, and 10.4 (responsive design) can be combined into one responsive layout property
- Properties 4.3 and 4.4 (sorting) can be combined into one sorting property

### Core Properties

**Property 1: User registration creates valid accounts**
*For any* valid user registration data (email, password, name), submitting the registration form should create a new user account with stored credentials that can be used for subsequent login.
**Validates: Requirements 1.1**

**Property 2: Authentication round-trip**
*For any* registered user, logging in with correct credentials should grant access to account features, and logging out should clear the session and return to logged-out state.
**Validates: Requirements 1.2, 1.5**

**Property 3: Invalid credentials are rejected**
*For any* login attempt with incorrect credentials, the system should deny access and display an error message.
**Validates: Requirements 1.3**

**Property 4: Guest checkout accessibility**
*For any* cart with products, a guest user should be able to proceed to checkout and complete an order without authentication.
**Validates: Requirements 2.1, 2.3**

**Property 5: Search matches query**
*For any* search query string, all returned products should have names or descriptions that contain the search term.
**Validates: Requirements 3.1**

**Property 6: Search result navigation**
*For any* product in search results, clicking it should navigate to that product's detail page.
**Validates: Requirements 3.4**

**Property 7: Category filter correctness**
*For any* selected category, all displayed products should belong to that category and no products from other categories should appear.
**Validates: Requirements 4.1**

**Property 8: Price filter bounds**
*For any* price range (min, max), all displayed products should have prices where min ≤ price ≤ max.
**Validates: Requirements 4.2**

**Property 9: Sort order correctness**
*For any* product list and sort criteria (popularity or date), the resulting list should be ordered in descending order by the selected criterion.
**Validates: Requirements 4.3, 4.4**

**Property 10: Combined filters intersection**
*For any* combination of filters (category, price, sort), all displayed products should satisfy all active filter criteria simultaneously.
**Validates: Requirements 4.5**

**Property 11: Product page completeness**
*For any* product, its detail page should display image, price, stock status, and description.
**Validates: Requirements 5.1**

**Property 12: In-stock product availability**
*For any* product with stock > 0, the product page should show available quantity and enable the add-to-cart button.
**Validates: Requirements 5.2**

**Property 13: Cart addition increases count**
*For any* product and cart state, adding the product to cart should increase the cart item count by 1.
**Validates: Requirements 6.1**

**Property 14: Cart total calculation**
*For any* cart state, the displayed total should equal the sum of (price × quantity) for all items in the cart.
**Validates: Requirements 6.2, 6.3, 6.4**

**Property 15: Favorites toggle round-trip**
*For any* product, adding it to favorites then removing it should return the favorites list to its original state.
**Validates: Requirements 7.1, 7.3**

**Property 16: Guest favorites persistence**
*For any* guest user's favorite products, the favorites should persist in localStorage across page reloads.
**Validates: Requirements 7.4**

**Property 17: Checkout summary accuracy**
*For any* cart state at checkout, the order summary should display all cart items with correct quantities and total price.
**Validates: Requirements 8.1**

**Property 18: Successful payment creates order**
*For any* successful payment transaction, the system should create an order with a unique order ID, store order details, and send confirmation email.
**Validates: Requirements 8.3, 8.5**

**Property 19: Failed payment preserves cart**
*For any* failed payment attempt, the cart contents should remain unchanged and available for retry.
**Validates: Requirements 8.4**

**Property 20: Order history completeness**
*For any* logged-in user with orders, the order history should display all orders with order number, date, and total.
**Validates: Requirements 9.1**

**Property 21: Responsive layout adaptation**
*For any* viewport size (mobile, tablet, desktop), the layout should adapt appropriately to provide optimal viewing experience.
**Validates: Requirements 10.2, 10.3, 10.4**

**Property 22: Input validation prevents injection**
*For any* form input containing potentially malicious content (script tags, SQL injection attempts), the validation should reject or sanitize the input.
**Validates: Requirements 11.1**

**Property 23: Link integrity**
*For any* link on the website, clicking it should navigate to a valid route without 404 errors.
**Validates: Requirements 11.2**

**Property 24: Error handling displays friendly messages**
*For any* error condition, the system should display a user-friendly error message and log the error details.
**Validates: Requirements 11.4**

**Property 25: Product grid display**
*For any* product list view, products should be displayed in a grid layout with visible images and price information.
**Validates: Requirements 13.3**

## Error Handling

### Frontend Error Handling

1. **Network Errors**: Display user-friendly message when API calls fail, with retry option
2. **Validation Errors**: Show inline validation messages for form fields
3. **Payment Errors**: Display specific error messages from payment provider
4. **404 Errors**: Show custom 404 page with navigation back to home
5. **Session Expiry**: Redirect to login with message when session expires

### Backend Error Handling

1. **Invalid Input**: Return 400 with validation error details
2. **Authentication Errors**: Return 401 for unauthorized access
3. **Not Found**: Return 404 for missing resources
4. **Server Errors**: Return 500 with generic message, log details
5. **Payment Errors**: Return specific error codes from payment provider

### Error Logging

All errors should be logged with:
- Timestamp
- Error type
- Stack trace
- User context (if available)
- Request details

## Testing Strategy

### Unit Testing

Unit tests will verify specific examples and edge cases:

**Authentication Tests:**
- Valid registration creates account
- Login with correct credentials succeeds
- Login with wrong password fails
- Logout clears session

**Cart Tests:**
- Adding product increases cart count
- Removing product decreases cart count
- Empty cart disables checkout button
- Cart total calculates correctly

**Product Tests:**
- Out-of-stock products disable buy button
- Empty search returns all products
- No search results shows appropriate message

**Order Tests:**
- Order creation generates unique ID
- Empty order history shows message

### Property-Based Testing

Property-based tests will verify universal properties across many inputs using **fast-check** (JavaScript property testing library).

**Configuration:**
- Each property test MUST run minimum 100 iterations
- Each test MUST be tagged with format: `**Feature: temu-ecommerce, Property {number}: {property_text}**`
- Each correctness property MUST be implemented by a SINGLE property-based test

**Key Properties to Test:**

1. **Authentication Properties** (Properties 1-3)
   - User registration with random valid data
   - Login/logout round-trip
   - Invalid credential rejection

2. **Search and Filter Properties** (Properties 5-10)
   - Search results match query
   - Category filtering correctness
   - Price range filtering
   - Sort order verification
   - Combined filter intersection

3. **Cart Properties** (Properties 13-14, 19)
   - Cart operations maintain correct totals
   - Failed payments preserve cart state

4. **Favorites Properties** (Properties 15-16)
   - Add/remove round-trip
   - LocalStorage persistence

5. **Order Properties** (Properties 17-18, 20)
   - Checkout summary accuracy
   - Order creation and storage
   - Order history completeness

6. **UI Properties** (Properties 11-12, 21, 23, 25)
   - Product page completeness
   - Responsive layout
   - Link integrity
   - Product grid display

7. **Security Properties** (Properties 22, 24)
   - Input validation
   - Error handling

### Integration Testing

Integration tests will verify:
- Complete checkout flow (add to cart → checkout → payment → confirmation)
- User registration → login → order → order history flow
- Search → filter → product detail → add to cart flow

### Test Execution Strategy

1. Write implementation code first
2. Write property-based tests for core logic immediately after implementation
3. Add unit tests for edge cases as needed
4. Run tests frequently during development
5. All tests must pass before considering a feature complete

## Performance Considerations

### Frontend Optimization

1. **Code Splitting**: Load only necessary JavaScript for current view
2. **Image Optimization**: Use WebP format with fallbacks, lazy loading
3. **CSS Optimization**: Single CSS file, minified for production
4. **Caching**: Aggressive caching of static assets
5. **Debouncing**: Debounce search input to reduce API calls

### Backend Optimization

1. **Response Caching**: Cache product data with appropriate TTL
2. **Database Indexing**: Index frequently queried fields (category, price)
3. **Pagination**: Limit product results per page
4. **Compression**: Enable gzip compression for API responses

### Loading Strategy

1. **Critical CSS**: Inline critical CSS in HTML
2. **Deferred JavaScript**: Load non-critical JS after page load
3. **Progressive Enhancement**: Show content before full interactivity
4. **Loading States**: Show skeletons/spinners during data fetch

## Security Considerations

### Frontend Security

1. **Input Sanitization**: Sanitize all user input before display
2. **XSS Prevention**: Use textContent instead of innerHTML where possible
3. **CSRF Protection**: Include CSRF tokens in forms
4. **Secure Storage**: Never store sensitive data in localStorage

### Backend Security

1. **Password Hashing**: Use bcrypt with appropriate salt rounds
2. **JWT Tokens**: Use secure, short-lived tokens for authentication
3. **Rate Limiting**: Limit API requests per IP/user
4. **Input Validation**: Validate all input on server side
5. **HTTPS Only**: Enforce HTTPS for all connections
6. **SQL Injection Prevention**: Use parameterized queries

### Payment Security

1. **PCI Compliance**: Never store credit card data
2. **Stripe/PayPal Integration**: Use official SDKs
3. **Webhook Verification**: Verify payment webhooks
4. **Amount Verification**: Verify payment amount matches order total

## Deployment Strategy

### GitHub Pages Deployment

1. **Build Process**: Minify and bundle all assets
2. **Static Generation**: Pre-render product pages where possible
3. **Environment Variables**: Use GitHub Secrets for API keys
4. **Custom Domain**: Support custom domain configuration

### Backend Deployment Options

1. **Serverless Functions**: Deploy API as serverless functions (Vercel, Netlify)
2. **Minimal Server**: Deploy Node.js server on free tier (Render, Railway)
3. **Database**: Use free tier database (MongoDB Atlas, Supabase)

### CI/CD Pipeline

1. **Automated Testing**: Run all tests on push
2. **Linting**: Enforce code style
3. **Build Verification**: Ensure build succeeds
4. **Automatic Deployment**: Deploy on merge to main branch

## Maintenance and Extensibility

### Code Organization Principles

1. **Single Responsibility**: Each file has one clear purpose
2. **Minimal Dependencies**: Avoid unnecessary libraries
3. **Clear Naming**: Use descriptive names for functions and variables
4. **Comments**: Document complex logic and business rules
5. **Consistent Style**: Follow consistent code formatting

### Future Extensibility

While keeping within 15 files, the architecture supports:
- Adding new payment methods (extend checkout.js)
- Adding product reviews (extend products.js)
- Adding wish lists (extend user.js)
- Adding admin panel (add admin.js if needed)
- Adding analytics (extend utils.js)

### Documentation Requirements

README.md should include:
- Setup instructions
- Environment variables needed
- Deployment instructions
- API documentation
- File structure explanation
- Contributing guidelines
