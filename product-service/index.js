const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.send("Product Service is healthy and up to date.. :) again update scaler live viva testing.. ");
});

// We will store the fetched data here
let products = [];

// URL to fetch raw data
const DATA_URL = "https://microsoftedge.github.io/Demos/json-dummy-data/256KB.json";

// Function to initialize data
const initData = async () => {
    try {
        console.log("⏳ Fetching live data...");
        const response = await axios.get(DATA_URL);
        
        // The external JSON is just a list of random items. 
        // We map it to fit our shop's needs (adding price & stock).
        products = response.data.slice(0, 20).map((item, index) => ({
            id: index + 1, // Force simpler IDs (1, 2, 3...) for easier testing
            name: item.name, 
            price: Math.floor(Math.random() * 1000) + 50, // Random price $50 - $1050
            stock: Math.floor(Math.random() * 20) + 1     // Random stock 1 - 20
        }));

        console.log(`✅ Loaded ${products.length} products from external URL`);
    } catch (error) {
        console.error("❌ Failed to fetch data:", error.message);
        // Fallback data if internet fails
        products = [
            { id: 1, name: "Fallback Laptop", price: 999, stock: 5 },
            { id: 2, name: "Fallback Phone", price: 599, stock: 10 }
        ];
    }
};

// Initialize data immediately
initData();

// Get all products
app.get('/', (req, res) => {
    res.json(products);
});

// Get single product (Internal API for Order Service)
app.get('/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
});

app.listen(3002, () => console.log("📦 Product Service running on port 3002"));