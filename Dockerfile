FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the dev server
CMD ["npm", "start"]
