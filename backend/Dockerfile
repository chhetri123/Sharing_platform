FROM node:18-alpine
# This line says we want to use Node.js version 18 with Alpine Linux (a lightweight Linux distribution)

# Add tini for better signal handling
RUN apk add --no-cache tini

WORKDIR /app
# Creates and sets the working directory inside the container to /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --only=production

COPY . .
# Copies all remaining files from your project to the container

# Use tini as entrypoint
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npm", "start"]

EXPOSE 3000
# Tells Docker that your app will use port 3000