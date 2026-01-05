/**
 * Minimal Backend Server
 * Simple Node.js server for API endpoints
 * For production, consider using serverless functions
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// In-memory storage (for demo - use database in production)
let users = [];
let orders = [];

// Helper: Send JSON response
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(data));
}

// Helper: Parse request body
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                resolve({});
            }
        });
        req.on('error', reject);
    });
}

// Helper: Simple password hash (use bcrypt in production)
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

// Helper: Generate token (use JWT in production)
function generateToken(userId) {
    return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
}

// API Routes
async function handleAPI(req, res, pathname) {
    // CORS headers
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        res.end();
        return;
    }

    // Auth endpoints
    if (pathname === '/api/auth/register' && req.method === 'POST') {
        const body = await parseBody(req);
        
        // Validate input
        if (!body.email || !body.password || !body.name) {
            return sendJSON(res, 400, { error: 'Missing required fields' });
        }
        
        // Check if user exists
        if (users.find(u => u.email === body.email)) {
            return sendJSON(res, 400, { error: 'User already exists' });
        }
        
        // Create user
        const user = {
            id: 'user_' + Date.now(),
            email: body.email,
            password: hashPassword(body.password),
            name: body.name,
            createdAt: new Date().toISOString()
        };
        
        users.push(user);
        
        const token = generateToken(user.id);
        const userResponse = { ...user };
        delete userResponse.password;
        
        return sendJSON(res, 201, { user: userResponse, token });
    }
    
    if (pathname === '/api/auth/login' && req.method === 'POST') {
        const body = await parseBody(req);
        
        const user = users.find(u => u.email === body.email);
        
        if (!user || user.password !== hashPassword(body.password)) {
            return sendJSON(res, 401, { error: 'Invalid credentials' });
        }
        
        const token = generateToken(user.id);
        const userResponse = { ...user };
        delete userResponse.password;
        
        return sendJSON(res, 200, { user: userResponse, token });
    }
    
    // Products endpoints
    if (pathname === '/api/products' && req.method === 'GET') {
        const products = JSON.parse(fs.readFileSync('data.json', 'utf8')).products;
        return sendJSON(res, 200, products);
    }
    
    if (pathname.startsWith('/api/products/') && req.method === 'GET') {
        const id = pathname.split('/')[3];
        const products = JSON.parse(fs.readFileSync('data.json', 'utf8')).products;
        const product = products.find(p => p.id === id);
        
        if (!product) {
            return sendJSON(res, 404, { error: 'Product not found' });
        }
        
        return sendJSON(res, 200, product);
    }
    
    // Orders endpoints
    if (pathname === '/api/orders' && req.method === 'POST') {
        const body = await parseBody(req);
        
        const order = {
            id: 'order_' + Date.now(),
            ...body,
            createdAt: new Date().toISOString()
        };
        
        orders.push(order);
        
        return sendJSON(res, 201, order);
    }
    
    if (pathname.startsWith('/api/orders/') && req.method === 'GET') {
        const userId = pathname.split('/')[3];
        const userOrders = orders.filter(o => o.userId === userId);
        
        return sendJSON(res, 200, userOrders);
    }
    
    // Payment endpoints (mock)
    if (pathname === '/api/payment/stripe' && req.method === 'POST') {
        const body = await parseBody(req);
        
        // Mock successful payment
        return sendJSON(res, 200, {
            success: true,
            paymentId: 'pay_' + Date.now(),
            status: 'succeeded'
        });
    }
    
    if (pathname === '/api/payment/paypal' && req.method === 'POST') {
        const body = await parseBody(req);
        
        // Mock successful payment
        return sendJSON(res, 200, {
            success: true,
            paymentId: 'paypal_' + Date.now(),
            status: 'completed'
        });
    }
    
    // 404
    return sendJSON(res, 404, { error: 'Endpoint not found' });
}

// Serve static files
function serveStatic(req, res, pathname) {
    // Default to index.html for SPA routing
    if (pathname === '/' || !path.extname(pathname)) {
        pathname = '/index.html';
    }
    
    const filePath = path.join(__dirname, pathname);
    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found - serve index.html for SPA routing
                fs.readFile(path.join(__dirname, 'index.html'), (err, indexContent) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Server error');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(indexContent, 'utf-8');
                    }
                });
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}

// Create server
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    console.log(`${req.method} ${pathname}`);
    
    // Handle API requests
    if (pathname.startsWith('/api/')) {
        await handleAPI(req, res, pathname);
    } else {
        // Serve static files
        serveStatic(req, res, pathname);
    }
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('Press Ctrl+C to stop');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});
