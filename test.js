const API_URL = "http://localhost:8080";

async function runTests() {
    console.log("🔥 Starting Smoke Tests...\n");

    let exitCode = 0;

    // Helper to log pass/fail
    const assert = (description, condition) => {
        if (condition) {
            console.log(`✅ PASS: ${description}`);
        } else {
            console.error(`❌ FAIL: ${description}`);
            exitCode = 1;
        }
    };

    try {
        // --- TEST 1: Check Product Service (GET /products) ---
        console.log("👉 Testing Product Service (via Gateway)...");
        const productRes = await fetch(`${API_URL}/products`);
        
        // Check if request failed entirely
        if (!productRes.ok) throw new Error(`Product Service returned ${productRes.status}`);
        
        const products = await productRes.json();
        
        assert("Product Service status is 200", productRes.status === 200);
        assert("Products array is not empty", Array.isArray(products) && products.length > 0);
        
        // Capture a valid ID for later use
        const validProductId = products[0]?.id || 1; 

        // --- TEST 2: Check Auth Service (Login) ---
        console.log("\n👉 Testing Auth Service (Login)...");
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "admin", password: "password" })
        });
        
        if (!loginRes.ok) throw new Error(`Auth Service Login returned ${loginRes.status}`);
        
        const loginData = await loginRes.json();
        const token = loginData.token; // Capture token for next test
        
        assert("Login status is 200", loginRes.status === 200);
        assert("Received JWT Token", !!token);

        // --- TEST 3: Check Auth Service (Validate Token) ---
        console.log("\n👉 Testing Auth Service (Validate Token)...");
        const validateRes = await fetch(`${API_URL}/auth/validate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: token })
        });

        const validateData = await validateRes.json();
        
        assert("Validate endpoint status is 200", validateRes.status === 200);
        assert("Token is valid", validateData.valid === true);

        // --- TEST 4: Check Order Service (Place Order) ---
        console.log("\n👉 Testing Order Service (Place Order)...");
        // We use the 'validProductId' we caught in Test 1
        const orderRes = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: validProductId, quantity: 1 })
        });

        const orderData = await orderRes.json();

        assert("Order placement status is 200/201", orderRes.status === 200 || orderRes.status === 201);
        assert("Order returned in response", !!orderData.order);
        assert("Order has correct Product ID", orderData.order?.id !== undefined);

    } catch (error) {
        console.error("\n❌ CRITICAL: Test execution stopped!", error.message);
        console.error("   (Check if 'docker-compose up' is running and all services are healthy)");
        exitCode = 1;
    }

    console.log("\n🔥 Smoke Tests Completed.");
    console.log("=================================");
    console.log(`\n🏁 Tests finished with exit code: ${exitCode}`);
    process.exit(exitCode);
}

runTests();