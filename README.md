# 🛍️ Shop-Micro: Node.js Microservices E-Commerce

**Shop-Micro** is a cloud-native e-commerce backend built with a **Microservices Architecture**. It demonstrates core DevOps and Backend engineering concepts, including **Service-to-Service communication**, **API Gateway routing**, and **Containerization**.

## 🏗️ Architecture

The application is split into four distinct services, orchestrated via Docker Compose.

<img width="2806" height="2294" alt="Untitled diagram-2026-01-15-084136" src="https://github.com/user-attachments/assets/85b6762a-cd71-45ae-a1ca-dd0007c0a566" />

## 🚀 Services Overview

| Service | Port | Description |
| --- | --- | --- |
| **API Gateway** | `8080` | The single entry point. Routes traffic to appropriate services using `http-proxy-middleware`. |
| **Auth Service** | `3001` | Handles user authentication and issues **JWT Tokens**. |
| **Product Service** | `3002` | Fetches live data from an external API, enriches it with simulated stock/price, and serves it. |
| **Order Service** | `3003` | Manages orders. Performs **synchronous inter-service communication** to verify stock with the Product Service before confirming orders. |

---

## 🛠️ Tech Stack

* **Runtime:** Node.js (v18 Alpine)
* **Framework:** Express.js
* **Containerization:** Docker & Docker Compose
* **Communication:** REST (Axios for inter-service calls)
* **Security:** JWT (JSON Web Tokens)

---

## ⚡ Getting Started

### Prerequisites

* Docker & Docker Compose installed on your machine.

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/shop-micro.git
cd shop-micro

```


2. **Start the application**
Build and start all services with a single command:
```bash
docker-compose up --build

```


3. **Verify Status**
Visit `http://localhost:8080/products` in your browser. You should see a JSON list of products fetched from the live source.

---

## 📡 API Endpoints

All requests should be sent to the **API Gateway (Port 8080)**.

### 1. Products

* **Get All Products:**
* `GET /products`
* *Returns:* List of available products with dynamic stock and pricing.



### 2. Orders

* **Place an Order:**
* `POST /orders`
* *Body:*
```json
{
  "productId": 1,
  "quantity": 2
}

```


* *Behavior:* The Order Service internally calls the Product Service to check if `stock >= quantity`. If successful, stock is theoretically reserved.



### 3. Authentication

* **Login (Mock):**
* `POST /auth/login`
* *Body:* `{"username": "admin", "password": "password"}`
* *Returns:* JWT Token.



---

## 📂 Project Structure

```text
shop-micro/
├── api-gateway/       # Routing logic
├── auth-service/      # JWT handling
├── product-service/   # Inventory & External Data Fetching
├── order-service/     # Order logic & Microservice Communication
└── docker-compose.yml # Orchestration config

```

## 🔮 Future Roadmap

* [ ] Migrate from Docker Compose to **Kubernetes (Kind)**.
* [ ] Implement **RabbitMQ** for asynchronous order processing.
* [ ] Add **Prometheus & Grafana** for monitoring request latency.
* [ ] Set up a CI/CD pipeline using **GitHub Actions**.