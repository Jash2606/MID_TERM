const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 8080;

app.get('/health', (req, res) => {
    res.send("API Gateway is healthy!");
});

app.get('/', (req, res) => {
    res.send("API Gateway is running!");
});

// Route requests to Auth Service
app.use('/auth', createProxyMiddleware({
    target: 'http://auth-service:3001',
    changeOrigin: true
}));

// Route requests to Product Service
app.use('/products', createProxyMiddleware({
    target: 'http://product-service:3002',
    changeOrigin: true
}));

// Route requests to Order Service
app.use('/orders', createProxyMiddleware({
    target: 'http://order-service:3003',
    changeOrigin: true
}));

app.listen(PORT, () => {
    console.log(`🚀 Gateway running on port ${PORT}`);
});