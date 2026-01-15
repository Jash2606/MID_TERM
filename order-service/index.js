const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

let orders = [];

// Place an Order
app.post('/', async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        // 1. COMMUNICATE: Call Product Service to get details
        // We use the Docker service name "product-service" instead of localhost
        const response = await axios.get(`http://product-service:3002/${productId}`);
        const product = response.data;

        // 2. CHECK LOGIC: Is it in stock?
        if (product.stock < quantity) {
            return res.status(400).json({ message: "Out of stock" });
        }

        // 3. PROCESS: Create order
        const newOrder = {
            id: orders.length + 1,
            product: product.name,
            totalPrice: product.price * quantity,
            status: "Confirmed"
        };
        orders.push(newOrder);

        res.json({ message: "Order placed successfully!", order: newOrder });

    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: "Product does not exist" });
        }
        res.status(500).json({ message: "Error contacting Product Service", error: error.message });
    }
});

app.listen(3003, () => console.log("🛒 Order Service running on port 3003"));