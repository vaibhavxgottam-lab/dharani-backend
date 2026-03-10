# 1. Use an official Node.js runtime as the base image
FROM node:22-alpine

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json first 
# (This allows Docker to cache your dependencies)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of your app's source code
COPY . .

# 6. Expose the port your app runs on (usually 5000 or 8000)
EXPOSE 5000

# 7. Command to run your app
CMD ["node", "server.js"]