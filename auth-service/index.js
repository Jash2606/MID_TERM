const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
const SECRET_KEY = "supersecretkey";

// Health Route
app.get('/health', (req, res) => {
    res.send("Auth Service is healthy!");
});

// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Mock User Check
    if (username === "admin" && password === "password") {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    }
    
    res.status(401).json({ message: "Invalid credentials" });
});

// Verify Token Route (Internal use)
app.post('/validate', (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, SECRET_KEY);
        res.json({ valid: true, user });
    } catch (err) {
        res.json({ valid: false });
    }
});

app.listen(3001, () => console.log("🔐 Auth Service running on port 3001"));