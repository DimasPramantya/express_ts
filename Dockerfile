# Use the official Node.js image as the base image
FROM node:16-alpine

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies for compiling native modules
RUN apk add --no-cache make gcc g++ python3

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Install TypeScript globally
RUN npm install -g typescript

RUN npx prisma migrate dev

RUN npx prisma generate

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD ["node", "dist/index.js"]