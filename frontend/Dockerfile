FROM node:20-alpine

WORKDIR /app

# Copy npm files
COPY package.json package-lock.json ./

# Install dependencies (npm is stable in Docker)
RUN npm install

# Copy rest of the code
COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]
