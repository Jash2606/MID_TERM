# Use a lightweight Node.js version
FROM node:18-alpine3.20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Start the app
CMD ["node", "index.js"]