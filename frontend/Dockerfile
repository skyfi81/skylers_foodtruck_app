# Use an official node image as a base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the .env file
COPY .env ./

# Build the React application
RUN npm run build

# Install serve to serve the build
RUN npm install -g serve

# Start the application
CMD ["serve", "-s", "build"]
